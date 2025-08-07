// Variables globales
let cart = [];
let checkoutModal = null;

// Número de WhatsApp de PERFUMIHIC (Bolivia)
const WHATSAPP_NUMBER = '59163367043';

// Inicialización cuando la página carga
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌸 PERFUMIHIC cargado correctamente');
    
    // Inicializar modal de checkout
    checkoutModal = document.getElementById('checkoutModal');
    
    // Configurar eventos
    setupEvents();
    
    // Configurar animaciones de scroll
    setupScrollAnimations();
    
    // Configurar navegación suave
    setupSmoothScrolling();
    
    // Cargar carrito desde almacenamiento local (si existe)
    loadCartFromStorage();
    
    // Actualizar contador del carrito
    updateCartCount();
    
    console.log('💖 ¡Sistema de carrito inicializado!');
    console.log('📱 WhatsApp integrado: ' + WHATSAPP_NUMBER);
});

// Configurar eventos
function setupEvents() {
    // Evento para el formulario de contacto
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
    
    // Evento para el formulario de checkout
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckoutSubmit);
    }
    
    // Eventos para cerrar modal
    window.addEventListener('click', function(event) {
        if (event.target === checkoutModal) {
            closeCheckoutModal();
        }
    });
}

// Funciones del Carrito
function addToCart(name, price, emoji) {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            emoji: emoji,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    updateCartCount();
    saveCartToStorage();
    showAddToCartSuccess(name);
    
    console.log('🛒 Producto agregado al carrito:', name);
}

function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    updateCartDisplay();
    updateCartCount();
    saveCartToStorage();
    
    console.log('🗑️ Producto eliminado del carrito:', name);
}

function updateQuantity(name, newQuantity) {
    const item = cart.find(item => item.name === name);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(name);
        } else {
            item.quantity = newQuantity;
            updateCartDisplay();
            updateCartCount();
            saveCartToStorage();
        }
    }
}

