
import { Colour, Interval, Rectangle, Sprite } from '/js/lib/index.js'

const TokenState = {
	IDLE: 0,
	MOVING: 1,
}

export class Token extends Sprite {
	#colour
	#state = TokenState.IDLE
	#target
	#stateChanger
	#speed = 3

	canDraw = true
	canUpdate = false

	constructor(x, y) {
		super(new Rectangle(x, y, 20, 20))
		this.#colour = new Colour(232, 222, 19)
	}

	setPlayerTarget(target) {
		this.canUpdate = true
		this.#target = target
		this.#state = TokenState.MOVING
		this.#stateChanger = new Interval(250)
	}

	update(elapsed, controller) {
		if(this.#state === TokenState.IDLE) return

		const distance = this.#target.centroid.distance(this.bounds.centroid)
		let vector = this.#target.centroid.subtract(this.bounds.centroid).divide(distance)

		if(!this.bounds.intersects(this.#target)) {
			vector = vector.multiply(this.#speed)

			this.bounds.x += vector.x
			this.bounds.y += vector.y
		}

		if(this.#stateChanger !== null && this.#stateChanger.next(elapsed)) {
			this.#state = TokenState.IDLE
			this.#target = null
			this.canUpdate = false
		}
	}

	render(gfx) {
		gfx.fillCircle(this.bounds, this.#colour)
	}
}