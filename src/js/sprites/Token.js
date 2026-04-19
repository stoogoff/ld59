
import { Colour, Interval, Rectangle, Sprite } from '../lib/index.js'
import { getRandomInt } from '../lib/utils.js'
import { Cycle } from '../helpers/Cycle.js'

const TokenState = {
	IDLE: 0,
	MOVING: 1,
}

const SIZE = 32

export class Token extends Sprite {
	#colour
	#state = TokenState.IDLE
	#target
	#stateChanger
	#speed = 3
	#images = []
	#image
	#imageChanger = null

	canDraw = true
	canUpdate = true

	constructor(x, y, images) {
		super(new Rectangle(x, y, SIZE, SIZE))
		this.#colour = new Colour(232, 222, 19)
		this.#images = new Cycle([...images, ...images.toReversed()])
		this.#image = this.#images.current
		this.#imageChanger = new Interval(getRandomInt(100, 500))
	}

	setPlayerTarget(target) {
		//this.#target = target
		//this.#state = TokenState.MOVING
		//this.#stateChanger = new Interval(250)
	}

	update(elapsed, controller) {
		if(this.#imageChanger.next(elapsed)) {
			this.#image = this.#images.next()
			this.#imageChanger = new Interval(getRandomInt(100, 500))
		}

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
		}
	}

	render(gfx) {
		//gfx.fillCircle(this.bounds, this.#colour)
		gfx.drawImage(this.#image, this.bounds)
	}
}