document.addEventListener("DOMContentLoaded", () => {
  const inputGroup = document.getElementById("inputGroup");
  const resultElement = document.getElementById("result");

  document.getElementById("addOptionBtn").addEventListener("click", () => {
    const input = document.createElement("input");
    input.setAttribute("list", "lunch-options");
    input.setAttribute("placeholder", "Choose or type an option");
    input.classList.add("lunch-input");
    inputGroup.insertBefore(input, document.getElementById("addOptionBtn"));
  });

  document.getElementById("decideBtn").addEventListener("click", () => {
    const inputs = document.querySelectorAll(".lunch-input");
    const options = [...inputs].map(input => input.value.trim()).filter(val => val);

    if (options.length < 2) {
      resultElement.textContent = "Please enter at least two options.";
    } else {
      const decision = options[Math.floor(Math.random() * options.length)];
      resultElement.textContent = `You should have ${decision} for lunch!`;
    }

    resultElement.style.opacity = 0;
    resultElement.offsetHeight; // reflow for animation
    resultElement.style.transition = "opacity 0.5s ease";
    resultElement.style.opacity = 1;
  });
});
