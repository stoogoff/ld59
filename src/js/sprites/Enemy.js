
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
	#state = EnemyState.IDLE
	#stateChanger = null
	#target
	#angle
	#speed

	canDraw = true
	canUpdate = true

	constructor(x, y, colour) {
		super(new Rectangle(x, y, SIZE, SIZE))

		this.#target = new Rectangle(
			getRandomInt(x - DISTANCE, x + DISTANCE * 2),
			getRandomInt(y - DISTANCE, y + DISTANCE * 2),
			SIZE,
			SIZE
		)
		this.#colour = colour
		
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
			this.#speed = getRandomInt(8, 14)
		}
	}

	update(elapsed, controller) {
		let vector = this.#target.centroid.subtract(this.bounds.x, this.bounds.y)
		const distance = Math.hypot(vector.x, vector.y)

		vector =  vector.divide(distance)

		if(within(vector.x, -1, 1) || within(vector.y, -1, 1)) {
			if(!this.bounds.intersects(this.#target)) {
				this.bounds.x += vector.x * this.#speed
				this.bounds.y += vector.y * this.#speed
			}
			else {
				this.#setRandomTarget()
				this.#setNewSpeed()
			}
		}

		if(this.#stateChanger !== null && this.#stateChanger.next(elapsed)) {
			this.#state = EnemyState.IDLE
			this.#setNewSpeed()
			this.#setRandomTarget()
		}
	}

	render(gfx) {
		gfx.fill(this.bounds, this.#colour)
		//gfx.fillCircle(this.#target, 'black')
		//gfx.draw(this.bounds, 'black')
	}
}
