
import { Colour, Interval, Keys, Rectangle, Sprite } from '/js/lib/index.js'

export class Player extends Sprite {
	#speed = 0
	#colour
	#pulse = null
	#pulseTargets = []

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

	// component methods

	// TODO make player movement feel more natural
	update(time, controller) {
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

		if(this.#pulse && this.#pulse.next(time)) {
			this.#pulse = null
			this.#pulseTargets = []
		}
	}

	render(gfx) {
		gfx.fillCircle(this.bounds, this.#colour)

		this.#pulseTargets.forEach(target => {
			gfx.drawLine(this.bounds.centroid, target, 'black')
		})
	}
}
