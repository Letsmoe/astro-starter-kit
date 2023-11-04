export class Observable<T> {
	private observers: ((data: T) => void)[]

	constructor(public data: T) {
		this.observers = [];
	}

	// Add an observer to this.observers.
	addObserver(observer: ((data: T) => void)) {
		this.observers.push(observer);
	}

	// Remove an observer from this.observers.
	removeObserver(observer: ((data: T) => void)) {
		const removeIndex = this.observers.findIndex((obs) => {
			return observer === obs;
		});

		if (removeIndex !== -1) {
			this.observers = this.observers.slice(removeIndex, 1);
		}
	}

	// Loops over this.observers and calls the update method on each observer.
	// The state object will call this method everytime it is updated.
	update(data: T) {
		this.data = data;
		if (this.observers.length > 0) {
			this.observers.forEach((observer) => observer(data));
		}
	}
}