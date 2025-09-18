// ==========================================
// 1. ДАНІ ТОВАРІВ (ОНОВЛЕНО: Годинники)
// ==========================================
const products = [
    { id: 1, name: "Класичний Хронограф 'Timeless'", price: 8999, category: "Класика", icon: "🕰️" },
    { id: 2, name: "Мінімалістичний 'Form'", price: 4500, category: "Мінімалізм", icon: "⬜" },
    { id: 3, name: "Спортивний 'Active Pro'", price: 6200, category: "Спорт", icon: "🏃‍♂️" },
    { id: 4, name: "Дайвер 'Ocean Master'", price: 11500, category: "Дайверські", icon: "🤿" },
    { id: 5, name: "Розумний Годинник 'Connect'", price: 7800, category: "Смарт", icon: "⌚" },
    { id: 6, name: "Жіночий 'Elegance Slim'", price: 5499, category: "Класика", icon: "💎" },
    { id: 7, name: "Тактичний 'Commando'", price: 9100, category: "Спорт", icon: "🛡️" },
    { id: 8, name: "Кишеньковий 'Vintage'", price: 3200, category: "Класика", icon: " pocket watch" },
];

// Кошик
let cart = [];

// DOM елементи
const pages = document.querySelectorAll('.page');
const navButtons = document.querySelectorAll('.nav-btn');
const categoryButtons = document.querySelectorAll('.category-btn');
const productsContainer = document.getElementById('products-list');
const loadingIndicator = document.getElementById('loading-indicator');
const searchInput = document.getElementById('search-input');
const cartIcon = document.getElementById('cart-icon');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const closeCartButton = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const totalPriceElement = document.getElementById('total-price');
const cartCountElement = document.getElementById('cart-count');
const exploreButton = document.getElementById('explore-btn');
const categoryPreviews = document.querySelectorAll('.category-preview');

// ==========================================
// 2. ДОПОМІЖНІ ФУНКЦІЇ
// ==========================================

// Отримати іконку для товару за категорією
function getProductIcon(category) {
    const icons = {
        'Класика': '🕰️',
        'Мінімалізм': '⬜',
        'Спорт': '🏃‍♂️',
        'Дайверські': '🤿',
        'Смарт': '⌚'
    };
    return icons[category] || '📦';
}

// Змінити кількість товару в кошику
function changeQuantity(productId, change) {
    const item = cart.find(i => i.id === productId);

    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartUI();
        }
    }
}

// ==========================================
// 3. ОСНОВНА ЛОГІКА
// ==========================================

// Відображення товарів
function renderProducts(category = 'all', searchQuery = '') {
    loadingIndicator.style.display = 'block';
    productsContainer.innerHTML = '';
    
    setTimeout(() => {
        let filteredProducts = category === 'all' 
            ? products 
            : products.filter(product => product.category === category);
        
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filteredProducts = filteredProducts.filter(product => 
                product.name.toLowerCase().includes(query)
            );
        }
        
        productsContainer.innerHTML = '';
        
        if (filteredProducts.length === 0) {
            productsContainer.innerHTML = `
                <div class="no-products">
                    <p>На жаль, моделі годинників за вашим запитом не знайдено 😢</p>
                </div>
            `;
        } else {
            filteredProducts.forEach(product => {
                const productElement = document.createElement('div');
                productElement.className = 'product-card';
                productElement.innerHTML = `
                    <div class="product-image">${getProductIcon(product.category)}</div>
                    <div class="product-info">
                        <div class="product-title">${product.name}</div>
                        <div class="product-price">${product.price} грн</div>
                        <button class="add-to-cart" data-id="${product.id}">Додати в кошик</button>
                    </div>
                `;
                productsContainer.appendChild(productElement);
            });
        }
        
        // Додати обробники подій для кнопок додавання в кошик
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                addToCart(productId);
                this.blur(); // ОНОВЛЕННЯ: Прибрати фокус після кліку
            });
        });
        
        loadingIndicator.style.display = 'none';
    }, 500);
}

// Додати товар до кошика
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1
            });
        }
        
        updateCartUI();
        showNotification(`Додано до кошика! ✅`); 
    }
}

// Видалити товар з кошика
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

