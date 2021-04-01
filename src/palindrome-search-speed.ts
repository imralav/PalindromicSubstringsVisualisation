import { fromEvent } from "rxjs";
import { map, tap } from "rxjs/operators";

const newLocal = document.querySelector(
  "#palindrome-search-input-speed-view"
)! as HTMLElement;
const registerSpeedChange = () =>
  fromEvent(
    document.querySelector("#palindrome-search-input-speed")!,
    "input"
  ).pipe(
    map((event) => (event.target as HTMLInputElement).value),
    tap((speed) => (newLocal.innerText = speed)),
    map((speed) => Number(speed))
  );

export default registerSpeedChange;
