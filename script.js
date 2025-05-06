// script.js

function decideLunch(option1, option2) {
    if (!option1 || !option2) {
        console.log("Please provide two options for lunch.");
        return;
    }

    const decision = Math.random() < 0.5 ? option1 : option2;
    console.log(`You should have ${decision} for lunch!`);
}

// Example usage
const lunchOption1 = "Pizza";
const lunchOption2 = "Sushi";

decideLunch(lunchOption1, lunchOption2);