// --- Get saved data or defaults ---
let number = Number(localStorage.getItem("savedNumber")) || 1;
let order = JSON.parse(localStorage.getItem("drinkOrder")) || {
    volume: null,
    container: null,
    flavors: []
};

// --- Elements (page-specific checks) ---
const numberDisplay = document.getElementById("number");
const increaseBtn = document.getElementById("increase");
const decreaseBtn = document.getElementById("decrease");
const summaryDiv = document.getElementById("summary");
const priceSpan = document.getElementById("price");
const productName = document.getElementById("product-name");
const productPrice = document.getElementById("product-price");
const volumeAlert = document.getElementById("volume-alert");
const suggestionsDiv = document.getElementById("suggestions");

// --- Prices ---
const volumePrices = { "330ML": 1.5, "500ML": 2.5, "1L": 3.5, "1,5L": 5.0 };
const containerPrices = { "Blikje": 1.0, "Flesje": 1.5 };
const shippingCost = 5.75;

// --- Update functions ---
function updateNumberDisplay() {
    if (numberDisplay) numberDisplay.textContent = number;
    localStorage.setItem("savedNumber", number);
    if (summaryDiv) updateSummary();
    if (productName && productPrice) updateProductDisplay();
    if (priceSpan) updateTotalPrice();
}

function updateSummary() {
    summaryDiv.innerHTML = `
        <p>Grootte: ${order.volume || "Nog niet gekozen"}</p>
        <p>Verpakking: ${order.container || "Nog niet gekozen"}</p>
        <p>Smaken: ${order.flavors.length ? order.flavors.join(", ") : "Nog niet gekozen"}</p>
        <p>Aantal: ${number}</p>
    `;
}

function updateProductDisplay() {
    if (!order.volume || !order.container) {
        productName.textContent = "Nog niet gekozen";
        productPrice.textContent = "0.00";
        return;
    }
    productName.textContent = `${order.container} ${order.volume}`;
    const basePrice = volumePrices[order.volume] + containerPrices[order.container];
    productPrice.textContent = basePrice.toFixed(2);
}

function updateTotalPrice() {
    if (!order.volume || !order.container) {
        priceSpan.textContent = "0.00";
        return;
    }
    const total = (volumePrices[order.volume] + containerPrices[order.container]) * number + shippingCost;
    priceSpan.textContent = total.toFixed(2);
}

function showVolumeAlert(message) {
    if (!volumeAlert) return;
    volumeAlert.textContent = message;
    volumeAlert.style.display = "block";
    volumeAlert.style.opacity = 0;
    setTimeout(() => volumeAlert.style.opacity = 1, 10);
    setTimeout(() => {
        volumeAlert.style.opacity = 0;
        setTimeout(() => volumeAlert.style.display = "none", 500);
    }, 3000);
}

function checkVolumeRestriction() {
    if (!document.querySelectorAll) return;
    const volumes = document.querySelectorAll('input[name="volume"]');
    volumes.forEach(v => {
        if (order.container === "Blikje" && (v.value === "1L" || v.value === "1,5L")) {
            v.disabled = true;
            if (v.checked) {
                v.checked = false;
                order.volume = null;
                localStorage.setItem("drinkOrder", JSON.stringify(order));
                showVolumeAlert("Blikje kan niet in 1 liter en 1,5 liter verpakt worden");
            }
        } else {
            v.disabled = false;
        }
    });
}

// --- Event listeners ---
increaseBtn?.addEventListener("click", () => { number++; updateNumberDisplay(); });
decreaseBtn?.addEventListener("click", () => { if (number > 1) { number--; updateNumberDisplay(); } });

// Volume inputs
document.querySelectorAll('input[name="volume"]').forEach(input => {
    if (input.value === order.volume) input.checked = true;
    input.addEventListener("change", () => {
        order.volume = input.value;
        localStorage.setItem("drinkOrder", JSON.stringify(order));
        checkVolumeRestriction();
        updateNumberDisplay();
        if (suggestionsDiv) updateSuggestions();
    });
});

// Container inputs
document.querySelectorAll('input[name="container"]').forEach(input => {
    if (input.value === order.container) input.checked = true;
    input.addEventListener("change", () => {
        order.container = input.value;
        localStorage.setItem("drinkOrder", JSON.stringify(order));
        checkVolumeRestriction();
        updateNumberDisplay();
        if (suggestionsDiv) updateSuggestions();
    });
});

// Flavor inputs
document.querySelectorAll('input[name="flavor"]').forEach(input => {
    if (order.flavors.includes(input.value)) input.checked = true;
    input.addEventListener("change", () => {
        if (input.checked) order.flavors.push(input.value);
        else order.flavors = order.flavors.filter(f => f !== input.value);
        localStorage.setItem("drinkOrder", JSON.stringify(order));
        updateNumberDisplay();
    });
});

const allFlavors = [
    "Mango", "Banaan", "Bosbes", "Chocolade", "Aardbei", "Vanille",
    "Watermeloen", "Pindakaas", "Koffie", "Framboos", "Matcha"
];

function updateSuggestions() {
    if (!suggestionsDiv || !order.volume || !order.container) return;

    suggestionsDiv.innerHTML = "";

    const numSuggestions = 3; // fixed number of suggestions

    for (let i = 0; i < numSuggestions; i++) {
        let combo = [];

        // Include at least one of the user's selected flavors if any
        if (order.flavors.length > 0) {
            const userFlavor = order.flavors[Math.floor(Math.random() * order.flavors.length)];
            combo.push(userFlavor);
        }

        // Fill the rest of the combo (total 2-4 flavors)
        const targetLength = Math.floor(Math.random() * 3) + 2; // 2, 3, or 4 flavors
        while (combo.length < targetLength) {
            const randomFlavor = allFlavors[Math.floor(Math.random() * allFlavors.length)];
            if (!combo.includes(randomFlavor)) combo.push(randomFlavor);
        }

        // Create suggestion box
        const suggestion = document.createElement("div");
        suggestion.className = "suggestion-box";
        suggestion.innerHTML = `
            <h5>Powerpulse ${order.container} ${order.volume}</h5>
            <h6>${combo.join(" + ")}</h6>
        `;
        suggestionsDiv.appendChild(suggestion);
    }
}


// --- Initial setup ---
checkVolumeRestriction();
updateNumberDisplay();
if (suggestionsDiv) updateSuggestions();
