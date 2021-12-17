//Récupération de l'ID du produit dans l'URL
let params = (new URL(document.location)).searchParams;
let productId = params.get('productId');
//Nombre de produits dans le panier.
let numberOfProductInCart = localStorage.length;

//Méthode qui permet d'appeler l'api retournant le produit
async function getItem() {
    try {
        let response = await fetch("http://localhost:3000/api/products/" + productId);
        return await response.json();
    } catch (error) {
        console.log("Error : " + error);
    }
}

//Function qui permet d'afficher les éléments dans le html
(async function renderItem() {
    let item = await getItem(); //Appel de la première fonction qui renvoie une promesse
    if (item._id === undefined) { //Message à l'utilisateur si le produit n'est pas trouvé
        const myNode = document.getElementsByClassName("item")[0];
        while (myNode.firstChild) { //Suppression de tous les élément html de la section "item"
            myNode.removeChild(myNode.lastChild);
        }
        myNode.innerHTML = `<h2>Désolé, cette article n'existe pas ou est indisponible</h2>`;
    } else {

        //détails du produit
        let img = document.createElement("img");
        img.setAttribute("src", `${item.imageUrl}`);
        img.setAttribute("alt", `${item.altTxt}`);

        document.getElementsByClassName("item__img")[0].appendChild(img);
        document.getElementById("title").innerText = item.name;
        document.getElementById("price").innerText = item.price;
        document.getElementById("description").innerText = item.description;

        //liste des couleurs disponible
        const numberOfColors = item.colors.length;
        for (let i = 0; i < numberOfColors; i++) {
            let color = document.createElement("option");
            color.setAttribute("value", `${item.colors[i]}`);
            color.innerText = item.colors[i];
            document.getElementById("colors").appendChild(color);
        }

        //Désactiver "SVP, choisissez une couleur" comme option
        document.getElementById("colors").firstElementChild.setAttribute("disabled", "disabled");
    }
})(); //Fin de la fonction renderItem

//récupérer couleur choisie par l'utilisateur
function getSelectedColor(elementId) {
    const elt = document.getElementById(elementId);
    if (elt.selectedIndex == 0)
        return null;
    return elt.options[elt.selectedIndex].text;
}

//Trouver une clé disponible dans local storage
function createKey() {
    for (let i = 0; i <= numberOfProductInCart; i++) {
        if (localStorage.getItem("pdt" + i) == null) {
            key = "pdt" + i;
            i = numberOfProductInCart; //fin de la boucle
            return key;
        }
    }
}

//Ajout d'un produit
function addPdt(indexPdt, idPdt, color, qty) {
    let objJson = {
        idPdt: idPdt,
        color: color,
        qty: qty,
        name: document.getElementById("title").textContent,
        price: document.getElementById("price").textContent,
        imageUrl: document.querySelector(".item__img img").getAttribute('src'),
        altTxt: document.querySelector(".item__img img").getAttribute('alt')
    }
    let objLinea = JSON.stringify(objJson);
    localStorage.setItem(indexPdt, objLinea);
}

//Bouton "Ajouter au panier"
const btn = document.getElementById('addToCart');
const errorMsg = document.getElementsByClassName("errorMsg")[0]
let msgConfirmAddInCart = document.createElement("h2");
document.getElementsByClassName("item__content")[0].appendChild(msgConfirmAddInCart);

btn.addEventListener('click', function () {
    let newPdt = {
        idPdt: productId,
        color: getSelectedColor("colors"),
        qty: parseInt(document.getElementById("quantity").value)
    }

    if (newPdt.color == null) {
        errorMsg.innerText = "Veuillez sélectionner une couleur";
    } else {
        if (newPdt.qty >= 1 && newPdt.qty <= 100) { //Vérification de la quantité rentré par l'utilisateur
            //Boucle pour vérifier si le produit mis dans le panier existe déjà
            for (let i = 0; i <= numberOfProductInCart; i++) {
                let objLinea = localStorage.getItem(localStorage.key(i));
                let objJson = JSON.parse(objLinea);

                if (i == numberOfProductInCart) { //On vérifie si tous les produits dans le panier ont été comparés
                    //Ajout du produit
                    addPdt(createKey(), newPdt.idPdt, newPdt.color, newPdt.qty);
                    msgConfirmAddInCart.innerText = newPdt.qty + " article(s) ajouté(s) à votre panier"; //message de confirmation
                } else {
                    //On vérifie si le produit ajouté est déjà dans le panier
                    if (newPdt.idPdt == objJson.idPdt & newPdt.color == objJson.color) {
                        let updateQty = newPdt.qty + objJson.qty; //calcul nouvelle quantité du produit
                        addPdt(localStorage.key(i), newPdt.idPdt, newPdt.color, updateQty); //Update du produit
                        msgConfirmAddInCart.innerText = newPdt.qty + " article(s) ajouté(s) à votre panier"; //message de confirmation
                        i = numberOfProductInCart + 1; //On sort de la boucle
                    }
                }
            }
            errorMsg.innerText = "";
        } else {
            errorMsg.innerText = "Veuillez indiquer une quantité entre 1 et 100";
        }
    }
    numberOfProductInCart = localStorage.length; //mise à jour variable
});
