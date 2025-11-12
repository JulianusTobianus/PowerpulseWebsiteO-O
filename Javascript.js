const numberDisplay = document.getElementById("number");
const increaseBtn = document.getElementById("increase");
const decreaseBtn = document.getElementById("decrease");

let number = 0;

increaseBtn.addEventListener("click", () => {
  number++;
  numberDisplay.textContent = number;
});
decreaseBtn.addEventListener("click", () => {
  number--;
  numberDisplay.textContent = number;
});
