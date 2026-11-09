/**
 * Controlador de Rutas - Novedades Ameyalli
 * Administra las rutas públicas del catálogo y bolsa de compras, así como
 * las rutas administrativas protegidas con operaciones CRUD completas y seguras.
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const db = require('./db');
const { 
    sanitizeText, 
    validatePrice, 
    validateStock, 
    validatePhone, 
    checkLoginRateLimit, 
    recordFailedLogin, 
    resetLoginAttempts, 
    safeCompare 
} = require('./security');

// ==========================================
// CONFIGURACIÓN SEGURA DE MULTER (IMÁGENES)
// ==========================================

const uploadsDir = path.join(__dirname, '../uploads/');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        // Generar nombre pseudoaleatorio con timestamp y hash para evitar colisiones y path traversal
        const uniqueSuffix = Date.now() + '-' + crypto.randomBytes(4).toString('hex');
        cb(null, `prod-${uniqueSuffix}${ext}`);
    }
});

const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const allowedExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedMimes.includes(file.mimetype) && allowedExts.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de archivo no permitido. Solo se aceptan imágenes JPG, PNG, WEBP o GIF.'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Límite de 5 MB
    fileFilter: fileFilter
});

// Middleware para atrapar errores específicos de Multer (ej. archivo muy pesado)
const uploadMiddleware = (fieldName) => (req, res, next) => {
    upload.single(fieldName)(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ success: false, message: 'La imagen excede el límite máximo permitido de 5 MB.' });
            }
            return res.status(400).json({ success: false, message: `Error en la subida de imagen: ${err.message}` });
        } else if (err) {
            return res.status(400).json({ success: false, message: err.message });
        }
        next();
    });
};

// ==========================================
// MIDDLEWARES DE AUTENTICACIÓN Y ROLES
// ==========================================

const requireAuth = (req, res, next) => {
    if (req.session && req.session.isAdmin) {
        next();
    } else {
        // Si es una petición AJAX/API, responder JSON 401 en lugar de redirigir bruscamente
        const isAjax = req.xhr || (req.headers.accept && req.headers.accept.includes('application/json')) || req.path.startsWith('/api/');
        if (isAjax) {
            return res.status(401).json({ success: false, message: 'Sesión no autorizada o expirada. Por favor inicia sesión.' });
        }
        res.redirect('/admin/login');
    }
};

// ==========================================
// RUTAS PÚBLICAS (TIENDA Y CATÁLOGO)
// ==========================================

// Página principal del catálogo
router.get('/', (req, res) => {
    const products = db.getProducts();
    const searchQuery = sanitizeText(req.query.q || '');
    
    let filtered = products;
    if (searchQuery) {
        const queryLower = searchQuery.toLowerCase();
        filtered = filtered.filter(p => 
            p.Nombre.toLowerCase().includes(queryLower) || 
            p.Descripcion.toLowerCase().includes(queryLower) ||
            p.Categoria.toLowerCase().includes(queryLower)
        );
    }

    res.render('index', { 
        products: filtered, 
        category: searchQuery ? `Búsqueda: "${searchQuery}"` : 'Todos los Productos',
        searchQuery 
    });
});

// Filtrado por categoría específica
router.get('/categoria/:cat', (req, res) => {
    const cat = sanitizeText(req.params.cat);
    const allProducts = db.getProducts();
    const products = allProducts.filter(p => p.Categoria.toLowerCase() === cat.toLowerCase());
    
    res.render('index', { 
        products, 
        category: cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase(),
        searchQuery: ''
    });
});

// API pública para consultar productos y stock en tiempo real
router.get('/api/productos', (req, res) => {
    const products = db.getProducts();
    res.json({ success: true, products });
});

// Vista de la bolsa de compras
router.get('/carrito', (req, res) => {
    res.render('carrito');
});

// Procesamiento de checkout con validación estricta en servidor y descuento de stock
router.post('/checkout', (req, res) => {
    try {
        const { cliente, telefono, productos_json } = req.body;

        // 1. Sanitización y validación del cliente
        const clienteSanitizado = sanitizeText(cliente, 100);
        if (!clienteSanitizado || clienteSanitizado.length < 3) {
            return res.status(400).json({ 
                success: false, 
                message: 'Por favor ingresa un nombre de cliente válido (mínimo 3 caracteres).' 
            });
        }

        // 2. Validación del teléfono
        const telefonoLimpio = String(telefono || '').replace(/\D/g, '');
        if (telefonoLimpio.length !== 10) {
            return res.status(400).json({ 
                success: false, 
                message: 'Por favor ingresa un número de teléfono válido de 10 dígitos.' 
            });
        }

        // 3. Validación de los productos recibidos
        let cartItems = [];
        try {
            cartItems = typeof productos_json === 'string' ? JSON.parse(productos_json) : productos_json;
        } catch (e) {
            return res.status(400).json({ success: false, message: 'Estructura de productos en el carrito no válida.' });
        }

        if (!Array.isArray(cartItems) || cartItems.length === 0) {
            return res.status(400).json({ success: false, message: 'La bolsa de compras se encuentra vacía.' });
        }

        // 4. Verificación de precios y stock oficial en la base de datos (NUNCA confiar en precios del cliente)
        const allDbProducts = db.getProducts();
        let calculatedTotal = 0;
        const validatedItemsForOrder = [];

        for (const item of cartItems) {
            const dbProduct = allDbProducts.find(p => String(p.ID) === String(item.id));
            if (!dbProduct) {
                return res.status(400).json({ 
                    success: false, 
                    message: `El producto "${sanitizeText(item.nombre)}" ya no existe en el inventario.` 
                });
            }

            const cantidad = parseInt(item.cantidad, 10);
            if (isNaN(cantidad) || cantidad <= 0) {
                return res.status(400).json({ 
                    success: false, 
                    message: `Cantidad inválida para el producto "${dbProduct.Nombre}".` 
                });
            }

            if (dbProduct.Stock < cantidad) {
                return res.status(400).json({ 
                    success: false, 
                    message: `Stock insuficiente para "${dbProduct.Nombre}". Disponibles: ${dbProduct.Stock}, solicitados: ${cantidad}.` 
                });
            }

            const subtotal = dbProduct.Precio * cantidad;
            calculatedTotal += subtotal;

            validatedItemsForOrder.push({
                id: dbProduct.ID,
                nombre: dbProduct.Nombre,
                precio: dbProduct.Precio,
                cantidad: cantidad,
                subtotal: subtotal
            });
        }

        // 5. Descuento atómico de stock en database.xlsx
        db.reduceProductStock(validatedItemsForOrder.map(item => ({ id: item.id, cantidad: item.cantidad })));

        // 6. Registro oficial del pedido
        const newOrder = db.addOrder({
            Cliente: clienteSanitizado,
            Telefono: telefonoLimpio,
            Productos: validatedItemsForOrder,
            Total: Math.round(calculatedTotal * 100) / 100
        });

        console.log(`[Venta] Pedido #${newOrder.ID} generado con éxito por $${newOrder.Total} MXN.`);

        res.json({ 
            success: true, 
            message: '¡Pedido generado con éxito! Te esperamos en tienda física.',
            orderId: newOrder.ID,
            total: newOrder.Total
        });

    } catch (err) {
        console.error('[Checkout Error]', err.message);
        res.status(500).json({ success: false, message: err.message || 'Error interno al procesar el pedido.' });
    }
});

// ==========================================
// RUTAS DE ADMINISTRACIÓN Y AUTENTICACIÓN
// ==========================================

// Vista de Login
router.get('/admin/login', (req, res) => {
    if (req.session && req.session.isAdmin) {
        return res.redirect('/admin');
    }
    res.render('login', { error: null });
});

// Procesamiento de Login con Rate Limiting y protección contra ataques de temporización
router.post('/admin/login', (req, res) => {
    const clientIp = req.ip || req.connection.remoteAddress || '127.0.0.1';

    // 1. Verificar límite de tasa de intentos (fuerza bruta)
    const rateCheck = checkLoginRateLimit(clientIp);
    if (!rateCheck.allowed) {
        return res.render('login', { 
            error: `Demasiados intentos fallidos. Por favor espera ${rateCheck.waitMinutes} minuto(s) antes de intentar de nuevo.` 
        });
    }

    const { password } = req.body;
    const expectedPassword = process.env.ADMIN_PASSWORD || 'ameyalli123';

    if (password && safeCompare(password, expectedPassword)) {
        resetLoginAttempts(clientIp);
        req.session.isAdmin = true;
        req.session.adminUser = 'Administrador General';
        console.log(`[Seguridad] Acceso concedido al panel administrativo desde ${clientIp}`);
        res.redirect('/admin');
    } else {
        recordFailedLogin(clientIp);
        const attemptsLeft = rateCheck.remainingAttempts - 1;
        console.warn(`[Seguridad] Intento fallido de login desde ${clientIp}. Intentos restantes: ${attemptsLeft}`);
        res.render('login', { 
            error: `Contraseña incorrecta. Intentos restantes antes de bloqueo temporal: ${Math.max(0, attemptsLeft)}` 
        });
    }
});

// Cierre de sesión seguro
router.get('/admin/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/admin/login');
    });
});

// Dashboard Administrativo principal
router.get('/admin', requireAuth, (req, res) => {
    const products = db.getProducts();
    const orders = db.getOrders();

    // Cálculo de estadísticas ejecutivas para el administrador
    const totalPedidos = orders.length;
    const pedidosPendientes = orders.filter(o => o.Estado === 'Pendiente').length;
    const pedidosCompletados = orders.filter(o => o.Estado === 'Completado').length;
    const ingresosTotales = orders
        .filter(o => o.Estado === 'Completado')
        .reduce((sum, o) => sum + (parseFloat(o.Total) || 0), 0);
    const productosAgotados = products.filter(p => p.Stock <= 0).length;
    const productosStockBajo = products.filter(p => p.Stock > 0 && p.Stock <= 3).length;

    const stats = {
        totalPedidos,
        pedidosPendientes,
        pedidosCompletados,
        ingresosTotales,
        totalProductos: products.length,
        productosAgotados,
        productosStockBajo
    };

    res.render('admin', { products, orders, stats, error: null });
});

// ==========================================
// API REST ADMINISTRATIVA (OPERACIONES CRUD CON TOASTS)
// ==========================================

// CREAR PRODUCTO (POST /admin/api/products)
router.post('/admin/api/products', requireAuth, uploadMiddleware('imagen'), (req, res) => {
    try {
        const { nombre, descripcion, precio, stock, categoria, imagen_url } = req.body;

        // Validaciones
        const cleanNombre = sanitizeText(nombre, 100);
        if (!cleanNombre || cleanNombre.length < 3) {
            return res.status(400).json({ success: false, message: 'El nombre del producto debe tener al menos 3 caracteres.' });
        }

        const validPrice = validatePrice(precio);
        if (validPrice === null) {
            return res.status(400).json({ success: false, message: 'El precio debe ser un número positivo válido.' });
        }

        const validStock = validateStock(stock);
        if (validStock === null) {
            return res.status(400).json({ success: false, message: 'El stock debe ser un número entero no negativo (0 o mayor).' });
        }

        const cleanCategoria = sanitizeText(categoria, 50) || 'Hombre';
        const cleanDesc = sanitizeText(descripcion, 500);

        // Determinar imagen: archivo subido o URL externa opcional
        let imagenPath = '';
        if (req.file) {
            imagenPath = '/uploads/' + req.file.filename;
        } else if (imagen_url && typeof imagen_url === 'string') {
            const cleanUrl = imagen_url.trim();
            if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://') || cleanUrl.startsWith('/img/')) {
                imagenPath = cleanUrl;
            }
        }

        const newProd = db.addProduct({
            Nombre: cleanNombre,
            Descripcion: cleanDesc,
            Precio: validPrice,
            Stock: validStock,
            Categoria: cleanCategoria,
            Imagen: imagenPath
        });

        console.log(`[Admin] Producto creado: "${newProd.Nombre}" con ID ${newProd.ID}`);

        res.status(201).json({ 
            success: true, 
            message: `Producto "${newProd.Nombre}" agregado correctamente al inventario.`,
            product: newProd 
        });

    } catch (err) {
        console.error('[Admin Error]', err);
        res.status(500).json({ success: false, message: 'Error interno al registrar el producto.' });
    }
});

// EDITAR PRODUCTO (POST /admin/api/products/:id/edit)
router.post('/admin/api/products/:id/edit', requireAuth, uploadMiddleware('imagen'), (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, precio, stock, categoria, imagen_url } = req.body;

        const existing = db.getProduct(id);
        if (!existing) {
            return res.status(404).json({ success: false, message: 'El producto a editar no existe.' });
        }

        const cleanNombre = sanitizeText(nombre, 100);
        if (!cleanNombre || cleanNombre.length < 3) {
            return res.status(400).json({ success: false, message: 'El nombre del producto debe tener al menos 3 caracteres.' });
        }

        const validPrice = validatePrice(precio);
        if (validPrice === null) {
            return res.status(400).json({ success: false, message: 'El precio debe ser un número positivo válido.' });
        }

        const validStock = validateStock(stock);
        if (validStock === null) {
            return res.status(400).json({ success: false, message: 'El stock debe ser un número entero no negativo (0 o mayor).' });
        }

        const cleanCategoria = sanitizeText(categoria, 50) || existing.Categoria;
        const cleanDesc = sanitizeText(descripcion, 500);

        // Si se subió un nuevo archivo, actualizar la ruta
        let imagenPath = existing.Imagen;
        if (req.file) {
            // Eliminar imagen anterior si era local
            if (existing.Imagen && existing.Imagen.startsWith('/uploads/')) {
                try {
                    const oldPath = path.join(__dirname, '..', existing.Imagen);
                    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
                } catch (e) {
                    console.warn('[Admin] No se pudo borrar imagen previa:', e.message);
                }
            }
            imagenPath = '/uploads/' + req.file.filename;
        } else if (imagen_url !== undefined && imagen_url.trim() !== '') {
            imagenPath = imagen_url.trim();
        }

        const updated = db.updateProduct(id, {
            Nombre: cleanNombre,
            Descripcion: cleanDesc,
            Precio: validPrice,
            Stock: validStock,
            Categoria: cleanCategoria,
            Imagen: imagenPath
        });

        console.log(`[Admin] Producto actualizado: "${updated.Nombre}" (Stock: ${updated.Stock})`);

        res.json({ 
            success: true, 
            message: `Producto "${updated.Nombre}" actualizado exitosamente.`,
            product: updated 
        });

    } catch (err) {
        console.error('[Admin Edit Error]', err);
        res.status(500).json({ success: false, message: 'Error interno al actualizar el producto.' });
    }
});

// ELIMINAR PRODUCTO (POST /admin/api/products/:id/delete)
router.post('/admin/api/products/:id/delete', requireAuth, (req, res) => {
    try {
        const { id } = req.params;
        const product = db.getProduct(id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Producto no encontrado.' });
        }

        const deleted = db.deleteProduct(id);
        if (!deleted) {
            return res.status(500).json({ success: false, message: 'No se pudo eliminar el producto.' });
        }

        console.log(`[Admin] Producto eliminado: "${product.Nombre}" (ID: ${id})`);

        res.json({ 
            success: true, 
            message: `El producto "${product.Nombre}" fue eliminado del catálogo correctamente.` 
        });

    } catch (err) {
        console.error('[Admin Delete Error]', err);
        res.status(500).json({ success: false, message: 'Error interno al eliminar el producto.' });
    }
});

// ACTUALIZAR ESTADO DE PEDIDO (POST /admin/api/orders/:id/status)
router.post('/admin/api/orders/:id/status', requireAuth, (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        const allowedStatus = ['Pendiente', 'Completado', 'Cancelado'];
        if (!allowedStatus.includes(estado)) {
            return res.status(400).json({ success: false, message: 'Estado de pedido no válido.' });
        }

        const updatedOrder = db.updateOrderStatus(id, estado);
        if (!updatedOrder) {
            return res.status(404).json({ success: false, message: 'Pedido no encontrado.' });
        }

        console.log(`[Admin] Pedido #${id} actualizado a estado "${estado}"`);

        res.json({ 
            success: true, 
            message: `Pedido #${id} actualizado a estado "${estado}".`,
            order: updatedOrder 
        });

    } catch (err) {
        console.error('[Admin Order Error]', err);
        res.status(500).json({ success: false, message: 'Error interno al actualizar el pedido.' });
    }
});

// Soporte retrocompatible para formularios estándar tradicionales
router.post('/admin/add-product', requireAuth, uploadMiddleware('imagen'), (req, res) => {
    const { nombre, descripcion, precio, stock, categoria } = req.body;
    db.addProduct({
        Nombre: sanitizeText(nombre, 100),
        Descripcion: sanitizeText(descripcion, 500),
        Precio: validatePrice(precio) || 0,
        Stock: validateStock(stock) || 0,
        Categoria: sanitizeText(categoria, 50) || 'Hombre',
        Imagen: req.file ? '/uploads/' + req.file.filename : ''
    });
    res.redirect('/admin?toast=created');
});

router.post('/admin/delete-product/:id', requireAuth, (req, res) => {
    db.deleteProduct(req.params.id);
    res.redirect('/admin?toast=deleted');
});

router.post('/admin/update-order/:id', requireAuth, (req, res) => {
    const { estado } = req.body;
    db.updateOrderStatus(req.params.id, estado || 'Completado');
    res.redirect('/admin?toast=order_updated');
});

module.exports = router;
