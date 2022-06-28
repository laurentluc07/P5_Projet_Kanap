//==========================================================================
//* Fonction qui permet de récupérer l'id d'un produit passé en paramètres
//==========================================================================
function getId() {
  const idProduct = new URL(window.location.href).searchParams.get("id");
  return idProduct
}

//==========================================================================
//* Fonction qui permet de récupérer les données
//==========================================================================
async function getProductById() {
  const idProduct = getId();
  try {
    let result = await fetch("http://localhost:3000/api/products/" + idProduct)
    return await result.json();
  } catch {
    apiError()
  }
}

//==========================================================================
//* Fonction qui permet d'afficher le produits avec un appel de fonction automatique
//==========================================================================
(async function renderProduct() {
  const item = await getProductById();
  document.querySelector(".item__img").innerHTML = `
  <img src="${item.imageUrl}" alt="${item.altTxt}">
  `;
  document.querySelector("#title").innerHTML = item.name
  document.querySelector("#price").innerHTML = item.price
  document.querySelector("#description").innerHTML = item.description
  item.colors.forEach(color => {
    document.querySelector("#colors").innerHTML += `
    <option value="${color}">${color}</option>
    `
  })
})();

//==========================================================================
//* Fonction qui permet d'ajouter au panier un produit
//==========================================================================
// document.queryselector plus rapide que le getElementById
// async function lorsque l'on fait appel a une base de donnée dynamique(api) et lorsque l'on fait appel
// a une base de donnée locale on fait juste une fonction normale
(function addToCart() {
  // enregistrer trois valeurs :
  let saveCart = document.querySelector("#addToCart")
  saveCart.addEventListener("click", () => {
    // L'id du produit
    const productId = getId();
    // La quantité
    const productQuantity = document.querySelector("#quantity").value
    // La couleur
    const productColor = document.querySelector("#colors").value

    let productJson = {
      id : productId,
      quantity : productQuantity,
      color : productColor,
    }

    let statusDb = JSON.parse(localStorage.getItem("cart"));

    let storageSave = () => {
      if (productColor === "") {
        alert("Veuillez sélectionner une couleur");
      } else if (productQuantity < 1 || productQuantity > 100) {
        alert("Veuillez Choisir entre 1 et 100 articles")
      } else {
        statusDb.push(productJson);
        localStorage.setItem('cart', JSON.stringify(statusDb));
        window.alert("Votre Produit est ajouté");
      }
    }

    if (statusDb) {
      statusDb.forEach((product, index) => {
        console.log(productJson.renderProduct)
        if (productJson.id === product.id && productJson.color === product.color) {
          productJson.quantity = parseInt(productJson.quantity) + parseInt(product.quantity)
          statusDb.splice(index, 1)
        }
      });
      storageSave();
    } else {
      statusDb = [];
      storageSave();
    }
  })
}) ();

//==========================================================================
//* Création message d'erreur
//==========================================================================
function apiError() {
  document.querySelector("h1").innerHTML =
  "<div>Toutes nos excuses une erreur c'est produite</div>";
  document.querySelector("h2").innerHTML = "Nous vous remercions pour votre visite<br />et nous vous invitons à revenir un peu plus tard";
}

// // Récupération de l'ID du produit depuis l'URL de la page.
// function productCheck() {
//     const url = new URL(window.location.href);
//     const id = url.searchParams.get("id");
//     return id;
// }

// // Récupération des informations du produit grâce à son ID, depuis l'API.
// async function productInfos() {
//     const productId = productCheck();
//     try {
//         const res = await fetch(`http://localhost:3000/api/products/${productId}`);
//         const item = await res.json();
//         return item;
//     } catch (error) {
//         console.log("Erreur: " + error);
//     };
// }

// // Modification du DOM pour faire apparaitre les détails du produit.
// (async function fillProduct() {
//     const item = await productInfos();
//     document.querySelector(".item__img").innerHTML =
//         `<img src="${item.imageUrl}" alt="${item.altTxt}">`;
//     document.querySelector("#title").innerHTML = item.name;
//     document.querySelector("#price").innerHTML = item.price;
//     document.querySelector("#description").innerHTML = item.description;
//     item.colors.forEach(color => {
//         document.querySelector("#colors").innerHTML +=
//             `<option value="${color}">${color}</option>`
//     });
// })();

// // Envoi de la sélection de l'utilisateur, dans le localStorage.
// (function productStorage() {
//     const sendButton = document.querySelector("#addToCart");
//     sendButton.addEventListener("click", () => {
//         const productId = productCheck();
//         const productColor = document.querySelector("#colors").value;
//         const productQuantity = document.querySelector("#quantity").value;
//         let productDetails = {
//             id: productId,
//             color: productColor,
//             quantity: productQuantity
//         };
//         let storageStatus = JSON.parse(localStorage.getItem("product"));
//         let storagePush = () => {
//             if (productColor === "") {
//                 alert("Veuillez sélectionner une couleur");
//             } else if (productQuantity < 1 || productQuantity > 100) {
//                 alert("Veuillez choisir entre 1 et 100 articles");
//             } else {
//                 storageStatus.push(productDetails);
//                 localStorage.setItem("product", JSON.stringify(storageStatus));
//                 alert("Votre sélection à été ajoutée au panier");
//             }
//         };
//         if (storageStatus) {
//             storageStatus.forEach((product, index) => {
//                 if (productDetails.id === product.id &&
//                     productDetails.color === product.color) {
//                     productDetails.quantity = parseInt(productDetails.quantity) +
//                         parseInt(product.quantity);
//                     storageStatus.splice(index, 1);
//                 }
//             });
//             storagePush();
//         } else {
//             storageStatus = [];
//             storagePush();
//         };
//     });
// })();