// Оновити інтерфейс кошика
function updateCartUI() {
    cartItemsContainer.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="no-products">Кошик порожній. Додайте свій перший годинник!</div>';
    }
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${item.price} грн</div>
            </div>
            <div class="cart-item-actions">
                <button class="cart-qty-btn decrease-qty" data-id="${item.id}">-</button>
                <span class="cart-item-quantity">${item.quantity}</span>
                <button class="cart-qty-btn increase-qty" data-id="${item.id}">+</button>
                <button class="cart-item-remove" data-id="${item.id}">🗑️</button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItemElement);
    });
    
    totalPriceElement.textContent = `${total.toLocaleString('uk-UA')} грн`;
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalItems;
    
    // Додати обробники подій для кнопок кошика
    document.querySelectorAll('.cart-item-remove').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            removeFromCart(productId);
            this.blur(); // ОНОВЛЕННЯ: Прибрати фокус після кліку
        });
    });

    document.querySelectorAll('.increase-qty').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            changeQuantity(productId, 1);
            this.blur(); // ОНОВЛЕННЯ: Прибрати фокус після кліку
        });
    });

    document.querySelectorAll('.decrease-qty').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            changeQuantity(productId, -1);
            this.blur(); // ОНОВЛЕННЯ: Прибрати фокус після кліку
        });
    });
    
    document.querySelector('.checkout-btn').addEventListener('click', function() {
        this.blur(); // ОНОВЛЕННЯ: Прибрати фокус після кліку
    });
}

// Показати сповіщення (без змін)
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: var(--primary-color);
        color: white;
        padding: 12px 20px;
        border-radius: 30px;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Відкрити кошик
function openCart() {
    cartSidebar.classList.add('active');
    cartOverlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
    cartIcon.blur(); // ОНОВЛЕННЯ: Прибираємо фокус з іконки кошика
}

// Закрити кошик
function closeCart() {
    cartSidebar.classList.remove('active');
    cartOverlay.style.display = 'none';
    document.body.style.overflow = 'auto';
    // На закриття фокус не потрібно прибирати, бо він не був на кнопці
}

// Перемикання сторінок
function switchPage(pageId) {
    navButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-page') === pageId) {
            btn.classList.add('active');
        }
    });
    
    pages.forEach(page => {
        page.classList.remove('active');
        if (page.id === pageId) {
            page.classList.add('active');
        }
    });
    
    if (pageId === 'catalog-page') {
        const activeCategory = document.querySelector('.category-btn.active');
        const category = activeCategory ? activeCategory.getAttribute('data-category') : 'all';
        renderProducts(category, searchInput.value);
    }
}

// Ініціалізація додатку
function initApp() {
    // Обробники подій для навігації
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const pageId = this.getAttribute('data-page');
            switchPage(pageId);
            this.blur(); // ОНОВЛЕННЯ: Прибрати фокус після кліку
        });
    });
    
    // Обробники подій для категорій
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const category = this.getAttribute('data-category');
            renderProducts(category, searchInput.value);
            this.blur(); // ОНОВЛЕННЯ: Прибрати фокус після кліку
        });
    });
    
    // Обробник події для пошуку (focus прибирати не треба, бо це поле вводу)
    searchInput.addEventListener('input', function() {
        const activeCategory = document.querySelector('.category-btn.active');
        const category = activeCategory ? activeCategory.getAttribute('data-category') : 'all';
        renderProducts(category, this.value);
    });
    
    // Обробники подій для кошика
    cartIcon.addEventListener('click', openCart);
    closeCartButton.addEventListener('click', function() {
        closeCart();
        this.blur(); // ОНОВЛЕННЯ: Прибрати фокус з кнопки закриття
    });
    cartOverlay.addEventListener('click', closeCart);
    
    // Обробник для кнопки "Перейти до покупок"
    if (exploreButton) {
        exploreButton.addEventListener('click', function() {
            switchPage('catalog-page');
            this.blur(); // ОНОВЛЕННЯ: Прибрати фокус після кліку
        });
    }
    
    // Обробники для прев'ю категорій
    categoryPreviews.forEach(preview => {
        preview.addEventListener('click', function() {
            const category = preview.getAttribute('data-category');
            switchPage('catalog-page');
            
            // Активувати відповідну категорію
            setTimeout(() => {
                categoryButtons.forEach(btn => {
                    btn.classList.remove('active');
                    if (btn.getAttribute('data-category') === category) {
                        btn.classList.add('active');
                    }
                });
                renderProducts(category);
            }, 100);
            this.blur(); // ОНОВЛЕННЯ: Прибрати фокус після кліку
        });
    });
    
    // Ініціалізація кошика
    updateCartUI();
    
    if (document.getElementById('catalog-page').classList.contains('active')) {
        renderProducts();
    }
}

// Запуск додатку після завантаження DOM
document.addEventListener('DOMContentLoaded', initApp);
