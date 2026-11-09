# GESTIÓN DE PROYECTOS DE SOFTWARE
## ENTREGABLE 9 - DECLARACIÓN DE TRABAJO (STATEMENT OF WORK - SoW)

**Instituto:** Campus Chapala  
**Alumnos:**
* ANGEL GABRIEL CARRILLO SANTOS
* CARLOS ALONSO DELGADO MURILLO
* JOSE DE JESUS GUARDADO ANDONAEGUI
* EDUARDO ISAIAS PARRA MARQUEZ  
**Carrera:** Ing. Sistemas Computacionales | **Grupo:** 7° A  
**Proyecto:** Página web, catálogo digital y punto de venta para tienda de ropa ("Novedades Ameyalli")  
**Unidad:** Gestión de Proyectos de Software – Unidad 2 – Octubre 2026

---

### 1. Introducción y Selección del Proveedor Externo (Hostinger)

La **Declaración de Trabajo (Statement of Work - SoW)** es un documento formal dentro de la gestión de proyectos (metodología de Google Project Management) que especifica el alcance, los entregables, las actividades excluidas, los plazos y las condiciones financieras de un proveedor externo contratado para el proyecto.

Para otorgar la máxima credibilidad técnica y financiera al proyecto **"Novedades Ameyalli"**, se seleccionó como proveedor de infraestructura a **Hostinger (Hostinger México / Hostinger International Ltd.)**, un proveedor real líder en servicios de alojamiento en la nube, servidores virtuales y registro de dominios. Con Hostinger se contrata el servicio de **Servidor Virtual VPS para Node.js**, el registro del dominio oficial `novedadesameyalli.com` y los certificados de seguridad SSL.

#### Trazabilidad con los entregables previos de la Unidad 2:
1. **Entregable 1 (Interesados):** Conecta con el rol del *"Proveedor de Hosting y Dominio Web"* (Hostinger), clasificado en el cuadrante de Monitoreo.
2. **Entregable 2 (Matriz RACI):** Corresponde a la Fase 2 (Configuración de servidor) y Fase 4 (Despliegue y publicación en producción).
3. **Entregable 7 (Gantt):** La ventana de trabajo con Hostinger está calendarizada del **19 al 30 de octubre de 2026** (10 días hábiles / 2 semanas).
4. **Entregable 8 (Presupuesto):** Cumple con el monto exacto presupuestado de **$2,000.00 MXN** ($1,500 MXN anuales de hosting/dominio Hostinger + $500 MXN de configuración técnica y soporte inicial).

---

### 2. Declaración de Trabajo Oficial (Statement of Work)

```
Novedades Ameyalli  |  Statement of Work (SoW)
Fecha de Inicio / Start date: Lunes, 19 de Octubre de 2026
```

# Declaración de Trabajo: Servicios de Infraestructura Web Hostinger

**Líder del Proyecto (Project Lead):** Ángel Gabriel Carrillo Santos  
**Patrocinador del Proyecto (Project Sponsor):** Propietario de Novedades Ameyalli  
**Proveedor Seleccionado (Vendor):** Hostinger México (Hostinger International Ltd.)  

### Historial de Revisiones (Revision History):
| Fecha (Date) | Revisado por | Aprobado por | Descripción del cambio |
| :---: | :---: | :---: | :--- |
| **19/10/2026** | AGCS | AGCS | Inicio y formalización del documento SoW con Hostinger. |
| **23/10/2026** | CADM | AGCS | Validación técnica de especificaciones de Node.js v20, SSL y persistencia de Excel. |

---

### Propósito (Purpose):
Dar seguimiento y cumplimiento en tiempo y forma a la contratación de servicios de infraestructura cloud, hosting y nombre de dominio con **Hostinger** para el proyecto **Novedades Ameyalli**, asegurando alta disponibilidad 24/7, seguridad SSL y persistencia de datos del catálogo web y punto de venta.

---

