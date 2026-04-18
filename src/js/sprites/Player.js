
import { Colour, Keys, Rectangle } from '/js/lib/index.js'

export class Player {
	#velocity = 0
	#bounds
	#colour

	canUpdate = true
	canDraw = true

	constructor(position, velocity) {
		const size = 40
		const centre = position.subtract(size / 2)

		this.#velocity = velocity
		this.#bounds = new Rectangle(centre.x, centre.y, size, size)
		this.#colour = new Colour(23, 32, 33, 0.9)
	}

	hitTest(bounds) {
		return this.#bounds.intersects(bounds)
	}

	// component methods

	// TODO make player velocty feel more natural
	update(time, controller) {
		if(controller.isKeyPressed(Keys.LEFT)) {
			this.#bounds.x -= this.#velocity
		}

		if(controller.isKeyPressed(Keys.RIGHT)) {
			this.#bounds.x += this.#velocity
		}

		if(controller.isKeyPressed(Keys.UP)) {
			this.#bounds.y -= this.#velocity
		}

		if(controller.isKeyPressed(Keys.DOWN)) {
			this.#bounds.y += this.#velocity
		}
	}

	render(gfx) {
		gfx.fillCircle(this.#bounds, this.#colour)
	}
}
