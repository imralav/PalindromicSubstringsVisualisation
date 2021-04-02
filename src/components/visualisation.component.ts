import { of, partition, from, fromEvent } from "rxjs";
import { map, tap } from "rxjs/operators";
import { characterConverter } from "../converters";

interface PalindromeCache {
  [key: string]: number[];
}

class VisualisationComponent {
  private container: HTMLElement;
  private palindromesCache: PalindromeCache = {};
  constructor() {
    this.container = document.querySelector(
      ".palindrome-search-output-characters"
    )!;
  }

  clear() {
    this.container.innerHTML = "";
    this.palindromesCache = {};
  }

  add(newSentence: string) {
    characterConverter(newSentence).forEach((characterElement) =>
      this.container.appendChild(characterElement)
    );
  }

  palindromeFound(fromIndex: number, toIndex: number, value: string) {
    this.highlightPalindromeFound(fromIndex, toIndex);
    this.palindromesCache[value] = [fromIndex, toIndex];
  }

  highlightPalindrome(value: string) {
    if (!this.palindromesCache[value]) {
      return;
    }
    const [fromIndex, toIndex] = this.palindromesCache[value];
    this.highlightPalindromeFound(fromIndex, toIndex);
  }

  palindromeInspected(fromIndex: number, toIndex: number) {
    this.highlight(fromIndex, toIndex, "inspected");
  }

  private highlightPalindromeFound(fromIndex: number, toIndex: number) {
    this.highlight(fromIndex, toIndex, "found");
  }

  private highlight(fromIndex: number, toIndex: number, stylingClass: string) {
    this.lowlightAll();
    const indexedChars = Array.from(
      this.container.children
    ).map((character, id) => ({ id, character }));
    const [higlightedChars, lowlightedChars] = partition(
      from(indexedChars),
      (indexAndCharacter) =>
        indexAndCharacter.id >= fromIndex && indexAndCharacter.id <= toIndex
    );
    higlightedChars.subscribe((element) =>
      element.character.classList.add(stylingClass)
    );
    lowlightedChars.subscribe((element) =>
      element.character.classList.remove(stylingClass)
    );
  }

  lowlightAll() {
    Array.from(this.container.children).forEach((element) =>
      element.classList.remove("found", "inspected")
    );
  }
}

export { VisualisationComponent as Visualisation };
