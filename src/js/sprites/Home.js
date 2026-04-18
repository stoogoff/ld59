
import { Colour, Rectangle, Sprite } from '/js/lib/index.js'

export class Home extends Sprite {
	#colour = new Colour(118, 240, 42, 1)
	#isHome = true

	canDraw = true

	constructor(position) {
		const centre = position.subtract(100)

		super(new Rectangle(centre.x, centre.y, 200, 200))
	}

	playerIsHome(is) {
		this.canDraw = is
	}

	render(gfx) {
		gfx.fillCircle(this.bounds, this.#colour)
	}
}