let jsonData = null;

fetch('./data.json')
    .then(response => response.json())
    .then(data => {
        // Now "data" is a JavaScript object with the data from the JSON
        for (const property in data) {
            const ul = document.querySelector("ul");
            const li = document.createElement("li");
            const img = document.createElement("img");
            const productDescription = document.createElement("div");
            const productDescriptionCategory = document.createElement("p");
            const productDescriptionName = document.createElement("h3");
            const productDescriptionPrice = document.createElement("p");
            const buttonContainer = document.createElement("div");
            const iconCart = document.createElement("img");
            const addToCartText = document.createElement("span");

            ul.appendChild(li);
            li.append(img);

            // Fuction to update the image with the size of the screen
            const updateImage = () => {
                if (window.matchMedia("(min-width: 580px)").matches) {
                    img.src = data[property].image.desktop;
                } else {
                    img.src = data[property].image.mobile;
                }
            };

            // Execute the fuction when the page is loaded
            updateImage();

            window.addEventListener('resize', updateImage);
            
            img.alt = "product-image";
            img.classList.add("product-image");
            li.append(buttonContainer);
            li.append(productDescription);
            productDescription.classList.add("product-description");
            buttonContainer.classList.add("add-remove-to-cart-container");

            productDescriptionCategory.textContent = data[property].category;
            productDescriptionCategory.classList.add("product-description__category");

            productDescriptionName.textContent = data[property].name;
            productDescriptionName.classList.add("product-description__name");

            const priceJson = data[property].price.toFixed(2);
            productDescriptionPrice.textContent = `$${priceJson}`;
            productDescriptionPrice.classList.add("product-description__price");

            productDescription.append(productDescriptionCategory);
            productDescription.append(productDescriptionName);
            productDescription.append(productDescriptionPrice);

            iconCart.src = "./icons/icon-add-to-cart.svg";
            iconCart.alt = "cart-icon";
            iconCart.classList.add("add-cart__icon");
            addToCartText.textContent = "Add to Cart";
            addToCartText.classList.add("add-cart__text");
            
            buttonContainer.append(iconCart);
            buttonContainer.append(addToCartText);

            // Assigning the data from the json to jsonData, since jsonData is a global variable we can access to it and the data of the json from every place across the script without making a new fetch call
            jsonData = data;
        }
    })
    .catch(error => console.error('Fail to load JSON file:', error));

// Event delegation
document.addEventListener("DOMContentLoaded", () => {
    const mainElement = document.querySelector("main");
    
    if (mainElement) {
        mainElement.addEventListener("click", handleClickEvents);
    } else {
        console.error("Main element is not found on DOMContentLoaded.");
    }
});

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

function addSelectedStyles(event) {
    const buttonContainerClicked = event.target.closest(".add-remove-to-cart-container");
    
    if(buttonContainerClicked) {
        const cartIcon = buttonContainerClicked.querySelector(".add-cart__icon");
        const cartText = buttonContainerClicked.querySelector(".add-cart__text");
        const productImageSelected = buttonContainerClicked.previousSibling;
        const addToCartButtonSelected = buttonContainerClicked;
        
        if(cartIcon && cartText) {
            cartIcon.remove();
            cartText.remove();

            addToCartButtonSelected.classList.add("add-to-cart--selected");
            productImageSelected.classList.add("selected-product");
            const minusButton = document.createElement("button");
            const minusButtonIconWrapper = document.createElement("figure");
            const minusButtonIcon = document.createElement("img");
            const plusButton = document.createElement("button");
            const plusButtonIconWrapper = document.createElement("figure");
            const plusButtonIcon = document.createElement("img");
            const productCounterElement = document.createElement("span");

            minusButton.classList.add("buttons");
            minusButton.classList.add("minus-button")
            minusButtonIconWrapper.classList.add("wrapper");
            minusButtonIcon.src = "./icons/icon-decrement-quantity.svg";
            minusButtonIcon.classList.add("icons");
            minusButton.append(minusButtonIconWrapper);
            minusButtonIconWrapper.append(minusButtonIcon);
        
            plusButton.classList.add("buttons");
            plusButton.classList.add("plus-button");
            plusButtonIconWrapper.classList.add("wrapper");
            plusButtonIcon.src = "./icons/icon-increment-quantity.svg";
            plusButtonIcon.classList.add("icons");
            plusButton.append(plusButtonIconWrapper);
            plusButtonIconWrapper.append(plusButtonIcon);
            console.log(productCounterElement.textContent);
            
            productCounterElement.textContent = 1;
            productCounterElement.classList.add("product-counter");
            addToCartButtonSelected.append(minusButton, productCounterElement, plusButton);

            // Sending the needed elements for the addProductsToCart function
            const nameProduct = buttonContainerClicked.nextSibling.querySelector(".product-description__name").textContent;
            const productCounter = productCounterElement.textContent;
            const priceProduct = buttonContainerClicked.nextSibling.querySelector(".product-description__price").textContent;

            addProductsToCart(nameProduct, productCounter, priceProduct);
        } 
    }
}

