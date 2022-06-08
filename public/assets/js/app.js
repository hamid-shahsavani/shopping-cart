//! import files

import { productsData } from "./products.js";

//! classes

class SaveToStorage {
  static updateStorage() {
    localStorage.setItem("cartItems", JSON.stringify(Cart.cartItems));
  }
  static updateTheme(theme) {
    localStorage.setItem("theme", JSON.stringify(theme));
  }
  static restoreCartItems() {
    //? add localStorage items to cartItems
    const localStorageItems = JSON.parse(localStorage.getItem('cartItems'));
    localStorageItems.forEach((item) => {
      Cart.cartItems.push(item);
      Cart.totalPrice += item['price'] * item['quantity'];
    });
    //? add to dom
    Cart.addToDom();
    //? update cart modal footer
    Cart.cartModalFooter();
    //? ..
    Cart.removeFromCart();
    Cart.plusAndMinusItem();
  }
  static restoreTheme() {
    $("html")[0].dataset.theme = JSON.parse(localStorage.getItem('theme'));
  }
}

class Products {
  static getProduct() {
    return productsData;
  }
  static addToDom(product) {
    let html = "";
    product.forEach((i) => {
      html += `<div class="card card-compact w-[350px] lg:w-full h-[400px] bg-base-100 shadow-xl card-bordered">
        <figure><img src=${i.image} class="h-[200px] lg:mx-4 overflow-hidden rounded-xl mt-3.5" alt="game"/></figure>
        <div class="card-body">
          <h2 class="card-title">${i.title}</h2>
          <p>${i.description}</p>
          <div class="card-actions justify-between items-center mt-4">
            <p class="font-bold text-xl mt-3"><span>${i.price}</span> $</p>
            <button class="btn btn-primary pt-1 buy-btn" data-id="${i.id}">buy now</button>
          </div>
        </div>
      </div>`;
      $("#products")[0].innerHTML = html;
    });
  }
}

class Cart {
  static cartItems = [];
  static totalPrice = 0;
  static checkCart() {
    let itemsInCard = this.cartItems;
    (function main() {
      if (itemsInCard.length === 0) {
        $("#cart-not-empty")[0].classList.add("!hidden");
        $("#cart-empty")[0].classList.remove("!hidden");
      } else {
        $("#cart-empty")[0].classList.add("!hidden");
        $("#cart-not-empty")[0].classList.remove("!hidden");
      }
      setTimeout(main, 0);
    })();
  }
  static updateCardItem({ id, quantity }) {
    return (this.cartItems[id] = { ...this.cartItems[id], quantity });
  }
  static getItems() {
    return this.cartItems;
  }
  static addToDom() {
    let html = "";
    Cart.cartItems.forEach((i) => {
      html += `<li class="flex justify-between items-center" data-id=${i.id}>
      <img src=${i.image} class="w-[110px] sm:w-[150px] rounded-lg" alt="game">
      <div class="flex flex-col gap-1 w-[120px] sm:w-[150px]">
        <p class="text-neutral-content font-bold text-sm sm:text-lg">${i.title}</p>
        <p class="text-neutral-content font-light text-sm sm:text-base">${[i.price]*[i.quantity]} $</p>
      </div>
      <div class="flex flex-col gap-1">
        <button class="plus bg-primary w-[18px] h-[18px] sm:w-6 sm:h-6 text-primary-content text-lg sm:text-xl rounded-full relative"><p class="absolute -top-[3px] left-[3px] sm:static">+</p></button>
        <p class="text-sm text-neutral-content flex justify-center items-center mt-1.5">${i.quantity}</p>
        <button class="minus border border-primary h-[18px] w-[18px] sm:w-6 sm:h-6 flex items-center justify-center text-primary text-lg text-[27px] rounded-full">-</button>
      </div>
      <button>
        <svg class="remove fill-neutral-content w-[22px] h-[22px] sm:w-6 sm:h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.69C140.6 6.848 151.7 0 163.8 0H284.2C296.3 0 307.4 6.848 312.8 17.69L320 32H416C433.7 32 448 46.33 448 64C448 81.67 433.7 96 416 96H32C14.33 96 0 81.67 0 64C0 46.33 14.33 32 32 32H128L135.2 17.69zM31.1 128H416V448C416 483.3 387.3 512 352 512H95.1C60.65 512 31.1 483.3 31.1 448V128zM111.1 208V432C111.1 440.8 119.2 448 127.1 448C136.8 448 143.1 440.8 143.1 432V208C143.1 199.2 136.8 192 127.1 192C119.2 192 111.1 199.2 111.1 208zM207.1 208V432C207.1 440.8 215.2 448 223.1 448C232.8 448 240 440.8 240 432V208C240 199.2 232.8 192 223.1 192C215.2 192 207.1 199.2 207.1 208zM304 208V432C304 440.8 311.2 448 320 448C328.8 448 336 440.8 336 432V208C336 199.2 328.8 192 320 192C311.2 192 304 199.2 304 208z"/></svg>
      </button>
      </li>`;
      $("#cart-items")[0].innerHTML = html;
    });
  }
  static removeFromCart() {
    $('.remove').forEach((i) => {
      i.addEventListener('click',(e)=>{
        // get trash parent data-id
        const productId = (e.target.parentElement.parentElement.parentElement.dataset.id) || (e.target.parentElement.parentElement.dataset.id);
        // select trash data-id from cardItems
        const productSelected = Cart.cartItems.find(({ id }) => id === parseInt(productId));
        // remove from cardItems
        this.cartItems.splice(this.cartItems.indexOf(productSelected),1);
        // update local storage
        SaveToStorage.updateStorage();
        // add and update cart items
        Cart.addToDom();
        // open cart modal
        $('#cart-modal')[0].checked = true;
        // remove item remove price from total price
        this.totalPrice -= (productSelected['price'] * productSelected['quantity']);
        // reset cart with click clear all btn , set cart item lengh , set total price
        Cart.cartModalFooter();
        // call again plus and minus item and remove from cart function
        this.plusAndMinusItem();
        this.removeFromCart();
        // show cart modal with remove item
        if ((this.cartItems.length) > 0){
          $('#cart-modal')[0].checked = false;
        }
      });
    });
  }
  static cartModalFooter(){
    $("#reset-cart")[0].addEventListener('click',()=>{
      this.cartItems.length = 0;
      this.totalPrice = 0;
      localStorage.removeItem("cartItems");
    });
    $("#cart-length")[0].innerText = this.cartItems.length;
    $('#total-price')[0].innerText = this.totalPrice;
  }
  static plusAndMinusItem(){
    $('.plus').forEach((i) => {
      i.addEventListener('click',(e)=>{
        // get trash parent data-id
        const productId = (e.target.parentElement.parentElement.parentElement.dataset.id) || (e.target.parentElement.parentElement.dataset.id);
        // select trash data-id from cardItems
        const productSelected = Cart.cartItems.find(({ id }) => id === parseInt(productId));
        // update show quantity number in cart modal
        productSelected['quantity'] += 1;
        // add and update cart items
        Cart.addToDom();
        // open cart modal
        $('#cart-modal')[0].checked = true;
        // add card selected price to total price 
        this.totalPrice += productSelected['price'];
        // update cart modal footer
        Cart.cartModalFooter();
        // update local storage
        SaveToStorage.updateStorage();
        // show cart modal with remove item
        if ((this.cartItems.length) > 0){
          $('#cart-modal')[0].checked = false;
        }
        // call plus and minus item and remove from cart function
        this.plusAndMinusItem();
        this.removeFromCart();
      });
    });
    $('.minus').forEach((i) => {
      i.addEventListener('click',(e)=>{
        // get trash parent data-id
        const productId = (e.target.parentElement.parentElement.parentElement.dataset.id) || (e.target.parentElement.parentElement.dataset.id);
        // select trash data-id from cardItems
        const productSelected = Cart.cartItems.find(({ id }) => id === parseInt(productId));
        // update show quantity number in cart modal
        productSelected['quantity'] -= 1;
        // add and update cart items
        Cart.addToDom();
        // open cart modal
        $('#cart-modal')[0].checked = true;
        // add card selected price to total price 
        this.totalPrice -= productSelected['price'];
        // update cart modal footer
        Cart.cartModalFooter();
        // update local storage
        SaveToStorage.updateStorage();
        if(productSelected['quantity'] === 0) {
          // remove item from cartItems
          this.cartItems.splice(this.cartItems.indexOf(productSelected),1);
          // update local storage
          SaveToStorage.updateStorage();
          // update cart modal footer
          Cart.cartModalFooter();
          // add and update cart items
          Cart.addToDom();
          // open cart modal
          $('#cart-modal')[0].checked = true;
        }
        // show modal 
        $('#cart-modal')[0].checked = false;
        // call plus and minus item and remove from cart function
        this.plusAndMinusItem();
        this.removeFromCart();
      });
    });
  }
}

