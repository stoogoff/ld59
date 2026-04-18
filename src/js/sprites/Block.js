
import { Colour } from '/js/lib/index.js'

export class Block {
	#rect

	canDraw = true

	constructor(rect) {
		this.#rect = rect
	}

	render(gfx) {
		const colour = new Colour(255, 0, 0, 0.9)

		gfx.fill(this.#rect, colour)			
	}
}
