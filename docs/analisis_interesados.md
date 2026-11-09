# GESTIÓN DE PROYECTOS DE SOFTWARE
## Análisis y Priorización de Partes Interesadas (Stakeholders)

**Proyecto:** Página web, catálogo digital y punto de venta para tienda de ropa ("Novedades Ameyalli")

---

### 1. Matriz de Análisis de los Interesados

A continuación se identifican los grupos de interés clave del proyecto, analizando su rol, grado de participación, impacto, niveles de poder/interés y estrategia de compromiso, adaptados a la metodología de gestión de proyectos:

| Interesado | Rol (relacionado con el proyecto) | Participación | Impacto | Poder o influencia (Alto/Medio/Bajo) | Interés (Alto/Medio/Bajo) | Compromiso |
| :--- | :--- | :--- | :--- | :---: | :---: | :--- |
| **Dueño / Propietario de la Tienda** | Patrocinador del proyecto (*Project Sponsor*) y cliente principal | Toma decisiones estratégicas y de negocio; aprueba el presupuesto ($6,000 MXN) y valida el diseño y los flujos de entrega. | Muy alto. Quiere que el proyecto incremente sus ventas y automatice la atención sin generar caos en tienda. No ofrece resistencia. | **Alto (A)** | **Medio / Alto (M/A)** | Se comunica a menudo para revisar avances, definir políticas de apartado y aprobar las entregas del catálogo. |
| **Desarrollador / Diseñador Web** | Líder técnico y miembro del equipo del proyecto | Desarrolla la arquitectura (Node.js, Express), diseña la interfaz moderna (Bootstrap 2026) y programa la base de datos en Excel y el carrito. | Dedicación total al desarrollo. Responsable directo de la calidad técnica, usabilidad y cumplimiento de objetivos. | **Alto (A)** | **Alto (A)** | Comunicación diaria y continua durante todo el ciclo de desarrollo y pruebas. |
| **Personal de Ventas (Tienda Física)** | Usuario operativo interno (*Operaciones de entrega*) | Recibe en sucursal a los clientes que levantaron pedido en línea, valida los datos, cobra y entrega la mercancía. | Medio a Alto. Cambia su rutina tradicional; debe coordinar el apartado de prendas para no venderlas en piso a otros clientes. | **Medio (M)** | **Medio (M)** | Se comunica durante las capacitaciones iniciales y en reuniones semanales para retroalimentar el proceso de entrega en caja. |
| **Clientes Actuales y Potenciales** | Usuario final externo (*Consumidor*) | Navegan por el catálogo digital (Hombre, Mujer, Descuento), apartan prendas mediante la bolsa web y acuden a tienda a pagar. | Alto en su experiencia de compra. Si la web es confusa o lenta, puede abandonar el proceso; si es ágil, aumenta su fidelidad. | **Medio (M)** | **Alto (A)** | Se comunican mediante encuestas de satisfacción, mensajes directos o dudas en mostrador al recoger su pedido. |
| **Proveedor de Hosting y Dominio** | Interesado secundario (*Soporte de infraestructura*) | Proveedor externo que aloja la aplicación web y garantiza la disponibilidad 24/7 del sitio y el dominio. | Bajo en el día a día. El impacto solo es crítico en caso de caída del servidor o renovación anual del servicio. | **Bajo / Medio (B/M)** | **Bajo (B)** | No se involucra directamente en el desarrollo; relación basada en monitoreo técnico y pago de servicios programados. |
| **Auxiliar de Tienda / Personal de Apoyo** | Empleado de apoyo en mostrador | Brinda apoyo general en tienda y puede orientar a clientes presenciales sobre cómo consultar el catálogo web en sus teléfonos. | Bajo. El impacto en sus tareas es mínimo y no presenta resistencia al cambio. | **Bajo (B)** | **Bajo (B)** | No se involucra directamente en el proyecto, pero debe estar informado y capacitado brevemente antes del lanzamiento. |

---

### 2. Priorización de los Interesados (Tabla de Poder vs. Interés)

Siguiendo el modelo de matriz Poder/Interés para definir el nivel de esfuerzo de gestión requerido para cada grupo:

```
                     PODER / INFLUENCIA
       ALTO ▲
            │  ┌───────────────────────────────┬───────────────────────────────┐
            │  │ MANTENER SATISFECHO           │ ADMINISTRAR DE CERCA          │
            │  │ (Prioridad Alta)              │ (Esfuerzo Alto)               │
            │  │                               │                               │
            │  │ • Dueño de la Tienda          │ • Desarrollador / Diseñador   │
            │  │   (Patrocinador/Decisor)      │   Web (Líder Técnico)         │
            │  │                               │ • Dueño (en validación final) │
      MEDIO │  ├───────────────────────────────┼───────────────────────────────┤
            │  │ MONITOREAR                    │ MOSTRAR CONSIDERACIÓN         │
            │  │ (Esfuerzo Mínimo)             │ (Mantener Informado)          │
            │  │                               │                               │
            │  │ • Proveedor Hosting / Dominio │ • Clientes de la Tienda       │
            │  │ • Auxiliar / Apoyo en Tienda  │ • Personal de Ventas Físicas  │
       BAJO ▼  └───────────────────────────────┴───────────────────────────────┘
               ◄─────────────── MEDIO ───────────────► ALTO
                              INTERÉS
```

#### Clasificación por Cuadrante y Estrategia de Gestión:

1. **Administrar de Cerca (Alto Poder - Alto Interés):**
   * **Desarrollador / Diseñador Web:** Requiere gestión activa y diaria, ya que de su ejecución depende el cumplimiento del cronograma, presupuesto y correcto funcionamiento de la plataforma.
   * **Dueño de la Tienda (en hitos clave):** Involucrarlo en revisiones de diseño y pruebas del carrito para asegurar que el producto final cumpla al 100% sus expectativas comerciales.

2. **Mantener Satisfecho (Alto Poder - Medio Interés):**
   * **Dueño / Patrocinador de la Tienda (gestión ejecutiva):** Mantenerlo informado con resúmenes claros de avances, métricas de costos ($6,000 MXN) y beneficios proyectados (ROI 233%) sin sobrecargarlo con detalles técnicos excesivos de programación.

3. **Mostrar Consideración / Mantener Informado (Medio/Bajo Poder - Alto/Medio Interés):**
   * **Clientes:** Diseñar una interfaz intuitiva y transparente (mensajes claros de que el pago y entrega es en tienda física) para que su experiencia sea óptima y recomienden la tienda.
   * **Personal de Ventas (Tienda Física):** Capacitarlos antes del lanzamiento en la consulta del panel/Excel de pedidos para que se sientan seguros, valorados y preparados en el nuevo proceso de entrega.

4. **Monitorear (Bajo Poder - Bajo Interés):**
   * **Proveedor de Hosting y Auxiliar de Tienda:** Requieren un esfuerzo mínimo de gestión. Se mantienen bajo observación pasiva para garantizar disponibilidad del servidor y que el personal de piso conozca la existencia del enlace web.

---

### Conclusión
El análisis demuestra que el éxito del proyecto "Novedades Ameyalli" depende no solo del desarrollo técnico, sino de la sincronización entre el **Dueño** (patrocinador clave) y el **Personal de Ventas** (adoptantes operativos). Al alinear la estrategia de comunicación según esta matriz, se garantiza que el cambio se adopte con mínima fricción y máximo impacto comercial.
