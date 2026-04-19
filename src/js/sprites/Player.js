
import { Animation, Colour, Interval, Keys, Rectangle, Sprite } from '/js/lib/index.js'
import { ENEMY_AWARENESS } from './Enemy.js'

const WIDTH = 30
const HEIGHT = 40

const PlayerState = {
	IDLE: 0,
	WALKING_LEFT: 1,
	WALKING_RIGHT: 2,
}

export class Player extends Sprite {
	#speed = 0
	#colour
	#pulse = null
	#pulseTargets = []
	#enemiesAlert = false
	#animationIdle
	#animationWalking
	#animationPulse
	#state = PlayerState.IDLE
	#image
	#imagePulse

	#fade = null
	#fadeColour = new Colour(200, 200, 200)

	canUpdate = true
	canDraw = true

	constructor(position, speed, image, imagePulse) {
		const centre = position.subtract(WIDTH / 2, HEIGHT / 2)

		super(new Rectangle(centre.x, centre.y, WIDTH, HEIGHT).grow(10))

		this.#speed = speed
		this.#colour = new Colour(23, 32, 33, 0.9)
		this.#image = image
		this.#imagePulse = imagePulse

		this.#animationIdle = new Animation(new Rectangle(0, 0, WIDTH, HEIGHT), 2, 1200)
		this.#animationWalking = new Animation(new Rectangle(2 * WIDTH, 0, WIDTH, HEIGHT), 2, 600, true, 2)
		this.#animationPulse = new Animation(new Rectangle(0, 0, 80, 10), 3)
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
		this.#state = PlayerState.IDLE

		if(controller.isKeyPressed(Keys.UP)) {
			this.bounds.y -= this.#speed
			this.#state = PlayerState.WALKING_LEFT
		}

		if(controller.isKeyPressed(Keys.DOWN)) {
			this.bounds.y += this.#speed
			this.#state = PlayerState.WALKING_RIGHT
		}

		if(controller.isKeyPressed(Keys.LEFT)) {
			this.bounds.x -= this.#speed
			this.#state = PlayerState.WALKING_LEFT
		}

		if(controller.isKeyPressed(Keys.RIGHT)) {
			this.bounds.x += this.#speed
			this.#state = PlayerState.WALKING_RIGHT
		}

		if(controller.isKeyPressed(Keys.SPACE)) {
			this.#pulse = new Interval(1000)
		}

		this.#animationPulse.update(elapsed)

		if(this.#pulse && this.#pulse.next(elapsed)) {
			this.#pulse = null
			this.#pulseTargets = []
		}

		if(this.#state === PlayerState.WALKING) {
			this.#animationWalking.update(elapsed)
		}
		else {
			this.#animationIdle.update(elapsed)
		}

		/*if(this.#fade) {
			this.#fadeColour = this.#fadeColour.copy(1 - (this.#fade.elapsed / this.#fade.span))

			if(this.#fade.next(elapsed)) {
				this.#fade = null
			}
		}*/		
	}

	render(gfx) {
		if(this.#state === PlayerState.WALKING_LEFT) {
			gfx.drawSprite(this.#image, this.#animationWalking.drawingRect, this.bounds, false, false)
		}
		else if(this.#state === PlayerState.WALKING_RIGHT) {
			gfx.drawSprite(this.#image, this.#animationWalking.drawingRect, this.bounds, false, false)
		}
		else {
			gfx.drawSprite(this.#image, this.#animationIdle.drawingRect, this.bounds, false, false)
		}

		//gfx.fillCircle(this.bounds, this.#colour)

		/*if(this.#fade) {
			gfx.drawCircle(this.bounds.grow(ENEMY_AWARENESS), this.#fadeColour)
		}*/

		this.#pulseTargets.forEach((target, idx) => {
			gfx.drawSprite(this.#imagePulse, this.#animationPulse.drawingRect, new Rectangle(this.bounds.centroid.x, this.bounds.centroid.y, 80, 40), false, false)

			//gfx.drawLine([this.bounds.centroid, target], idx === 0 ? 'white' : 'black')
		})
	}
}
