
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function showToast(message, isError = false) {
    const toastEl = document.getElementById('cartToast');
    const toastMessage = document.getElementById('toastMessage');
    if (toastEl && toastMessage) {
        toastMessage.textContent = message;
        if (isError) {
            toastEl.classList.remove('text-bg-success');
            toastEl.classList.add('text-bg-danger');
        } else {
            toastEl.classList.remove('text-bg-danger');
            toastEl.classList.add('text-bg-success');
        }
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
    } else {
        alert(message);
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function addToCart(id, nombre, precio) {
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.cantidad += 1;
    } else {
        cart.push({ id, nombre, precio, cantidad: 1 });
    }
    saveCart();
    showToast('Añadido a tu bolsa: ' + nombre);
}

function updateCartCount() {
    const countSpan = document.getElementById('cart-count');
    if (countSpan) {
        countSpan.textContent = cart.reduce((acc, item) => acc + item.cantidad, 0);
    }
}

function renderCart() {
    const container = document.getElementById('cart-items-container');
    const totalSpan = document.getElementById('cart-total');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = '<p class="text-muted">Tu carrito está vacío.</p>';
        totalSpan.textContent = '0.00';
        return;
    }

    let html = '<ul class="list-group border-0">';
    let total = 0;
    cart.forEach((item, index) => {
        const itemTotal = item.precio * item.cantidad;
        total += itemTotal;
        html += `
            <li class="list-group-item d-flex justify-content-between align-items-center border-0 mb-2 rounded bg-light p-3">
                <div class="d-flex flex-column">
                    <h6 class="my-0 fw-bold">${item.nombre}</h6>
                    <small class="text-muted">$${item.precio.toFixed(2)} x ${item.cantidad}</small>
                </div>
                <div class="d-flex align-items-center">
                    <span class="fw-bold me-3 text-primary">$${itemTotal.toFixed(2)}</span>
                    <button class="btn btn-sm btn-outline-danger border-0" onclick="removeFromCart(${index})"><i class="bi bi-trash"></i></button>
                </div>
            </li>
        `;
    });
    html += '</ul>';
    container.innerHTML = html;
    totalSpan.textContent = total.toFixed(2);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    renderCart();
}

// On page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    renderCart();

    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (cart.length === 0) {
                showToast('Tu bolsa de compras está vacía.', true);
                return;
            }

            const cliente = document.getElementById('cliente-nombre').value;
            const telefono = document.getElementById('cliente-telefono').value;
            const total = cart.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

            fetch('/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    cliente,
                    telefono,
                    total,
                    productos_json: JSON.stringify(cart)
                })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    cart = [];
                    saveCart();
                    renderCart();
                    
                    // Show modal instead of alert
                    const modal = new bootstrap.Modal(document.getElementById('successModal'));
                    modal.show();
                    checkoutForm.reset();
                }
            })
            .catch(err => {
                console.error(err);
                showToast('Hubo un error al procesar el pedido', true);
            });
        });
    }
});