function addProductsToCart(productName, counter, productPrice) {
    // Creating the elements that are going to contain the information
    const cart = document.querySelector(".cart");
    const emptyCart = document.querySelector(".cart__empty");
    const productContainerInCartElement = document.createElement("div");
    const productNameElement = document.createElement("p");
    const pricingContainer = document.createElement("div");
    const counterOfProductsSelected = document.createElement("span");
    const defaultPriceElement = document.createElement("span");
    const accumulatedPriceElement = document.createElement("span");
    const buttonToRemoveProduct = document.createElement("button");
    const iconInsideButton = document.createElement("img");
    
    // Adding the style classes to the elements
    emptyCart.id = "inactive";
    productContainerInCartElement.classList.add("cart__product-selected-container");
    productNameElement.classList.add("product-selected__name");
    pricingContainer.classList.add("product-selected__pricing-container");
    counterOfProductsSelected.classList.add("counter");
    defaultPriceElement.classList.add("default-price");
    accumulatedPriceElement.classList.add("accumulated-price");
    buttonToRemoveProduct.classList.add("remove-button");

    // Adding the information on the elements
    counterOfProductsSelected.textContent = `${counter}x`;
    productNameElement.textContent = productName;
    defaultPriceElement.textContent = `@ ${productPrice}`;
    accumulatedPriceElement.textContent = productPrice;

    // Validates if the product container exists, if it does then placed the next product container after the last one.
    const productContainerInCart = cart.querySelector(".cart__product-selected-container");

    if(cart.contains(productContainerInCart)) {
        const orderTotalElement = cart.querySelector(".cart__order-total-container");
        cart.insertBefore(productContainerInCartElement, orderTotalElement);
    } else {
        emptyCart.after(productContainerInCartElement);
    }
    productContainerInCartElement.append(productNameElement, pricingContainer);
    pricingContainer.append(counterOfProductsSelected, defaultPriceElement, accumulatedPriceElement, buttonToRemoveProduct);
    iconInsideButton.src = "./icons/icon-remove-item.svg";
    buttonToRemoveProduct.append(iconInsideButton);

    // Validates if the orderTotalContainerModal DON’T exist, if that’s true then creates it.
    let orderTotalContainerModal = document.querySelector(".cart__order-total-container");
    console.log(orderTotalContainerModal);

    if(!orderTotalContainerModal) {
        //ORDER TOTAL
        orderTotalContainerModal = document.createElement("div");
        const orderTotalParagraphModal = document.createElement("p");
        const orderTotalResult = document.createElement("p");

        orderTotalContainerModal.classList.add("cart__order-total-container");
        orderTotalParagraphModal.textContent = "Order Total";
        orderTotalParagraphModal.classList.add("order-total-paragraph");
        orderTotalResult.classList.add("order-total-result");

        //CARBON NEUTRAL DELIVERY
        const carbonNeutralContainer = document.createElement("div");
        const carbonNeutralIcon = document.createElement("img");
        const carbonNeutralParagraph = document.createElement("p");

        carbonNeutralContainer.classList.add("cart__carbon-neutral-container");
        carbonNeutralIcon.src = "./icons/icon-carbon-neutral.svg";
        carbonNeutralIcon.alt = "carbon neutral icon";
        carbonNeutralParagraph.innerHTML = "This is a <span>carbon-neutral</span> delivery";
        carbonNeutralParagraph.classList.add("carbon-neutral-paragraph");

        //CONFIRM ORDER
        const confirmOrderButton = document.createElement("button");

        confirmOrderButton.classList.add("cart__confirm-order");
        confirmOrderButton.classList.add("order-button");
        confirmOrderButton.textContent = "Confirm Order";

        cart.insertBefore(orderTotalContainerModal, productContainerInCart);
        orderTotalContainerModal.append(orderTotalParagraphModal, orderTotalResult);

        cart.append(confirmOrderButton);

        cart.insertBefore(carbonNeutralContainer, confirmOrderButton);
        carbonNeutralContainer.append(carbonNeutralIcon, carbonNeutralParagraph);
    }
    
    quantityOfProductsInsideCart();
}

