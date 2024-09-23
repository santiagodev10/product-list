const ul = document.querySelector("ul");
const productImage = document.querySelector(".product-image");
const addToCartButton = document.querySelector(".add-remove-to-cart-container");
const cartIcon = document.querySelector(".add-cart__icon");
const cartText = document.querySelector(".add-cart__text");
const cart = document.querySelector(".cart");

// En tu segundo script
fetch('./data.json')
    .then(response => response.json()) // Analiza el contenido JSON
    .then(data => {
        // Ahora "data" es un objeto JavaScript con los datos del JSON
        console.log(data); 
        for (const property in data) {
            console.log(data[property].image.thumbnail);
            //creando elementos para insertar en ellos los datos del json
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
            img.classList.add("product-image");
            li.append(productDescription);
            li.append(buttonContainer);
            productDescription.classList.add("product-description");
            buttonContainer.classList.add("add-remove-to-cart-container");

            productDescriptionCategory.textContent = data[property].category;
            productDescriptionCategory.classList.add("product-description__category");

            productDescriptionName.textContent = data[property].name;
            productDescriptionName.classList.add("product-description__name");

            productDescriptionPrice.textContent = "$" + data[property].price;
            productDescriptionPrice.classList.add("product-description__price");

            productDescription.append(productDescriptionCategory);
            productDescription.append(productDescriptionName);
            productDescription.append(productDescriptionPrice);

            iconCart.src = "./icons/icon-add-to-cart.svg";
            addToCartText.textContent = "Add to Cart";
            addToCartText.classList.add("add-cart__text");

            buttonContainer.append(iconCart);
            buttonContainer.append(addToCartText);
            
        }
        // ... y así sucesivamente
    })
    .catch(error => console.error('Error al cargar el archivo JSON:', error));

addToCartButton.addEventListener("click", addItemToCart, {once: true});

function addItemToCart(event) {
    console.log(event)
    /*Primero se ponen los estilos para el producto seleccionado*/

    /*Eliminando los elementos que lleva por defecto el add to cart*/
    cartIcon.remove();
    cartText.remove();

    /*poniendo estilos al borde de la imagen y al background del boton*/
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