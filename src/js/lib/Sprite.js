
export class Sprite {
	#bounds

	constructor(bounds) {
		this.#bounds = bounds
	}

	get bounds() {
		return this.#bounds
	}

	hitTest(target) {
		return this.#bounds.intersects(target)
	}
}