function increaseAndDecreaseItems(event) {
    console.log(event);
    const plusButtonClicked = event.target.closest(".plus-button");
    const minusButtonClicked = event.target.closest(".minus-button");
    console.log(plusButtonClicked, minusButtonClicked);

    let productCounter;
    if (plusButtonClicked) {
        productCounter = plusButtonClicked.previousSibling;
        let productCounterNumber = parseFloat(productCounter.textContent);
        productCounterNumber += 1;
        productCounter.textContent = productCounterNumber;
        updateProductInsideCart(event, productCounter);
    } else if (minusButtonClicked) {
        productCounter = minusButtonClicked.nextSibling;
        let productCounterNumber = parseFloat(productCounter.textContent);
        if (productCounterNumber > 1) {
            productCounterNumber -= 1;
            productCounter.textContent = productCounterNumber;
        }
        updateProductInsideCart(event, productCounter);
    }
}

function updateProductInsideCart(event, productCounter) {
    const cart = event.target.closest("main").querySelector(".cart");
    let cartProductCounter = cart.querySelectorAll(".counter");
    let defaultPrice = cart.querySelectorAll(".default-price");
    let accumulatedPrices = cart.querySelectorAll(".accumulated-price");

    for (let index = 0; index < cartProductCounter.length; index++) {
        let defaultPriceNumber = Number(defaultPrice[index].textContent.substring(3));        

        let accumulatedPriceNumber = Number(accumulatedPrices[index].textContent.substring(1));

        let productCounterName = productCounter.closest(".add-remove-to-cart-container").nextSibling.querySelector(".product-description__name").textContent;

        let cartProductName = cartProductCounter[index].closest(".product-selected__pricing-container").previousSibling.textContent;

        if (cartProductName === productCounterName) {
            cartProductCounter[index].textContent = productCounter.textContent + "x";
            const plusButtonClicked = event.target.closest(".plus-button");
            const minusButtonClicked = event.target.closest(".minus-button");
            if (plusButtonClicked) {
                accumulatedPrices[index].textContent = "$" + (accumulatedPriceNumber + defaultPriceNumber).toFixed(2);
            } else if (minusButtonClicked) {
                accumulatedPrices[index].textContent = "$" + Math.max(defaultPriceNumber, accumulatedPriceNumber - defaultPriceNumber).toFixed(2);
            }
        }
    }
    quantityOfProductsInsideCart();
}

