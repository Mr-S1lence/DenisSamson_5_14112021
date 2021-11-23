/* var urlSearchParams = URL.searchParams;

console.log(urlSearchParams); */

let params = (new URL(document.location)).searchParams;
let productId = params.get('productId');
/* console.log(productId); */
let item__img = document.getElementById("item__img");


fetch("http://localhost:3000/api/products/" + productId) /* On envoie une requête de type GET à l'API */
    .then(function (res) {
        if (res.ok) { /* On vérifie si la requête est bien passée */

            return res.json(); /* Ce résultat json est une Promise, nous le retournons et récupérons sa vrai valeur dans la fonction then() suivante */
        }
    })
    .then(function (value) {
/*         console.log(value); */
        let img = document.createElement("img");
        img.setAttribute("src", `${value.imageUrl}`);
        img.setAttribute("alt", `${value.altTxt}`);

        document.getElementsByClassName("item__img")[0].appendChild(img);

        document.getElementById("title").innerText = value.name;
        document.getElementById("price").innerText = value.price;
        document.getElementById("description").innerText = value.description;


        const numberOfColors = value.colors.length;
        for (let i = 0; i < numberOfColors; i++) {
            let color = document.createElement("option");
            color.setAttribute("value", `${value.colors[i]}`);
            color.innerText = value.colors[i];
            document.getElementById("colors").appendChild(color);
        }


    })
    .catch(function (err) {
        // Une erreur est survenue
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




    function getQty() { //récupérer quantité dans input
        const input = parseInt(document.getElementById("quantity").value);
/*         const qty = parseInt(JSON.parse(localStorage.getItem("quantity")));
        let newQty = qty + input;

        alert(newQty);
        localStorage.setItem("quantity", JSON.stringify(newQty)); */
        return input;
    }

    function getSelectedColor(elementId) { //récupérer coleur dans select/option
        var elt = document.getElementById(elementId);
    
        if (elt.selectedIndex == -1)
            return null;
    
        return elt.options[elt.selectedIndex].text;
    }


function addPdt(indexPdt,idPdt,color,qty){
    let objJson = {
        idPdt : idPdt,
        color : color,
        qty : qty
    }
    let objLinea = JSON.stringify(objJson);
/*     localStorage.setItem("pdt"+ parseInt(numberOfProductInCart),objLinea);     */
localStorage.setItem("pdt"+ indexPdt,objLinea);
}



function msgUser(qty){
    const test = document.getElementsByClassName("item__content")[0];
    let msg = document.createElement("h2");
    msg.innerText = qty + " articles ont bien été ajoutés à votre panier";
    test.appendChild(msg);
}



console.log(localStorage);
/* console.log(localStorage.getItem("pdt2")); */



/* console.log(objJson.idPdt); */

console.log("nombre de produit dans le panier : " + numberOfProductInCart);


    const btn = document.getElementById('addToCart');
    btn.addEventListener('click', function(e){
        let newPdt = {
            idPdt : productId,
            color : getSelectedColor("colors"), //A FAIRE RECUPER VALEUR ENTRER PAR USER
            qty : parseInt(document.getElementById("quantity").value)
        }

        for (let i = 0; i <= numberOfProductInCart; i++) { //Boucle pour vérifier si le produit mis dans le panier existe déjà
                console.log(localStorage.getItem("pdt" + i));
                console.log(newPdt.idPdt + " " + newPdt.color);
                let objLinea = localStorage.getItem("pdt" + i);
                let objJson = JSON.parse(objLinea);
/*                 console.log("Id du produit n°"+i + " : "+ objJson.idPdt); */
/*                 console.log("couleur du produit n°"+i + " : "+ objJson.color); */
                    console.log("i = "+i);
/*                     console.log("numberOfProductInCart =  "+numberOfProductInCart); */
                if(i == numberOfProductInCart){ //On vérifie si tous les produits dans le panier ont été comparés
                     console.log("Fin des comparaisons / Ajout du nouveau produit");
                     //On utilise numberOfProductInCart comme indice pour le nouveau produit de localStorage
                    addPdt(parseInt(numberOfProductInCart),newPdt.idPdt,newPdt.color,newPdt.qty); 
                    msgUser(newPdt.qty);
                }else{
/*                     console.log("aurevoir"); */
                    if(newPdt.idPdt == objJson.idPdt & newPdt.color == objJson.color){ //On vérifie si le produit ajouté est déjà dans le panier
                        console.log("recherche n° "+i+" identique");
                        console.log("objJson Qty : "+objJson.qty);
                        console.log("newPdt Qty : "+newPdt.qty);
                        let updateQty = newPdt.qty + objJson.qty; //calcul nouvelle quantité du produit
                        console.log("Nouvelle qty : "+ updateQty);
                        addPdt(i,newPdt.idPdt,newPdt.color,updateQty); //Update du produit
                        msgUser(newPdt.qty);
                        i = numberOfProductInCart + 1; //On sort de la boucle
                        console.log("i devient numberOfProductInCart + 1/ On sort de la boucle => "+ i)
                    }
                }
            }
            console.log(localStorage);
            numberOfProductInCart = localStorage.length; //mise à jour variable
            console.log(numberOfProductInCart);
/*             console.log("Id du produit à ajouter : " + newPdt.idPdt); */
    });




    

    
