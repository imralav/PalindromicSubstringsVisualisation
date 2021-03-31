import { palindromeConverter } from "../converters";

//TODO: on hover highlight the palindrome below
class FoundPalindromesComponent {
  private container: HTMLElement;
  constructor() {
    this.container = document.querySelector(
      ".palindrome-search-output-found-palindromes-container"
    )!;
  }

  clear() {
    this.container.innerHTML = "";
  }

  add(palindrome: string) {
    const newPalindromeElement = palindromeConverter(
      `${this.container.childElementCount + 1}. ${palindrome}`
    );
    this.container.appendChild(newPalindromeElement);
  }
}
export { FoundPalindromesComponent as FoundPalindromes };
