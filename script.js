document.addEventListener("DOMContentLoaded", () => {
  const inputGroup = document.getElementById("inputGroup");
  const resultElement = document.getElementById("result");
  const resultText = document.getElementById("resultText");
  const spinner = document.getElementById("spinner");
  const chime = document.getElementById("chime");
  
  // Store original options
  const originalOptions = Array.from(document.getElementById("lunch-options").options)
    .map(option => option.value);

  // Function to update datalist based on selected values
  function updateDatalist() {
    const currentValues = Array.from(document.querySelectorAll(".lunch-input"))
      .map(input => input.value.trim())
      .filter(Boolean);
    
    const datalist = document.getElementById("lunch-options");
    datalist.innerHTML = '';
    
    originalOptions.forEach(option => {
      if (!currentValues.includes(option)) {
        const optionElement = document.createElement("option");
        optionElement.value = option;
        datalist.appendChild(optionElement);
      }
    });
  }

  // Input validation function
  function validateInput(input) {
    const currentValue = input.value.trim();
    if (!currentValue) return true;

    const otherInputs = Array.from(document.querySelectorAll(".lunch-input"))
      .filter(otherInput => otherInput !== input);

    if (otherInputs.some(other => other.value.trim() === currentValue)) {
      resultText.textContent = `${currentValue} is already selected!`;
      resultElement.style.opacity = 1;
      input.value = '';
      return false;
    }
    return true;
  }

  // Add new input field
  document.getElementById("addOptionBtn").addEventListener("click", () => {
    const input = document.createElement("input");
    input.setAttribute("list", "lunch-options");
    input.setAttribute("placeholder", "Choose or type an option");
    input.classList.add("lunch-input");
    
    // Add validation to new input
    input.addEventListener("input", () => {
      if (validateInput(input)) {
        updateDatalist();
        resultElement.style.opacity = 0;
      }
    });
    
    inputGroup.insertBefore(input, document.getElementById("addOptionBtn"));
    updateDatalist();
  });

  // Add validation to existing inputs
  document.querySelectorAll(".lunch-input").forEach(input => {
    input.addEventListener("input", () => {
      if (validateInput(input)) {
        updateDatalist();
        resultElement.style.opacity = 0;
      }
    });
  });

  // Decision logic
  document.getElementById("decideBtn").addEventListener("click", () => {
    const inputs = document.querySelectorAll(".lunch-input");
    const options = [...inputs].map(input => input.value.trim()).filter(val => val);
    const uniqueOptions = [...new Set(options)];

    if (uniqueOptions.length < 2) {
      resultText.textContent = "Please enter at least two unique options.";
      resultElement.style.opacity = 1;
      return;
    }

    spinner.style.display = "inline-block";
    resultText.textContent = "Deciding...";
    resultElement.style.opacity = 1;

    setTimeout(() => {
      const decision = uniqueOptions[Math.floor(Math.random() * uniqueOptions.length)];
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