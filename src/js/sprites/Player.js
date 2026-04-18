
import { Colour, Keys, Rectangle } from '/js/lib/index.js'

export class Player {
	#velocity = 0
	#rect
	#colour

	canUpdate = true
	canDraw = true

	constructor(position, velocity) {
		const size = 40
		const centre = position.subtract(size / 2)

		this.#velocity = velocity
		this.#rect = new Rectangle(centre.x, centre.y, size, size)
		this.#colour = new Colour(23, 32, 33, 0.9)
	}

	// TODO make player velocty feel more natural
	update(time, controller) {
		if(controller.isKeyPressed(Keys.LEFT)) {
			this.#rect.x -= this.#velocity
		}

		if(controller.isKeyPressed(Keys.RIGHT)) {
			this.#rect.x += this.#velocity
		}

		if(controller.isKeyPressed(Keys.UP)) {
			this.#rect.y -= this.#velocity
		}

		if(controller.isKeyPressed(Keys.DOWN)) {
			this.#rect.y += this.#velocity
		}
	}

	render(gfx) {
		gfx.fillCircle(this.#rect, this.#colour)
	}
}
