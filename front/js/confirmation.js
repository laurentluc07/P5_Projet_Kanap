let orderParams = new URLSearchParams(document.location.search);

//==========================================================================
//* Fonction affcihage du message de confirmation de la commande
//==========================================================================
const displayOrderNumber = () => {
    orderId.textContent = orderParams.get("id");
    localStorage.clear();
    setTimeout(() => {
        document.location.href = "http://127.0.0.1:5501/front/html/index.html";
    }, 5000);
};
displayOrderNumber();
