
export class Wall {
	#path = []
	#colour

	canDraw = true

	constructor(path, colour) {
		this.#path = path
		this.#colour = colour
	}

	collision(target) {
		return this.#path.some(point => target.intersects(point))
	}

	render(gfx) {
		gfx.drawLine(this.#path, this.#colour, 6)
	}
}