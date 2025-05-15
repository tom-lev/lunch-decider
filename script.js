document.addEventListener("DOMContentLoaded", () => {
  const inputGroup = document.getElementById("inputGroup");
  const resultElement = document.getElementById("result");
  const resultText = document.getElementById("resultText");
  const spinner = document.getElementById("spinner");
  const chime = document.getElementById("chime");

document.getElementById("addOptionBtn").addEventListener("click", () => {
  const input = document.createElement("input");
  input.classList.add("lunch-input", "awesomplete");
  input.setAttribute("placeholder", "Choose or type an option");
  input.setAttribute("data-list", "Pizza, Sushi, Burger, Salad, Falafel, Sandwich, Pasta");
  inputGroup.insertBefore(input, document.getElementById("addOptionBtn"));

  // Initialize Awesomplete on the new input
  new Awesomplete(input, {
    minChars: 0,
    maxItems: 7
  });

  // Optional: open dropdown when focused
  input.addEventListener("focus", () => {
    input.dispatchEvent(new Event("input"));
  });
});

  document.getElementById("decideBtn").addEventListener("click", () => {
    const inputs = document.querySelectorAll(".lunch-input");
    const options = [...inputs].map(input => input.value.trim()).filter(val => val);

    if (options.length < 2) {
      resultText.textContent = "Please enter at least two options.";
      resultElement.style.opacity = 1;
      return;
    }

    // Show spinner and "Deciding..." message
    spinner.style.display = "inline-block";
    resultText.textContent = "Deciding...";
    resultElement.style.opacity = 1;

    // Delay decision to simulate thinking
    setTimeout(() => {
      const decision = options[Math.floor(Math.random() * options.length)];
      resultText.textContent = `You should have ${decision} for lunch!`;

      // Hide spinner
      spinner.style.display = "none";

      // Animate result
      resultText.classList.remove("pop");
      void resultText.offsetWidth; // trigger reflow
      resultText.classList.add("pop");

      // Play sound
      chime.currentTime = 0;
      chime.play();

    }, 1000);
  });
});
