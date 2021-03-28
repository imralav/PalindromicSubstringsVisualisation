import "./main";

const palindromeSearchOutputCharacters = document.querySelector(
  ".palindrome-search-output-characters"
);
const palindromeSearchInput = document.querySelector(
  "#palindrome-search-input"
);
palindromeSearchInput?.addEventListener("input", (event) => {
  const newSentence = (event.target as HTMLInputElement).value;
  rewritePalindromeSearchOutputCharacters(newSentence);
});

const rewritePalindromeSearchOutputCharacters = (newSentence: string) => {
  if (!Boolean(palindromeSearchOutputCharacters)) {
    return;
  }
  palindromeSearchOutputCharacters!.innerHTML = "";
  newSentence
    .split("")
    .map((character) => {
      const characterElement = document.createElement("li");
      characterElement.classList.add("palindrome-search-output-character");
      characterElement.innerText = character;
      return characterElement;
    })
    .forEach((characterElement) =>
      palindromeSearchOutputCharacters!.appendChild(characterElement)
    );
};
