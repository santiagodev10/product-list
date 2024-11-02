# Frontend Mentor - Product list with cart solution

This is a solution to the [Product list with cart challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/product-list-with-cart-5MmqLVAp_d). Frontend Mentor challenges help you improve your coding skills by building realistic projects. 

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
- [Author](#author)

## Overview

### The challenge

Users should be able to:

- Add items to the cart and remove them
- Increase/decrease the number of items in the cart
- See an order confirmation modal when they click "Confirm Order"
- Reset their selections when they click "Start New Order"
- View the optimal layout for the interface depending on their device's screen size
- See hover and focus states for all interactive elements on the page

### Screenshot

![Product-list](./Screenshot_1.jpg)

### Links

- Solution URL: [Add solution URL here](https://your-solution-url.com)
- Live Site URL: [Product-list](https://product-list-h48p21za3-santiago-s-projects-57b87035.vercel.app/)

## My process

### Built with

- Semantic HTML5 markup
- CSS custom properties
- Flexbox
- CSS Grid
- Mobile-first workflow

### What I learned

* I learned some design patterns like the delegation pattern, which is very useful to avoid make too many addEventListeners, here’s an example:
```js
function handleClickEvents(event) {
    const addToCartClicked = event.target.closest(".add-remove-to-cart-container");
    
    const plusButtonClicked = event.target.closest(".plus-button");

    const minusButtonClicked = event.target.closest(".minus-button");

    const removeButtonClicked = event.target.closest(".remove-button");

    const confirmOrderClicked = event.target.closest(".cart__confirm-order");
    
    if (addToCartClicked) {
        addSelectedStyles(event);
        totalOrderPrice();
    }

    if (plusButtonClicked || minusButtonClicked) {
        increaseAndDecreaseItems(event);
        totalOrderPrice();
    }

    if (removeButtonClicked) {
        removeProductFromCart(event);
        quantityOfProductsInsideCart();
        totalOrderPrice();
    }

    if (confirmOrderClicked) {
        openModalWindow();
    }
}
```

## Author

- Frontend Mentor - [@santiagodev10](https://www.frontendmentor.io/profile/santiagodev10)