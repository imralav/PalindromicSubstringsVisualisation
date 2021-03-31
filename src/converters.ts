const characterConverter = (sentence: string) => {
  const template = (document.querySelector(
    "#new-character-template"
  )! as HTMLTemplateElement).content;
  return sentence.split("").map((character) => {
    const characterElement = template.cloneNode(true) as HTMLElement;
    characterElement.querySelector("li")!.innerHTML = character;
    return characterElement;
  });
};

const palindromeConverter = (palindrome: string) => {
  const template = (document.querySelector(
    "#new-palindrome-template"
  )! as HTMLTemplateElement).content;
  const palindromeELement = template.cloneNode(true) as HTMLElement;
  palindromeELement.querySelector("li")!.innerHTML = palindrome;
  return palindromeELement;
};

export { characterConverter, palindromeConverter };
