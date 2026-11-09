# GESTIÓN DE PROYECTOS DE SOFTWARE
## PLAN DE PROYECTO (PLAN MAESTRO INTEGRADO)

**Instituto:** Campus Chapala  
**Alumnos:**
* ÁNGEL GABRIEL CARRILLO SANTOS (Líder de Proyecto)
* CARLOS ALONSO DELGADO MURILLO (Desarrollador Backend y Base de Datos)
* JOSÉ DE JESÚS GUARDADO ANDONAEGUI (Diseñador UI/UX y Frontend)
* EDUARDO ISAÍAS PARRA MÁRQUEZ (Control de Calidad / Aseguramiento y Minutas)  
**Carrera:** Ingeniería en Sistemas Computacionales | **Grupo:** 7° A  
**Proyecto:** Página web, catálogo digital y punto de venta para tienda de ropa ("Novedades Ameyalli")  
**Fecha:** Octubre 2026

---

### 1. Resumen General del Proyecto

* **Nombre del Proyecto:** Página web, catálogo digital y punto de venta para tienda de ropa ("Novedades Ameyalli")
* **Descripción:** Desarrollo de catálogo web responsivo con bolsa de compras, pedidos con recolección física en tienda, base de datos amigable en Excel (`data/database.xlsx`) y panel de administración protegido para Novedades Ameyalli.
* **Líder / Responsable:** Ángel Gabriel Carrillo Santos
* **Estado del Proyecto:** Aprobado / En ejecución (Versión Final Oficial / Listo para Operación)

---

### 2. Documentos Clave del Plan de Proyecto

