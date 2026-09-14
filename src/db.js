
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '../data/database.xlsx');

function initDB() {
    if (!fs.existsSync(dbPath)) {
        const wb = xlsx.utils.book_new();
        
        const productosData = [['ID', 'Nombre', 'Descripcion', 'Precio', 'Imagen', 'Categoria']];
        const wsProductos = xlsx.utils.aoa_to_sheet(productosData);
        xlsx.utils.book_append_sheet(wb, wsProductos, 'Productos');

        const pedidosData = [['ID', 'Cliente', 'Telefono', 'Productos', 'Total', 'Fecha', 'Estado']];
        const wsPedidos = xlsx.utils.aoa_to_sheet(pedidosData);
        xlsx.utils.book_append_sheet(wb, wsPedidos, 'Pedidos');

        xlsx.writeFile(wb, dbPath);
    }
}

function getSheetData(sheetName) {
    const wb = xlsx.readFile(dbPath);
    const ws = wb.Sheets[sheetName];
    return xlsx.utils.sheet_to_json(ws);
}

function saveSheetData(sheetName, data) {
    const wb = xlsx.readFile(dbPath);
    const newWs = xlsx.utils.json_to_sheet(data);
    wb.Sheets[sheetName] = newWs;
    xlsx.writeFile(wb, dbPath);
}

const db = {
    init: initDB,
    getProducts: () => getSheetData('Productos'),
    getProduct: (id) => {
        const products = getSheetData('Productos');
        return products.find(p => p.ID == id);
    },
    addProduct: (product) => {
        const products = getSheetData('Productos');
        product.ID = Date.now().toString(); // Generate simple ID
        products.push(product);
        saveSheetData('Productos', products);
    },
    updateProduct: (id, updatedProduct) => {
        let products = getSheetData('Productos');
        const index = products.findIndex(p => p.ID == id);
        if (index !== -1) {
            products[index] = { ...products[index], ...updatedProduct };
            saveSheetData('Productos', products);
        }
    },
    deleteProduct: (id) => {
        let products = getSheetData('Productos');
        products = products.filter(p => p.ID != id);
        saveSheetData('Productos', products);
    },
    getOrders: () => getSheetData('Pedidos'),
    addOrder: (order) => {
        const orders = getSheetData('Pedidos');
        order.ID = Date.now().toString();
        order.Fecha = new Date().toLocaleString('es-MX');
        order.Estado = 'Pendiente';
        orders.push(order);
        saveSheetData('Pedidos', orders);
    },
    updateOrderStatus: (id, status) => {
        let orders = getSheetData('Pedidos');
        const index = orders.findIndex(o => o.ID == id);
        if (index !== -1) {
            orders[index].Estado = status;
            saveSheetData('Pedidos', orders);
        }
    }
};

module.exports = db;
