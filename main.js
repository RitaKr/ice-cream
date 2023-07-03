const priceList = {
	toppings: [
		{
			name: "no topping",
			img: "images/chocolate-topping.png",
			transparent: true,
			price: 0,
		},
		{
			name: "Chocolate topping",
			img: "images/chocolate-topping.png",
			price: 10,
		},
		{ name: "Caramel topping", img: "images/caramel-topping.png", price: 10 },
		{
			name: "Strawberry topping",
			img: "images/strawberry-topping.png",
			price: 10,
		},
	],

	balls: [
		{ name: "Vanilla ball", img: "images/vanilla-ball.png", price: 25 },
		{ name: "Chocolate ball", img: "images/chocolate-ball.png", price: 30 },

		{
			name: "Stracciatella ball",
			img: "images/stracciatella-ball.png",
			price: 35,
		},
		{
			name: "Choco-white mix ball",
			img: "images/choco-white-ball.png",
			price: 35,
		},
		{ name: "Strawberry ball", img: "images/strawberry-ball.png", price: 30 },
		{ name: "Pistachio ball", img: "images/pistachio-ball.png", price: 40 },
		{ name: "Mango ball", img: "images/mango-ball.png", price: 40 },
	],
	cones: [
		{ name: "Regular cone", img: "images/regular-cone.png", price: 15 },
		{ name: "Chocolate cone", img: "images/chocolate-cone.png", price: 18 },
		{ name: "Paper cup", img: "images/paper-cone.png", price: 10 },
	],
};
let ballsCount = 1;
let selectedIceCream = {
	toppingId: 0,
	ballId1: 0,
	coneId: 0,
};
let scrollWidth = 150;
const toppingsContainer = document.getElementById("toppings");
const ballsContainer = document.getElementById("balls1");
const conesContainer = document.getElementById("cones");
function appendAllToppings() {
	toppingsContainer.innerHTML = "";
	priceList.toppings.forEach((topping) => {
		let toppingImg;
		toppingImg = document.createElement("img");
		toppingImg.setAttribute("src", topping.img);
		if ("transparent" in topping) {
			toppingImg.style.visibility = "hidden";
		} else {
		}

		toppingImg.classList.add("topping");
		toppingsContainer.append(toppingImg);
	});
}
function appendAllBalls() {
	ballsContainer.innerHTML = "";
	priceList.balls.forEach((ball) => {
		const ballImg = document.createElement("img");
		ballImg.setAttribute("src", ball.img);
		ballImg.classList.add("ball");
		ballsContainer.append(ballImg);
	});
}

function appendAllCones() {
	conesContainer.innerHTML = "";
	priceList.cones.forEach((cone) => {
		const coneImg = document.createElement("img");
		coneImg.setAttribute("src", cone.img);
		coneImg.classList.add("cone");
		conesContainer.append(coneImg);
	});
}

function calculateTotalPrice() {
	let total = 0;
	for (property in selectedIceCream) {
		let originalItem = property.slice(0, property.length - 1) + "Id";
		if (property.includes("ball")) originalItem = "balls";
		else originalItem = property.slice(0, property.length - 2) + "s";

		console.log(originalItem);
		let item = priceList[originalItem][selectedIceCream[property]];
		console.log(item);
		total += item.price;
	}
	document.getElementById("totalPrice").innerHTML =
		"Total price: " + total + " UAH";
}
function scrollToLeft(id, container) {
	console.log(id, container);
	if (selectedIceCream[id] > 0) selectedIceCream[id]--;
	container.scrollBy({
		left: -scrollWidth,
		behavior: "smooth",
	});
	calculateTotalPrice();
}

