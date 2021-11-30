fetch("http://localhost:3000/api/products") /* On envoie une requête de type GET à l'API */
  .then(function (res) {
    if (res.ok) { /* On vérifie si la requête est bien passée */

      return res.json(); /* Ce résultat json est une Promise, nous le retournons et récupérons sa vrai valeur dans la fonction then() suivante */
    }
  })
  .then(function (value) {

    const numberOfProducts = value.length;



    for (let i = 0; i < numberOfProducts; i++) {

      let a = document.createElement("a");
      let art = document.createElement("article");
      let img = document.createElement("img");
      let name = document.createElement("h3");
      let description = document.createElement("p");

      a.setAttribute("href", `product.html?productId=${value[i]._id}`);
      a.appendChild(art);

      art.appendChild(img);
      art.appendChild(name);
      art.appendChild(description);

      img.setAttribute("src", `${value[i].imageUrl}`);
      img.setAttribute("alt", `${value[i].altTxt}`);

      name.classList.add('productName');
      name.innerText = value[i].name;

      description.classList.add('productDescription');
      description.innerText = value[i].description;

      document
        .getElementById("items")
        .appendChild(a);

    } //Fin de la boucle
  })


  .catch(function (err) {
    // Une erreur est survenue
    console.log("erreur requête")
    // todo : Mettre un msg d'erreur pour l'utilisateur
  });