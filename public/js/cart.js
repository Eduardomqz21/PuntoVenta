/**
 * Gestión Reactiva del Carrito y Notificaciones Toast - Novedades Ameyalli
 * Provee persistencia en localStorage, validación en tiempo real contra stock,
 * manipulación de cantidades y feedback visual interactivo.
 */

// Estado global de la bolsa de compras
let cart = JSON.parse(localStorage.getItem('cart')) || [];

/**
 * Muestra una notificación visual Toast con estilo moderno y retroalimentación en tiempo real.
 * @param {string} message - Texto principal de la notificación
 * @param {string} type - Tipo de notificación: 'success', 'danger', 'warning', 'info'
 * @param {string} title - Título superior opcional
 */
function showNotification(message, type = 'success', title = '') {
    const toastEl = document.getElementById('appToast');
    const toastTitle = document.getElementById('toastTitle');
    const toastMessage = document.getElementById('toastMessage');
    const toastIcon = document.getElementById('toastIcon');

    if (!toastEl || !toastMessage) {
        // Fallback básico en caso de que el elemento no esté en el DOM
        console.log(`[Toast ${type}] ${message}`);
        return;
    }

    // Configuración según el tipo
    const config = {
        success: {
            icon: 'bi-check-circle-fill',
            colorClass: 'text-success',
            borderClass: 'border-success-subtle',
            defaultTitle: '¡Éxito!'
        },
        danger: {
            icon: 'bi-exclamation-octagon-fill',
            colorClass: 'text-danger',
            borderClass: 'border-danger-subtle',
            defaultTitle: 'Atención / Error'
        },
        error: {
            icon: 'bi-exclamation-octagon-fill',
            colorClass: 'text-danger',
            borderClass: 'border-danger-subtle',
            defaultTitle: 'Error'
        },
        warning: {
            icon: 'bi-exclamation-triangle-fill',
            colorClass: 'text-warning',
            borderClass: 'border-warning-subtle',
            defaultTitle: 'Aviso de Stock'
        },
        info: {
            icon: 'bi-info-circle-fill',
            colorClass: 'text-primary',
            borderClass: 'border-primary-subtle',
            defaultTitle: 'Información'
        }
    };

    const currentConf = config[type] || config.info;

    // Actualizar contenido y estilos
    toastTitle.textContent = title || currentConf.defaultTitle;
    toastMessage.textContent = message;

    // Limpiar clases previas del icono
    toastIcon.className = `bi ${currentConf.icon} fs-4 me-3 ${currentConf.colorClass}`;

    // Limpiar bordes previos
    toastEl.className = `toast align-items-center border shadow-lg bg-white ${currentConf.borderClass}`;

    const bsToast = bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 4000 });
    bsToast.show();
}

// Compatibilidad con el llamado histórico showToast
function showToast(message, isError = false) {
    showNotification(message, isError ? 'danger' : 'success');
}

/**
 * Guarda el carrito actual en localStorage y actualiza el contador global.
 */
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

/**
 * Actualiza el contador numérico en la barra de navegación con animación visual.
 */
function updateCartCount() {
    const countSpan = document.getElementById('cart-count');
    if (countSpan) {
        const totalItems = cart.reduce((acc, item) => acc + (parseInt(item.cantidad, 10) || 0), 0);
        countSpan.textContent = totalItems;
        
        // Animación suave de salto
        countSpan.classList.remove('badge-pop');
        void countSpan.offsetWidth; // Forzar reflujo
        countSpan.classList.add('badge-pop');
    }
}

/**
 * Añade un producto al carrito verificando previamente el stock disponible.
 * @param {string} id - ID del producto
 * @param {string} nombre - Nombre del producto
 * @param {number} precio - Precio unitario
 * @param {number} stock - Stock máximo disponible en inventario
 * @param {string} imagen - URL o ruta de la imagen
 */
function addToCart(id, nombre, precio, stock = 10, imagen = '') {
    const stockMaximo = parseInt(stock, 10) || 0;

    // 1. Bloqueo si el stock es cero o negativo
    if (stockMaximo <= 0) {
        showNotification(`Lo sentimos, "${nombre}" está actualmente agotado.`, 'danger', 'Producto Agotado');
        return;
    }

    const existingIndex = cart.findIndex(item => String(item.id) === String(id));
    const currentQty = existingIndex !== -1 ? cart[existingIndex].cantidad : 0;

    // 2. Bloqueo si la cantidad ya añadida alcanza o supera el stock disponible
    if (currentQty >= stockMaximo) {
        showNotification(
            `No puedes añadir más unidades de "${nombre}". Stock disponible: ${stockMaximo}`, 
            'warning', 
            'Límite de Stock Alcanzado'
        );
        return;
    }

    // 3. Añadir o incrementar
    if (existingIndex !== -1) {
        cart[existingIndex].cantidad += 1;
        // Aseguramos que la imagen y el stock estén actualizados
        cart[existingIndex].stock = stockMaximo;
        cart[existingIndex].precio = precio;
    } else {
        cart.push({
            id: String(id),
            nombre: String(nombre),
            precio: parseFloat(precio) || 0,
            stock: stockMaximo,
            imagen: imagen || '',
            cantidad: 1
        });
    }

    saveCart();
    showNotification(`Se añadió "${nombre}" a tu bolsa de compras.`, 'success', '¡Añadido a la Bolsa!');
}

