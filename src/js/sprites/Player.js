
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
	#imageIdle
	#imageWalkingLeft
	#imageWalkingRight
	#imagePulse

	#fade = null
	#fadeColour = new Colour(200, 200, 200)

	canUpdate = true
	canDraw = true

	constructor(position, speed, imageManager) {
		const centre = position.subtract(WIDTH / 2, HEIGHT / 2)

		super(new Rectangle(centre.x, centre.y, WIDTH, HEIGHT))

		this.#speed = speed
		this.#colour = new Colour(23, 32, 33, 0.9)
		this.#imageWalkingLeft = imageManager.getImage('player-sprites-walking-left.png')
		this.#imageWalkingRight = imageManager.getImage('player-sprites-walking-right.png')
		this.#imageIdle = imageManager.getImage('player-sprites-idle.png')
		this.#imagePulse = imageManager.getImage('lightning-sprites.png')

		this.#animationIdle = new Animation(new Rectangle(0, 0, WIDTH, HEIGHT), 15, 400)
		this.#animationWalking = new Animation(new Rectangle(0, 0, WIDTH, HEIGHT), 3, 150)
		this.#animationPulse = new Animation(new Rectangle(0, 0, 400, 10), 4)
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

		this.#animationWalking.update(elapsed)
		this.#animationIdle.update(elapsed)

		/*if(this.#fade) {
			this.#fadeColour = this.#fadeColour.copy(1 - (this.#fade.elapsed / this.#fade.span))

			if(this.#fade.next(elapsed)) {
				this.#fade = null
			}
		}*/		
	}

	render(gfx) {
		//gfx.fillCircle(this.bounds, this.#colour)

		/*if(this.#fade) {
			gfx.drawCircle(this.bounds.grow(ENEMY_AWARENESS), this.#fadeColour)
		}*/

		this.#pulseTargets.forEach((target, idx) => {
			//gfx.drawSprite(this.#imagePulse, this.#animationPulse.drawingRect, new Rectangle(this.bounds.centroid.x, this.bounds.centroid.y, 200, 10), false, false)
			//gfx.drawLine([this.bounds.centroid, target], idx === 0 ? 'white' : 'black')

			const distance = target.distance(this.bounds.centroid)
			const delta = target.subtract(this.bounds.centroid)
			const angle = Math.atan2(delta.y, delta.x)

			//gfx.drawImage()
			console.log(distance)

			gfx.context.save()
			gfx.context.translate(this.bounds.centroid.x, this.bounds.centroid.y)
			gfx.context.rotate(angle + Math.PI / 2)
			/*gfx.context.drawImage(
				this.#imagePulse,
				this.#animationPulse.drawingRect.x,
				this.#animationPulse.drawingRect.y,
				this.#animationPulse.drawingRect.w,
				this.#animationPulse.drawingRect.h,
				0,
				0,
				-distance,
				10
			)*/

			gfx.context.drawImage(
				this.#imagePulse,
				this.#animationPulse.drawingRect.x,
				this.#animationPulse.drawingRect.y,
				this.#animationPulse.drawingRect.w,
				this.#animationPulse.drawingRect.h,
				-this.#animationPulse.drawingRect.h / 2,
				-distance,
				this.#animationPulse.drawingRect.h,
				distance,
			)
			gfx.context.restore()
/*
const drawStretchedImage = (
	ctx: CanvasRenderingContext2D,
	img: HTMLImageElement,
	x1: number,
	y1: number,
	x2: number,
	y2: number
) => {
	const dx = x2 - x1;
	const dy = y2 - y1;
	const distance = Math.sqrt(dx * dx + dy * dy);
	const angle = Math.atan2(dy, dx);

	ctx.save();
	ctx.translate(x1, y1);
	// rotate so that "up" points toward (x2, y2)
	ctx.rotate(angle + Math.PI / 2);
	// draw image with bottom centre at origin, stretching height to match distance
	ctx.drawImage(img, -img.width / 2, -distance, img.width, distance);
	ctx.restore();
};
*/

		})

		if(this.#state === PlayerState.WALKING_LEFT) {
			gfx.drawSprite(this.#imageWalkingLeft, this.#animationWalking.drawingRect, this.bounds)
		}
		else if(this.#state === PlayerState.WALKING_RIGHT) {
			gfx.drawSprite(this.#imageWalkingRight, this.#animationWalking.drawingRect, this.bounds)
		}
		else {
			gfx.drawSprite(this.#imageIdle, this.#animationIdle.drawingRect, this.bounds)
		}
	}
}
