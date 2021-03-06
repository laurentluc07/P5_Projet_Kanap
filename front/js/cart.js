//==========================================================================
//* Fonction qui permet de récupérer la base de donées
//==========================================================================
function getCart() {
  return JSON.parse(localStorage.getItem("cart"));
}

//==========================================================================
//* Fonction qui permet de vérifier si il y a des produits dans le panier
//==========================================================================
function verifyCartItems() {
  const cartStatus = getCart();
  if (cartStatus === null || cartStatus.length === 0) {
    document.querySelector(".cart__order__form").hidden = true;
    document.querySelector("#cart__items").innerHTML = `
    <article class="cart__item">
      <h2>Panier vide</h2>
      <p>
        Veuillez retourner sur la page de produit</br>
        Afin de sélectionner un produit.
      </p>
    </article>
    `
    return false
  } else {
    return true
  }
}

//==========================================================================
//* Fonction qui permet d'afficher les produits ajouté au panier
//==========================================================================
async function productDisplay() {
  verifyCartItems();
  const cartStatus = getCart();
  let totalPrice = 0;
  let totalQuantity = 0;
  let cartContent = "";
  for (cart of cartStatus) {
    await fetch("http://localhost:3000/api/products/" + cart.id)
    .then((response) => response.json())
    .then(product => {
      totalPrice += parseInt(product.price) * parseInt(cart.quantity);
      totalQuantity += parseInt(cart.quantity);
      cartContent += `
      <article class="cart__item" data-id="${cart.id}" data-color="${cart.color}">
        <div class="cart__item__img">
          <img src="${product.imageUrl}" alt="${product.altTxt}">
        </div>
        <div class="cart__item__content">
          <div class="cart__item__content__description">
            <h2>${product.name}</h2>
            <p>${cart.color}</p>
            <p>${product.price * cart.quantity} €</p>
          </div>
          <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
              <p>Qté : </p>
              <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${cart.quantity}">
              <p></p>
            </div>
            <div class="cart__item__content__settings__delete">
              <p class="deleteItem">Supprimer</p>
            </div>
          </div>
        </div>
      </article>`
    })
  }
  document.querySelector("#cart__items").innerHTML = cartContent;
  document.querySelector("#totalPrice").innerHTML = totalPrice;
  document.querySelector("#totalQuantity").innerHTML = totalQuantity;
};

//==========================================================================
//* Actualisation dynamique du panier, sans rechargement de la page.
//==========================================================================
async function loadPage() {
  if (verifyCartItems()) {
    await productDisplay();
    editQuantity();
    deleteProduct();
  }
}
loadPage();

//==========================================================================
//* Fonction qui permet d'éditer la quantité des produits
//==========================================================================
function editQuantity() {
  let allItemsCart = getCart();
  let quantities = document.querySelectorAll(".itemQuantity");
  quantities.forEach((quantity) => {
    quantity.addEventListener("change", (e) => {
      if (e.target.value < 1 || e.target.value > 100) {
        alert("Veuillez choisir entre 1 et 100 produits")
      } else {
        const newQuantity = e.target.value;
        const productId = e.target.closest("article").dataset.id;
        const productColor = e.target.closest("article").dataset.color;
        const productPosition = allItemsCart.findIndex(item =>
          item.id === productId && item.color === productColor)
        allItemsCart[productPosition].quantity = newQuantity;
        localStorage.setItem("cart", JSON.stringify(allItemsCart));
        loadPage();
      }
    })
  })
};

//==========================================================================
//* Fonction qui permet de supprimer les articles
//==========================================================================
function deleteProduct() {
  let allItemsCart = getCart();
  let removeProductsButton = document.querySelectorAll(".deleteItem");
  removeProductsButton.forEach(removeButton => {
    removeButton.addEventListener("click", (e) => {
      console.log("suppression")
      let result = confirm("Voulez vous vraiment supprimer l'article ?")
      if (result) {
        const productId = e.target.closest("article").dataset.id;
        const productColor = e.target.closest("article").dataset.color;
        const newCart = allItemsCart.filter(item =>
          !(item.id == productId && item.color === productColor));
        localStorage.setItem("cart", JSON.stringify(newCart));
        alert("Votre produit à bien était supprimé")
        loadPage();
      }
    })
  });
}
loadPage();

