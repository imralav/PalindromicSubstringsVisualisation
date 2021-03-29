import { of } from "rxjs";
import { concatMap, delay, tap } from "rxjs/operators";
import "./main";
import palindromeCharactersConverter from "./palindrome-characters-converter";
import { PalindromeSearch } from "./palindrome-search-algorithm";

const DELAY_BETWEEN_EVENT_CONSUMPTION = 500;

const palindromeSearchInput = document.querySelector(
  "#palindrome-search-input"
)! as HTMLInputElement;
palindromeSearchInput.addEventListener("input", (event) => {
  const newSentence = (event.target as HTMLInputElement).value;
  rewritePalindromeSearchOutputCharacters(newSentence);
});

const rewritePalindromeSearchOutputCharacters = (newSentence: string) => {
  const palindromeSearchOutputCharacters = document.querySelector(
    ".palindrome-search-output-characters"
  );
  if (!Boolean(palindromeSearchOutputCharacters)) {
    return;
  }
  palindromeSearchOutputCharacters!.innerHTML = "";
  palindromeCharactersConverter(newSentence).forEach((characterElement) =>
    palindromeSearchOutputCharacters!.appendChild(characterElement)
  );
};

const palindromeSearchButton = document.querySelector(
  ".palindrome-search-input__start-button"
)!;
palindromeSearchButton.addEventListener("click", async (event) => {
  const palindromeSearch = new PalindromeSearch(palindromeSearchInput.value);
  palindromeSearch.eventsStream
    .pipe(
      concatMap((event) =>
        of(event).pipe(delay(DELAY_BETWEEN_EVENT_CONSUMPTION))
      ),
      tap((event) => console.log("Event ", event))
    )
    .subscribe();
  console.log(await palindromeSearch.search());
});
