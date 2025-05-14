document.addEventListener("DOMContentLoaded", () => {
  function decideLunch(option1, option2) {
    if (!option1 || !option2) {
      return "Please enter two options.";
    }
    const decision = Math.random() < 0.5 ? option1 : option2;
    return `You should have ${decision} for lunch!`;
  }

  const resultElement = document.getElementById("result");

  document.getElementById("decideBtn").addEventListener("click", () => {
    const option1 = document.getElementById("option1").value.trim();
    const option2 = document.getElementById("option2").value.trim();
    const result = decideLunch(option1, option2);

    resultElement.textContent = result;
    resultElement.style.opacity = 0;
    resultElement.offsetHeight; // trigger reflow
    resultElement.style.transition = "opacity 0.5s ease";
    resultElement.style.opacity = 1;
  });

  // Add new lunch option
  document.getElementById("addOptionBtn").addEventListener("click", () => {
    const newOptionInput = document.getElementById("newOption");
    const newOption = newOptionInput.value.trim();

    if (newOption) {
      const dataList = document.getElementById("lunch-options");

      // Check if option already exists
      const exists = [...dataList.options].some(opt => opt.value.toLowerCase() === newOption.toLowerCase());
      if (!exists) {
        const option = document.createElement("option");
        option.value = newOption;
        dataList.appendChild(option);
      }

      newOptionInput.value = "";
    }
  });
});
