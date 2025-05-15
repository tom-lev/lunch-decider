document.addEventListener("DOMContentLoaded", () => {
  const inputGroup = document.getElementById("inputGroup");
  const resultElement = document.getElementById("result");
  const resultText = document.getElementById("resultText");
  const spinner = document.getElementById("spinner");
  const chime = document.getElementById("chime");

  // Initialize Awesomplete for existing inputs
  document.querySelectorAll(".lunch-input").forEach(input => {
    const list = input.getAttribute("data-list")?.split(",").map(x => x.trim()) || [];
    new Awesomplete(input, { list, minChars: 0, maxItems: 7 });

    input.addEventListener("focus", () => {
      input.dispatchEvent(new Event("input")); // trigger dropdown
    });
  });

  document.getElementById("addOptionBtn").addEventListener("click", () => {
    const input = document.createElement("input");
    input.classList.add("lunch-input", "awesomplete");
    input.setAttribute("placeholder", "Choose or type an option");
    input.setAttribute("data-list", "Pizza, Sushi, Burger, Salad, Falafel, Sandwich, Pasta");
    inputGroup.insertBefore(input, document.getElementById("addOptionBtn"));

    const list = input.getAttribute("data-list").split(",").map(x => x.trim());
    new Awesomplete(input, { list, minChars: 0, maxItems: 7 });

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

    spinner.style.display = "inline-block";
    resultText.textContent = "Deciding...";
    resultElement.style.opacity = 1;

    setTimeout(() => {
      const decision = options[Math.floor(Math.random() * options.length)];
      resultText.textContent = `You should have ${decision} for lunch!`;
      spinner.style.display = "none";

      resultText.classList.remove("pop");
      void resultText.offsetWidth;
      resultText.classList.add("pop");

      chime.currentTime = 0;
      chime.play();
    }, 1000);
  });
});
