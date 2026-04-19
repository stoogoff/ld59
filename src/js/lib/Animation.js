
import { Interval } from './Interval.js'
import { Rectangle } from './Rectangle.js'

export class Animation {
	#animation
	#currentFrame = 0
	#frames = 1
	#looping = true
	#drawingRect
	#startingFrame

	constructor(bounds, frames, speed = 100, looping = true, offset = 0) {
		this.#frames = frames
		this.#animation = new Interval(speed)
		this.#looping = looping
		this.#drawingRect = bounds
		this.#currentFrame = offset
		this.#startingFrame = offset
	}

	get drawingRect() {
		return this.#drawingRect
	}

	update(elapsed) {
		if(this.#animation.next(elapsed)) {
			++this.#currentFrame

			if(this.#currentFrame >= this.#frames) {
				this.#currentFrame = this.#looping ? this.#startingFrame : this.#frames
			}

			this.#drawingRect = new Rectangle(
				this.#drawingRect.w * this.#currentFrame,
				this.#drawingRect.y,
				this.#drawingRect.w,
				this.#drawingRect.h,
			)
		}
	}
}
