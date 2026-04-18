
import { Colour, Point, Rectangle } from '/js/lib/index.js'
import { getRandomInt, within } from '/js/lib/utils.js'

const EnemyState = {
	IDLE: 0,
	PURSUING: 1,
	GIVING_UP: 2,
}

const DISTANCE = 150
const SIZE = 50

export class Enemy {
	#bounds
	#colour
	#state = EnemyState.IDLE
	#target
	#angle
	#speed

	canDraw = true
	canUpdate = true

	constructor(x, y) {
		this.#target = new Rectangle(
			getRandomInt(x - DISTANCE, x + DISTANCE * 2),
			getRandomInt(y - DISTANCE, y + DISTANCE * 2),
			SIZE,
			SIZE
		)
		this.#bounds = new Rectangle(x, y, SIZE, SIZE)
		this.#colour = new Colour(176, 176, 176)
		
		this.#setNewSpeed()
	}

	#setNewSpeed() {
		if(this.#state === EnemyState.IDLE) {
			this.#speed = getRandomInt(2, 4)
		}
	}

	update(time, controller) {
		// TODO if the player is close converge on them
		// TODO if the player activates their pulse increase the range of the pulse
		// TODO they should move a bit if they're idle
		// TODO they should pursue the player but give up after a few frames if the player is out of range

		if(this.#state === EnemyState.IDLE) {
			// go to target
			// if at target pick a random nearby point
			let vecX = this.#target.x - this.#bounds.x
			let vecY = this.#target.y - this.#bounds.y
			let dist = Math.hypot(vecX, vecY)

			vecX /= dist
			vecY /= dist

			if(within(vecX, -1, 1) || within(vecY, -1, 1)) {
				if(!this.#bounds.intersects(this.#target)) {
					this.#bounds.x += vecX * this.#speed
					this.#bounds.y += vecY * this.#speed
				}
				else {
					this.#target = new Rectangle(
						getRandomInt(this.#bounds.x - DISTANCE, this.#bounds.x + DISTANCE * 2),
						getRandomInt(this.#bounds.y - DISTANCE, this.#bounds.y + DISTANCE * 2),
						SIZE,
						SIZE
					)
					this.#setNewSpeed()
				}
			}
		}
	}

	render(gfx) {
		gfx.fill(this.#bounds, this.#colour)
		gfx.fillCircle(new Rectangle(this.#target.x, this.#target.y, 30, 30), 'black')
	}
}
