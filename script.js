let jsonData = null;

fetch('./data.json')
    .then(response => response.json()) // Analiza el contenido JSON
    .then(data => {
        // Ahora "data" es un objeto JavaScript con los datos del JSON
        console.log(data); 
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

            //anidando elementos segun la estructura que ya teniamos hecha, poniendole las clases de los estilos y añadiendoles la informacion respectiva del json a cada elemento
            ul.appendChild(li);
            li.append(img);
            img.src = data[property].image.mobile;
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
            productDescriptionPrice.textContent = "$" + priceJson;
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

            jsonData = data;
        }
        // ... y así sucesivamente
    })
    .catch(error => console.error('Error al cargar el archivo JSON:', error));

// Delegación de eventos
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
    
    console.log(removeButtonClicked);
    console.log(confirmOrderClicked);
    
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
    console.log(event);
    //seleccionando elementos del DOM
    const buttonContainerClicked = event.target.closest(".add-remove-to-cart-container");
    //validando cual de los li fue seleccionado    
    if(buttonContainerClicked) {
        console.log(buttonContainerClicked);
        const cartIcon = buttonContainerClicked.querySelector(".add-cart__icon");
        const cartText = buttonContainerClicked.querySelector(".add-cart__text");
        const liContainer = buttonContainerClicked.previousSibling;
        const addToCartButton = buttonContainerClicked;
        
        /*Primero se ponen los estilos para el producto seleccionado*/
        /*Eliminando los elementos que lleva por defecto el add to cart*/
        
        if(cartIcon && cartText) {
            cartIcon.remove();
            cartText.remove();

            addToCartButton.classList.add("add-to-cart--selected");
            liContainer.classList.add("selected-product");
            /*creando los botones y el span*/
            const minusButton = document.createElement("button");
            const minusButtonIconWrapper = document.createElement("figure");
            const minusButtonIcon = document.createElement("img");
            const plusButton = document.createElement("button");
            const plusButtonIconWrapper = document.createElement("figure");
            const plusButtonIcon = document.createElement("img");
            const productCounterElement = document.createElement("span");
            /*añadiendo estilos a los botones y al span*/
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
            /*añadiendo los botones y el span adentro del contenedor*/
            addToCartButton.append(minusButton, productCounterElement, plusButton);

            //aqui tengo que detectar cual product category se esta haciendo click, aprovechando que el addeventlistener esta puesto en el ul
            const nameProduct = buttonContainerClicked.nextSibling.children[1].textContent;
            const productCounter = productCounterElement.textContent;
            const priceProduct = buttonContainerClicked.nextSibling.children[2].textContent;

            addProductsToCart(nameProduct, productCounter, priceProduct);
        } 
    }
}

function addProductsToCart(productName, counter, productPrice) {
    //Primero creamos los elementos que van a recibir la informacion
    const cart = document.querySelector(".cart");
    const emptyCart = document.querySelector(".cart__empty");
    const productContainerInCart = document.createElement("div");
    const productNameElement = document.createElement("p");
    const pricingContainer = document.createElement("div");
    const counterOfProductsSelected = document.createElement("span");
    const defaultPriceElement = document.createElement("span");
    const accumulatedPriceElement = document.createElement("span");
    const buttonToRemoveProduct = document.createElement("button");
    const iconInsideButton = document.createElement("img");
    let orderTotalContainer = document.querySelector(".cart__order-total-container");
    console.log(orderTotalContainer);
    
    //Añadiendo las clases de los estilos a los elementos
    emptyCart.id = "inactive"
    // emptyCart.remove()
    productContainerInCart.classList.add("cart__product-selected-container");
    productNameElement.classList.add("product-selected__name");
    pricingContainer.classList.add("product-selected__pricing-container");
    counterOfProductsSelected.classList.add("counter");
    defaultPriceElement.classList.add("default-price");
    accumulatedPriceElement.classList.add("accumulated-price");
    buttonToRemoveProduct.classList.add("remove-button");
    iconInsideButton.classList.add

    //Anidando los elementos dentro de los contenedores
    cart.insertBefore(productContainerInCart, cart.children[1]);
    productContainerInCart.append(productNameElement, pricingContainer);
    pricingContainer.append(counterOfProductsSelected, defaultPriceElement, accumulatedPriceElement, buttonToRemoveProduct);
    iconInsideButton.src = "./icons/icon-remove-item.svg";
    buttonToRemoveProduct.append(iconInsideButton);

    //Añadiendo la informacion en los elementos
    counterOfProductsSelected.textContent = counter + "x";
    productNameElement.textContent = productName;
    defaultPriceElement.textContent = "@" + " " + productPrice;
    accumulatedPriceElement.textContent = productPrice;

    if(!orderTotalContainer) {
        //ORDER TOTAL
        orderTotalContainer = document.createElement("div");
        const orderTotalParagraph = document.createElement("p");
        const orderTotalResult = document.createElement("p");

        orderTotalContainer.classList.add("cart__order-total-container");
        orderTotalParagraph.textContent = "Order Total";
        orderTotalParagraph.classList.add("order-total-paragraph");
        orderTotalResult.classList.add("order-total-result");

        cart.insertBefore(orderTotalContainer, cart.children[3]);
        orderTotalContainer.append(orderTotalParagraph, orderTotalResult);

        //CARBON NEUTRAL DELIVERY
        const carbonNeutralContainer = document.createElement("div");
        const carbonNeutralIcon = document.createElement("img");
        const carbonNeutralParagraph = document.createElement("p");

        carbonNeutralContainer.classList.add("cart__carbon-neutral-container");
        carbonNeutralIcon.src = "./icons/icon-carbon-neutral.svg";
        carbonNeutralIcon.alt = "carbon neutral icon";
        carbonNeutralParagraph.innerHTML = "This is a <span>carbon-neutral</span> delivery";
        carbonNeutralParagraph.classList.add("carbon-neutral-paragraph");

        cart.insertBefore(carbonNeutralContainer, cart.children[4]);
        carbonNeutralContainer.append(carbonNeutralIcon, carbonNeutralParagraph);


        //CONFIRM ORDER
        const confirmOrderButton = document.createElement("button");

        confirmOrderButton.classList.add("cart__confirm-order");
        confirmOrderButton.classList.add("order-button");
        confirmOrderButton.textContent = "Confirm Order";

        cart.insertBefore(confirmOrderButton, cart.children[5]);
        console.log(cart.children.length);
        
    }
    
    quantityOfProductsInsideCart();
}