//==========================================================================
//* Fonction de vérification des inputs du formulaire, grâce à des Regex.
//==========================================================================
function formValidation() {
    const firstNameCheck = () => {
        const firstName = document.querySelector("#firstName");
        const errorMsg = document.querySelector("#firstNameErrorMsg");
        if (/^([A-Za-zÀ-ú]{2,20})?([-])?([A-Za-zÀ-ú]{2,20})$/.test(firstName.value)) {
            errorMsg.innerText = "";
            return true;
        } else {
            errorMsg.innerText = "Veuillez renseigner un prénom.";
        }
    };
    const lastNameCheck = () => {
        const lastName = document.querySelector("#lastName");
        const errorMsg = document.querySelector("#lastNameErrorMsg");
        if (/^([A-Za-zÀ-ú]{2,20})?([-])?([A-Za-zÀ-ú]{2,20})$/.test(lastName.value)) {
            errorMsg.innerText = "";
            return true;
        } else {
            errorMsg.innerText = "Veuillez renseigner un nom.";
        }
    };
    const addressCheck = () => {
        const address = document.querySelector("#address");
        const errorMsg = document.querySelector("#addressErrorMsg");
        if (address.value != "") {
            errorMsg.innerText = "";
            return true;
        } else {
            errorMsg.innerText = "Veuillez renseigner une adresse.";
        }
    };
    const cityCheck = () => {
        const city = document.querySelector("#city");
        const errorMsg = document.querySelector("#cityErrorMsg");
        if (/^([A-Za-zÀ-ú']{2,20})?([-])?([A-Za-zÀ-ú']{2,20})?([-])?([A-Za-zÀ-ú']{2,20})$/.test(city.value)) {
            errorMsg.innerText = "";
            return true;
        } else {
            errorMsg.innerText = "Veuillez renseigner une ville.";
        }
    };
    const emailCheck = () => {
        const email = document.querySelector("#email");
        const errorMsg = document.querySelector("#emailErrorMsg");
        if (/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/.test(email.value)) {
            errorMsg.innerText = "";
            return true;
        } else {
            errorMsg.innerText = "Veuillez renseigner un email.";
        }
    };
    if (firstNameCheck() &&
        lastNameCheck() &&
        addressCheck() &&
        cityCheck() &&
        emailCheck()) {
        return true;
    } else {
        return false;
    }
}

//==========================================================================
//* Envoi de la commande et redirection de l'utilisateur vers la page confirmation.
//==========================================================================
(async function orderSending() {
    const storageStatus = getCart();
    const orderButton = document.querySelector("#order");
    orderButton.addEventListener("click", async(event) => {
        event.preventDefault();
        if (formValidation()) {
            let contact = {
                firstName: document.querySelector("#firstName").value,
                lastName: document.querySelector("#lastName").value,
                address: document.querySelector("#address").value,
                city: document.querySelector("#city").value,
                email: document.querySelector("#email").value
            };
            let products = [];
            storageStatus.forEach(product => {
                products.push(product.id)
            });
            let userData = {
                contact,
                products
            };
            await fetch("http://localhost:3000/api/products/order", {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(userData),
                })
                .then(res => res.json())
                .then(data => {
                    localStorage.clear();
                    location.href = `http://127.0.0.1:5501/front/html/confirmation.html?id=${data.orderId}`;
                })
                .catch(error => {
                    console.log("Erreur: " + error);
                });
        } else {
            alert("Veuillez verifier vos informations.");
        }
    });
})();
