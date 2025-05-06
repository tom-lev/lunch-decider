// script.js

function decideLunch(option1, option2) {
    if (!option1 || !option2) {
        return "Please enter two options.";
    }

    const decision = Math.random() < 0.5 ? option1 : option2;
    return `You should have ${decision} for lunch!`;
}

document.getElementById("decideBtn").addEventListener("click", () => {
    const option1 = document.getElementById("option1").value.trim();
    const option2 = document.getElementById("option2").value.trim();
    const result = decideLunch(option1, option2);
    document.getElementById("result").textContent = result;
});
