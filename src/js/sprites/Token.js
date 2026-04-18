
import { Colour, Rectangle } from '/js/lib/index.js'

export class Token {
	#bounds
	#colour

	canDraw = true

	constructor(x, y) {
		this.#bounds = new Rectangle(x, y, 20, 20)
		this.#colour = new Colour(232, 222, 19)
	}

	get bounds() {
		return this.#bounds
	}

	render(gfx) {
		gfx.fillCircle(this.#bounds, this.#colour)
	}
}