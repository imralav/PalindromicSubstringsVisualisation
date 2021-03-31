import { of } from "rxjs";
import { concatMap, delay, finalize, tap } from "rxjs/operators";
import { FoundPalindromes } from "./components/found-palindromes.component";
import { Visualisation } from "./components/visualisation.component";
import "./main";
import {
  PalindromeFoundEvent,
  PalindromeSearchInvoker,
} from "./palindrome-search-algorithm";

const DELAY_BETWEEN_EVENT_CONSUMPTION = 500;

const foundPalindromes = new FoundPalindromes();
const visualisation = new Visualisation();

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
palindromeSearchButton.addEventListener("click", async (event) => {
  palindromeSearchInput.disabled = true;
  palindromeSearchButton.disabled = true;
  foundPalindromes.clear();
  const palindromeSearch = new PalindromeSearchInvoker(
    palindromeSearchInput.value
  );
  palindromeSearch
    .search()
    .pipe(
      concatMap((event) =>
        of(event).pipe(delay(DELAY_BETWEEN_EVENT_CONSUMPTION))
      ),
      tap((event) => {
        if (event instanceof PalindromeFoundEvent) {
          const palidromeFoundEvent = event as PalindromeFoundEvent;
          foundPalindromes.add(palidromeFoundEvent.value);
          visualisation.highlight(
            palidromeFoundEvent.from,
            palidromeFoundEvent.to
          );
        }
      }),
      finalize(() => {
        visualisation.lowlightAll();
        palindromeSearchInput.disabled = false;
        palindromeSearchButton.disabled = false;
      })
    )
    .subscribe();
  //zablokuj input i przycisk
  //odpal animacje pulsowania na przycisku
  //zakoncz animacje pulsowania na przycisku
});
