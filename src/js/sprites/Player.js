
import { Colour, Interval, Keys, Rectangle, Sprite } from '/js/lib/index.js'
import { ENEMY_AWARENESS } from './Enemy.js'

export class Player extends Sprite {
	#speed = 0
	#colour
	#pulse = null
	#pulseTargets = []
	#enemiesAlert = false

	#fade = null
	#fadeColour = new Colour(200, 200, 200)

	canUpdate = true
	canDraw = true

	constructor(position, speed) {
		const size = 40
		const centre = position.subtract(size / 2)

		super(new Rectangle(centre.x, centre.y, size, size))

		this.#speed = speed
		this.#colour = new Colour(23, 32, 33, 0.9)
	}

	get isPulsing() {
		return this.#pulse !== null
	}

	setPulseTargets(points) {
		this.#pulseTargets = points
	}

	setEnemiesAlert(alert) {
		/*if(alert) {
			this.#fade = null
			this.#fadeColour = this.#fadeColour.copy(1)
		}
		else if(this.#fade === null) {
			this.#fade = new Interval(500)
		}*/
	}

	// component methods

	// TODO make player movement feel more natural
	update(elapsed, controller) {
		if(controller.isKeyPressed(Keys.LEFT)) {
			this.bounds.x -= this.#speed
		}

		if(controller.isKeyPressed(Keys.RIGHT)) {
			this.bounds.x += this.#speed
		}

		if(controller.isKeyPressed(Keys.UP)) {
			this.bounds.y -= this.#speed
		}

		if(controller.isKeyPressed(Keys.DOWN)) {
			this.bounds.y += this.#speed
		}

		if(controller.isKeyPressed(Keys.SPACE)) {
			this.#pulse = new Interval(1000)
		}

		if(this.#pulse && this.#pulse.next(elapsed)) {
			this.#pulse = null
			this.#pulseTargets = []
		}

		/*if(this.#fade) {
			this.#fadeColour = this.#fadeColour.copy(1 - (this.#fade.elapsed / this.#fade.span))

			if(this.#fade.next(elapsed)) {
				this.#fade = null
			}
		}*/		
	}

	render(gfx) {
		gfx.fillCircle(this.bounds, this.#colour)

		/*if(this.#fade) {
			gfx.drawCircle(this.bounds.grow(ENEMY_AWARENESS), this.#fadeColour)
		}*/

		this.#pulseTargets.forEach((target, idx) => {
			gfx.drawLine([this.bounds.centroid, target], idx === 0 ? 'white' : 'black')
		})
	}
}
