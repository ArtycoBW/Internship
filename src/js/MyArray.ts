export class MyArray<T> {
  constructor(private array: T[]) {}

  mutationObserver = new MutationObserver(() => {
    console.log("mutation");
  });

  map<U>(callbackfn: (value: T, index: number, array: T[]) => U): U[] {
    const result: U[] = [];
    for (let i = 0; i < this.array.length; i++) {
      result.push(callbackfn(this.array[i], i, this.array));
    }
    return result;
  }
}
