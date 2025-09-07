// Дані товарів
const products = [
    { id: 1, name: "Смартфон Xiaomi", price: 8999, category: "Електроніка" },
    { id: 2, name: "Ноутбук Asus", price: 21999, category: "Електроніка" },
    { id: 3, name: "Футболка чоловіча", price: 499, category: "Одяг" },
    { id: 4, name: "Джинси класичні", price: 899, category: "Одяг" },
    { id: 5, name: "Роман 'Хіба ревуть воли'", price: 199, category: "Книги" },
    { id: 6, name: "Настільна лампа LED", price: 459, category: "Для дому" },
    { id: 7, name: "Бездротові навушники", price: 1299, category: "Електроніка" },
    { id: 8, name: "Кава в зернах", price: 89, category: "Для дому" },
    { id: 9, name: "Монітор 24\"", price: 5499, category: "Електроніка" },
    { id: 10, name: "Светр з вовни", price: 1299, category: "Одяг" },
    { id: 11, name: "Детективи Агати Крісті", price: 299, category: "Книги" },
    { id: 12, name: "Кавоварка", price: 1899, category: "Для дому" }
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

// Відображення товарів
function renderProducts(category = 'all', searchQuery = '') {
    // Показати індикатор завантаження
    loadingIndicator.style.display = 'block';
    productsContainer.innerHTML = '';
    
    // Імітація затримки завантаження
    setTimeout(() => {
        let filteredProducts = category === 'all' 
            ? products 
            : products.filter(product => product.category === category);
        
        // Фільтрація за пошуковим запитом
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filteredProducts = filteredProducts.filter(product => 
                product.name.toLowerCase().includes(query)
            );
        }
        
        // Очистити контейнер товарів
        productsContainer.innerHTML = '';
        
        if (filteredProducts.length === 0) {
            productsContainer.innerHTML = `
                <div class="no-products">
                    <p>Товари не знайдено</p>
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
            });
        });
        
        // Приховати індикатор завантаження
        loadingIndicator.style.display = 'none';
    }, 500);
}

// Отримати іконку для товару за категорією
function getProductIcon(category) {
    const icons = {
        'Електроніка': '📱',
        'Одяг': '👕',
        'Книги': '📚',
        'Для дому': '🏠'
    };
    return icons[category] || '📦';
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
        showNotification(`Товар "${product.name}" додано до кошика!`);
    }
}

// Видалити товар з кошика
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

// Оновити інтерфейс кошика
function updateCartUI() {
    // Очистити контейнер товарів у кошику
    cartItemsContainer.innerHTML = '';
    
    let total = 0;
    
    // Додати товари до кошика
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${item.price} грн × ${item.quantity}</div>
            </div>
            <div class="cart-item-actions">
                <span class="cart-item-quantity">${item.quantity}</span>
                <button class="cart-item-remove" data-id="${item.id}">🗑️</button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItemElement);
    });
    
    // Оновити загальну суму
    totalPriceElement.textContent = `${total} грн`;
    
    // Оновити лічильник товарів у кошику
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalItems;
    
    // Додати обробники подій для кнопок видалення
    document.querySelectorAll('.cart-item-remove').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            removeFromCart(productId);
        });
    });
}

// Показати сповіщення
function showNotification(message) {
    // Створити елемент сповіщення
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
    
    // Додати сповіщення на сторінку
    document.body.appendChild(notification);
    
    // Видалити сповіщення через 3 секунди
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
}

// Закрити кошик
function closeCart() {
    cartSidebar.classList.remove('active');
    cartOverlay.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Перемикання сторінок
function switchPage(pageId) {
    // Оновити активну кнопку навігації
    navButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-page') === pageId) {
            btn.classList.add('active');
        }
    });
    
    // Перемикати сторінки
    pages.forEach(page => {
        page.classList.remove('active');
        if (page.id === pageId) {
            page.classList.add('active');
        }
    });
    
    // Якщо переходимо на каталог, перемальовуємо товари
    if (pageId === 'catalog-page') {
        renderProducts();
    }
}

// Ініціалізація додатку
function initApp() {
    // Обробники подій для навігації
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const pageId = this.getAttribute('data-page');
            switchPage(pageId);
        });
    });
    
    // Обробники подій для категорій
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const category = this.getAttribute('data-category');
            renderProducts(category, searchInput.value);
        });
    });
    
    // Обробник події для пошуку
    searchInput.addEventListener('input', function() {
        const activeCategory = document.querySelector('.category-btn.active');
        const category = activeCategory ? activeCategory.getAttribute('data-category') : 'all';
        renderProducts(category, this.value);
    });
    
    // Обробники подій для кошика
    cartIcon.addEventListener('click', openCart);
    closeCartButton.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);
    
    // Обробник для кнопки "Перейти до покупок"
    if (exploreButton) {
        exploreButton.addEventListener('click', () => {
            switchPage('catalog-page');
        });
    }
    
    // Обробники для прев'ю категорій
    categoryPreviews.forEach(preview => {
        preview.addEventListener('click', () => {
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
        });
    });
    
    // Ініціалізація кошика
    updateCartUI();
}




// Запуск додатку після завантаження DOM
document.addEventListener('DOMContentLoaded', initApp);