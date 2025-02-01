class Product {
    constructor(id, name, price) {
      this.id = id;
      this.name = name;
      this.price = price;
    }
  }
  
  class ShoppingCartItem {
    constructor(product, quantity = 1) {
      this.product = product;
      this.quantity = quantity;
    }
  
    // Calculer le prix total de cet article
    calculateTotalPrice() {
      return this.product.price * this.quantity;
    }
  }
  
  class ShoppingCart {
    constructor() {
      this.items = [];
    }
  
    // Ajouter un produit au panier
    addItem(product) {
      let item = this.items.find(item => item.product.id === product.id);
      if (item) {
        item.quantity++;
      } else {
        item = new ShoppingCartItem(product, 1);  // Quantité initiale à 1
        this.items.push(item);
      }
      this.updateDOM();
    }
  
    // Supprimer un produit du panier
    removeItem(productId) {
      this.items = this.items.filter(item => item.product.id !== productId);
      this.updateDOM();
    }
  
    // Obtenir le prix total du panier
    getTotal() {
      return this.items.reduce((total, item) => total + item.calculateTotalPrice(), 0);
    }
  
    // Obtenir la quantité totale d'articles dans le panier
    getTotalQuantity() {
      return this.items.reduce((total, item) => total + item.quantity, 0);
    }
  
    // Mettre à jour l'affichage du panier dans le DOM
    updateDOM() {
      const cartCount = document.getElementById('cart-count');
      const totalPrice = document.querySelector('.total');
  
      // Mettre à jour le nombre d'articles dans le panier
      cartCount.textContent = this.getTotalQuantity();
      // Mettre à jour le prix total dans le DOM
      totalPrice.textContent = `${this.getTotal()} $`;
  
      // Mettre à jour les quantités de chaque produit dans le DOM
      this.items.forEach(item => {
        const quantityElement = document.querySelector(`.card[data-product-id="${item.product.id}"] .quantity`);
        if (quantityElement) {
          quantityElement.textContent = item.quantity;
        }
      });
    }
  
    // Mettre à jour la quantité dans le DOM pour un produit spécifique
    updateQuantityInDOM(productId, quantity) {
      const quantityElement = document.querySelector(`.card[data-product-id="${productId}"] .quantity`);
      if (quantityElement) {
        quantityElement.textContent = quantity;
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
  
  // Initialiser l'affichage du panier avec les produits existants
  function initializeCart() {
    products.forEach(product => {
      shoppingCart.addItem(product);
    });
  }
  
  // Gérer l'ajout des articles
  document.querySelectorAll('.fa-plus-circle').forEach((button, index) => {
    button.addEventListener('click', () => {
      shoppingCart.addItem(products[index]);
    });
  });
  
  // Gérer la suppression des articles
  document.querySelectorAll('.fa-trash-alt').forEach((button, index) => {
    button.addEventListener('click', () => {
      const productId = index + 1;
      shoppingCart.removeItem(productId);  // Supprimer l'article du panier
      const productCard = document.querySelector(`.card[data-product-id="${productId}"]`);
      if (productCard) {
        productCard.remove(); // Retirer la carte du DOM
      }
      shoppingCart.updateDOM();  // Mettre à jour le total et le nombre d'articles dans le panier
    });
  });
  
  // Gérer la réduction de la quantité
  document.querySelectorAll('.fa-minus-circle').forEach((button, index) => {
    button.addEventListener('click', () => {
      const productId = index + 1;
      let item = shoppingCart.items.find(item => item.product.id === productId);
      if (item && item.quantity > 0) {
        item.quantity--;
        shoppingCart.updateDOM();
        shoppingCart.updateQuantityInDOM(productId, item.quantity);
      }
    });
  });
  
  // Appel initial pour remplir le panier avec les produits
  initializeCart();
  