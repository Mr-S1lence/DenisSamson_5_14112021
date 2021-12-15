//Méthode qui permet d'appeler l'api retournant l'ensemble des produits
async function getItems() {
  try {
    let response = await fetch("http://localhost:3000/api/products")
    return await response.json();
  } catch (error) {
    console.log("Error : " + error);
  }
}

//Function qui permet d'afficher les éléments dans le html
(async function renderItem() {
  let items = await getItems(); //Appel de la première fonction qui renvoie une promesse.
  let htmlRender = ""; //Initialisation d'une variable représentant le rendu final.
  if (items === undefined) { //Affichage d'une erreur si problème de connexion avec l'api.
    htmlRender = `
        <h2">Erreur de connexion avec le serveur, veuillez réessayer plus tard</h2>
      `;
  } else {
    items.forEach(element => { //On boucle sur les éléments
      //Contenu HTML :
      let htmlContent = `
          <a href="./product.html?productId=${element._id}">
            <article>
              <img src="${element.imageUrl}" alt="${element.altTxt}">
              <h3 class="productName">${element.name}</h3>
              <p class="productDescription">${element.description}</p>
            </article>
          </a>
        `;
      htmlRender += htmlContent;
    });
  }

  const itemsContainer = document.getElementById("items"); //Récupère l'ID du container
  itemsContainer.innerHTML += htmlRender; //Concaténisation du nouveau contenu avec l'ancien.
})();