/**
 * Modifica la cantidad de un artículo en el carrito respetando el stock disponible.
 * @param {number} index - Índice del artículo en el carrito
 * @param {number} change - Delta (+1 o -1) o nueva cantidad
 */
function changeQuantity(index, change) {
    if (!cart[index]) return;

    const item = cart[index];
    const newQty = item.cantidad + change;

    if (newQty <= 0) {
        removeFromCart(index);
        return;
    }

    if (newQty > item.stock) {
        showNotification(
            `Solo hay ${item.stock} unidades disponibles de "${item.nombre}".`, 
            'warning', 
            'Stock Máximo'
        );
        item.cantidad = item.stock;
    } else {
        item.cantidad = newQty;
    }

    saveCart();
    renderCart();
}

/**
 * Elimina un producto de la bolsa de compras.
 * @param {number} index 
 */
function removeFromCart(index) {
    if (!cart[index]) return;
    const removedName = cart[index].nombre;
    cart.splice(index, 1);
    saveCart();
    renderCart();
    showNotification(`Se eliminó "${removedName}" de tu bolsa.`, 'info', 'Artículo Removido');
}

/**
 * Renderiza dinámicamente el contenido del carrito en templates/carrito.ejs.
 */
function renderCart() {
    const container = document.getElementById('cart-items-container');
    const totalSpan = document.getElementById('cart-total');
    const subtotalSpan = document.getElementById('cart-subtotal');
    const checkoutBtn = document.getElementById('checkout-submit-btn');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-bag-x text-muted" style="font-size: 4rem;"></i>
                <h4 class="fw-bold mt-3 text-secondary">Tu bolsa de compras está vacía</h4>
                <p class="text-muted">Explora nuestro catálogo y descubre las mejores prendas de temporada.</p>
                <a href="/" class="btn btn-primary rounded-pill px-4 mt-2">
                    <i class="bi bi-arrow-left me-2"></i> Ir al Catálogo
                </a>
            </div>
        `;
        if (totalSpan) totalSpan.textContent = '0.00';
        if (subtotalSpan) subtotalSpan.textContent = '0.00';
        if (checkoutBtn) checkoutBtn.disabled = true;
        return;
    }

    if (checkoutBtn) checkoutBtn.disabled = false;

    let html = '<div class="list-group list-group-flush">';
    let total = 0;
    let hasStockIssue = false;

    cart.forEach((item, index) => {
        const itemTotal = item.precio * item.cantidad;
        total += itemTotal;

        const isOutOfStock = item.stock <= 0;
        const exceedsStock = item.cantidad > item.stock;

        if (isOutOfStock || exceedsStock) {
            hasStockIssue = true;
        }

        const imgHtml = item.imagen ? 
            `<img src="${item.imagen}" alt="${item.nombre}" class="rounded-3 shadow-sm object-fit-cover" style="width: 70px; height: 70px;">` :
            `<div class="rounded-3 bg-light d-flex align-items-center justify-content-center text-muted" style="width: 70px; height: 70px;"><i class="bi bi-image fs-4"></i></div>`;

        html += `
            <div class="list-group-item py-3 px-0 border-bottom ${exceedsStock ? 'bg-danger-subtle rounded p-2 mb-2' : ''}">
                <div class="row align-items-center gy-2">
                    <div class="col-auto">
                        ${imgHtml}
                    </div>
                    <div class="col">
                        <h6 class="mb-1 fw-bold text-dark">${item.nombre}</h6>
                        <div class="d-flex align-items-center gap-2 flex-wrap">
                            <span class="text-muted small">$${item.precio.toFixed(2)} c/u</span>
                            ${isOutOfStock ? 
                                '<span class="badge bg-danger">Agotado</span>' : 
                                `<span class="badge bg-light text-dark border">Disponibles: ${item.stock}</span>`
                            }
                        </div>
                        ${exceedsStock ? `<small class="text-danger fw-semibold d-block mt-1">Has superado el stock disponible (${item.stock}). Reduce la cantidad.</small>` : ''}
                    </div>
                    <div class="col-auto">
                        <div class="input-group input-group-sm rounded-pill border overflow-hidden" style="width: 110px;">
                            <button class="btn btn-light px-2" type="button" onclick="changeQuantity(${index}, -1)" title="Disminuir">
                                <i class="bi bi-dash"></i>
                            </button>
                            <input type="text" class="form-control text-center bg-white border-0 fw-bold" value="${item.cantidad}" readonly>
                            <button class="btn btn-light px-2" type="button" onclick="changeQuantity(${index}, 1)" title="Aumentar" ${item.cantidad >= item.stock ? 'disabled' : ''}>
                                <i class="bi bi-plus"></i>
                            </button>
                        </div>
                    </div>
                    <div class="col-auto text-end" style="min-width: 90px;">
                        <span class="fw-bold fs-6 text-primary">$${itemTotal.toFixed(2)}</span>
                    </div>
                    <div class="col-auto text-end">
                        <button class="btn btn-sm btn-outline-danger border-0 rounded-circle" onclick="removeFromCart(${index})" title="Eliminar">
                            <i class="bi bi-trash3-fill"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    html += '</div>';

    container.innerHTML = html;
    if (totalSpan) totalSpan.textContent = total.toFixed(2);
    if (subtotalSpan) subtotalSpan.textContent = total.toFixed(2);

    if (hasStockIssue && checkoutBtn) {
        checkoutBtn.disabled = true;
        showNotification('Uno o más productos superan el stock disponible. Por favor ajusta tu bolsa para continuar.', 'warning', 'Revisa tu Pedido');
    }
}

