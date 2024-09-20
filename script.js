const productImage = document.querySelector(".product-image");
const addToCartButton = document.querySelector(".add-remove-to-cart-container");
const cartIcon = document.querySelector(".cart-icon");
const cartText = document.querySelector(".cart-text");
const cart = document.querySelector(".cart");

addToCartButton.addEventListener("click", addItemToCart, {once: true})

function addItemToCart(event) {
    console.log(event)
    cartIcon.remove();
    cartText.remove();

    /*poner estilos al borde de la imagen y al background del boton*/
    productImage.classList.add("selected-product");
    addToCartButton.classList.add("add-to-cart--selected");
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
}