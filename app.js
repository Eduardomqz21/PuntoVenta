
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const routes = require('./src/routes');
const db = require('./src/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize DB
db.init();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
// Also serve uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Session for simple admin auth
app.use(session({
    secret: 'ameyalli-secret-key',
    resave: false,
    saveUninitialized: true
}));

// Template engine setup
app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'ejs');

// Routes
app.use('/', routes);

app.listen(PORT, () => {
    console.log("Servidor corriendo en http://localhost:" + PORT);;
});
