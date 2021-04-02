import { fromEvent, of } from "rxjs";
import { concatMap, delay, finalize, switchMap, tap } from "rxjs/operators";
import { FoundPalindromes } from "./components/found-palindromes.component";
import { Visualisation } from "./components/visualisation.component";
import "./main";
import {
  AllPalindromesFoundEvent,
  NoPalindromeFoundEvent,
  PalindromeFoundEvent,
  PalindromeInspectedEvent,
  PalindromeSearchInvoker,
} from "./palindrome-search-algorithm";
import palindromeSearchSpeed from "./palindrome-search-speed";

const visualisation = new Visualisation();
const foundPalindromes = new FoundPalindromes(visualisation);

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

const palindromeSearchStartButton = document.querySelector(
  ".palindrome-search-input__start-button"
)! as HTMLInputElement;
const palindromeSearchStartStream = fromEvent(
  palindromeSearchStartButton,
  "click"
);
palindromeSearchStartStream
  .pipe(
    //and let's find the palindromes
    tap(() => {
      beginSearch();
    }),
    switchMap(() =>
      new PalindromeSearchInvoker(palindromeSearchInput.value).search()
    ),
    concatMap((searchEventsStream) =>
      of(searchEventsStream).pipe(delay(palindromeSearchSpeedValue))
    ),
    tap(handleEventVisualisation()),
    finalize(() => {
      //why doesnt it finalize?
      console.log("finalized");
      finishSearch();
    })
  )
  .subscribe();

function beginSearch() {
  console.log("start");
  replaceStartButtonText("looking for the palindromes...");
  toggleAnimationOnStartButton();
  clearOldPalindromeAndDisableInput();
}

function replaceStartButtonText(text: string) {
  palindromeSearchStartButton.textContent = text;
}

function toggleAnimationOnStartButton() {
  palindromeSearchStartButton.classList.toggle("search-in-progress-animation");
}

function clearOldPalindromeAndDisableInput() {
  palindromeSearchInput.disabled = true;
  palindromeSearchStartButton.disabled = true;
  foundPalindromes.clear();
}

function finishSearch() {
  replaceStartButtonText("and let's find the palindromes");
  toggleAnimationOnStartButton();
  lowlighAllAndEnableInput();
}

function lowlighAllAndEnableInput() {
  visualisation.lowlightAll();
  palindromeSearchInput.disabled = false;
  palindromeSearchStartButton.disabled = false;
}

function handleEventVisualisation(): ((value: unknown) => void) | undefined {
  return (event) => {
    if (event instanceof PalindromeFoundEvent) {
      const palidromeFoundEvent = event as PalindromeFoundEvent;
      const indexedPalindrome = foundPalindromes.addAndReturnIndexedPalindrome(
        palidromeFoundEvent.value
      );
      visualisation.palindromeFound(
        palidromeFoundEvent.from,
        palidromeFoundEvent.to,
        indexedPalindrome
      );
    } else if (event instanceof PalindromeInspectedEvent) {
      const palindromeInspectedEvent = event as PalindromeInspectedEvent;
      visualisation.palindromeInspected(
        palindromeInspectedEvent.from,
        palindromeInspectedEvent.to
      );
    } else if (
      event instanceof AllPalindromesFoundEvent ||
      event instanceof NoPalindromeFoundEvent
    ) {
      console.log("All found");
      finishSearch();
    }
  };
}

//przyklady
//bbccaacacdbdbcbcbbbcbadcbdddbabaddbcadb
//aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
