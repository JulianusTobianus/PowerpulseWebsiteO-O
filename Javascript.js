
let number = Number(localStorage.getItem("savedNumber")) || 1;
let order = JSON.parse(localStorage.getItem("drinkOrder")) || {
    volume: null,
    container: null,
    flavors: []
};


const numberDisplay = document.getElementById("number");
const increaseBtn = document.getElementById("increase");
const decreaseBtn = document.getElementById("decrease");
const summaryDiv = document.getElementById("summary");
const priceSpan = document.getElementById("price");
const productName = document.getElementById("product-name");
const productPrice = document.getElementById("product-price");
const volumeAlert = document.getElementById("volume-alert");

const volumePrices = { "330ML": 2.0, "500ML": 3.0, "1L": 5.0, "1,5L": 6.5 };
const containerPrices = { "Blikje": 0.5, "Flesje": 1.0 };
const shippingCost = 5.75;
-
function updateNumberDisplay() {
    numberDisplay.textContent = number;
    localStorage.setItem("savedNumber", number);
    updateSummary();
    updateProductDisplay();
    updateTotalPrice();
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
    const basePrice = (volumePrices[order.volume] + containerPrices[order.container]);
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

increaseBtn?.addEventListener("click", () => { number++; updateNumberDisplay(); });
decreaseBtn?.addEventListener("click", () => { if (number > 1) { number--; updateNumberDisplay(); } });


document.querySelectorAll('input[name="volume"]').forEach(input => {
    if (input.value === order.volume) input.checked = true;
    input.addEventListener("change", () => {
        order.volume = input.value;
        localStorage.setItem("drinkOrder", JSON.stringify(order));
        checkVolumeRestriction();
        updateNumberDisplay();
    });
});


document.querySelectorAll('input[name="container"]').forEach(input => {
    if (input.value === order.container) input.checked = true;
    input.addEventListener("change", () => {
        order.container = input.value;
        localStorage.setItem("drinkOrder", JSON.stringify(order));
        checkVolumeRestriction();
        updateNumberDisplay();
    });
});


document.querySelectorAll('input[name="flavor"]').forEach(input => {
    if (order.flavors.includes(input.value)) input.checked = true;
    input.addEventListener("change", () => {
        if (input.checked) order.flavors.push(input.value);
        else order.flavors = order.flavors.filter(f => f !== input.value);
        localStorage.setItem("drinkOrder", JSON.stringify(order));
        updateNumberDisplay();
    });
});

checkVolumeRestriction();
updateNumberDisplay();


const suggestionsDiv = document.getElementById("suggestions");

// Predefined flavor combos (can have more than 2 flavors)
const flavorCombos = [
    ["Aardbei", "Chocolade", "Vanille"],  // first suggestion
    ["Mango", "Bosbes", "Banaan", "Matcha"] // second suggestion
];

function updateSuggestions() {
    if (!suggestionsDiv || !order.volume || !order.container) return;

    // Clear previous suggestions
    suggestionsDiv.innerHTML = "";

    // Loop through the flavor combos
    flavorCombos.forEach(combo => {
        const suggestion = document.createElement("div");
        suggestion.className = "suggestion-box";
        suggestion.innerHTML = `
            <h5>Powerpulse ${order.container} ${order.volume}</h5>
            <h6>${combo.join(" + ")}</h6>
        `;
        suggestionsDiv.appendChild(suggestion);
    });
}

// Call initially and whenever volume/container changes
updateSuggestions();

// Update suggestions when volume changes
document.querySelectorAll('input[name="volume"]').forEach(input => {
    input.addEventListener('change', () => {
        order.volume = input.value;
        localStorage.setItem("drinkOrder", JSON.stringify(order));
        updateNumberDisplay();
        updateSuggestions();
    });
});

// Update suggestions when container changes
document.querySelectorAll('input[name="container"]').forEach(input => {
    input.addEventListener('change', () => {
        order.container = input.value;
        localStorage.setItem("drinkOrder", JSON.stringify(order));
        checkVolumeRestriction();
        updateNumberDisplay();
        updateSuggestions();
    });
});
