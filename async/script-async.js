// Promise, async / await

// Simular un servidor con asincronía

function fetchProductsAsync() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {id:1, name:'Pelota de fútbol', price:20},
                {id:2, name:'Raqueta de tennis', price:50}
            ])
        }, 3000)
    });
}

// MOstrar productos con asincronía
async function displayProducts() {
    const products = document.getElementById('products');
    products.innerHTML = "<p>Cargando productos...</p>";

    //Llamada NO bloqueante.
    const productsFunction = await fetchProductsAsync();
    console.log(productsFunction);

    products.innerHTML = productsFunction
    .map((p)=>{
        `<p>${p.name} - ${p.price}€</p>`
    })
    .join("");
}

document.getElementById('addProductForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('product-name').value;
    const price = document.getElementById('product-price').value;

    //Simular guardado en servior.
    await new Promise((resolve) => {
        setTimeout(resolve, 1000);
        alert(`Producto añadido: ${name} - ${price}€`);
        document.getElementById('addProductForm').reset();

        displayProducts();
    })
});

//
displayProducts();