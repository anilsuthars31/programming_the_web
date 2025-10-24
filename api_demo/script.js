const adviceText = document.getElementById("advice");
const getAdviceBtn = document.getElementById("getAdviceBtn");

async function getAdvice() {
  try {
    const response = await fetch("https://api.adviceslip.com/advice");
    const data = await response.json();
    adviceText.textContent = `${data.slip.advice}`;
  } catch (error) {
    adviceText.textContent = "Oops! Something went wrong. Try again!";
    console.error(error);
  }
}

getAdvice();

getAdviceBtn.addEventListener("click", getAdvice);




// {
//   slip: {
//     id: 117,
//     advice: "Don't let the perfect be the enemy of the good."
//   }
// }