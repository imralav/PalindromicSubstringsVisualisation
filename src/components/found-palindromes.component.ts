import { fromEvent } from "rxjs";
import { map, tap } from "rxjs/operators";
import { palindromeConverter } from "../converters";
import { Visualisation } from "./visualisation.component";

//TODO: on hover highlight the palindrome below
class FoundPalindromesComponent {
  private container: HTMLElement;
  constructor(private visualiser: Visualisation) {
    this.container = document.querySelector(
      ".palindrome-search-output-found-palindromes-container"
    )!;
    fromEvent(this.container, "mouseout").subscribe(() =>
      visualiser.lowlightAll()
    );
  }

  clear() {
    this.container.innerHTML = "";
  }

  addAndReturnIndexedPalindrome(palindrome: string) {
    const fullUniquePalindrome = `${
      this.container.childElementCount + 1
    }. ${palindrome}`;
    const newPalindromeElement = palindromeConverter(fullUniquePalindrome);
    fromEvent(newPalindromeElement, "mouseover").subscribe(() =>
      this.visualiser.highlightPalindrome(fullUniquePalindrome)
    );
    this.container.appendChild(newPalindromeElement);
    return fullUniquePalindrome;
  }
}
export { FoundPalindromesComponent as FoundPalindromes };
