
export class Cycle {
	#array
	#index = 0

	constructor(array) {
		this.#array = array
	}

	next() {
		const output = this.#array[this.#index]

		++this.#index

		if(this.#index >= this.#array.length) {
			this.#index = 0
		}

		return output
	}
}
