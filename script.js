const ul = document.querySelector("ul");
// const productImage = document.querySelector(".product-image");
// const addToCartButton = document.querySelector(".add-remove-to-cart-container");
// const cartIcon = document.querySelector(".add-cart__icon");
// const cartText = document.querySelector(".add-cart__text");
// const cart = document.querySelector(".cart");



fetch('./data.json')
    .then(response => response.json()) // Analiza el contenido JSON
    .then(data => {
        // Ahora "data" es un objeto JavaScript con los datos del JSON
        console.log(data); 
        for (const property in data) {
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

ul.addEventListener("click", addSelectedStyles);

function addSelectedStyles(event) {
    console.log(event);
    //seleccionando elementos del DOM
    const buttonContainerClicked = event.target.closest(".add-remove-to-cart-container");
    //validando cual de los li fue seleccionado    
    if(buttonContainerClicked) {
        console.log(buttonContainerClicked);
        const cartIcon = buttonContainerClicked.querySelector(".add-cart__icon");
        const cartText = buttonContainerClicked.querySelector(".add-cart__text");
        const productImage = buttonContainerClicked.previousSibling;
        const addToCartButton = buttonContainerClicked;
          
        /*Primero se ponen los estilos para el producto seleccionado*/
        
        /*Eliminando los elementos que lleva por defecto el add to cart*/
        cartIcon.remove();
        cartText.remove();
        
        /*poniendo estilos al borde de la imagen y al background del boton*/
        console.log(productImage);
            
        addToCartButton.classList.add("add-to-cart--selected");
        productImage.classList.add("selected-product");
        /*creando los botones y el span*/
        const minusButton = document.createElement("button");
        const minusButtonIconWrapper = document.createElement("figure");
        const minusButtonIcon = document.createElement("img");
        const plusButton = document.createElement("button");
        const plusButtonIconWrapper = document.createElement("figure");
        const plusButtonIcon = document.createElement("img");
        const productCounter = document.createElement("span");
        /*añadiendo estilos a los botones y al span*/
        minusButton.classList.add("buttons");
        minusButtonIconWrapper.classList.add("wrapper");
        minusButtonIcon.src = "./icons/icon-decrement-quantity.svg";
        minusButtonIcon.classList.add("icons");
        minusButton.append(minusButtonIconWrapper);
        minusButtonIconWrapper.append(minusButtonIcon);
        
        plusButton.classList.add("buttons");
        plusButtonIconWrapper.classList.add("wrapper");
        plusButtonIcon.src = "./icons/icon-increment-quantity.svg";
        plusButtonIcon.classList.add("icons");
        plusButton.append(plusButtonIconWrapper);
        plusButtonIconWrapper.append(plusButtonIcon);
        
        productCounter.textContent = "1";
        productCounter.classList.add("product-counter");
        /*añadiendo los botones y el span adentro del contenedor*/
        addToCartButton.appendChild(minusButton);
        addToCartButton.appendChild(productCounter);
        addToCartButton.appendChild(plusButton);

        //aqui tengo que detectar cual product category se esta haciendo click, aprovechando que el addeventlistener esta puesto en el ul
        const nameProduct = buttonContainerClicked.nextSibling.children[1].textContent;
        const priceProduct = buttonContainerClicked.nextSibling.children[2].textContent;
        
        addItemToCart(nameProduct, priceProduct)
    }
}

function addItemToCart(productName, productPrice) {
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
    emptyCart.classList.add("inactive");
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
    console.log(productNameElement.textContent = productName);
    console.log(defaultPriceElement.textContent = productPrice);
    counterOfProductsSelected.textContent = "1x";
    productNameElement.textContent = productName;
    defaultPriceElement.textContent = productPrice;
    accumulatedPriceElement.textContent = productPrice;
}