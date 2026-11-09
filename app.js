/**
 * Servidor Principal de Aplicación - Novedades Ameyalli
 * Configura Express, middlewares de seguridad, sesiones, motor de vistas EJS
 * y manejo centralizado de errores.
 */

const express = require('express');
const path = require('path');
const session = require('express-session');
const routes = require('./src/routes');
const db = require('./src/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Inicialización de la base de datos y migraciones automáticas
db.init();

// ==========================================
// SEGURIDAD Y MIDDLEWARES BÁSICOS
// ==========================================

// Encabezados HTTP de seguridad defensiva
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

// Parseo de cuerpos de peticiones JSON y URL-Encoded
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json({ limit: '10mb' }));

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuración de Sesiones Seguras
const isProduction = process.env.NODE_ENV === 'production';
app.use(session({
    name: 'ameyalli_session_id',
    secret: process.env.SESSION_SECRET || 'ameyalli-super-secure-session-key-2026',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true, // Mitiga robo de cookies vía JavaScript / XSS
        secure: isProduction, // HTTPS en producción
        sameSite: 'lax', // Protección contra CSRF
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
}));

// Pasar variables globales seguras a todas las vistas EJS
app.use((req, res, next) => {
    res.locals.isAdmin = (req.session && req.session.isAdmin) || false;
    res.locals.adminUser = (req.session && req.session.adminUser) || '';
    res.locals.currentPath = req.path;
    next();
});

// Configuración del motor de plantillas EJS
app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'ejs');

// ==========================================
// RUTAS DE LA APLICACIÓN
// ==========================================
app.use('/', routes);

// Middleware para rutas no encontradas (404)
app.use((req, res) => {
    res.status(404).render('index', { 
        products: [], 
        category: 'Página No Encontrada (404)', 
        searchQuery: '' 
    });
});

// Middleware centralizado de manejo de errores (500)
app.use((err, req, res, next) => {
    console.error('[Error No Controlado]', err.stack || err.message);
    if (req.xhr || req.headers.accept?.includes('application/json')) {
        return res.status(500).json({ 
            success: false, 
            message: 'Ocurrió un error interno en el servidor.' 
        });
    }
    res.status(500).send('<h3>Error en el servidor. Por favor intenta más tarde.</h3>');
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(` Servidor Novedades Ameyalli activo en:`);
    console.log(` http://localhost:${PORT}`);
    console.log(` Panel Administrador: http://localhost:${PORT}/admin`);
    console.log(`====================================================`);
});

module.exports = app;
