import { Subject } from "rxjs";

class PalindromeSearch {
  private algorithmEvents = new Subject<string>();
  constructor(private sentence: string) {}

  public readonly eventsStream = this.algorithmEvents.asObservable();

  public async search() {
    if (this.sentence.length === 0) {
      this.algorithmEvents.next("Empty sentence");
      this.algorithmEvents.complete();
      return 0;
    }
    return this.findPalindromes();
  }

  private async findPalindromes() {
    const chars = this.sentence.split("");
    let results = 0;
    for (let i = 0; i < chars.length; i++) {
      results++;
      this.algorithmEvents.next(`Odd-length palindrome found: ${chars[i]}`);
      //for odd-length palindromes
      let steps = 1;
      while (this.canExpandFromOddLengthPalindrome(i, steps)) {
        //can go X steps to the left and right?
        if (chars[i - steps] == chars[i + steps]) {
          results++;
          this.algorithmEvents.next(
            `Odd-length palindrome found: ${this.sentence.substring(
              i - steps,
              i + steps
            )}`
          );
          steps++;
        } else {
          break;
        }
      }
      //for even-length palindromes
      steps = 1;
      if (i + 1 < this.sentence.length && chars[i] == chars[i + 1]) {
        while (this.canExpandFromEvenLengthPalindrome(i, i + 1, steps)) {
          //can go X steps to the left and right?
          if (chars[i - steps] == chars[i + 1 + steps]) {
            results++;
            this.algorithmEvents.next(
              `Even-length palindrome found: ${this.sentence.substring(
                i - steps,
                i + 1 + steps
              )}`
            );
            steps++;
          } else {
            break;
          }
        }
      }
    }
    this.algorithmEvents.complete();
    return results;
  }

  private canExpandFromEvenLengthPalindrome(left = 0, right = 0, steps = 1) {
    return left - steps >= 0 && right + steps < this.sentence.length;
  }

  private canExpandFromOddLengthPalindrome(from = 0, steps = 1) {
    return from - steps >= 0 && from + steps < this.sentence.length;
  }
}

export { PalindromeSearch };