### Alcance / Principales Actividades (Scope / Major Project Activities):
* **Aprovisionamiento y configuración de servidor virtual (Hostinger VPS KVM)** con soporte nativo para Node.js (v20+ LTS) y gestor de procesos PM2.
* **Registro, activación y delegación de registros DNS** del nombre de dominio oficial `novedadesameyalli.com`.
* **Instalación y activación de certificados de seguridad SSL/TLS** gratuitos ilimitados de Hostinger para navegación cifrada (HTTPS).
* **Configuración de almacenamiento persistente en disco SSD** para la base de datos en Excel (`data/database.xlsx`) y directorio de imágenes (`/uploads`).
* **Activación del sistema de copias de seguridad (backups automáticos diarios)** y entrega de credenciales de acceso al panel hPanel y SSH.

---

### Actividades Fuera del Alcance (Out-of-scope activities):
* Desarrollo, modificación o depuración del código fuente de la aplicación web (HTML, CSS, JavaScript, Express, EJS).
* Carga de productos, precios o fotografías de la ropa en el catálogo de Novedades Ameyalli.
* Capacitación al personal de mostrador sobre ventas o atención al cliente presencial.
* Reparación o mantenimiento de equipos locales (computadoras, teléfonos o red WiFi de la tienda física).

---

### Entregables (Deliverables):
* **Hostinger aprovisionará y mantendrá activo el servidor virtual en la nube** configurado con sistema operativo Linux y entorno Node.js listo para ejecutar la aplicación web.
* **Hostinger registrará el dominio `novedadesameyalli.com`** y configurará la zona DNS apuntando correctamente a la IP del servidor web.
* **Hostinger garantizará la emisión y renovación automática del certificado SSL** con candado de seguridad HTTPS activo en todos los navegadores.
* **Hostinger proporcionará el servicio de respaldos diarios automatizados** con posibilidad de restauración rápida ante contingencias.
* **El proveedor entregará las credenciales maestras de acceso a hPanel, SSH y SFTP** al Líder de Proyecto (Ángel Gabriel Carrillo Santos) y al Desarrollador Backend (Carlos Alonso Delgado Murillo).
* **El proveedor brindará soporte técnico especializado 24/7 vía chat y ticket** para resolver dudas de configuración de puertos y despliegue del entorno Node.js.

---

### Cronograma / Hitos Principales (Schedule Overview / Major Milestones):
* **Hito 1:** Contratación del servicio, aprovisionamiento del servidor VPS y registro de `novedadesameyalli.com` (19 al 21 de Octubre de 2026).
* **Hito 2:** Configuración del entorno Node.js, activación del certificado SSL y almacenamiento de base de datos Excel (22 al 26 de Octubre de 2026).
* **Hito 3:** Pruebas de conectividad en producción, validación de DNS y entrega formal de accesos (27 al 30 de Octubre de 2026).

---

### Horas Estimadas de Finalización (Estimated hours for completion):
**40 horas** de configuración técnica, aprovisionamiento y pruebas de disponibilidad.

---

### Fecha Estimada de Finalización (Estimated date for completion):
**Dos semanas (10 días hábiles). Viernes, 30 de Octubre de 2026.**

---

### Términos de Pago (Payment Terms):
El costo total acordado es de **$2,000.00 MXN** (alineado con los costos fijos presupuestados en el Entregable 8: $1,500.00 MXN por el plan de hosting anual Hostinger y registro del dominio + $500.00 MXN para soporte y configuración técnica inicial).  
Se pagará un **anticipo del 50% ($1,000.00 MXN)** a la contratación del servicio y compra del dominio, y el **50% restante ($1,000.00 MXN)** al concluir las pruebas de conexión y recibir las credenciales maestras de administración.

---

### Firmas de Conformidad:

```
____________________________________          ____________________________________
    Ángel Gabriel Carrillo Santos                     Representante de Servicio
 Líder del Proyecto (Project Lead)                         Hostinger México
        Novedades Ameyalli                           Hostinger International Ltd.
```

---

> *Este documento de Declaración de Trabajo (SoW) es un ejercicio académico para la materia de Gestión de Proyectos de Software (Instituto Tecnológico / Campus Chapala) basado en la metodología de Google Project Management. Se utiliza Hostinger como proveedor de referencia real para la estimación de costos y alcances técnicos.*
