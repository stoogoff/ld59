
import { Interval, Rectangle, Sprite } from '/js/lib/index.js'
import { getRandomInt } from '/js/lib/utils.js'

export const ENEMY_AWARENESS = 250

const EnemyState = {
	IDLE: 0,
	PURSUING: 1,
	FLEEING: 2,
}

const DISTANCE = 150
const WIDTH = 60
const HEIGHT = 40

export class Enemy extends Sprite {
	#colour
	#borderColour
	#state = EnemyState.IDLE
	#stateChanger = null
	#target
	#angle
	#speed
	#image

	canDraw = true
	canUpdate = true

	constructor(x, y, colour, image) {
		super(new Rectangle(x, y, WIDTH, HEIGHT))

		this.#image = image
		this.#colour = colour
		this.#borderColour = colour.adjust(0.25)
		this.#setRandomTarget()
		this.#setNewSpeed()
	}

	get target() {
		return this.#target
	}

	get isFleeing() {
		return this.#state === EnemyState.FLEEING
	}

	setPlayerTarget(target) {
		this.#target = target
		this.#state = EnemyState.PURSUING
		this.#setNewSpeed()
		this.#stateChanger = new Interval(getRandomInt(500, 1500))
	}

	setFleeTarget(target) {
		this.#target = new Rectangle(target.x, target.y, WIDTH, HEIGHT)
		this.#state = EnemyState.FLEEING
		this.#setNewSpeed()
		this.#stateChanger = new Interval(getRandomInt(2000, 3000))
	}

	#setRandomTarget() {
		this.#target = new Rectangle(
			getRandomInt(this.bounds.x - DISTANCE, this.bounds.x + DISTANCE * 2),
			getRandomInt(this.bounds.y - DISTANCE, this.bounds.y + DISTANCE * 2),
			WIDTH,
			HEIGHT
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

		this.#speed = 5
	}

	update(elapsed, controller) {
		const distance = this.#target.centroid.distance(this.bounds.centroid)
		let vector = this.#target.centroid.subtract(this.bounds.centroid).divide(distance)

		if(!this.bounds.intersects(this.#target)) {
			vector = vector.multiply(this.#speed)

			this.bounds.x += vector.x
			this.bounds.y += vector.y
		}
		else {
			this.#setRandomTarget()
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
		gfx.drawImage(this.#image, this.bounds)
		//gfx.fill(this.bounds, this.#colour)

		if(this.#state === EnemyState.PURSUING) {
			gfx.draw(this.bounds, this.#borderColour)
		}

		// debug show target but maybe leave it in and draw something better
		//gfx.fillCircle(new Rectangle(this.#target.centroid.x, this.#target.centroid.y, 10, 10), 'black')
		//gfx.drawLine([this.bounds.centroid, this.#target.centroid], 'white')
	}
}
