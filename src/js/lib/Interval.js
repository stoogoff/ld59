
export class Interval {
	#elapsed = 0
	#span

	constructor(span) {
		this.#span = span
	}

	get elapsed() {
		return this.#elapsed
	}

	next(time) {
		this.#elapsed += time

		if(this.#elapsed > this.#span) {
			this.#elapsed -= this.#span
			return true
		}

		return false
	}
	
	reset() {
		this.#elapsed = 0
	}
}
