/* cette fonction permet de recupérer les produits depuis le serveur */
async function getItems() {
	try {
		let response = await fetch("http://localhost:3000/api/products");
		return await response.json();
	} catch (error) {
		console.log("Error : " + error);
          // todo : Mettre un msg d'erreur pour l'utilisateur
	}
}

// Affichage du rendu dans le document  HTML
(async function renderItems() {
	let items = await getItems();
	let htmlRender = "";
	items.forEach((item) => {
		let htmlContent = `
		<a href="./product.html?productId=${item._id}">
			<article>
				<img src="${item.imageUrl}" alt="${item.altTxt}">
				<h3 class="productName">${item.name}</h3>
				<p class="productDescription">${item.description}</p>
			</article>
		</a>
		`;
		htmlRender += htmlContent;
	});
	const itemContainer = document.getElementById("items");
	itemContainer.innerHTML += htmlRender;
})();
