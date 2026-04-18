
import { Colour, Rectangle, Sprite } from '/js/lib/index.js'

export class Token extends Sprite {
	#colour

	canDraw = true

	constructor(x, y) {
		super(new Rectangle(x, y, 20, 20))
		this.#colour = new Colour(232, 222, 19)
	}

	render(gfx) {
		gfx.fillCircle(this.bounds, this.#colour)
	}
}