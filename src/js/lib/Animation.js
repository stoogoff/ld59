
import { Interval } from './Interval.js'
import { Rectangle } from './Rectangle.js'

export class Animation {
	#animation
	#currentFrame = 0
	#frames = 1
	#looping = true
	#drawingRect

	constructor(bounds, frames, speed = 100, looping = true) {
		this.#frames = frames
		this.#animation = new Interval(speed)
		this.#looping = looping
		this.#drawingRect = bounds
	}

	get drawingRect() {
		return this.#drawingRect
	}

	update(elapsed) {
		if(this.#animation.next(elapsed)) {
			++this.#currentFrame

			if(this.#currentFrame >= this.#frames) {
				this.#currentFrame = this.#looping ? 0 : this.#frames
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
