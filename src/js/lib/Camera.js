
import { Keys } from './Controller.js'

export class Camera {
	#position
	#bounds
	#speed

	canDraw = true
	canUpdate = true

	constructor(position, bounds, speed) {
		this.#position = position
		this.#bounds = bounds
		this.#speed = speed
	}

	update(time, controller) {
		if(controller.isKeyPressed(Keys.LEFT)) {
			this.#position.x -= this.#speed
		}

		if(controller.isKeyPressed(Keys.RIGHT)) {
			this.#position.x += this.#speed
		}

		if(controller.isKeyPressed(Keys.UP)) {
			this.#position.y -= this.#speed
		}

		if(controller.isKeyPressed(Keys.DOWN)) {
			this.#position.y += this.#speed
		}
	}

	beforeRender(gfx) {
		gfx.context.save()
		gfx.context.translate(-this.#position.x, -this.#position.y)
	}

	afterRender(gfx) {
		gfx.context.restore()
	}
}
