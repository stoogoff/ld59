
import { Animation, Interval, Rectangle, Sprite } from '../lib/index.js'
import { getRandomInt } from '../lib/utils.js'

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
	#state = EnemyState.IDLE
	#stateChanger = null
	#target
	#angle
	#speed
	#image
	#animation
	#isHidden

	canDraw = true
	canUpdate = true

	constructor(x, y, image, isHidden = false) {
		super(new Rectangle(x, y, WIDTH, HEIGHT))

		this.#image = image
		this.#setRandomTarget()
		this.#setNewSpeed()

		this.#isHidden = isHidden
		this.#animation = new Animation(new Rectangle(0, 0, WIDTH, HEIGHT), 8, 300)
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
			if(this.#stateChanger.next(elapsed)) {
				this.#state = EnemyState.IDLE
				this.#setNewSpeed()
				this.#setRandomTarget()
			}
		}

		this.#animation.update(elapsed)
	}

	render(gfx) {
		//gfx.drawImage(this.#image, this.bounds)
		//gfx.fill(this.bounds, this.#colour)
		if(!this.#isHidden) {
			gfx.drawSprite(this.#image, this.#animation.drawingRect, this.bounds, false, false)
		}

		if(this.#isHidden && this.#state === EnemyState.PURSUING) {
			gfx.drawSprite(this.#image, this.#animation.drawingRect, this.bounds, false, false)
			//gfx.draw(this.bounds, 'black')
		}

		// debug show target but maybe leave it in and draw something better
		//gfx.fillCircle(new Rectangle(this.#target.centroid.x, this.#target.centroid.y, 10, 10), 'black')
		//gfx.drawLine([this.bounds.centroid, this.#target.centroid], 'white')
	}
}