// Incrementar y decrementar items
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

// Actualizar producto dentro del carrito
function updateProductInsideCart(event, productCounter) {
    const cart = event.target.closest("main").children[2];
    let cartProductCounter = cart.querySelectorAll(".counter");
    console.log(cartProductCounter);
    let defaultPrice = cart.querySelectorAll(".default-price");
    let accumulatedPrices = cart.querySelectorAll(".accumulated-price");

    for (let index = 0; index < cartProductCounter.length; index++) {
        let defaultPriceNumber = Number(defaultPrice[index].textContent.substring(3));        

        let accumulatedPriceNumber = Number(accumulatedPrices[index].textContent.substring(1));

        let productCounterName = productCounter.closest(".add-remove-to-cart-container").nextSibling.children[1].textContent;

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

// Remover producto del carrito
function removeProductFromCart(event) {
    console.log(event);

    const cart = event.target.closest(".cart");
    console.log(cart);

    const cartProductSelected = cart.children[1];
    console.log(cartProductSelected);

    const liContainerItems = event.target.closest(".cart").previousSibling.previousSibling.children;
    console.log(liContainerItems);

    for (let index = 0; index < liContainerItems.length; index++) {
        console.log(liContainerItems[index].children[1]);

        const liContainerName = liContainerItems[index].closest("li")?.children[2]?.children[1]?.textContent;
        console.log(liContainerName);

        const minusButton = liContainerItems[index].closest("li")?.children[1]?.children[0];
        const counterMenu = liContainerItems[index].closest("li")?.children[1]?.children[1];
        const plusButton = liContainerItems[index].closest("li")?.children[1]?.children[2];

        const liContainerStyles = liContainerItems[index].closest("li")?.children[0];
        const liContainerButton = liContainerItems[index].closest("li")?.children[1];

        let cartProductCounter = cartProductSelected.querySelectorAll(".product-selected__name");
        console.log(cartProductCounter);
        

        if (liContainerName) {
            for (let i = 0; i < cartProductCounter.length; i++) {
                const cartProductContainer = cartProductCounter[i].closest(".cart__product-selected-container");
                console.log(cartProductContainer);

                if (liContainerName === cartProductCounter[i].textContent) {
                    cartProductContainer.remove();
                    minusButton.remove();
                    counterMenu.remove();
                    plusButton.remove();
                    liContainerStyles.classList.remove("selected-product");
                    liContainerButton.classList.remove("add-to-cart--selected");

                    if (!liContainerItems[index].querySelector(".add-cart__icon") && !liContainerItems[index].querySelector(".add-cart__text")) {
                        const addToCartButton = liContainerItems[index].children[1];
                        console.log(addToCartButton);
                        
                        const cartIcon = document.createElement("img");
                        const cartText = document.createElement("span");
                        cartIcon.src = "./icons/icon-add-to-cart.svg";
                        cartText.textContent = "Add to Cart";
                        cartIcon.classList.add("add-cart__icon");
                        cartText.classList.add("add-cart__text");
                        addToCartButton.append(cartIcon);
                        addToCartButton.append(cartText);

                        if (cart.children.length < 6) {
                            const emptyCart = cart.querySelector(".cart__empty");
                            console.log(emptyCart);
                            const orderTotalContainer = cart.querySelector(".cart__order-total-container");
                            const carbonNeutralContainer = cart.querySelector(".cart__carbon-neutral-container");
                            const confirmOrderButton = cart.querySelector(".cart__confirm-order");
                            console.log({orderTotalContainer, carbonNeutralContainer, confirmOrderButton});
                            
                            emptyCart.id = "none";
                            orderTotalContainer.remove();
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
    const cartCounterItems = document.querySelectorAll(".cart__product-selected-container");
    let totalQuantity = 0;
    
    for (let index = 0; index < cartCounterItems.length; index++) {    
        let cartCounter = cartCounterItems[index].children[1].children[0].textContent;
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

    if(cartCounterItems.length === 0) {
        quantityProductsElement.textContent = 0;
    }
}

function totalOrderPrice() {
    const orderTotalElement = document.querySelector(".order-total-result");
    console.log(orderTotalElement);

    const accumulatedPriceItems = document.querySelectorAll(".accumulated-price");
    console.log(accumulatedPriceItems);

    let totalPrice = 0;

    for (let index = 0; index < accumulatedPriceItems.length; index++) {
        let accumulatedPrices = accumulatedPriceItems[index].textContent;
        console.log(accumulatedPrices);

        let accumulatedPricesNumber = Number(accumulatedPrices.substring(1));
        console.log(accumulatedPricesNumber);
        
        totalPrice += accumulatedPricesNumber;
        orderTotalElement.textContent = `$${totalPrice.toFixed(2)}`;
    }
}

function openModalWindow() {
    const body = document.querySelector("body");
    const cart = document.querySelector(".cart");
    const productContainerInCart = cart.querySelectorAll(".cart__product-selected-container");
    console.log(productContainerInCart);
    const modalWindowOpen = document.querySelector(".modal-window");

    if (!modalWindowOpen) {
        //Creando elementos
        const modalWindow = document.createElement("div");
        const modalCard = document.createElement("section");
        const confirmedImageElement = document.createElement("img");
        const orderConfirmedTitle = document.createElement("h2");
        const orderConfirmedSubtitle = document.createElement("p");
        //Products section
        const productsSectionContainer = document.createElement("div");
        //Hay que hacer una validacion para que cree un contenedor del producto por cada contenedor del producto que haya en el carrito
        //DE AQUI
        for (let index = 0; index < productContainerInCart.length; index++) {
            console.log(productContainerInCart[index]);

            const productNameInCart = productContainerInCart[index].querySelector(".product-selected__name").textContent;
            console.log(productNameInCart);
            
            const pricingContainer = productContainerInCart[index].querySelector(".product-selected__pricing-container");
            console.log(pricingContainer);
            
            const counterInCart = pricingContainer.querySelector(".counter").textContent;
            const defaultPriceInCart = pricingContainer.querySelector(".default-price").textContent;
            const accumulatedPriceInCart = pricingContainer.querySelector(".accumulated-price").textContent;
            console.log({counterInCart, defaultPriceInCart, accumulatedPriceInCart});
            
            const productContainer = document.createElement("div");
            const productImage = document.createElement("img");
            const productName = document.createElement("p");
            const productCounter = document.createElement("span");
            const productDefaultPrice = document.createElement("span");
            const productAccumulatedPrice = document.createElement("span");
            const jsonData2 = jsonData;
            console.log(jsonData2);

            for(const data in jsonData2)  {
                console.log(jsonData2[data].name);
            
                const productNameInJson = jsonData2[data].name;

                if(productNameInJson === productNameInCart) {
                    productImage.src = jsonData2[data].image.thumbnail;
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
        //HASTA AQUI
        const orderTotalResultInCart = document.querySelector(".order-total-result").textContent;

        const orderTotalContainer = document.createElement("div");
        const orderTotalParagraph = document.createElement("p");
        const orderTotalResult = document.createElement("p");
        
        const startNewOrderButton = document.createElement("button");

    //Añadiendo estilos a los elementos
        modalWindow.classList.add("modal-window");
        modalCard.classList.add("modal-card");
        confirmedImageElement.src = "./icons/icon-order-confirmed.svg";
        confirmedImageElement.alt = "order-confirmed-icon";
        confirmedImageElement.classList.add("modal-card__confirmed-image");
        orderConfirmedTitle.classList.add("modal-card__title");
        orderConfirmedTitle.textContent = "Order Confirmed";
        orderConfirmedSubtitle.classList.add("modal-card__subtitle");
        orderConfirmedSubtitle.textContent = "We hope you enjoy your food!";

        orderTotalContainer.classList.add("products-section__order-total");
        orderTotalParagraph.classList.add("order-total-paragraph");
        orderTotalParagraph.textContent = "Order Total";
        orderTotalResult.classList.add("order-total-result");
        orderTotalResult.textContent = orderTotalResultInCart;

        startNewOrderButton.classList.add("modal-card__new-order-button", "order-button");
        startNewOrderButton.textContent = "Start New Order";

    //Posicionando elementos
        body.append(modalWindow);
        modalWindow.append(modalCard);
        modalCard.append(confirmedImageElement, orderConfirmedTitle, orderConfirmedSubtitle, productsSectionContainer, startNewOrderButton);

        productsSectionContainer.append(orderTotalContainer);
        orderTotalContainer.append(orderTotalParagraph, orderTotalResult);

        const newOrderButton = document.querySelector(".modal-card__new-order-button");
        console.log(newOrderButton);

        if(newOrderButton.addEventListener("click", startNewOrder));
    }
}

function startNewOrder() {
    location.reload()
}