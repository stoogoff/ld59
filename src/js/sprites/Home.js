
import { Colour, Rectangle } from '/js/lib/index.js'

export class Home {
	#bounds
	#colour = new Colour(118, 240, 42, 1)
	#isHome = true

	canDraw = true

	constructor(position) {
		const centre = position.subtract(100)

		this.#bounds = new Rectangle(centre.x, centre.y, 200, 200)
	}

	get bounds() {
		return this.#bounds
	}

	playerIsHome(is) {
		this.canDraw = is
	}

	render(gfx) {
		gfx.fillCircle(this.#bounds, this.#colour)
	}
}