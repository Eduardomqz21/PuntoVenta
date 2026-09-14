
const db = require('./src/db');
db.init();

const sampleProducts = [
    { Nombre: 'Camisa Casual Manga Larga', Descripcion: 'Camisa de algodón con diseño moderno y ajuste perfecto.', Precio: 350.00, Categoria: 'Hombre', Imagen: '' },
    { Nombre: 'Pantalón Chino Clásico', Descripcion: 'Pantalón cómodo para el trabajo o salida casual.', Precio: 450.00, Categoria: 'Hombre', Imagen: '' },
    { Nombre: 'Blusa Estampado Floral', Descripcion: 'Ligera y fresca, ideal para la temporada de verano.', Precio: 280.00, Categoria: 'Mujer', Imagen: '' },
    { Nombre: 'Vestido de Noche Elegante', Descripcion: 'Destaca en cualquier evento con este hermoso vestido largo.', Precio: 890.00, Categoria: 'Mujer', Imagen: '' },
    { Nombre: 'Chamarra de Mezclilla', Descripcion: 'Clásica chamarra azul que combina con todo.', Precio: 550.00, Categoria: 'Hombre', Imagen: '' },
    { Nombre: 'Zapatos de Tacón Medio', Descripcion: 'Zapatos cómodos para el uso diario.', Precio: 600.00, Categoria: 'Mujer', Imagen: '' },
    { Nombre: 'Playera Básica Algodón', Descripcion: 'Playera esencial en varios colores.', Precio: 150.00, Categoria: 'Descuento', Imagen: '' },
    { Nombre: 'Short Deportivo Mujer', Descripcion: 'Ideal para el gimnasio o correr al aire libre.', Precio: 199.00, Categoria: 'Descuento', Imagen: '' }
];

sampleProducts.forEach(p => db.addProduct(p));
console.log('Productos de prueba añadidos con éxito.');
