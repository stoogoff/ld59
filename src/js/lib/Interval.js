export class Interval {
	#elapsed = 0;

	constructor(span) {
		this.#span = span;
	}

	next(time) {
		this.#elapsed += time;

		if(this.#elapsed > this.#span) {
			this.#elapsed -= this.#span;
			return true;
		}

		return false;
	}
	
	reset() {
		this.#elapsed = 0;
	}
}
