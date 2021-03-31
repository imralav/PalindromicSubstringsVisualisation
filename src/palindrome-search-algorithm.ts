import { Observable, of, Subscriber } from "rxjs";

interface PalindromeSearchEvent {}

class AllPalindromesFoundEvent implements PalindromeSearchEvent {
  constructor(public amount: number) {}
}

class PalindromeFoundEvent implements PalindromeSearchEvent {
  constructor(public from: number, public to: number, public value: string) {}
}

class NoPalindromeFoundEvent implements PalindromeSearchEvent {}

class PalindromeSearch {
  constructor(
    private sentence: string,
    private eventStream: Subscriber<PalindromeSearchEvent>
  ) {}

  findPalindromes() {
    const chars = this.sentence.split("");
    let results = 0;
    for (let i = 0; i < chars.length; i++) {
      results++;
      this.sendOddLengthPalindromeFoundEvent(i, 0);
      //for odd-length palindromes
      let steps = 1;
      //can go X steps to the left and right?
      while (this.canExpandFromOddLengthPalindrome(i, steps)) {
        if (chars[i - steps] == chars[i + steps]) {
          this.sendOddLengthPalindromeFoundEvent(i, steps);
          results++;
          steps++;
        } else {
          break;
        }
      }
      //for even-length palindromes
      steps = 1;
      if (i + 1 < this.sentence.length && chars[i] == chars[i + 1]) {
        results++;
        this.sendEvenLengthPalindromeFound(i, 0);
        //can go X steps to the left and right?
        while (this.canExpandFromEvenLengthPalindrome(i, i + 1, steps)) {
          if (chars[i - steps] == chars[i + 1 + steps]) {
            results++;
            this.sendEvenLengthPalindromeFound(i, steps);
            steps++;
          } else {
            break;
          }
        }
      }
    }
    this.eventStream.next(new AllPalindromesFoundEvent(results));
    this.eventStream.complete();
  }

  private sendEvenLengthPalindromeFound(i: number, steps: number) {
    this.eventStream.next(
      new PalindromeFoundEvent(
        i - steps,
        i + 1 + steps,
        this.sentence.substring(i - steps, i + 2 + steps)
      )
    );
  }

  private sendOddLengthPalindromeFoundEvent(i: number, steps: number) {
    this.eventStream.next(
      new PalindromeFoundEvent(
        i - steps,
        i + steps,
        this.sentence.substring(i - steps, i + 1 + steps)
      )
    );
  }

  private canExpandFromEvenLengthPalindrome(left = 0, right = 0, steps = 1) {
    return left - steps >= 0 && right + steps < this.sentence.length;
  }

  private canExpandFromOddLengthPalindrome(from = 0, steps = 1) {
    return from - steps >= 0 && from + steps < this.sentence.length;
  }
}

class PalindromeSearchInvoker {
  constructor(private sentence: string) {}

  public search() {
    if (this.sentence.length === 0) {
      return of(new NoPalindromeFoundEvent());
    }
    const newLocal = new Observable((subscriber) => {
      new PalindromeSearch(this.sentence, subscriber).findPalindromes();
    });
    return newLocal;
  }
}

export {
  PalindromeSearchInvoker,
  PalindromeSearchEvent,
  NoPalindromeFoundEvent,
  PalindromeFoundEvent,
  AllPalindromesFoundEvent,
};
