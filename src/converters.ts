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
  const clonedTemplate = template.cloneNode(true) as HTMLElement;
  const palindromeELement = clonedTemplate.querySelector("li")!;
  palindromeELement.innerHTML = palindrome;
  return palindromeELement;
};

export { characterConverter, palindromeConverter };
