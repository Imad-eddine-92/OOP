class Product {
  constructor(id, name, price) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.liked = false; // Ajout de l'état du like
  }

  // Méthode pour alterner l'état "like"
  toggleLike() {
    this.liked = !this.liked;
  }
}

class ShoppingCartItem {
  constructor(product, quantity = 1) {
    this.product = product;
    this.quantity = quantity;
  }

  calculateTotalPrice() {
    return this.product.price * this.quantity;
  }
}

class ShoppingCart {
  constructor() {
    this.items = [];
  }

  addItem(product) {
    let item = this.items.find(item => item.product.id === product.id);
    if (item) {
      item.quantity++;
    } else {
      item = new ShoppingCartItem(product, 1);
      this.items.push(item);
    }
    this.updateDOM();
  }

  removeItem(productId) {
    this.items = this.items.filter(item => item.product.id !== productId);
    this.updateDOM();
  }

  getTotal() {
    return this.items.reduce((total, item) => total + item.calculateTotalPrice(), 0);
  }

  getTotalQuantity() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  updateDOM() {
    const cartCount = document.getElementById('cart-count');
    const totalPrice = document.querySelector('.total');

    cartCount.textContent = this.getTotalQuantity();
    totalPrice.textContent = `${this.getTotal()} $`;

    this.items.forEach(item => {
      const quantityElement = document.querySelector(`.card[data-product-id="${item.product.id}"] .quantity`);
      if (quantityElement) {
        quantityElement.textContent = item.quantity;
      }
    });
  }

  updateQuantityInDOM(productId, quantity) {
    const quantityElement = document.querySelector(`.card[data-product-id="${productId}"] .quantity`);
    if (quantityElement) {
      quantityElement.textContent = quantity;
    }
  }
}

class EventManager {
  constructor(shoppingCart, products) {
    this.shoppingCart = shoppingCart;
    this.products = products;
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    document.querySelectorAll('.fa-plus-circle').forEach((button, index) => {
      button.addEventListener('click', () => {
        this.shoppingCart.addItem(this.products[index]);
      });
    });

    document.querySelectorAll('.fa-trash-alt').forEach((button, index) => {
      button.addEventListener('click', () => {
        const productId = index + 1;
        this.shoppingCart.removeItem(productId);
        this.removeProductCard(productId);
      });
    });

    document.querySelectorAll('.fa-minus-circle').forEach((button, index) => {
      button.addEventListener('click', () => {
        const productId = index + 1;
        this.decreaseQuantity(productId);
      });
    });

    document.querySelectorAll('.fa-heart').forEach((button, index) => {
      button.addEventListener('click', () => {
        const product = this.products[index];
        product.toggleLike();
        this.updateLikeIcon(button, product.liked);
      });
    });
  }

  removeProductCard(productId) {
    const productCard = document.querySelector(`.card[data-product-id="${productId}"]`);
    if (productCard) {
      productCard.remove();
    }
  }

  decreaseQuantity(productId) {
    let item = this.shoppingCart.items.find(item => item.product.id === productId);
    if (item && item.quantity > 1) {
      item.quantity--;
      this.shoppingCart.updateDOM();
      this.shoppingCart.updateQuantityInDOM(productId, item.quantity);
    }
  }

  updateLikeIcon(button, liked) {
    if (liked) {
      button.classList.add('text-danger');
    } else {
      button.classList.remove('text-danger');
    }
  }
}

// Créer les produits
const products = [
  new Product(1, 'Baskets', 100),
  new Product(2, 'Socks', 20),
  new Product(3, 'Bag', 50)
];

// Créer un panier
const shoppingCart = new ShoppingCart();

// Initialiser l'affichage du panier
function initializeCart() {
  products.forEach(product => {
    shoppingCart.addItem(product);
  });
}

// Gestion des événements
new EventManager(shoppingCart, products);

initializeCart();
