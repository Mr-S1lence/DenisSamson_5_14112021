//Function qui permet d'afficher les éléments dans le html
async function renderItem() {

    let htmlRender = ""; //Initialisation d'une variable représentant le rendu final.
    let htmlContent = ``;
    if (localStorage.length == 0) {
        htmlRender = `<h2>Votre panier est vide</h2>`;
    } else {
        for (let i = 0; i < localStorage.length; i++) {
            //Contenu HTML :

            let productId = JSON.parse(localStorage.getItem(localStorage.key(i))).idPdt;
            let color = JSON.parse(localStorage.getItem(localStorage.key(i))).color;
            let qty = JSON.parse(localStorage.getItem(localStorage.key(i))).qty;
            let name = JSON.parse(localStorage.getItem(localStorage.key(i))).name;
            let price = JSON.parse(localStorage.getItem(localStorage.key(i))).price;
            let imageUrl = JSON.parse(localStorage.getItem(localStorage.key(i))).imageUrl;
            let altTxt = JSON.parse(localStorage.getItem(localStorage.key(i))).altTxt;

            htmlContent = `
            <article class="cart__item" data-id="${productId}" data-color="${color}">
            <div class="cart__item__img">
                <img src="${imageUrl}" alt="${altTxt}">
            </div>
            <div class="cart__item__content">
                <div class="cart__item__content__description">
                <h2>${name}</h2>
                <p>${color}</p>
                <p>${price}€</p>
                </div>
                <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                    <p>Qté :</p>
                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${qty}">
                </div>
                <p class="errorMsg"></p>
                <div class="cart__item__content__settings__delete">
                    <p class="deleteItem">Supprimer</p>
                </div>
                </div>
            </div>
            </article>
        `;
            htmlRender += htmlContent;
        };
    }
    const itemsContainer = document.getElementById("cart__items"); //Récupère l'ID du container
    itemsContainer.innerHTML += htmlRender; //Concaténisation du nouveau contenu avec l'ancien.
}

//calcul du prix total
function calculatePrice() {
    let totalQty = 0;
    let totalPrice = 0;
    let priceContent = document.querySelectorAll('.cart__item div.cart__item__content__description');
    let inputQty = document.querySelectorAll('.itemQuantity');

    for (let i = 0; i < priceContent.length; i++) {
        let priceP = priceContent[i].lastElementChild.textContent;
        let newPriceP = priceP.substring(0, priceP.length - 1);
        let Qty = inputQty[i].value;
        totalQty = totalQty + parseInt(Qty);
        totalPrice = totalPrice + (parseInt(Qty) * parseInt(newPriceP))
    }
    document.getElementById("totalQuantity").innerText = totalQty;
    document.getElementById("totalPrice").innerText = totalPrice;
}

//function pour trouver l'index d'un produit dans localStorage 
//en fonction de son id et de sa couleur
function findIndexProduct(idPdt, color) {
    for (let i = 0; i < localStorage.length; i++) {
        let objLinea = localStorage.getItem(localStorage.key(i));
        let objJson = JSON.parse(objLinea);
        if (idPdt == objJson.idPdt && color == objJson.color) {
            return result = localStorage.key(i);
        }
    }
}

//update LocalStorage
function updatePdt(keyPdt, qty) {
    let existing = localStorage.getItem(keyPdt);
    existing = existing ? JSON.parse(existing) : {}; //opérateur (ternaire) conditionnel
    existing['qty'] = qty;
    localStorage.setItem(keyPdt, JSON.stringify(existing));
}


//changement de quantité
function changeQuantity() {
    let el = document.querySelectorAll('.cart__item');

    for (let i = 0; i < el.length; i++) {
        let myNode = el[i].closest("article");
        let dataId = myNode.getAttribute('data-id');
        let dataColor = myNode.getAttribute('data-color');
        let inputQty = document.querySelectorAll('.itemQuantity');
        let msgErr = document.querySelectorAll('.cart__item__content .errorMsg');
        el[i].addEventListener('change', () => {
            if (inputQty[i].value >= 1 && inputQty[i].value <= 100) { //Vérification de la quantité rentré par l'utilisateur
                msgErr[i].innerText = "";
                inputQty[i].style.border = "none";
                calculatePrice();
                updatePdt(findIndexProduct(dataId, dataColor), inputQty[i].value)
            } else {
                inputQty[i].focus();
                inputQty[i].style.border = "2px solid red";
                msgErr[i].className = 'errorMsg'
                msgErr[i].innerText = "Veuillez indiquer une quantité entre 1 et 100";
            }
        });
    }
}

