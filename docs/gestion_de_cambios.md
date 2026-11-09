# Gestión de Cambios: Implementación de Web y Punto de Venta "Novedades Ameyalli"

**Objetivo del Documento:**
De acuerdo con la metodología de gestión de cambios, este documento identifica a las audiencias afectadas por la implementación del nuevo catálogo web y punto de venta, evalúa el impacto (positivo y negativo) en sus procesos, y establece las estrategias de mitigación para asegurar una transición exitosa y reducir el impacto en la productividad.

---

## 1. ¿A quiénes afecta el cambio? (Grupos de Usuarios)

Tras analizar el alcance del proyecto, hemos identificado tres grupos principales que interactuarán directa o tangencialmente con el nuevo sistema:

1. **Dueño / Administrador de la Tienda:** Responsable de cargar los productos, actualizar el catálogo y revisar los pedidos entrantes.
2. **Empleados de la Tienda Física (Ventas):** Personal que atiende en el local y se encargará de cobrar y entregar la mercancía apartada en línea.
3. **Clientes (Usuarios Finales):** Personas que navegarán por el catálogo web y realizarán pedidos para recoger en tienda.

---

## 2. ¿Cómo los afecta el cambio? (Análisis de Impacto)

A continuación, se detalla el impacto que tendrá la nueva herramienta en la rutina de cada grupo, considerando que todo cambio conlleva una fase inicial de resistencia o curva de aprendizaje ("empeorar antes de mejorar").

### A. Dueño / Administrador
* **Impacto Positivo:** Tendrá un control centralizado, digital y automático de su inventario y pedidos. Ahorrará tiempo al no tener que responder mensajes manuales preguntando por "qué ropa hay disponible".
* **Impacto Negativo (Resistencia):** Tendrá que aprender a utilizar el panel de administración web (`/admin`), recordar contraseñas, subir imágenes de los productos correctamente y cambiar su hábito de anotar pedidos en papel. Además, debe aprender a no editar el archivo de Excel manualmente mientras el sistema está encendido para evitar conflictos.

### B. Empleados de la Tienda Física (Ventas)
* **Impacto Positivo:** Las ventas serán más rápidas, ya que el cliente llegará con un pedido pre-armado y sabiendo el total a pagar.
* **Impacto Negativo (Resistencia):** Altera su proceso tradicional de venta. Ahora tendrán que coordinarse con el Administrador para identificar qué cliente viene por un "pedido web" y tener las prendas separadas del inventario físico para no venderlas por error a alguien más en la tienda.

### C. Clientes (Usuarios Finales)
* **Impacto Positivo:** Comodidad para ver tallas, precios, categorías (Hombre, Mujer, Descuento) y apartar ropa 24/7 desde su celular.
* **Impacto Negativo (Resistencia):** Los clientes que están acostumbrados a comprar en línea tradicionalmente podrían confundirse y buscar dónde meter su tarjeta de crédito, frustrándose si no entienden que el modelo es "pide en línea, paga en tienda".

---

## 3. ¿Qué se realizará para mitigar el impacto negativo? (Estrategias de Transición)

Para garantizar la adopción del sistema y generar credibilidad y confianza, ejecutaremos las siguientes acciones de mitigación divididas por audiencia:

### Estrategias para el Dueño / Administrador (Fase de Preparación y Resiliencia)
* **Capacitación 1 a 1:** Realizar una sesión de demostración donde el administrador agregue un producto de prueba y complete un pedido, asegurando que se sienta seguro con la herramienta.
* **Documentación Simple:** Entregar un manual rápido ("Walkthrough") con pasos sencillos y visuales.
* **Medida preventiva técnica:** La base de datos se exporta a un Excel (`database.xlsx`) para que el administrador sienta tranquilidad de que sus datos están en un formato que él conoce y domina, reduciendo el miedo a perder la información.

### Estrategias para los Empleados de Tienda (Fase de Concientización)
* **Nuevo Protocolo de Comunicación:** Establecer una rutina diaria. El administrador imprimirá o enviará por WhatsApp la lista de pedidos pendientes del día a los vendedores para que separen la ropa a primera hora.
* **Sesión de preguntas y respuestas:** Reunir a los vendedores para explicarles que esta herramienta les ayudará a vender más rápido, enfatizando los aspectos positivos para ganar su aceptación.

### Estrategias para los Clientes (Diseño Centrado en el Usuario)
* **Mensajes Claros (UX/UI):** En la vista del carrito de compras (`carrito.ejs`), se añadió un recuadro muy visible que dice *"Pago y entrega directamente en tienda física"* antes de pedir el nombre y teléfono.
* **Notificación de Éxito:** Al confirmar el pedido, un mensaje de éxito (Modal) reafirma al cliente las instrucciones: *"Te esperamos en la tienda para realizar el pago y entregarte tus productos"*. Esto evita falsas expectativas y reduce la fricción de uso.
