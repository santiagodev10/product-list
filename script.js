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
        }
        // ... y así sucesivamente
    })
    .catch(error => console.error('Error al cargar el archivo JSON:', error));

// Delegación de eventos
document.addEventListener("DOMContentLoaded", () => {
    const mainElement = document.querySelector("main");
    if (mainElement) {
        mainElement.addEventListener("click", handleMainClick);
    } else {
        console.error("Main element is not found on DOMContentLoaded.");
    }
});

function handleMainClick(event) {
    const addToCartClicked = event.target.closest(".add-remove-to-cart-container");
    const plusButtonClicked = event.target.closest(".plus-button");
    const minusButtonClicked = event.target.closest(".minus-button");
    const removeButtonClicked = event.target.closest(".remove-button");
    console.log(removeButtonClicked);
        
    
    if (addToCartClicked) {
        addSelectedStyles(event);
    }

    if (plusButtonClicked || minusButtonClicked) {
        increaseAndDecreaseItems(event);
    }

    if (removeButtonClicked) {
        removeProductFromCart(event);
        quantityOfProductsInsideCart();
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
            addToCartButton.appendChild(minusButton);
            addToCartButton.appendChild(productCounterElement);
            addToCartButton.appendChild(plusButton);

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
    const productSelectedContainer = document.createElement("div");
    const productNameElement = document.createElement("p");
    const pricingContainer = document.createElement("div");
    const counterOfProductsSelected = document.createElement("span");
    const defaultPriceElement = document.createElement("span");
    const accumulatedPriceElement = document.createElement("span");
    const buttonToRemoveProduct = document.createElement("button");
    const iconInsideButton = document.createElement("img"); 

    //Añadiendo las clases de los estilos a los elementos
    emptyCart.id = "inactive"
    productSelectedContainer.classList.add("cart__product-selected-container");
    productNameElement.classList.add("product-selected__name");
    pricingContainer.classList.add("product-selected__pricing-container");
    counterOfProductsSelected.classList.add("counter");
    defaultPriceElement.classList.add("default-price");
    accumulatedPriceElement.classList.add("accumulated-price");
    buttonToRemoveProduct.classList.add("remove-button");
    iconInsideButton.classList.add

    //Anidando los elementos dentro de los contenedores
    cart.append(productSelectedContainer);
    productSelectedContainer.append(productNameElement);
    productSelectedContainer.append(pricingContainer);
    pricingContainer.append(counterOfProductsSelected);
    pricingContainer.append(defaultPriceElement);
    pricingContainer.append(accumulatedPriceElement);
    pricingContainer.append(buttonToRemoveProduct);
    iconInsideButton.src = "./icons/icon-remove-item.svg";
    buttonToRemoveProduct.append(iconInsideButton);

    //Añadiendo la informacion en los elementos
    counterOfProductsSelected.textContent = counter + "x";
    productNameElement.textContent = productName;
    defaultPriceElement.textContent = "@ " + productPrice;
    accumulatedPriceElement.textContent = productPrice;
    
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

    const cartProductSelected = cart.children[2];
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

                        if (cart.children.length === 2) {
                            const emptyCart = cart.children[1];
                            emptyCart.id = "none";
                        }
                    }    
                }
            }
        }
    }
}

function quantityOfProductsInsideCart() {
    const quantityProductsElement = document.querySelector(".quantity-products");
    console.log(quantityProductsElement);

    const cart = document.querySelector(".cart");
    console.log(cart);

    const cartCounterItems = document.querySelectorAll(".cart__product-selected-container");
    console.log(cartCounterItems);

    let totalQuantity = 0;
    
    for (let index = 0; index < cartCounterItems.length; index++) {    
        let cartCounter = cartCounterItems[index].children[1].children[0].textContent;
        console.log(cartCounter.length);

        let cartCounterNumber = Number(cartCounter[0]);
        console.log(cartCounterNumber);

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