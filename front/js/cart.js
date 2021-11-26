const createProductCard = async () => {
    return new Promise((resolve,reject)=>{
        let numberOfProductInCart = localStorage.length;
        let result = false;
    console.log("nombre de produits : " + numberOfProductInCart);
    console.log(localStorage);
        for (let i = 0; i < localStorage.length; i++) {
                    console.log("boucle n°" + i);
            let productId = JSON.parse(localStorage.getItem("pdt" + i)).idPdt;
            let color = JSON.parse(localStorage.getItem("pdt" + i)).color;
            /*         console.log("IdPdt : " + productId); */
    
            fetch("http://localhost:3000/api/products/" + productId) /* On envoie une requête de type GET à l'API */
                .then(function (res) {
                    if (res.ok) { /* On vérifie si la requête est bien passée */
    
                        return res.json(); /* Ce résultat json est une Promise, nous le retournons et récupérons sa vrai valeur dans la fonction then() suivante */
                    }
                })
                .then(function (value) {
                    /*       console.log(value) */
    
                    let art = document.createElement("article");
                    art.className = 'cart__item';
                    art.setAttribute("data-id", productId);
                    art.setAttribute("data-color", color);
    
                    let div1 = document.createElement("div");
                    let div2 = document.createElement("div");
    
                    div1.className = 'cart__item__img';
                    let img = document.createElement("img");
                    img.setAttribute("src", `${value.imageUrl}`);
                    img.setAttribute("alt", `${value.altTxt}`);
    
                    div2.className = 'cart__item__content';
                    let div3 = document.createElement("div");
                    div3.className = 'cart__item__content__description';
                    let h2 = document.createElement("h2");
                    h2.innerText = value.name;
                    let p1 = document.createElement("p");
                    p1.innerText = color;
    
                    let p2 = document.createElement("p");
                    p2.innerText = value.price + "€";
    
                    let div4 = document.createElement("div");
                    div4.className = 'cart__item__content__settings';
                    let div5 = document.createElement("div");
                    div5.className = 'cart__item__content__settings__quantity';
                    let p3 = document.createElement("p");
                    p3.innerText = "Qté : ";
                    let input = document.createElement("input");
                    input.setAttribute("type", "number");
                    input.className = 'itemQuantity';
                    input.setAttribute("name", "itemQuantity");
                    input.setAttribute("min", "1");
                    input.setAttribute("max", "100");
                    input.setAttribute("value", JSON.parse(localStorage.getItem("pdt" + i)).qty);
                    let div6 = document.createElement("div");
                    div6.className = 'cart__item__content__settings__delete';
                    let p4 = document.createElement("p");
                    p4.className = 'deleteItem';
                    p4.innerText = "Supprimer";
    
                    let msgErr = document.createElement("span");
                    msgErr.className = 'msgErr';
                    msgErr.style.color = "red";
                    msgErr.style.background = "white";
                    
                    art.appendChild(div1);
                    art.appendChild(div2);
                    div1.appendChild(img);
                    div2.appendChild(div3);
                    div2.appendChild(div4);
                    div3.appendChild(h2);
                    div3.appendChild(p1);
                    div3.appendChild(p2);
                    div4.appendChild(div5);
                    div4.appendChild(msgErr);
                    div4.appendChild(div6);
                    div5.appendChild(p3);
                    div5.appendChild(input);
                    div6.appendChild(p4);
    
                    document
                        .getElementById("cart__items")
                        .appendChild(art);
    
                })//Fin de then()
                .catch(function (err) {
                    // Une erreur est survenue
                    console.log("erreur requête", err)
                    // todo : Mettre un msg d'erreur pour l'utilisateur
                });
    
                if(localStorage.length != 0){
                    if(i == (localStorage.length - 1)){
                        console.log("createProductCard over")
                        result = true;
                        resolve();
                    }else{
                        console.log(result);
                    }
                }else{
                    console.log("aucun produit dans le panier");
                    result = true;
                    resolve();
                }
        }//Fin de la boucle
        
/*         return result; */
    });
}//Fin function createProductCard