// ==========================================
// INICIALIZACIÓN Y MANEJO DE EVENTOS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    renderCart();

    // Delegación de eventos para botones de añadir al carrito
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-add-cart');
        if (!btn) return;
        const { id, nombre, precio, stock, imagen } = btn.dataset;
        addToCart(id, nombre, parseFloat(precio), parseInt(stock, 10), imagen);
    });

    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (cart.length === 0) {
                showNotification('Tu bolsa de compras está vacía.', 'warning');
                return;
            }

            const nombreInput = document.getElementById('cliente-nombre');
            const telefonoInput = document.getElementById('cliente-telefono');
            const submitBtn = document.getElementById('checkout-submit-btn');

            const cliente = (nombreInput ? nombreInput.value : '').trim();
            const telefono = (telefonoInput ? telefonoInput.value : '').trim();

            // Validación en el Frontend
            if (cliente.length < 3) {
                showNotification('Ingresa un nombre completo válido (mínimo 3 caracteres).', 'danger');
                if (nombreInput) nombreInput.focus();
                return;
            }

            const cleanPhone = telefono.replace(/\D/g, '');
            if (cleanPhone.length !== 10) {
                showNotification('Por favor ingresa un número de teléfono de 10 dígitos para contactarte.', 'danger');
                if (telefonoInput) telefonoInput.focus();
                return;
            }

            // Bloquear botón y mostrar spinner
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Confirmando pedido...';
            }

            try {
                const response = await fetch('/checkout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        cliente,
                        telefono: cleanPhone,
                        productos_json: JSON.stringify(cart)
                    })
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    // Vaciar carrito tras compra exitosa
                    cart = [];
                    saveCart();
                    renderCart();

                    // Actualizar datos del modal de éxito
                    const modalOrderNum = document.getElementById('modal-order-id');
                    const modalTotal = document.getElementById('modal-order-total');
                    if (modalOrderNum) modalOrderNum.textContent = `#${data.orderId || 'OK'}`;
                    if (modalTotal) modalTotal.textContent = `$${parseFloat(data.total || 0).toFixed(2)} MXN`;

                    // Mostrar modal de confirmación
                    const successModalEl = document.getElementById('successModal');
                    if (successModalEl) {
                        const modal = bootstrap.Modal.getOrCreateInstance(successModalEl);
                        modal.show();
                    }

                    checkoutForm.reset();
                    showNotification('¡Pedido registrado con éxito! Tu mercancía ha sido apartada.', 'success', 'Orden Exitosa');
                } else {
                    showNotification(data.message || 'Error al procesar el pedido.', 'danger', 'No se pudo completar');
                }
            } catch (err) {
                console.error('[Checkout Error]', err);
                showNotification('Error de conexión con el servidor. Por favor intenta de nuevo.', 'danger');
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = 'Confirmar Pedido <i class="bi bi-arrow-right ms-2"></i>';
                }
            }
        });
    }
});
