class EventEmitter<T> {
  private callbacks: { [type: string]: Array<(val: T) => T> } = {};
  private listeners: { [type: string]: Array<(val: T) => unknown> } = {};

  constructor(private _value: T) {}

  emit(type: string) {
    if (!this.callbacks[type]) {
      throw new Error(`${type} not registered`);
    }

    this.callbacks[type].forEach((fn) => {
      this._value = fn(this._value);
    });

    if (this.listeners[type]) {
      this.listeners[type].forEach((fn) => fn(this._value));
    }
  }

  register(type: string, fn: (val: T) => T) {
    if (!this.callbacks[type]) {
      this.callbacks[type] = [];
    }

    if (this.callbacks[type].length > 0 && this.callbacks[type][0] !== fn) {
      console.warn(`Callback for ${type} has changed!!`);
    }

    this.callbacks[type].push(fn);
  }

  on(type: string, fn: (val: T) => unknown) {
    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }

    this.listeners[type].push(fn);
  }

  get value() {
    return this._value;
  }
}

const emitter = new EventEmitter(13);
// emitter.emit('Increment'); // Error: Increment not registered

emitter.register("Increment", (val) => val + 1); // OK
// emitter.register('Increment', (val) => val + 2);  // console.warn (callback has changed!!)

emitter.register("Decrement", (val) => val - 1);

emitter.on("Increment", (val) => console.log(`New increment with: ${val}`));
emitter.on("Decrement", (val) => console.log(`New decrement with: ${val}`));
emitter.on("Decrement", (val) => console.log(`New decrement2 with: ${val}`));

emitter.emit("Increment"); // Logs: New increment with: 2
emitter.emit("Decrement"); // Logs: New decrement with: 1, New decrement2 with: 1
emitter.emit("Decrement");

console.log(emitter.value); // 1
