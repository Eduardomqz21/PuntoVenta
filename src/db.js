/**
 * Capa de Persistencia y Acceso a Datos - Novedades Ameyalli
 * Gestiona la lectura, escritura, transacciones de stock y migraciones
 * automáticas sobre el archivo data/database.xlsx mediante SheetJS.
 */

const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '../data/database.xlsx');

/**
 * Inicializa la base de datos en Excel si no existe, o aplica migraciones
 * en caso de que falten columnas críticas como 'Stock'.
 */
function initDB() {
    const dataDir = path.dirname(dbPath);
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    if (!fs.existsSync(dbPath)) {
        const wb = xlsx.utils.book_new();
        
        // Estructura oficial de Productos con columna Stock
        const productosHeaders = [['ID', 'Nombre', 'Descripcion', 'Precio', 'Stock', 'Categoria', 'Imagen', 'FechaCreacion']];
        const wsProductos = xlsx.utils.aoa_to_sheet(productosHeaders);
        xlsx.utils.book_append_sheet(wb, wsProductos, 'Productos');

        // Estructura oficial de Pedidos
        const pedidosHeaders = [['ID', 'Fecha', 'Cliente', 'Telefono', 'Productos', 'Total', 'Estado']];
        const wsPedidos = xlsx.utils.aoa_to_sheet(pedidosHeaders);
        xlsx.utils.book_append_sheet(wb, wsPedidos, 'Pedidos');

        xlsx.writeFile(wb, dbPath);
        console.log('[DB] Base de datos database.xlsx inicializada con éxito.');
    } else {
        // Verificar si los registros existentes cuentan con la propiedad 'Stock'
        try {
            const wb = xlsx.readFile(dbPath);
            const wsProductos = wb.Sheets['Productos'];
            if (wsProductos) {
                const productos = xlsx.utils.sheet_to_json(wsProductos);
                let needsUpdate = false;

                const migrated = productos.map(p => {
                    const item = { ...p };
                    // Si el producto no tiene Stock o es nulo/inválido, asignamos 10 unidades por defecto
                    if (item.Stock === undefined || item.Stock === null || isNaN(parseInt(item.Stock, 10))) {
                        item.Stock = 10;
                        needsUpdate = true;
                    } else {
                        item.Stock = Math.max(0, parseInt(item.Stock, 10));
                    }
                    if (!item.FechaCreacion) {
                        item.FechaCreacion = new Date().toLocaleDateString('es-MX');
                        needsUpdate = true;
                    }
                    return item;
                });

                if (needsUpdate) {
                    wb.Sheets['Productos'] = xlsx.utils.json_to_sheet(migrated);
                    xlsx.writeFile(wb, dbPath);
                    console.log('[DB] Migración aplicada: Columna Stock y FechaCreacion normalizadas.');
                }
            }
        } catch (err) {
            console.error('[DB Error] Error al verificar/migrar database.xlsx:', err.message);
        }
    }
}

/**
 * Lee y normaliza los datos de una hoja en formato JSON.
 * @param {string} sheetName - Nombre de la hoja ('Productos' o 'Pedidos')
 * @returns {Array<object>}
 */
function getSheetData(sheetName) {
    if (!fs.existsSync(dbPath)) {
        initDB();
    }
    const wb = xlsx.readFile(dbPath);
    const ws = wb.Sheets[sheetName];
    if (!ws) return [];
    const data = xlsx.utils.sheet_to_json(ws);

    if (sheetName === 'Productos') {
        return data.map(p => ({
            ID: String(p.ID || ''),
            Nombre: String(p.Nombre || ''),
            Descripcion: String(p.Descripcion || ''),
            Precio: parseFloat(p.Precio) || 0,
            Stock: Math.max(0, parseInt(p.Stock, 10) || 0),
            Categoria: String(p.Categoria || 'Todos'),
            Imagen: p.Imagen ? String(p.Imagen) : '',
            FechaCreacion: p.FechaCreacion ? String(p.FechaCreacion) : ''
        }));
    }

    if (sheetName === 'Pedidos') {
        return data.map(o => ({
            ID: String(o.ID || ''),
            Fecha: String(o.Fecha || ''),
            Cliente: String(o.Cliente || ''),
            Telefono: String(o.Telefono || ''),
            Productos: String(o.Productos || '[]'),
            Total: parseFloat(o.Total) || 0,
            Estado: String(o.Estado || 'Pendiente')
        }));
    }

    return data;
}