class Theme {
  static themes = [
    "dark",
    "cupcake",
    "bumblebee",
    "emerald",
    "halloween",
    "forest",
    "luxury",
    "dracula",
    "cmyk",
    "autumn",
    "lemonade",
    "night",
    "coffee",
    "winter",
  ];
  static changeTheme() {
    $("#change-theme")[0].addEventListener("click", () => {
      const randomTheme = this.themes[(Math.random() * this.themes.length) | 0];
      $("html")[0].dataset.theme = randomTheme;
      SaveToStorage.updateTheme(randomTheme);
    });
  }
}

//! element selector

function $(e) {
  return document.querySelectorAll(e);
}

//! run function with dom load

addEventListener("DOMContentLoaded", () => {
  //? change theme with click button
  Theme.changeTheme();

  //? add products to dom
  Products.addToDom(Products.getProduct());

  //? check item in cart
  Cart.checkCart();

  //? restore cart item from local storage
  JSON.parse(localStorage.getItem('cartItems')) ? SaveToStorage.restoreCartItems() : '';

  //? restore cart item from local storage
  JSON.parse(localStorage.getItem('theme')) ? SaveToStorage.restoreTheme() : '';

  //? add product to cart
  [...$(".buy-btn")].forEach((i) => {
    i.addEventListener("click", (e) => {

      //? get product id clicked
      const productId = e.target.dataset.id;

      //? check is product in cart
      const isCart = Cart.cartItems.find(({ id }) => id === parseInt(productId));
      if (isCart) {
        // true : add +1 to quality number 
        const getProductById = Cart.cartItems.find((i) => i.id === parseInt(productId));
        getProductById['quantity'] = getProductById['quantity']+1;
        // add cart price to total price 
        Cart.totalPrice += (parseInt(getProductById['price']));
      } else {
        // false : add product to cart
        const getProductById = Products.getProduct().find((i) => i.id === parseInt(productId));
        getProductById['quantity'] = 1;
        Cart.cartItems.push(getProductById);
        // add cart price to total price 
        Cart.totalPrice += (parseInt(getProductById['price']));
      }

      //? add to cart 
      Cart.addToDom();

      //? open cart modal
      $('#cart-modal')[0].checked = true;

      //? reset cart with click clear all btn , set cart item lengh , set total price
      Cart.cartModalFooter();

      //? plus and minus cart item
      Cart.plusAndMinusItem();

      //? remove item from cart with click trash icon
      Cart.removeFromCart();

      //? add product to local storage
      SaveToStorage.updateStorage();

    });
  });
});