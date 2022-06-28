//==========================================================================
//* Fonction de récupération des données de l'api
//==========================================================================
async function getProducts() {
  try {
    let products = await fetch('http://localhost:3000/api/products');
    return await products.json();
  }
  catch {
    apiError()
  }
}

//==========================================================================
//* Fonction affichage des produits
//==========================================================================
function showProducts(item) {
  document.querySelector("#items").innerHTML += `
  <a href="./product.html?id=${item._id}">
    <article>
      <img src="${item.imageUrl}" alt="${item.altTxt}">
      <h3 class="productName">${item.name}</h3>
      <p class="productDescription">${item.description}</p>
    </article>
  </a>`
}
// appel de fonction automatique ()();
(async function renderProducts() {
  const items = await getProducts();
  items.forEach(item => {
    showProducts(item)
  })
})();

//==========================================================================
//* Création message d'erreur
//==========================================================================
function apiError() {
  document.querySelector("h1").innerHTML =
  "<div>Toutes nos excuses une erreur c'est produite</div>";
  document.querySelector("h2").innerHTML = "Nous vous remercions pour votre visite<br />et nous vous invitons à revenir un peu plus tard";
}
