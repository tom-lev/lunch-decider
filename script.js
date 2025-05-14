document.addEventListener("DOMContentLoaded", () => {
  const inputGroup = document.getElementById("inputGroup");
  const resultElement = document.getElementById("result");
  const resultText = document.getElementById("resultText");
  const spinner = document.getElementById("spinner");
  const chime = document.getElementById("chime");

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
