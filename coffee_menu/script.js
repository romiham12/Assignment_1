const menu = [
	{ name: "Espresso", price: 3.0 },
	{ name: "Latte",    price: 4.5 },
	{ name: "Mocha",    price: 5.0 },
	{ name: "Muffin",   price: 2.5 },
];
let cart = [];

const menuList = document.querySelector("#menu-list");
const cartList = document.querySelector("#cart-list");
const cartCount = document.querySelector("#cart-count");
const cartTotal = document.querySelector("#cart-total");
const rewardMessage = document.querySelector("#reward-msg");
const itemForm = document.querySelector("#item-form");
const itemNameInput = document.querySelector("#item-name");
const itemPriceInput = document.querySelector("#item-price");
const errorMessage = document.querySelector("#error-msg");

// Format a numeric price with a dollar sign and two decimal places.
function formatPrice(price) {
	return `$${price.toFixed(2)}`;
}

// Render every menu item as a list row with an Add button.
function renderMenu() {
	menuList.textContent = "";

	// Build one menu row for each item.
	menu.forEach((item, index) => {
		const listItem = document.createElement("li");
		listItem.className = "item-row";

		const itemCopy = document.createElement("span");
		itemCopy.className = "item-copy";
		itemCopy.textContent = `${item.name} \u2014 ${formatPrice(item.price)}`;

		const addButton = document.createElement("button");
		addButton.type = "button";
		addButton.className = "primary-button";
		addButton.dataset.index = index;
		addButton.textContent = "Add";

		listItem.appendChild(itemCopy);
		listItem.appendChild(addButton);
		menuList.appendChild(listItem);
	});
}

// Recalculate the cart total and toggle the reward styling and message.
function updateTotal() {
	// Multiply each unit price by its quantity and add the subtotals.
	const total = cart.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0
	);

	cartTotal.textContent = `Total: ${formatPrice(total)}`;

	if (total > 15) {
		cartTotal.style.color = "red";
		rewardMessage.classList.remove("hidden");
	} else {
		cartTotal.style.color = "";
		rewardMessage.classList.add("hidden");
	}
}

// Render cart quantities, the item count, and the empty-cart state.
function renderCart() {
	cartList.textContent = "";
	// Count units rather than distinct rows in the cart.
	cartCount.textContent = cart.reduce((count, item) => count + item.quantity, 0);

	if (cart.length === 0) {
		const emptyMessage = document.createElement("li");
		emptyMessage.className = "empty-message";
		emptyMessage.textContent = "Your cart is empty.";
		cartList.appendChild(emptyMessage);
	} else {
		// Build one row and quantity controls for each distinct cart item.
		cart.forEach((item, index) => {
			const listItem = document.createElement("li");
			listItem.className = "item-row cart-entry";

			const itemCopy = document.createElement("span");
			itemCopy.className = "item-copy cart-entry-copy";
			itemCopy.textContent = `${item.name} \u00D7${item.quantity} \u2014 ${formatPrice(item.price * item.quantity)}`;

			const controls = document.createElement("span");
			controls.className = "quantity-controls";

			const decreaseButton = document.createElement("button");
			decreaseButton.type = "button";
			decreaseButton.className = "quantity-button";
			decreaseButton.dataset.action = "decrease";
			decreaseButton.dataset.index = index;
			decreaseButton.setAttribute("aria-label", `Remove one ${item.name}`);
			decreaseButton.textContent = "-";

			const quantity = document.createElement("span");
			quantity.className = "quantity-value";
			quantity.textContent = item.quantity;
			quantity.setAttribute("aria-label", "Quantity");

			const increaseButton = document.createElement("button");
			increaseButton.type = "button";
			increaseButton.className = "quantity-button";
			increaseButton.dataset.action = "increase";
			increaseButton.dataset.index = index;
			increaseButton.setAttribute("aria-label", `Add one ${item.name}`);
			increaseButton.textContent = "+";

			controls.appendChild(decreaseButton);
			controls.appendChild(quantity);
			controls.appendChild(increaseButton);
			listItem.appendChild(itemCopy);
			listItem.appendChild(controls);
			cartList.appendChild(listItem);
		});
	}

	updateTotal();
}

// Add a selected menu item, increasing its quantity if it is already in the cart.
menuList.addEventListener("click", (event) => {
	const addButton = event.target.closest("button");

	if (!addButton || !menuList.contains(addButton)) {
		return;
	}

	const item = menu[Number(addButton.dataset.index)];
	const cartItem = cart.find((entry) => entry.name === item.name);

	if (cartItem) {
		cartItem.quantity += 1;
	} else {
		cart.push({ ...item, quantity: 1 });
	}

	renderCart();
});

// Handle cart quantity changes with one delegated click listener.
cartList.addEventListener("click", (event) => {
	const button = event.target.closest("button");

	if (!button || !cartList.contains(button)) {
		return;
	}

	const index = Number(button.dataset.index);
	const item = cart[index];

	if (button.dataset.action === "increase") {
		item.quantity += 1;
	} else if (button.dataset.action === "decrease") {
		item.quantity -= 1;

		if (item.quantity === 0) {
			cart.splice(index, 1);
		}
	}

	renderCart();
});

// Validate and add a custom menu item without inserting user text as HTML.
itemForm.addEventListener("submit", (event) => {
	event.preventDefault();

	const name = itemNameInput.value.trim();
	const priceText = itemPriceInput.value.trim();
	const price = Number(priceText);

	if (name === "") {
		errorMessage.textContent = "Name is required.";
		return;
	}

	if (priceText === "" || !Number.isFinite(price) || price <= 0) {
		errorMessage.textContent = "Price must be a positive number.";
		return;
	}

	// Compare names without regard to letter case.
	const duplicate = menu.some(
		(item) => item.name.toLowerCase() === name.toLowerCase()
	);

	if (duplicate) {
		errorMessage.textContent = "This item is already on the menu.";
		return;
	}

	menu.push({ name, price });
	renderMenu();
	itemForm.reset();
	errorMessage.textContent = "";
});

// Empty the cart and refresh its count, total, reward, and empty message.
document.querySelector("#clear-cart").addEventListener("click", () => {
	cart = [];
	renderCart();
});

renderMenu();
renderCart();
