
import { Interval, Rectangle, Sprite } from '/js/lib/index.js'
import { getRandomInt, within } from '/js/lib/utils.js'

const EnemyState = {
	IDLE: 0,
	PURSUING: 1,
	FLEEING: 2,
}

const DISTANCE = 150
const SIZE = 50

export class Enemy extends Sprite {
	#colour
	#borderColour
	#state = EnemyState.IDLE
	#stateChanger = null
	#target
	#angle
	#speed

	canDraw = true
	canUpdate = true

	constructor(x, y, colour) {
		super(new Rectangle(x, y, SIZE, SIZE))

		this.#colour = colour
		this.#borderColour = colour.adjust(0.25)
		this.#setRandomTarget()
		this.#setNewSpeed()
	}

	setPlayerTarget(target) {
		this.#target = target
		this.#state = EnemyState.PURSUING
		this.#setNewSpeed()
		this.#stateChanger = new Interval(getRandomInt(500, 2500))
	}

	setFleeTarget(target) {
		this.#target = new Rectangle(target.x, target.y, SIZE, SIZE)
		this.#state = EnemyState.FLEEING
		this.#setNewSpeed()
		this.#stateChanger = new Interval(getRandomInt(500, 2500))
	}

	#setRandomTarget() {
		this.#target = new Rectangle(
			getRandomInt(this.bounds.x - DISTANCE, this.bounds.x + DISTANCE * 2),
			getRandomInt(this.bounds.y - DISTANCE, this.bounds.y + DISTANCE * 2),
			SIZE,
			SIZE
		)
	}

	#setNewSpeed() {
		if(this.#state === EnemyState.IDLE) {
			this.#speed = getRandomInt(2, 4)
		}
		else if(this.#state === EnemyState.PURSUING){
			this.#speed = getRandomInt(6, 10)
		}
		else if(this.#state === EnemyState.FLEEING) {
			this.#speed = getRandomInt(10, 14)
		}
	}

	update(elapsed, controller) {
		let vector = this.#target.centroid.subtract(this.bounds.centroid)
		const distance = Math.hypot(vector.x, vector.y)

		vector = vector.divide(distance)

		if(within(vector.x, -1, 1) || within(vector.y, -1, 1)) {
			if(!this.bounds.intersects(this.#target)) {
				vector = vector.multiply(this.#speed)

				this.bounds.x += vector.x
				this.bounds.y += vector.y
			}
			else {
				this.#setRandomTarget()
				this.#setNewSpeed()
			}
		}

		if(this.#stateChanger !== null) {
			this.#borderColour = this.#borderColour.copy(1 - (this.#stateChanger.elapsed / this.#stateChanger.span))

			if(this.#stateChanger.next(elapsed)) {
				this.#state = EnemyState.IDLE
				this.#setNewSpeed()
				this.#setRandomTarget()
			}
		}
	}

	render(gfx) {
		gfx.fill(this.bounds, this.#colour)

		if(this.#state === EnemyState.PURSUING) {
			gfx.draw(this.bounds, this.#borderColour)
		}

		// debug show target but maybe leave it in and draw something better
		gfx.fillCircle(new Rectangle(this.#target.centroid.x, this.#target.centroid.y, 10, 10), 'black')
		gfx.drawLine([this.bounds.centroid, this.#target.centroid], 'white')
	}
}
