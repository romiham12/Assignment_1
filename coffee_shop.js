// Calculate an order's price after applying the assignment's validation and discounts.
function calculatePrice(size, quantity, isMember, hour) {
	if (!["small", "medium", "large"].includes(size)) {
		return "Invalid size";
	}
	if (!Number.isInteger(quantity) || quantity <= 0) {
		return "Invalid quantity";
	}
	if (!Number.isInteger(hour) || hour < 0 || hour > 23) {
		return "Invalid hour";
	}

	let pricePerCup;
	switch (size) {
		case "small":
			pricePerCup = 2.5;
			break;
		case "medium":
			pricePerCup = 3.5;
			break;
		case "large":
			pricePerCup = 4.5;
			break;
	}

	let total = pricePerCup * quantity;
	if (quantity >= 5) {
		total -= total * 0.1;
	}
	if (isMember) {
		total -= total * 0.05;
	}
	if (hour >= 15 && hour <= 17) {
		total -= 1;
	}

	return Math.round(Math.max(0, total) * 100) / 100;
}

// Print the price for each order quantity from one through ten.
function printPriceTable(size, isMember, hour) {
	for (let quantity = 1; quantity <= 10; quantity += 1) {
		const price = calculatePrice(size, quantity, isMember, hour);
		console.log(`Qty ${quantity} -> $${price.toFixed(2)}`);
	}
}

// Find the earliest hour that produces the lowest valid order price.
function cheapestHour(size, quantity, isMember) {
	let bestHour = 0;
	let lowestPrice = Infinity;

	for (let hour = 0; hour <= 23; hour += 1) {
		const price = calculatePrice(size, quantity, isMember, hour);
		if (typeof price === "number" && price < lowestPrice) {
			lowestPrice = price;
			bestHour = hour;
		}
	}

	return bestHour;
}

console.log("Q1 calculatePrice large, 2, non-member, 10:", calculatePrice("large", 2, false, 10));
console.log("Q1 calculatePrice medium, 5, member, 16:", calculatePrice("medium", 5, true, 16));
console.log("Q1 calculatePrice small, 4, member, 9:", calculatePrice("small", 4, true, 9));
console.log("Q1 calculatePrice small, 1, non-member, 15:", calculatePrice("small", 1, false, 15));
console.log("Q1 calculatePrice invalid size:", calculatePrice("xl", 1, false, 9));
console.log("Q1 calculatePrice invalid quantity:", calculatePrice("large", 0, false, 9));
console.log("Q1 calculatePrice invalid hour:", calculatePrice("medium", 2, true, 25));
console.log("Q1 extra test, bulk discount:", calculatePrice("small", 5, false, 14));
console.log("Q1 extra test, fractional quantity:", calculatePrice("small", 2.5, false, 10));

console.log("Q1 medium price table (non-member, hour 16):");
printPriceTable("medium", false, 16);

const bestHour = cheapestHour("large", 3, false);
const bestPrice = calculatePrice("large", 3, false, bestHour);
console.log(`Q1 best deal: The best time to order 3 large coffees is at ${String(bestHour).padStart(2, "0")}:00 for $${bestPrice.toFixed(2)}.`);