function removeProductFromCart(event) {
    const cart = event.target.closest(".cart");
    const cartProductSelected = event.target.closest(".cart__product-selected-container");
    const liContainerItems = event.target.closest("main").querySelector("ul").children;

    for (let index = 0; index < liContainerItems.length; index++) {
        const liContainerName = liContainerItems[index].closest("li").querySelector(".product-description__name").textContent;
        const minusButton = liContainerItems[index].closest("li").querySelector(".minus-button");
        const counterMenu = liContainerItems[index].closest("li").querySelector(".product-counter");
        const plusButton = liContainerItems[index].closest("li").querySelector(".plus-button");

        const liContainerImage = liContainerItems[index].closest("li").querySelector(".product-image");
        const liContainerButton = liContainerItems[index].closest("li").querySelector(".add-remove-to-cart-container");

        const cartProductName = cartProductSelected.querySelectorAll(".product-selected__name");

        if (liContainerName) {
            for (let i = 0; i < cartProductName.length; i++) {
                const cartProductContainer = cartProductName[i].closest(".cart__product-selected-container");

                if (liContainerName === cartProductName[i].textContent) {
                    cartProductContainer.remove();
                    minusButton.remove();
                    counterMenu.remove();
                    plusButton.remove();
                    liContainerImage.classList.remove("selected-product");
                    liContainerButton.classList.remove("add-to-cart--selected");

                    if (!liContainerItems[index].querySelector(".add-cart__icon") && !liContainerItems[index].querySelector(".add-cart__text")) {
                        const addToCartButton = liContainerItems[index].querySelector(".add-remove-to-cart-container");                        
                        const cartIcon = document.createElement("img");
                        const cartText = document.createElement("span");
                        cartIcon.src = "./icons/icon-add-to-cart.svg";
                        cartText.textContent = "Add to Cart";
                        cartIcon.classList.add("add-cart__icon");
                        cartText.classList.add("add-cart__text");
                        addToCartButton.append(cartIcon);
                        addToCartButton.append(cartText);

                        const cartProductContainer = document.querySelector(".cart__product-selected-container");
                        if (!cart.contains(cartProductContainer)) {
                            const emptyCart = cart.querySelector(".cart__empty");
                            const orderTotalContainerModal = cart.querySelector(".cart__order-total-container");
                            const carbonNeutralContainer = cart.querySelector(".cart__carbon-neutral-container");
                            const confirmOrderButton = cart.querySelector(".cart__confirm-order");
                            
                            emptyCart.id = "none";
                            orderTotalContainerModal.remove();
                            carbonNeutralContainer.remove();
                            confirmOrderButton.remove();
                        }
                    }    
                }
            }
        }
    }
}

function quantityOfProductsInsideCart() {
    const quantityProductsElement = document.querySelector(".quantity-products");
    const cartProductSelected = document.querySelectorAll(".cart__product-selected-container");
    let totalQuantity = 0;
    
    for (let index = 0; index < cartProductSelected.length; index++) {    
        let cartCounter = cartProductSelected[index].querySelector(".counter").textContent;
        let cartCounterNumber = Number(cartCounter[0]);

        if (cartCounter.length > 2) {
            cartCounterNumber = Number(cartCounter.substring(0,2));
            totalQuantity += cartCounterNumber;
            quantityProductsElement.textContent = totalQuantity;
        } else {
            totalQuantity += cartCounterNumber;        
            quantityProductsElement.textContent = totalQuantity;
        }
    }

    if(cartProductSelected.length === 0) {
        quantityProductsElement.textContent = 0;
    }
}

function totalOrderPrice() {
    const orderTotalElement = document.querySelector(".order-total-result");
    const accumulatedPriceItems = document.querySelectorAll(".accumulated-price");
    let totalPrice = 0;

    for (let index = 0; index < accumulatedPriceItems.length; index++) {
        let accumulatedPrices = accumulatedPriceItems[index].textContent;
        let accumulatedPricesNumber = Number(accumulatedPrices.substring(1));
        
        totalPrice += accumulatedPricesNumber;
        orderTotalElement.textContent = `$${totalPrice.toFixed(2)}`;
    }
}

