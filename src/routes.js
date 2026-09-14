
const express = require('express');
const router = express.Router();
const db = require('./db');
const multer = require('multer');
const path = require('path');

// Setup Multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads/'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Simple auth middleware
const requireAuth = (req, res, next) => {
    if (req.session.isAdmin) {
        next();
    } else {
        res.redirect('/admin/login');
    }
};

// --- USER ROUTES ---

router.get('/', (req, res) => {
    const products = db.getProducts();
    res.render('index', { products, category: 'Todos' });
});

router.get('/categoria/:cat', (req, res) => {
    const cat = req.params.cat;
    const allProducts = db.getProducts();
    const products = allProducts.filter(p => p.Categoria.toLowerCase() === cat.toLowerCase());
    res.render('index', { products, category: cat.charAt(0).toUpperCase() + cat.slice(1) });
});

router.get('/carrito', (req, res) => {
    res.render('carrito');
});

router.post('/checkout', (req, res) => {
    const { cliente, telefono, productos_json, total } = req.body;
    db.addOrder({
        Cliente: cliente,
        Telefono: telefono,
        Productos: productos_json, // JSON string of cart
        Total: total
    });
    res.json({ success: true, message: 'Pedido enviado correctamente.' });
});

// --- ADMIN ROUTES ---

router.get('/admin/login', (req, res) => {
    res.render('login', { error: null });
});

router.post('/admin/login', (req, res) => {
    const { password } = req.body;
    // VERY simple hardcoded password for now
    if (password === 'ameyalli123') {
        req.session.isAdmin = true;
        res.redirect('/admin');
    } else {
        res.render('login', { error: 'Contraseña incorrecta' });
    }
});

router.get('/admin/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

router.get('/admin', requireAuth, (req, res) => {
    const products = db.getProducts();
    const orders = db.getOrders();
    res.render('admin', { products, orders });
});

router.post('/admin/add-product', requireAuth, upload.single('imagen'), (req, res) => {
    const { nombre, descripcion, precio, categoria } = req.body;
    const imagen = req.file ? '/uploads/' + req.file.filename : '';
    
    db.addProduct({
        Nombre: nombre,
        Descripcion: descripcion,
        Precio: Number(precio),
        Categoria: categoria,
        Imagen: imagen
    });
    res.redirect('/admin');
});

router.post('/admin/delete-product/:id', requireAuth, (req, res) => {
    db.deleteProduct(req.params.id);
    res.redirect('/admin');
});

router.post('/admin/update-order/:id', requireAuth, (req, res) => {
    const { estado } = req.body;
    db.updateOrderStatus(req.params.id, estado);
    res.redirect('/admin');
});

module.exports = router;
