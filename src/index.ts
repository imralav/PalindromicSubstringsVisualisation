import { fromEvent, of } from "rxjs";
import { concatMap, delay, finalize, switchMap, tap } from "rxjs/operators";
import { FoundPalindromes } from "./components/found-palindromes.component";
import { Visualisation } from "./components/visualisation.component";
import "./main";
import {
  AllPalindromesFoundEvent,
  PalindromeFoundEvent,
  PalindromeInspectedEvent,
  PalindromeSearchInvoker,
} from "./palindrome-search-algorithm";
import palindromeSearchSpeed from "./palindrome-search-speed";

const foundPalindromes = new FoundPalindromes();
const visualisation = new Visualisation();

let palindromeSearchSpeedValue = 100; //TODO:should I move it to the stream or is it fine?
palindromeSearchSpeed().subscribe(
  (speed) => (palindromeSearchSpeedValue = speed)
);

const palindromeSearchInput = document.querySelector(
  "#palindrome-search-input"
)! as HTMLInputElement;
palindromeSearchInput.addEventListener("input", (event) => {
  const newSentence = (event.target as HTMLInputElement).value;
  visualisation.clear();
  visualisation.add(newSentence);
});

const palindromeSearchButton = document.querySelector(
  ".palindrome-search-input__start-button"
)! as HTMLInputElement;
const palindromeSearchStartStream = fromEvent(palindromeSearchButton, "click");
palindromeSearchStartStream
  .pipe(
    tap(() => clearOldPalindromeAndDisableInput()),
    switchMap(() =>
      new PalindromeSearchInvoker(palindromeSearchInput.value).search()
    ),
    concatMap((searchEventsStream) =>
      of(searchEventsStream).pipe(delay(palindromeSearchSpeedValue))
    ),
    tap(handleEventVisualisation()),
    finalize(() => {
      console.log("finalized");
      lowlighAllAndEnableInput(); //why doesnt it finalize?
    })
  )
  .subscribe();
//odpal animacje pulsowania na przycisku
//zakoncz animacje pulsowania na przycisku
//dostosowanie predkosci
//zatrzymywanie

function clearOldPalindromeAndDisableInput() {
  palindromeSearchInput.disabled = true;
  palindromeSearchButton.disabled = true;
  foundPalindromes.clear();
}

function lowlighAllAndEnableInput() {
  visualisation.lowlightAll();
  palindromeSearchInput.disabled = false;
  palindromeSearchButton.disabled = false;
}

function handleEventVisualisation(): ((value: unknown) => void) | undefined {
  return (event) => {
    if (event instanceof PalindromeFoundEvent) {
      const palidromeFoundEvent = event as PalindromeFoundEvent;
      foundPalindromes.add(palidromeFoundEvent.value);
      visualisation.highlightFound(
        palidromeFoundEvent.from,
        palidromeFoundEvent.to
      );
    } else if (event instanceof PalindromeInspectedEvent) {
      const palindromeInspectedEvent = event as PalindromeInspectedEvent;
      visualisation.highlightInspected(
        palindromeInspectedEvent.from,
        palindromeInspectedEvent.to
      );
    } else if (event instanceof AllPalindromesFoundEvent) {
      console.log("All found");
      lowlighAllAndEnableInput();
    }
  };
}

//przyklady
//bbccaacacdbdbcbcbbbcbadcbdddbabaddbcadb
//aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