/**
 * Guarda un array de objetos en la hoja especificada de database.xlsx.
 * @param {string} sheetName 
 * @param {Array<object>} data 
 */
function saveSheetData(sheetName, data) {
    if (!fs.existsSync(dbPath)) {
        initDB();
    }
    const wb = xlsx.readFile(dbPath);
    const newWs = xlsx.utils.json_to_sheet(data);
    wb.Sheets[sheetName] = newWs;
    xlsx.writeFile(wb, dbPath);
}

const db = {
    init: initDB,

    // ==========================================
    // MÉTODOS DE PRODUCTOS
    // ==========================================

    /**
     * Obtiene la lista completa de productos disponibles.
     * @returns {Array}
     */
    getProducts: () => getSheetData('Productos'),

    /**
     * Busca un producto por su ID único.
     * @param {string} id 
     * @returns {object|undefined}
     */
    getProduct: (id) => {
        const products = getSheetData('Productos');
        return products.find(p => String(p.ID) === String(id));
    },

    /**
     * Agrega un nuevo producto a la base de datos.
     * @param {object} product 
     * @returns {object} - Producto guardado con ID asignado
     */
    addProduct: (product) => {
        const products = getSheetData('Productos');
        const newProduct = {
            ID: Date.now().toString(),
            Nombre: product.Nombre,
            Descripcion: product.Descripcion || '',
            Precio: parseFloat(product.Precio) || 0,
            Stock: Math.max(0, parseInt(product.Stock, 10) || 0),
            Categoria: product.Categoria || 'Todos',
            Imagen: product.Imagen || '',
            FechaCreacion: new Date().toLocaleDateString('es-MX')
        };
        products.push(newProduct);
        saveSheetData('Productos', products);
        return newProduct;
    },

    /**
     * Actualiza un producto existente manteniendo la integridad de campos no modificados.
     * @param {string} id 
     * @param {object} updatedProduct 
     * @returns {object|null} - Producto actualizado o null si no se encontró
     */
    updateProduct: (id, updatedProduct) => {
        let products = getSheetData('Productos');
        const index = products.findIndex(p => String(p.ID) === String(id));
        if (index === -1) return null;

        const current = products[index];

        // Si no se proporcionó una nueva imagen, conservar la imagen existente
        let imagenFinal = current.Imagen;
        if (updatedProduct.Imagen !== undefined && updatedProduct.Imagen !== null && updatedProduct.Imagen !== '') {
            imagenFinal = updatedProduct.Imagen;
        }

        const merged = {
            ...current,
            Nombre: updatedProduct.Nombre !== undefined ? updatedProduct.Nombre : current.Nombre,
            Descripcion: updatedProduct.Descripcion !== undefined ? updatedProduct.Descripcion : current.Descripcion,
            Precio: updatedProduct.Precio !== undefined ? parseFloat(updatedProduct.Precio) : current.Precio,
            Stock: updatedProduct.Stock !== undefined ? Math.max(0, parseInt(updatedProduct.Stock, 10)) : current.Stock,
            Categoria: updatedProduct.Categoria !== undefined ? updatedProduct.Categoria : current.Categoria,
            Imagen: imagenFinal
        };

        products[index] = merged;
        saveSheetData('Productos', products);
        return merged;
    },

    /**
     * Elimina un producto por su ID y limpia su imagen física en uploads si corresponde.
     * @param {string} id 
     * @returns {boolean}
     */
    deleteProduct: (id) => {
        let products = getSheetData('Productos');
        const productToDelete = products.find(p => String(p.ID) === String(id));
        if (!productToDelete) return false;

        // Limpiar archivo físico si es una imagen subida localmente en /uploads/
        if (productToDelete.Imagen && productToDelete.Imagen.startsWith('/uploads/')) {
            try {
                const imagePath = path.join(__dirname, '..', productToDelete.Imagen);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            } catch (err) {
                console.warn('[DB] No se pudo eliminar la imagen física:', err.message);
            }
        }

        products = products.filter(p => String(p.ID) !== String(id));
        saveSheetData('Productos', products);
        return true;
    },

    // ==========================================
    // MÉTODOS DE PEDIDOS Y GESTIÓN DE STOCK
    // ==========================================

    /**
     * Obtiene el historial completo de pedidos ordenados cronológicamente inverso.
     * @returns {Array}
     */
    getOrders: () => {
        const orders = getSheetData('Pedidos');
        return orders.reverse();
    },

    /**
     * Registra un nuevo pedido y asigna fecha y estado inicial 'Pendiente'.
     * @param {object} order 
     * @returns {object} - Pedido creado
     */
    addOrder: (order) => {
        const orders = getSheetData('Pedidos');
        const newOrder = {
            ID: Date.now().toString(),
            Fecha: new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' }),
            Cliente: order.Cliente,
            Telefono: order.Telefono,
            Productos: typeof order.Productos === 'string' ? order.Productos : JSON.stringify(order.Productos),
            Total: parseFloat(order.Total) || 0,
            Estado: 'Pendiente'
        };
        orders.push(newOrder);
        saveSheetData('Pedidos', orders);
        return newOrder;
    },

    /**
     * Actualiza el estado de un pedido ('Pendiente', 'Completado', 'Cancelado').
     * Si un pedido es cancelado, restaura automáticamente el stock a los productos correspondientes.
     * @param {string} id 
     * @param {string} status 
     * @returns {object|null}
     */
    updateOrderStatus: (id, status) => {
        let orders = getSheetData('Pedidos');
        const index = orders.findIndex(o => String(o.ID) === String(id));
        if (index === -1) return null;

        const currentOrder = orders[index];
        const previousStatus = currentOrder.Estado;
        currentOrder.Estado = status;

        // Si se cancela un pedido que estaba Pendiente o Completado, devolvemos el stock al inventario
        if (status === 'Cancelado' && previousStatus !== 'Cancelado') {
            try {
                let parsedItems = JSON.parse(currentOrder.Productos);
                if (Array.isArray(parsedItems)) {
                    db.restoreProductStock(parsedItems);
                }
            } catch (e) {
                console.warn('[DB] No se pudo parsear productos para restaurar stock:', e.message);
            }
        }

        // Si un pedido cancelado se reactiva a Pendiente o Completado, volvemos a reservar el stock
        if (previousStatus === 'Cancelado' && (status === 'Pendiente' || status === 'Completado')) {
            try {
                let parsedItems = JSON.parse(currentOrder.Productos);
                if (Array.isArray(parsedItems)) {
                    db.reduceProductStock(parsedItems);
                }
            } catch (e) {
                console.warn('[DB] No se pudo parsear productos para descontar stock reabierto:', e.message);
            }
        }

        saveSheetData('Pedidos', orders);
        return currentOrder;
    },

    /**
     * Descuenta atómicamente el stock de los productos comprados.
     * Verifica previamente que TODOS los productos cuenten con stock suficiente;
     * si alguno no tiene suficiente, arroja un error y no modifica nada.
     * @param {Array<{ id: string, cantidad: number }>} items 
     * @returns {boolean}
     */
    reduceProductStock: (items) => {
        if (!Array.isArray(items) || items.length === 0) {
            throw new Error('La lista de productos del pedido está vacía.');
        }

        let products = getSheetData('Productos');

        // Paso 1: Validación estricta de stock disponible para cada producto
        for (const item of items) {
            const prod = products.find(p => String(p.ID) === String(item.id));
            if (!prod) {
                throw new Error(`El producto con ID "${item.id}" ya no existe en el catálogo.`);
            }
            const cantidadPedida = parseInt(item.cantidad, 10);
            if (isNaN(cantidadPedida) || cantidadPedida <= 0) {
                throw new Error(`Cantidad no válida para "${prod.Nombre}".`);
            }
            if (prod.Stock < cantidadPedida) {
                throw new Error(`Stock insuficiente para "${prod.Nombre}". Disponibles: ${prod.Stock}, solicitados: ${cantidadPedida}.`);
            }
        }

        // Paso 2: Descontar el stock de manera efectiva
        for (const item of items) {
            const prod = products.find(p => String(p.ID) === String(item.id));
            const cantidadPedida = parseInt(item.cantidad, 10);
            prod.Stock = Math.max(0, prod.Stock - cantidadPedida);
        }

        saveSheetData('Productos', products);
        return true;
    },

    /**
     * Restaura el stock de los productos (utilizado al cancelar pedidos).
     * @param {Array<{ id: string, cantidad: number }>} items 
     */
    restoreProductStock: (items) => {
        if (!Array.isArray(items)) return;
        let products = getSheetData('Productos');

        for (const item of items) {
            const prod = products.find(p => String(p.ID) === String(item.id));
            if (prod) {
                const cantidadDevuelta = parseInt(item.cantidad, 10) || 0;
                prod.Stock += cantidadDevuelta;
            }
        }

        saveSheetData('Productos', products);
    }
};

module.exports = db;
