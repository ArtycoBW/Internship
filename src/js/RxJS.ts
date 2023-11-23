// А-ля RxJS Subject. Необходимо реализовать реактивную контекст значения.
class Subject<T> {
  private subscribers: ((val: T) => unknown)[] = [];
  private canceled: boolean = false;

  constructor(private _value: T) {}

  subscribe(fn: (val: T) => unknown) {
    this.subscribers.push(fn);
  }

  next(val: T): Subject<T>;
  next(fn: (val: T) => T): Subject<T>;
  next(valOrFn: T | ((val: T) => T)): Subject<T> {
    if (typeof valOrFn === "function") {
      this._value = (valOrFn as (val: T) => T)(this._value);
    } else {
      this._value = valOrFn;
    }

    if (!this.canceled) {
      this.subscribers.forEach((subscriber) => subscriber(this._value));
    }

    return this;
  }

  cancel() {
    this.canceled = true;
  }

  resume() {
    this.canceled = false;
  }
}

// Использование

const timerSubject = new Subject(0);

timerSubject.subscribe((val) => console.log(`Current Time ${val}`));

setInterval(() => {
  const currentSecond = new Date().getSeconds();

  if (currentSecond % 10 === 0) {
    timerSubject.cancel(); // Каждую секунду, делящуюся на 10 отменяем. (и логироваться ничего не должно). см ниже.
  } else {
    timerSubject.resume(); // А далее восстанавливаем, с 11, 21, 31 логи должны пойти.
  }

  timerSubject.next(currentSecond);
}, 1000);

// Current Time 1
// Current Time 2
// Current Time 3
// Current Time 4
// Current Time 5
// Current Time 6
// Current Time 7
// Current Time 8
// Current Time 9

// Пусто

// Current Time 11
// ....
