const numberDisplay = document.getElementById("number");
const increaseBtn = document.getElementById("increase");
const decreaseBtn = document.getElementById("decrease");

if (numberDisplay) {

   
    let number = Number(localStorage.getItem("savedNumber")) || 1;

    numberDisplay.textContent = number;

    if (increaseBtn && decreaseBtn) {

        increaseBtn.addEventListener("click", () => {
            number++;
            numberDisplay.textContent = number;

            localStorage.setItem("savedNumber", number);
        });

        decreaseBtn.addEventListener("click", () => {
            if (number > 1) {
                number--;
            }
            numberDisplay.textContent = number;

            localStorage.setItem("savedNumber", number);
        });
    }
}
