export default function (sentence: string) {
  return sentence.split("").map((character) => {
    const characterElement = document.createElement("li");
    characterElement.classList.add("palindrome-search-output-character");
    characterElement.innerText = character;
    return characterElement;
  });
}
