import { of, partition, from } from "rxjs";
import { characterConverter } from "../converters";

class VisualisationComponent {
  private container: HTMLElement;
  constructor() {
    this.container = document.querySelector(
      ".palindrome-search-output-characters"
    )!;
  }

  clear() {
    this.container.innerHTML = "";
  }

  add(newSentence: string) {
    characterConverter(newSentence).forEach((characterElement) =>
      this.container.appendChild(characterElement)
    );
  }

  highlightFound(fromIndex: number, toIndex: number) {
    this.highlight(fromIndex, toIndex, "found");
  }

  highlightInspected(fromIndex: number, toIndex: number) {
    this.highlight(fromIndex, toIndex, "inspected");
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