//calcul du prix total
async function calculatePrice() {
    let totalQty = 0;
    let totalPrice1 = 0;
    let priceContent = document.querySelectorAll('.cart__item div.cart__item__content__description');
    let inputQty = document.querySelectorAll('.itemQuantity');

    for (let i = 0; i < priceContent.length; i++) {
        let priceP = priceContent[i].lastElementChild.textContent;
        let newPriceP = priceP.substring(0, priceP.length - 1);
        let Qty = inputQty[i].value;
        totalQty = totalQty + parseInt(Qty);
        totalPrice1 = totalPrice1 + (parseInt(Qty) * parseInt(newPriceP))
    }
    document.getElementById("totalQuantity").innerText = totalQty;
    document.getElementById("totalPrice").innerText = totalPrice1;
}

//update LocalStorage
function addPdt(indexPdt, idPdt, color, qty) {
    let objJson = {
        idPdt: idPdt,
        color: color,
        qty: qty
    }
    let objLinea = JSON.stringify(objJson);
    localStorage.setItem("pdt" + indexPdt, objLinea);
}

//changement de quantité
function changeQuantity() {
    let el = document.querySelectorAll('.cart__item');
    for (let i = 0; i < el.length; i++) {
        let myNode = el[i].closest("article");
        let dataId = myNode.getAttribute('data-id');
        let dataColor = myNode.getAttribute('data-color');
        let inputQty = document.querySelectorAll('.itemQuantity');
        let objLinea = localStorage.getItem("pdt" + i);
        let objJson = JSON.parse(objLinea);
        let msgErr = document.querySelectorAll('.msgErr');
        el[i].addEventListener('change', (event) => { 
            if(inputQty[i].value >= 1 && inputQty[i].value <=100){ //Vérification de la quantité rentré par l'utilisateur
                msgErr[i].innerText = "";
                inputQty[i].style.border = "none";
                calculatePrice();
                if (dataId == objJson.idPdt & dataColor == objJson.color) {
                    addPdt([i], dataId, dataColor, inputQty[i].value)
                    console.log(localStorage);
                }
            }else{
                      inputQty[i].focus();
                      inputQty[i].style.border = "1px solid red";
                      msgErr[i].innerText = "Veuillez indiquer une quantité entre 1 et 100";
            }
        });
    }
}

console.log("test");
console.log(localStorage.getItem(localStorage.key(3)));

//function pour trouver l'index d'un produit dans localStorage 
//en fonction de son id et de sa couleur
function findIndexProduct(idPdt, color){
    console.log("idPdt en entré : " + idPdt);
    console.log("color en entré : " + color);
    for (let i = 0; i < localStorage.length; i++) {
        console.log("recherche n°" + i )
        let objLinea = localStorage.getItem(localStorage.key(i));
        let objJson = JSON.parse(objLinea);
        console.log(objJson.idPdt)
        console.log(objJson.color)
        if(idPdt == objJson.idPdt && color == objJson.color){
            return result = localStorage.key(i);
        }
    }   
}

//suppression produit 
function deleteProduct() {
    let deleteBtn = document.getElementsByClassName("deleteItem");
    Array.from(deleteBtn).forEach(child => {
        let myNode = child.closest("article");
        deleteBtn = document.getElementsByClassName("deleteItem");
        child.addEventListener('click', function (e) {
            let dataId = myNode.getAttribute('data-id');
            let dataColor = myNode.getAttribute('data-color');
            let dataProduct = '[data-id="' + myNode.getAttribute('data-id') + '"][data-color="' + myNode.getAttribute('data-color') + '"]';
            let objDelete = child.closest(dataProduct);
            console.log("index du produit à supprimer :" + findIndexProduct(myNode.getAttribute('data-id'),myNode.getAttribute('data-color')));
            localStorage.removeItem(findIndexProduct(myNode.getAttribute('data-id'),myNode.getAttribute('data-color')));
            calculatePrice();
            console.log(localStorage);
            objDelete.remove();
            setTimeout(() => {
                calculatePrice();                
            }, 500);
        });
    });
}

//vérification données contact









const main = async () => {
    await createProductCard();

    setTimeout(() => {
        calculatePrice(); 
        changeQuantity()
        deleteProduct();
    }, 500);
}

main()