function openModalWindow() {
    const main = document.querySelector("main");
    const cart = document.querySelector(".cart");
    const productContainerInCart = cart.querySelectorAll(".cart__product-selected-container");
    const modalWindowOpen = document.querySelector(".modal-window");

    if (!modalWindowOpen) {
        const modalWindow = document.createElement("div");
        const modalCard = document.createElement("section");
        const confirmedImageElement = document.createElement("img");
        const orderConfirmedTitle = document.createElement("h2");
        const orderConfirmedSubtitle = document.createElement("p");
        const productsSectionContainer = document.createElement("div");
        
        // This for cycle is to walk through every product container inside the cart, to assign all the information to the products in the modal window card
        for (let index = 0; index < productContainerInCart.length; index++) {
            const productNameInCart = productContainerInCart[index].querySelector(".product-selected__name").textContent;
            
            const pricingContainer = productContainerInCart[index].querySelector(".product-selected__pricing-container");
            
            const counterInCart = pricingContainer.querySelector(".counter").textContent;
            const defaultPriceInCart = pricingContainer.querySelector(".default-price").textContent;
            const accumulatedPriceInCart = pricingContainer.querySelector(".accumulated-price").textContent;
            
            const productContainer = document.createElement("div");
            const productImage = document.createElement("img");
            const productName = document.createElement("p");
            const productCounter = document.createElement("span");
            const productDefaultPrice = document.createElement("span");
            const productAccumulatedPrice = document.createElement("span");

            // Walking through the global variable jsonData in order to assign the correct image of the product in the modal window card
            for(const data in jsonData)  {
                const productNameInJson = jsonData[data].name;

                if(productNameInJson === productNameInCart) {
                    productImage.src = jsonData[data].image.thumbnail;
                }
            }

            productsSectionContainer.classList.add("modal-card__products-section");
            productContainer.classList.add("products-section__product");
            productImage.alt = "product-image";
            productImage.classList.add("product__product-image");
            productName.classList.add("product__name");
            productName.textContent = productNameInCart;
            productCounter.classList.add("product__counter");
            productCounter.textContent = counterInCart;
            productDefaultPrice.classList.add("product__default-price");
            productDefaultPrice.textContent = defaultPriceInCart;
            productAccumulatedPrice.classList.add("product__accumulated-price");
            productAccumulatedPrice.textContent = accumulatedPriceInCart;

            productsSectionContainer.append(productContainer);
            productContainer.append(productImage, productName, productCounter, productDefaultPrice, productAccumulatedPrice);
        }

        const orderTotalResultInCart = document.querySelector(".order-total-result").textContent;
        const orderTotalContainerModal = document.createElement("div");
        const orderTotalParagraphModal = document.createElement("p");
        const orderTotalResultModal = document.createElement("p");
        const startNewOrderButton = document.createElement("button");

        modalWindow.classList.add("modal-window");
        modalCard.classList.add("modal-card");
        confirmedImageElement.src = "./icons/icon-order-confirmed.svg";
        confirmedImageElement.alt = "order-confirmed-icon";
        confirmedImageElement.classList.add("modal-card__confirmed-image");
        orderConfirmedTitle.classList.add("modal-card__title");
        orderConfirmedTitle.textContent = "Order Confirmed";
        orderConfirmedSubtitle.classList.add("modal-card__subtitle");
        orderConfirmedSubtitle.textContent = "We hope you enjoy your food!";
        orderTotalContainerModal.classList.add("products-section__order-total");
        orderTotalParagraphModal.classList.add("order-total-paragraph");
        orderTotalParagraphModal.textContent = "Order Total";
        orderTotalResultModal.classList.add("order-total-result");
        orderTotalResultModal.textContent = orderTotalResultInCart;

        startNewOrderButton.classList.add("modal-card__new-order-button", "order-button");
        startNewOrderButton.textContent = "Start New Order";

        main.after(modalWindow);
        modalWindow.append(modalCard);
        modalCard.append(confirmedImageElement, orderConfirmedTitle, orderConfirmedSubtitle, productsSectionContainer, startNewOrderButton);
        productsSectionContainer.append(orderTotalContainerModal);
        orderTotalContainerModal.append(orderTotalParagraphModal, orderTotalResultModal);

        const newOrderButton = document.querySelector(".modal-card__new-order-button");

        if(newOrderButton.addEventListener("click", startNewOrder));
    }
}

function startNewOrder() {
    location.reload()
}