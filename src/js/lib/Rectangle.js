
import { Point } from './Point.js'

export class Rectangle {
	constructor(x, y, w, h) {
		if(x.constructor === Object) {
			h = x.h
			w = x.w
			y = x.y
			x = x.x
		}

		this.x = x
		this.y = y
		this.w = w
		this.h = h || w
	}

	toString() {
		return "[object Rectangle: x = " + this.x + ", y = " + this.y + ", width = " + this.w + ", height = " + this.h + "]"
	}

	get top() {
		return this.y
	}

	get left() {
		return this.x
	}

	get bottom() {
		return this.y + this.h
	}

	get right() {
		return this.x + this.w
	}

	get width() {
		return this.w
	}

	get height() {
		return this.h
	}

	get centroid() {
		return new Point(this.x + this.w / 2, this.y + this.h / 2)
	}

	copy() {
		return new Rectangle(this.x, this.y, this.w, this.h)
	}

	contains(x, y, w, h) {
		w = w || 0
		h = h || 0

		if(x.constructor === Point) {
			y = x.y
			x = x.x
		}
		else if(x.constructor === Rectangle) {
			w = x.w
			h = x.h
			y = x.y
			x = x.x
		}
		return x >= this.x && x + w <= this.x + this.w && y >= this.y && y + h <= this.y + this.h
	}

	intersects(x, y, w, h) {
		if(x.constructor === Rectangle) {
			w = x.w
			h = x.h
			y = x.y
			x = x.x
		}
		else if(x.constructor === Point) {
			w = h = 1
			y = x.y
			x = x.x
		}

		return !(this.x >= x + w || this.x + this.w <= x || this.y >= y + h || this.y + this.h <= y)
	}

	grow(x, y) {
		y = y || x
		return new Rectangle(this.x - x, this.y - y, this.w + x * 2, this.h + y * 2)
	}

	bounds(x, y, w, h) {
		if(x.constructor === Rectangle) {
			w = x.w
			h = x.h
			y = x.y
			x = x.x
		}

		let constrained = false

		if(this.x < x) {
			this.x = x
			constrained = true
		}

		if(this.y < y) {
			this.y = y
			constrained = true
		}

		if(this.x + this.w > x + w) {
			this.x = x + w - this.w
			constrained = true
		}

		if(this.y + this.h > y + h) {
			this.y = y + h - this.h
			constrained = true
		}

		return constrained
	}
}