//suppression produit 
function deleteProduct() {
    let deleteBtn = document.getElementsByClassName("deleteItem");
    Array.from(deleteBtn).forEach(child => {
        let myNode = child.closest("article");
        child.addEventListener('click', function () {
            let dataProduct = '[data-id="' + myNode.getAttribute('data-id') + '"][data-color="' + myNode.getAttribute('data-color') + '"]';
            let objDelete = child.closest(dataProduct);
            localStorage.removeItem(findIndexProduct(myNode.getAttribute('data-id'), myNode.getAttribute('data-color')));
            objDelete.remove();
            calculatePrice();
        });
    });
}

//Création du tableau product pour l'api
function createProductArray() {
    let products = [];
    for (let i = 0; i < localStorage.length; i++) {
        products[i] = JSON.parse(localStorage.getItem(localStorage.key(i))).idPdt;
    }
    return products;
}

//Validation des données
function validateEmail(email) {
    regex = /^[a-zA-Z-_]+@[a-zA-Z-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
}

function validateAddress(address) {
    regex = /^(([a-zA-ZÀ-ÿ0-9]+[\s\-]{1}[a-zA-ZÀ-ÿ0-9]+)){1,10}$/;
    return regex.test(address);
}

function validateCity(city) {
    regex = /^(([a-zA-ZÀ-ÿ]+[\s\-]{1}[a-zA-ZÀ-ÿ]+)|([a-zA-ZÀ-ÿ]+)){1,3}$/;
    return regex.test(city);
}

function validateName(name) {
    regex = /^[a-zA-ZÀ-ÿ]+$/;
    return regex.test(name);
}

//Erreur sous le bouton commandé : "panier vide / Erreur de saisie dans le formulaire"
const errSubmit = document.querySelector(".cart__order__form > p:last-child");

function validateDataUser() { //Vérification à chaque changement d'un des champs du formulaire
    const input = document.querySelectorAll('div.cart__order__form__question > input');
    //Erreur sous l'input concerné
    const error = document.querySelectorAll('div.cart__order__form__question > p');
    for (let i = 0; i < input.length; i++) {
        input[i].addEventListener('change', () => {
            let id = input[i].getAttribute("id");
            error[i].className = 'errorMsg';
            switch (id) {
                case 'firstName':
                    if (validateName(input[i].value) == true) {
                        error[i].innerText = "";
                    } else {
                        error[i].innerText = "Veuillez rentrer un prénom sans chiffres ni caractères spéciaux";
                    }
                    break;
                case 'lastName':
                    if (validateName(input[i].value) == true) {
                        error[i].innerText = "";
                    } else {
                        error[i].innerText = "Veuillez rentrer un nom sans chiffres ni caractères spéciaux";
                    }
                    break;
                case 'address':
                    if (validateAddress(input[i].value) == true) {
                        error[i].innerText = "";
                    } else {
                        error[i].innerText = "Veuillez rentrer une adresse correcte sans caractères spéciaux";
                    }
                    break;
                case 'city':
                    if (validateCity(input[i].value) == true) {
                        error[i].innerText = "";
                    } else {
                        error[i].innerText = "Veuillez rentrer le nom d'une ville correcte sans chiffres ni caractères spéciaux";
                    }
                    break;
                case 'email':
                    if (validateEmail(input[i].value) == true) {
                        error[i].innerText = "";
                    } else {
                        error[i].innerText = "Veuillez rentrer une adresse email valide";
                    }
                    break;
            }
            errSubmit.innerText = "";
        });
    }
}//fin de la fonction validateDataUser

//Envoie des données à l'api
function send(e) {

    let products = createProductArray();
    let contact = new Object({ //Récupération des données entrées par l'utilisateur
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        email: document.getElementById('email').value,
    });
    if((localStorage.length != 0)){//Vérification si le panier est vide
        if (//Vérification de "contact"
            (validateName(contact.firstName) == true) &
            (validateName(contact.lastName) == true) &
            (validateAddress(contact.address) == true) &
            (validateCity(contact.city) == true) &
            (validateEmail(contact.email) == true)
        ){

            e.preventDefault();//Permet de ne pas executer le comportement par défaut
            fetch("http://localhost:3000/api/products/order", {
                method: "POST",
                headers: {//Définit les données qu'on envoie
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ contact: contact, products: products })//Conversion en JSON
            })
                .then(function (res) {
                    if (res.ok) {
                        return res.json();
                    }
                })
                .then(function (value) {
                    linkOrder = "./confirmation.html?orderId=" + value.orderId;
                    document.location.href = linkOrder;
                }).catch(function (err) {
                    // Une erreur est survenue
                    console.log("erreur requête")
                });
        } else {
            errSubmit.className = 'errorMsg';
            errSubmit.innerText = "Veuillez renseigner correctement le formulaire.";
        }
    }else{
        errSubmit.className = 'errorMsg';
        errSubmit.innerText = "Votre panier est vide.";
    }
    
} //Fin de la fonction send

renderItem();
calculatePrice();
changeQuantity();
deleteProduct();
validateDataUser();

document
    .getElementById("order")
    .addEventListener("click", send);

