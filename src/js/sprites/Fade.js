
import { Colour } from '../lib/index.js'

export class Fade {
	#bounds
	#colour
	#timer

	canDraw = true
	canUpdate = true

	constructor(bounds, colour) {
		this.#bounds = bounds
		this.#colour = colour.copy(1)
		this.#timer = 0
	}

	get isComplete() {
		return this.#timer > 2000 // complete after 2 seconds
	}

	update(time, controller) {
		this.#timer += time

		this.#colour = this.#colour.copy(this.#timer / 2000)
	}

	render(gfx) {
		gfx.fill(this.#bounds, this.#colour)
	}
}
