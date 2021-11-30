
let params = (new URL(document.location)).searchParams;
let productId = params.get('productId');
let item__img = document.getElementById("item__img");


fetch("http://localhost:3000/api/products/" + productId) /* On envoie une requête de type GET à l'API avec l'id du produit */
    .then(function (res) {
        if (res.ok) { /* On vérifie si la requête est bien passée */

            return res.json(); /* Ce résultat json est une Promise, nous le retournons et récupérons sa vrai valeur dans la fonction then() suivante */
        }
    })
    .then(function (value) {

        //détails du produit
        let img = document.createElement("img");
        img.setAttribute("src", `${value.imageUrl}`);
        img.setAttribute("alt", `${value.altTxt}`);

        document.getElementsByClassName("item__img")[0].appendChild(img);
        document.getElementById("title").innerText = value.name;
        document.getElementById("price").innerText = value.price;
        document.getElementById("description").innerText = value.description;

        //liste des couleurs disponible
        const numberOfColors = value.colors.length;
        for (let i = 0; i < numberOfColors; i++) {
            let color = document.createElement("option");
            color.setAttribute("value", `${value.colors[i]}`);
            color.innerText = value.colors[i];
            document.getElementById("colors").appendChild(color);
        }

        //Désactiver "SVP, choisissez une couleur" comme option
        document.getElementById("colors").firstElementChild.setAttribute("disabled", "disabled");

    })
    .catch(function (err) {
        //Gestion des erreurs
        console.log("erreur requête")
        const myNode = document.getElementsByClassName("item")[0];
        while (myNode.firstChild) { //Suppression de tous les élément html de la section "item"
            myNode.removeChild(myNode.lastChild);
        }
        let msgErr = document.createElement("h2");
        msgErr.innerText = "Désolé, cette article n'existe pas ou est indisponible.";
        myNode.appendChild(msgErr);
    });


/* AJOUT DANS PANIER */

let numberOfProductInCart = localStorage.length;

//récupérer coleur dans select/option
function getSelectedColor(elementId) {
    var elt = document.getElementById(elementId);

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
        qty: qty
    }
    let objLinea = JSON.stringify(objJson);
    localStorage.setItem(indexPdt, objLinea);
}

//Ajout d'un message pour l'utilisateur
function msgUser(qty) {
    const elm = document.getElementsByClassName("item__content")[0];
    let msg = document.createElement("h2");
    msg.innerText = qty + " article(s) ajouté(s) à votre panier";
    elm.appendChild(msg);
}

//Bouton "Ajouter au panier"
const btn = document.getElementById('addToCart');
btn.addEventListener('click', function (e) {
    let newPdt = {
        idPdt: productId,
        color: getSelectedColor("colors"),
        qty: parseInt(document.getElementById("quantity").value)
    }

    if (newPdt.color == null) {
        alert("Veuillez sélectionner une couleur");
    } else {
        if (newPdt.qty >= 1 && newPdt.qty <= 100) { //Vérification de la quantité rentré par l'utilisateur
            //Boucle pour vérifier si le produit mis dans le panier existe déjà
            for (let i = 0; i <= numberOfProductInCart; i++) {

                let objLinea = localStorage.getItem(localStorage.key(i));
                let objJson = JSON.parse(objLinea);

                if (i == numberOfProductInCart) { //On vérifie si tous les produits dans le panier ont été comparés
                    //Ajout du produit
                    addPdt(createKey(), newPdt.idPdt, newPdt.color, newPdt.qty);

                    msgUser(newPdt.qty); //message de confirmation
                } else {
                    //On vérifie si le produit ajouté est déjà dans le panier
                    if (newPdt.idPdt == objJson.idPdt & newPdt.color == objJson.color) {
                        let updateQty = newPdt.qty + objJson.qty; //calcul nouvelle quantité du produit
                        addPdt(localStorage.key(i), newPdt.idPdt, newPdt.color, updateQty); //Update du produit
                        msgUser(newPdt.qty); //message de confirmation
                        i = numberOfProductInCart + 1; //On sort de la boucle
                    }
                }
            }
        } else {
            alert("Veuillez indiquer une quantité entre 1 et 100");
        }
    }

    numberOfProductInCart = localStorage.length; //mise à jour variable
});