function updateCartDisplay() {
    const cartContent = document.getElementById('cartContent');
    const cartSummary = document.getElementById('cartSummary');
    
    if (cart.length === 0) {
        cartContent.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-cart" style="font-size: 3rem; margin-bottom: 20px; color: #ccc;"></i>
                <p>Tu carrito está vacío</p>
                <p>¡Agrega algunos perfumes increíbles!</p>
            </div>
        `;
        cartSummary.style.display = 'none';
    } else {
        const cartItemsHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">${item.emoji}</div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">Bs. ${item.price}</div>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateQuantity('${item.name}', ${item.quantity - 1})">-</button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity('${item.name}', ${item.quantity + 1})">+</button>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart('${item.name}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
        
        cartContent.innerHTML = `<div class="cart-items">${cartItemsHTML}</div>`;
        cartSummary.style.display = 'block';
        
        updateCartTotal();
    }
}

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
}

function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const cartTotal = document.getElementById('cartTotal');
    if (cartTotal) {
        cartTotal.textContent = `Bs. ${total.toLocaleString('es-BO')}`;
    }
}

function scrollToCart() {
    const cartSection = document.getElementById('carrito');
    if (cartSection) {
        cartSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Almacenamiento del carrito
function saveCartToStorage() {
    try {
        window.cartData = JSON.stringify(cart);
    } catch (error) {
        console.log('No se puede guardar el carrito');
    }
}

function loadCartFromStorage() {
    try {
        if (window.cartData) {
            cart = JSON.parse(window.cartData);
            updateCartDisplay();
        }
    } catch (error) {
        console.log('No se puede cargar el carrito guardado');
        cart = [];
    }
}

// Modal de Checkout
function openCheckoutModal() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío. Agrega algunos productos primero.');
        return;
    }
    
    populateOrderSummary();
    checkoutModal.style.display = 'block';
}

function closeCheckoutModal() {
    checkoutModal.style.display = 'none';
}

function populateOrderSummary() {
    const orderSummary = document.getElementById('orderSummary');
    const finalTotal = document.getElementById('finalTotal');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const orderItemsHTML = cart.map(item => `
        <div class="order-item">
            <span>${item.emoji} ${item.name} x${item.quantity}</span>
            <span>Bs. ${(item.price * item.quantity).toLocaleString('es-BO')}</span>
        </div>
    `).join('');
    
    orderSummary.innerHTML = `
        <div class="order-summary">
            <h3><i class="fab fa-whatsapp"></i> Resumen del Pedido</h3>
            ${orderItemsHTML}
            <div class="order-item">
                <span><strong>Total</strong></span>
                <span><strong>Bs. ${total.toLocaleString('es-BO')}</strong></span>
            </div>
        </div>
    `;
    
    finalTotal.textContent = `Bs. ${total.toLocaleString('es-BO')}`;
}

// Funciones de WhatsApp
function createWhatsAppMessage(orderData) {
    const cartItemsList = orderData.cart.map(item => 
        `• ${item.emoji} ${item.name} - Cantidad: ${item.quantity} - Precio: Bs. ${item.price} - Subtotal: Bs. ${item.price * item.quantity}`
    ).join('\n');
    
    const message = `🌸 *NUEVO PEDIDO PERFUMIHIC* 🌸
━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 *DATOS DEL CLIENTE:*
• Nombre: ${orderData.customerName}
• Teléfono: ${orderData.customerPhone}
• Dirección: ${orderData.customerAddress}
• Método de Pago: ${orderData.paymentMethod}

🛒 *PRODUCTOS PEDIDOS:*
${cartItemsList}

💰 *TOTAL: Bs. ${orderData.total.toLocaleString('es-BO')}*

📝 *NOTAS ADICIONALES:*
${orderData.customerNotes || 'Ninguna'}

📅 *Fecha del Pedido:* ${orderData.orderDate}

¡Gracias por elegir PERFUMIHIC! 🌸`;

    return encodeURIComponent(message);
}

function createContactWhatsAppMessage(contactData) {
    const message = `📞 *MENSAJE DE CONTACTO - PERFUMIHIC*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 *DATOS DEL REMITENTE:*
• Nombre: ${contactData.name}
• Teléfono: ${contactData.phone || 'No proporcionado'}
• Asunto: ${contactData.subject}

💬 *MENSAJE:*
${contactData.message}

📅 *Fecha:* ${contactData.date}`;

    return encodeURIComponent(message);
}

function sendWhatsAppOrder(orderData) {
    const message = createWhatsAppMessage(orderData);
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    
    // Abrir WhatsApp en una nueva pestaña
    window.open(whatsappURL, '_blank');
    
    // Mostrar mensaje de éxito
    showOrderSuccess(orderData);
    
    // Limpiar carrito después del pedido
    clearCart();
    closeCheckoutModal();
    
    console.log('📱 Pedido enviado por WhatsApp');
}

function sendWhatsAppContact(contactData) {
    const message = createContactWhatsAppMessage(contactData);
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    
    // Abrir WhatsApp en una nueva pestaña
    window.open(whatsappURL, '_blank');
    
    // Mostrar mensaje de éxito
    showContactSuccess(contactData);
    
    // Limpiar formulario
    document.getElementById('contactForm').reset();
    
    console.log('📱 Mensaje de contacto enviado por WhatsApp');
}

function openWhatsAppChat() {
    const message = encodeURIComponent('¡Hola PERFUMIHIC! 🌸 Me interesa conocer más sobre sus perfumes premium.');
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    window.open(whatsappURL, '_blank');
}

// Manejo de formularios
function handleCheckoutSubmit(e) {
    e.preventDefault();
    
    if (!validateCheckoutForm()) {
        alert('Por favor completa todos los campos requeridos correctamente.');
        return;
    }
    
    const formData = new FormData(e.target);
    const orderData = {
        customerName: formData.get('customerName'),
        customerPhone: formData.get('customerPhone'),
        customerAddress: formData.get('customerAddress'),
        paymentMethod: formData.get('paymentMethod'),
        customerNotes: formData.get('customerNotes') || 'Ninguna',
        cart: cart,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        orderDate: new Date().toLocaleString('es-BO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    };
    
    // Enviar pedido por WhatsApp
    sendWhatsAppOrder(orderData);
}

function handleContactSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const contactData = {
        name: formData.get('contactName'),
        phone: formData.get('contactPhone') || 'No proporcionado',
        subject: formData.get('contactSubject'),
        message: formData.get('contactMessage'),
        date: new Date().toLocaleString('es-BO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    };
    
    // Enviar mensaje por WhatsApp
    sendWhatsAppContact(contactData);
}

// Funciones de mensajes y notificaciones
function showOrderSuccess(orderData) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <i class="fab fa-whatsapp" style="margin-right: 10px; color: white; font-size: 1.5rem;"></i>
        <div>
            <strong>¡Pedido Enviado por WhatsApp!</strong><br>
            Gracias ${orderData.customerName}<br>
            Revisa WhatsApp para confirmar tu pedido
        </div>
    `;
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

function showContactSuccess(contactData) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <i class="fab fa-whatsapp" style="margin-right: 10px; color: white; font-size: 1.5rem;"></i>
        <div>
            <strong>¡Mensaje Enviado por WhatsApp!</strong><br>
            Gracias ${contactData.name}<br>
            Te responderemos pronto
        </div>
    `;
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 4000);
}

function showAddToCartSuccess(productName) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.style.transform = 'translate(-50%, -50%) scale(0.8)';
    successDiv.style.background = 'linear-gradient(45deg, #4ecdc4, #44a08d)';
    successDiv.innerHTML = `
        <i class="fas fa-cart-plus" style="margin-right: 10px; color: #fff;"></i>
        <strong>${productName}</strong><br>
        ¡Agregado al carrito!
    `;
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 2000);
}

function clearCart() {
    cart = [];
    updateCartDisplay();
    updateCartCount();
    saveCartToStorage();
    console.log('🧹 Carrito limpiado');
}

// Configurar animaciones de scroll
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observar elementos con clase fade-in
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

// Configurar navegación suave
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Compensar por navbar fija
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Efectos adicionales para mejorar la experiencia
document.addEventListener('DOMContentLoaded', function() {
    // Efecto de typing para el título principal
    setTimeout(() => {
        const heroTitle = document.querySelector('.hero h1');
        if (heroTitle) {
            heroTitle.style.opacity = '1';
            heroTitle.style.animation = 'fadeInUp 1s ease-out';
        }
    }, 300);
    
    // Efecto de aparición progresiva para las tarjetas de productos
    setTimeout(() => {
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 200 * (index + 1));
        });
    }, 1000);
});

// Funciones utilitarias
function formatPrice(price) {
    return `Bs. ${price.toLocaleString('es-BO')}`;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\d\-\+\(\)\s]+$/;
    return re.test(phone) && phone.length >= 8;
}

// Validaciones del formulario
function validateCheckoutForm() {
    const requiredFields = ['customerName', 'customerPhone', 'customerAddress', 'paymentMethod'];
    let isValid = true;
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field.value.trim()) {
            field.style.borderColor = '#ff4757';
            isValid = false;
        } else {
            field.style.borderColor = '#25d366';
        }
    });
    
    // Validar teléfono
    const phoneField = document.getElementById('customerPhone');
    if (phoneField.value && !validatePhone(phoneField.value)) {
        phoneField.style.borderColor = '#ff4757';
        isValid = false;
    }
    
    return isValid;
}

// Easter egg: Konami Code
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.keyCode);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join('') === konamiSequence.join('')) {
        // Easter egg activado
        document.body.style.filter = 'hue-rotate(180deg)';
        setTimeout(() => {
            document.body.style.filter = 'none';
        }, 3000);
        
        // Agregar productos gratis al carrito
        addToCart('Perfume Secreto', 0, '🎁');
        
        const easterDiv = document.createElement('div');
        easterDiv.className = 'success-message';
        easterDiv.innerHTML = `
            <i class="fas fa-gift" style="margin-right: 10px;"></i>
            🎉 ¡Código Konami Activado!<br>
            ¡Perfume secreto agregado gratis!
        `;
        document.body.appendChild(easterDiv);
        
        setTimeout(() => {
            easterDiv.remove();
        }, 4000);
        
        console.log('🎉 ¡Easter egg activado! ¡PERFUMIHIC te saluda!');
    }
});

// Event listeners adicionales
document.addEventListener('keydown', function(e) {
    // Cerrar modal con Escape
    if (e.key === 'Escape' && checkoutModal && checkoutModal.style.display === 'block') {
        closeCheckoutModal();
    }
});

// Funciones adicionales del carrito
function getCartItemCount() {
    return cart.reduce((total, item) => total + item.quantity, 0);
}

function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function isCartEmpty() {
    return cart.length === 0;
}

// Función para mostrar mensaje de WhatsApp disponible
function showWhatsAppWelcome() {
    setTimeout(() => {
        if (document.querySelector('.whatsapp-float')) {
            const welcomeDiv = document.createElement('div');
            welcomeDiv.className = 'success-message';
            welcomeDiv.style.bottom = '100px';
            welcomeDiv.style.right = '30px';
            welcomeDiv.style.top = 'auto';
            welcomeDiv.style.left = 'auto';
            welcomeDiv.style.transform = 'none';
            welcomeDiv.style.position = 'fixed';
            welcomeDiv.innerHTML = `
                <i class="fab fa-whatsapp" style="margin-right: 10px; color: white;"></i>
                <div>
                    <strong>¡WhatsApp Disponible!</strong><br>
                    Haz clic para chatear con nosotros
                </div>
            `;
            document.body.appendChild(welcomeDiv);
            
            setTimeout(() => {
                welcomeDiv.remove();
            }, 4000);
        }
    }, 3000);
}

// Inicializar mensaje de bienvenida de WhatsApp
document.addEventListener('DOMContentLoaded', function() {
    showWhatsAppWelcome();
});

// Log de inicialización
console.log('🌸 PERFUMIHIC JavaScript cargado completamente');
console.log('💖 ¡Disfruta explorando nuestros perfumes!');
console.log('🛒 Sistema de carrito activado');
console.log('📱 WhatsApp integrado: https://wa.me/' + WHATSAPP_NUMBER);
console.log('🎯 Todo listo para enviar pedidos por WhatsApp');

// Funciones de depuración para desarrollo
if (typeof window !== 'undefined') {
    window.PERFUMIHIC_DEBUG = {
        cart: () => cart,
        clearCart: clearCart,
        whatsappNumber: WHATSAPP_NUMBER,
        testWhatsApp: () => openWhatsAppChat()
    };
}