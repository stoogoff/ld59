
export class Background {
	#bounds
	#colour

	canDraw = true

	constructor(bounds, colour) {
		this.#bounds = bounds
		this.#colour = colour
	}

	render(gfx) {
		gfx.fill(this.#bounds, this.#colour)
	}
}