function scrollRight(id, container) {
	console.log(id, container);
	if (
		(selectedIceCream[id] < priceList.balls.length - 1 &&
			id.includes("ball")) ||
		(selectedIceCream[id] < priceList.cones.length - 1 &&
			id.includes("cone")) ||
		(selectedIceCream[id] < priceList.toppings.length - 1 &&
			id.includes("topping"))
	)
		selectedIceCream[id]++;
	container.scrollBy({
		left: scrollWidth,
		behavior: "smooth",
	});
	calculateTotalPrice();
}
function scrollWithSwipe(id, container) {
	let startX = 0;
	let startY = 0;
	let endX = 0;
	const minSwipeDistance = 30;

	container.addEventListener("touchstart", function (event) {
		//console.log(event)
		startX = event.touches[0].clientX;
		startY = event.touches[0].clientY;
	});

	container.addEventListener("touchend", function (event) {
		const highestBall = document.getElementById("balls" + ballsCount);
		const highestBallBounds = highestBall.getBoundingClientRect();
		//console.log(event)
		endX = event.changedTouches[0].clientX;
		const deltaX = endX - startX;
		console.log(startY);
		console.log(highestBallBounds);
		if (deltaX < -minSwipeDistance) {
			// Left swipe
			console.log("Swiped left");
			if (
				startY > highestBallBounds.top + 40 &&
				startY < highestBallBounds.top + highestBallBounds.height
			)
				scrollRight("ballId" + ballsCount, highestBall);
			else scrollRight(id, container);
		} else if (deltaX > minSwipeDistance) {
			console.log("Swiped right");
			if (
				startY > highestBallBounds.top + 40 &&
				startY < highestBallBounds.top + highestBallBounds.height
			)
				scrollToLeft("ballId" + ballsCount, highestBall);
			else scrollToLeft(id, container);
		}
	});
}

function deleteBall(parentNode) {
	delete selectedIceCream["ballId" + parentNode.dataset.ballCount];
	calculateTotalPrice();
    ballsCount--;
	parentNode.remove();
}
window.onload = () => {
	const leftToppingArrow = document.getElementById("toLeftTopping");
	const rightToppingArrow = document.getElementById("toRightTopping");
	const leftConeArrow = document.getElementById("toLeftCone");
	const rightConeArrow = document.getElementById("toRightCone");
	appendAllToppings();
	appendAllBalls();
	appendAllCones();
	calculateTotalPrice();
	document.getElementById("addBallBtn").addEventListener("click", () => {
		const ballsContainer = document
			.getElementById("ballsContainer1")
			.cloneNode(true);
		ballsCount++;
		ballsContainer.dataset.ballCount = ballsCount;
		ballsContainer.innerHTML +=
			'<button class="delete-btn" onclick="deleteBall(this.parentNode)">x</button>';
		document.getElementById("ballsContainer1").before(ballsContainer);
		ballsContainer.querySelector(".balls-container").id = "balls" + ballsCount;
		let id = "ballId" + ballsCount;
		scrollWithSwipe(id, ballsContainer);
		selectedIceCream[id] = 0;
		calculateTotalPrice();
		console.log(selectedIceCream);
	});
	scrollWithSwipe("ballId1", ballsContainer);
	scrollWithSwipe("coneId", conesContainer);
	scrollWithSwipe("toppingId", toppingsContainer);

	// rightToppingArrow.addEventListener("click", () => {
	// 	if (selectedIceCream.toppingId < priceList.toppings.length - 1)
	// 		selectedIceCream.toppingId++;
	// 	toppingsContainer.scrollBy({
	// 		left: scrollWidth ,
	// 		behavior: "smooth",
	// 	});
	// 	calculateTotalPrice();
	// });
	// leftToppingArrow.addEventListener("click", () => {
	// 	if (selectedIceCream.toppingId > 0) selectedIceCream.toppingId--;
	// 	toppingsContainer.scrollBy({
	// 		left: -scrollWidth ,
	// 		behavior: "smooth",
	// 	});
	// 	calculateTotalPrice();
	// });
	// rightConeArrow.addEventListener("click", () => {
	// 	if (selectedIceCream.coneId < priceList.cones.length - 1)
	// 		selectedIceCream.coneId++;
	// 	conesContainer.scrollBy({
	// 		left: scrollWidth ,
	// 		behavior: "smooth",
	// 	});
	// 	calculateTotalPrice();
	// });
	// leftConeArrow.addEventListener("click", () => {
	// 	if (selectedIceCream.coneId > 0) selectedIceCream.coneId--;
	// 	conesContainer.scrollBy({
	// 		left: -scrollWidth ,
	// 		behavior: "smooth",
	// 	});
	// 	calculateTotalPrice();
	// });
};
