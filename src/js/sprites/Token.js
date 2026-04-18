
import { Colour, Rectangle } from '/js/lib/index.js'

export class Token {
	#position
	#colour

	canDraw = true

	constructor(x, y) {
		this.#position = new Rectangle(x, y, 20, 20)
		this.#colour = new Colour(232, 222, 19)
	}

	render(gfx) {
		gfx.fillCircle(this.#position, this.#colour)
	}
}