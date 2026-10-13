const orders = [
	{ id: 1, customer: "Rami",  items: ["latte", "croissant"],          total: 7.5 },
	{ id: 2, customer: "Lea",   items: ["espresso"],                    total: 3.0 },
	{ id: 3, customer: "Rami",  items: ["latte", "muffin"],             total: 8.0 },
	{ id: 4, customer: "Karim", items: ["mocha", "croissant"],          total: 9.0 },
	{ id: 5, customer: "Lea",   items: ["latte"],                       total: 4.5 },
	{ id: 6, customer: "Nour",  items: ["espresso", "latte", "muffin"], total: 10.5 },
];

const mondayCustomers  = ["Rami", "Lea", "Karim", "Nour"];
const tuesdayCustomers = ["Lea", "Nour", "Tony", "Rami", "Lea"];

// Add and return the total revenue from all orders.
function getTotalRevenue(orders) {
	// Sum each order's total without changing the orders array.
	return orders.reduce((total, order) => total + order.total, 0);
}

// Return orders whose totals meet the minimum amount.
function getBigOrders(orders, min) {
	// Keep only orders at or above the requested minimum.
	return orders.filter((order) => order.total >= min);
}

// Format each order as a readable one-line summary.
function getOrderSummaries(orders) {
	// Convert each order object into its display string.
	return orders.map(
		(order) => `#${order.id} ${order.customer} - ${order.items.length} item(s) - $${order.total.toFixed(2)}`
	);
}

// Return a copied array sorted from highest total to lowest.
function getSortedByTotal(orders) {
	// Compare totals on the copied array so the original remains unchanged.
	return [...orders].sort((orderA, orderB) => orderB.total - orderA.total);
}

// Return the IDs of orders that contain the requested item.
function findOrdersByItem(orders, item) {
	// Select matching orders before extracting their IDs.
	return orders
		.filter((order) => order.items.includes(item))
		.map((order) => order.id);
}

// Count each ordered item and return the counts by item name.
function countItems(orders) {
	const itemCounts = {};

	// Visit every order and increment a count for each item in it.
	orders.forEach((order) => {
		// Count every occurrence of this item in the current order.
		order.items.forEach((item) => {
			itemCounts[item] = (itemCounts[item] || 0) + 1;
		});
	});

	return itemCounts;
}

// Return the name of the most frequently ordered item.
function getMostPopularItem(orders) {
	// Find the item with the greatest count.
	return Object.entries(countItems(orders)).reduce(
		(mostPopular, [item, count]) =>
			count > mostPopular.count ? { item, count } : mostPopular,
		{ item: null, count: 0 }
	).item;
}

// Add each order total to its customer's spending total.
function getSpendingPerCustomer(orders) {
	const spending = {};

	// Accumulate each order under its customer's name.
	orders.forEach((order) => {
		spending[order.customer] = (spending[order.customer] || 0) + order.total;
	});

	return spending;
}

// Return customer names once each, in their original order.
function getUniqueCustomers(orders) {
	// Extract names and let Set remove duplicates.
	return [...new Set(orders.map((order) => order.customer))];
}

// Return every distinct item name in first-seen order.
function getAllItems(orders) {
	// Flatten item lists and use Set to remove duplicates.
	return [...new Set(orders.flatMap((order) => order.items))];
}

// Return customers present in both visit sets.
function bothDays(setA, setB) {
	// Keep customers from the first set that also appear in the second.
	return [...setA].filter((customer) => setB.has(customer));
}

// Return customers present only in the first visit set.
function onlyFirstDay(setA, setB) {
	// Keep customers from the first set that are absent from the second.
	return [...setA].filter((customer) => !setB.has(customer));
}

// Return all customers from both sets without duplicates.
function allCustomers(setA, setB) {
	return [...new Set([...setA, ...setB])];
}

const mondaySet = new Set(mondayCustomers);
const tuesdaySet = new Set(tuesdayCustomers);

console.log("Total revenue:", getTotalRevenue(orders));
console.log("Big orders (min 8):", getBigOrders(orders, 8));
console.log("Order summaries:", getOrderSummaries(orders));
console.log("Sorted by total:", getSortedByTotal(orders));
console.log("Orders containing muffin:", findOrdersByItem(orders, "muffin"));
console.log("Item counts:", countItems(orders));
console.log("Most popular item:", getMostPopularItem(orders));
console.log("Spending per customer:", getSpendingPerCustomer(orders));
console.log("Unique customers:", getUniqueCustomers(orders));
console.log("All distinct items:", getAllItems(orders));
console.log("Customers who came both days:", bothDays(mondaySet, tuesdaySet));
console.log("Customers who came only Monday:", onlyFirstDay(mondaySet, tuesdaySet));
console.log("Customers who came either day:", allCustomers(mondaySet, tuesdaySet));
// Lea appears twice in the Tuesday array, but a Set stores each customer only once.
console.log("Distinct Tuesday customers:", tuesdaySet.size);
console.log("Q2 extra test, revenue for no orders:", getTotalRevenue([]));
console.log("Q2 extra test, no tea orders:", findOrdersByItem(orders, "tea"));
