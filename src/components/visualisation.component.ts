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

  highlight(fromIndex: number, toIndex: number) {
    const indexedChars = Array.from(
      this.container.children
    ).map((character, id) => ({ id, character }));
    const [higlightedChars, lowlightedChars] = partition(
      from(indexedChars),
      (indexAndCharacter) =>
        indexAndCharacter.id >= fromIndex && indexAndCharacter.id <= toIndex
    );
    higlightedChars.subscribe((element) =>
      element.character.classList.remove("highlight")
    );
    lowlightedChars.subscribe((element) =>
      element.character.classList.add("highlight")
    );
  }

  lowlightAll() {
    Array.from(this.container.children).forEach((element) =>
      element.classList.remove("highlight")
    );
  }
}

export { VisualisationComponent as Visualisation };