| Documento Clave | Descripción del Contenido y Enlace | Nombre del Documento (Archivo en Google Drive) |
| :--- | :--- | :--- |
| **Acta de Constitución del Proyecto** | Objetivos del negocio, justificación, alcance inicial y entrevista al cliente | `01_Acta_Constitucion_Proyecto_Novedades_Ameyalli.docx` |
| **Declaración de Trabajo (SoW - Proveedor)** | Declaración de trabajo para hosting en la nube, dominio y certificados SSL con Hostinger | `06_Declaracion_Trabajo_SoW_Hostinger.docx` |
| **Plan de Gestión de Riesgos** | Plan de gestión de riesgos: 9 riesgos (presupuesto y cronograma) con mitigaciones | `07_Plan_Gestion_Riesgos_Novedades_Ameyalli.docx` |
| **Cronograma de Trabajo (Diagrama de Gantt)** | Calendario oficial de trabajo con 14 tareas en 4 fases (5 oct al 17 nov 2026) | `04_Cronograma_Gantt_Novedades_Ameyalli.xlsx` |
| **Presupuesto del Proyecto** | Presupuesto total de $6,000.00 MXN ($3,600 mano de obra, $2,000 fijos, $400 reserva) | `05_Presupuesto_Novedades_Ameyalli.xlsx` |
| **Plan de Comunicación y Seguimiento** | Matriz de comunicación con equipo, patrocinador, empleados, proveedor y clientes | `08_Plan_Comunicacion_Novedades_Ameyalli.xlsx` |
| **Carpeta Compartida en Google Drive** | [Enlace a Carpeta en Google Drive](https://drive.google.com/drive/folders/1KTfw3q8_xT7JfH1X52csWwappXuj9MRM?usp=sharing) | Carpeta `KeyDocs` en Google Drive |
| **Matriz de Responsabilidades (RACI)** | Matriz de responsabilidades con 6 roles y 14 tareas organizadas por fases | `02_Matriz_RACI_Novedades_Ameyalli.xlsx` |
| **Estructura de Desglose del Trabajo (EDT / WBS)** | Desglose jerárquico de componentes, tareas y secuencia de trabajo de las 4 fases | `03_EDT_Estructura_Desglose_Trabajo.docx / .xlsx` |

---

### 3. Cronograma de Trabajo y Fases (Diagrama de Gantt)

**Título del Proyecto:** Plan de Trabajo - Novedades Ameyalli  
**Empresa / Cliente:** Novedades Ameyalli  
**Líder de Proyecto:** Ángel Gabriel Carrillo Santos | **Fecha de Creación:** 05/Octubre/2026  
**Duración Total:** 7 Semanas (31 días hábiles) | **Fechas:** 05/10/2026 al 17/11/2026  

| ID Tarea | Hitos y Tareas | Responsable | Fecha Inicio | Fecha Fin | Duración (Días) | % Avance | Hito Asociado |
| :---: | :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| **FASE 1** | **FASE 1: Planificación y Análisis Inicial** | **Líder de Proyecto / Equipo** | **05/10/2026** | **16/10/2026** | **10** | **100%** | **HITO 1: Planificación Concluida** |
| 1.1 | Entrevista al cliente y levantamiento de requerimientos de tienda | Líder de Proyecto | 05/10/2026 | 09/10/2026 | 5 | 100% | H1 - Documento de Requerimientos |
| 1.2 | Análisis costo-beneficio y cálculo de ROI (233%) | Líder de Proyecto | 05/10/2026 | 14/10/2026 | 8 | 100% | H1 - Análisis Financiero Costo-Beneficio y ROI |
| 1.3 | Mapeo de interesados y matriz poder vs. interés | Control de Calidad / QA | 12/10/2026 | 16/10/2026 | 5 | 100% | H1 - Matriz de Interesados |
| **FASE 2** | **FASE 2: Diseño y Arquitectura de la Solución** | **Desarrollador Backend / UI/UX** | **19/10/2026** | **30/10/2026** | **10** | **100%** | **HITO 2: Arquitectura Aprobada** |
| 2.1 | Maquetación y diseño responsivo de interfaz (Bootstrap) | Diseñador UI/UX y Frontend | 19/10/2026 | 28/10/2026 | 8 | 100% | H2 - Plantillas de Vistas EJS y Estilos CSS |
| 2.2 | Estructuración de base de datos en Excel (`data/database.xlsx`) | Desarrollador Backend y BD | 19/10/2026 | 27/10/2026 | 7 | 100% | H2 - Conector de BD `src/db.js` |
| 2.3 | Configuración del servidor Node.js, Express y rutas | Desarrollador Backend y BD | 19/10/2026 | 30/10/2026 | 10 | 100% | H2 - Servidor `app.js` y Rutas del Sistema |
| **FASE 3** | **FASE 3: Desarrollo de Funcionalidades** | **Equipo de Desarrollo Web** | **26/10/2026** | **06/11/2026** | **10** | **100%** | **HITO 3: Sistema Funcional Completo** |
| 3.1 | Programación del catálogo con filtros (Hombre, Mujer, Descuentos) | Diseñador UI/UX y Frontend | 26/10/2026 | 04/11/2026 | 8 | 100% | H3 - Catálogo Dinámico en Línea |
| 3.2 | Implementación de carrito de compras y notificaciones emergentes | Diseñador UI/UX y Frontend | 28/10/2026 | 05/11/2026 | 7 | 100% | H3 - Carrito Funcional `cart.js` |
| 3.3 | Desarrollo de panel /admin para inventario y pedidos | Desarrollador Backend y BD | 26/10/2026 | 06/11/2026 | 10 | 100% | H3 - Panel de Administración Protegido |
| 3.4 | Carga inicial de prendas, categorías e imágenes de muestra | Diseñador UI/UX y Frontend | 26/10/2026 | 02/11/2026 | 6 | 100% | H3 - Catálogo Inicial Poblado |
| **FASE 4** | **FASE 4: Pruebas, Despliegue y Entrega** | **Equipo Completo y Patrocinador** | **09/11/2026** | **17/11/2026** | **6** | **100%** | **HITO 4: Proyecto en Operación** |
| 4.1 | Pruebas integrales de flujo de pedido y retiro en tienda | Control de Calidad / QA | 09/11/2026 | 13/11/2026 | 5 | 100% | H4 - Casos de Prueba Aprobados |
| 4.2 | Control de versiones y publicación en repositorio GitHub | Desarrollador Backend y BD | 09/11/2026 | 13/11/2026 | 5 | 100% | H4 - Repositorio GitHub Publicado |
| 4.3 | Capacitación al dueño y personal en panel y Excel | Control de Calidad / QA | 13/11/2026 | 17/11/2026 | 2 | 100% | H4 - Personal de Tienda Capacitado |
| 4.4 | Puesta en marcha oficial y acta de entrega final | Líder de Proyecto | 17/11/2026 | 17/11/2026 | 1 | 100% | H4 - Acta de Entrega Final Firmada |

---

### 4. Presupuesto General del Proyecto

* **Presupuesto Meta:** \$6,000.00 MXN  
* **Gasto Real:** \$6,000.00 MXN  
* **Diferencia / Saldo:** \$0.00 MXN  

| Hitos y Tareas | Detalles de Personal / Proveedor | Horas | Tarifa ($/h) | Unidades | Costo Unitario / Fijo | Presupuesto ($) | Categoría |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Hito 1: Planificación y Análisis Inicial** | | | | | | **$710.00** | **Hito 1** |
| Tarea 1.1: Entrevista y levantamiento de requerimientos | Líder de Proyecto (Ángel Gabriel) | 7 | $35.00 | 1 | $245.00 | $245.00 | Mano de obra |
| Tarea 1.2: Análisis Costo-Beneficio y ROI (233%) | Líder de Proyecto (Ángel Gabriel) | 9 | $35.00 | 1 | $315.00 | $315.00 | Mano de obra |
| Tarea 1.3: Mapeo de interesados y matriz poder/interés | Control de Calidad / QA (Eduardo) | 5 | $30.00 | 1 | $150.00 | $150.00 | Mano de obra |
| **Hito 2: Diseño y Arquitectura de la Solución** | | | | | | **$1,080.00** | **Hito 2** |
| Tarea 2.1: Maquetación y diseño de interfaz (Bootstrap) | Diseñador UI/UX (José de Jesús) | 8 | $35.00 | 1 | $280.00 | $280.00 | Mano de obra |
| Tarea 2.2: Base de datos en Excel (`data/database.xlsx`) | Desarrollador Backend (Carlos Alonso) | 8 | $40.00 | 1 | $320.00 | $320.00 | Mano de obra |
| Tarea 2.3: Servidor Node.js, Express y rutas | Desarrollador Backend (Carlos Alonso) | 12 | $40.00 | 1 | $480.00 | $480.00 | Mano de obra |
| **Hito 3: Desarrollo de Funcionalidades** | | | | | | **$1,260.00** | **Hito 3** |
| Tarea 3.1: Programación catálogo con filtros | Diseñador UI/UX (José de Jesús) | 8 | $35.00 | 1 | $280.00 | $280.00 | Mano de obra |
| Tarea 3.2: Carrito de compras y notificaciones emergentes | Diseñador UI/UX (José de Jesús) | 7 | $35.00 | 1 | $245.00 | $245.00 | Mano de obra |
| Tarea 3.3: Panel /admin para inventario y pedidos | Desarrollador Backend (Carlos Alonso) | 14 | $40.00 | 1 | $560.00 | $560.00 | Mano de obra |
| Tarea 3.4: Carga inicial de prendas y muestras | Diseñador UI/UX (José de Jesús) | 5 | $35.00 | 1 | $175.00 | $175.00 | Mano de obra |
| **Hito 4: Pruebas, Despliegue y Puesta en Marcha** | | | | | | **$550.00** | **Hito 4** |
| Tarea 4.1: Pruebas integrales de flujo de pedido y retiro | Control de Calidad / QA (Eduardo) | 8 | $30.00 | 1 | $240.00 | $240.00 | Mano de obra |
| Tarea 4.2: Control de versiones y publicación en GitHub | Desarrollador Backend (Carlos Alonso) | 3 | $40.00 | 1 | $120.00 | $120.00 | Mano de obra |
| Tarea 4.3: Capacitación al dueño y personal en tienda | Control de Calidad / QA (Eduardo) | 4 | $30.00 | 1 | $120.00 | $120.00 | Mano de obra |
| Tarea 4.4: Puesta en marcha oficial y acta de entrega | Líder de Proyecto (Ángel Gabriel) | 2 | $35.00 | 1 | $70.00 | $70.00 | Mano de obra |
| **Costos Fijos de Infraestructura y Operación** | | | | | | **$2,000.00** | **Costos Fijos** |
| Servidor Cloud VPS y Dominio web (12 meses) | Proveedor Externo: Hostinger México | -- | -- | 1 | $1,500.00 | $1,500.00 | Costo Fijo (Hostinger) |
| Soporte y mantenimiento técnico eventual (primer año) | Equipo de Soporte / Mantenimiento | -- | -- | 1 | $500.00 | $500.00 | Soporte Fijo |
| **Reserva de Contingencia / Margen de Seguridad** | Margen de reserva (10% sobre mano de obra) | -- | -- | 1 | $400.00 | $400.00 | Reserva |
| **PRESUPUESTO TOTAL DEL PROYECTO** | **100 Horas de Desarrollo + Costos Fijos + Reserva** | **100** | | | | **$6,000.00** | **TOTAL** |

---

### 5. Plan de Comunicación y Seguimiento

| Destinatarios | Tipo de Comunicación | Frecuencia | Remitente / Responsable | Fechas Clave | Métodos de Entrega | Objetivo Principal | Notas / Seguimiento |
| :--- | :--- | :---: | :--- | :---: | :--- | :--- | :--- |
| **Equipo central (Desarrollo, UI/UX, QA)** | Reunión de avance e integración | Semanal | Líder de Proyecto (Ángel Gabriel) | Todos los lunes 6:00 p.m. | Videollamada (Slack / Meet) | Revisar avance EDT/WBS, resolver bloqueos técnicos e integrar código en Git. | Minuta elaborada por Eduardo Parra. |
| **Dueño / Patrocinador (Novedades Ameyalli)** | Informe de estado ejecutivo y demostración | Quincenal / Por hito | Líder de Proyecto (Ángel Gabriel) | Cierre de H1, H2, H3 y H4 | En persona / Correo electrónico | Validar avances del proyecto, presentar demostración web, revisar presupuesto y aprobar hitos. | Reunión quincenal presencial en tienda. |
| **Personal de ventas (Tienda física)** | Capacitación operativa de entrega | Una vez (con seguimiento) | Control de Calidad / QA (Eduardo) | Viernes 13 de noviembre 2026 | En persona (en tienda física) | Capacitar en el protocolo de recepción de pedidos web y coordinación del inventario. | Práctica simulada con cliente real. |
| **Dueño / Administrador de la Tienda** | Capacitación técnica (Panel /admin y Excel) | Una vez | QA y Desarrollador Backend | Lunes 16 de noviembre 2026 | En persona / Demostración práctica | Entrenar al dueño en la carga de productos, actualización de precios y manejo de database.xlsx. | Entrega de manual de usuario en PDF. |
| **Proveedor de Hosting (Hostinger)** | Gestión de infraestructura y soporte | Según sea necesario / Inicial | Desarrollador Backend (Carlos Alonso) | 19 al 30 de octubre 2026 | Chat en vivo / Ticket de Soporte hPanel | Aprovisionamiento de servidor VPS Node.js, activación de dominio y certificados SSL. | Alineado con la Declaración de Trabajo (SoW - Hostinger). |
| **Clientes y Usuarios Finales** | Notificaciones y mensajes de interfaz | Continua (en el sitio web) | Diseñador UI/UX (José de Jesús) | A partir de lanzamiento (17 nov 2026) | Interfaz Web (Notificaciones emergentes / Modales) | Informar claramente sobre la modalidad: "Pide en línea, paga y recoge en tienda física". | Mensajes emergentes Toast de Bootstrap implementados. |
| **Equipo de Desarrollo y Cliente** | Encuesta de adopción y retroalimentación | Una vez | Control de Calidad / QA (Eduardo) | Primeras 2 semanas posteriores al lanzamiento | Formularios digitales / En persona | Evaluar satisfacción de uso, detectar incidencias operativas y medir adopción del sistema. | Cierre de lecciones aprendidas. |
