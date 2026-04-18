
import { Rectangle } from './Rectangle.js'

export class Point {
	constructor(x, y) {
		if(x.constructor === Object) {
			y = x.y
			x = x.x
		}

		this.x = x
		this.y = y
	}
	
	toString() {
		return "{ x = " + this.x + ", y = " + this.y + " }"
	}

	copy() {
		return new Point(this.x, this.y)
	}

	add(x, y) {
		if(x.constructor === Point || x.constructor === Rectangle) {
			y = x.y
			x = x.x
		}

		y = y || x

		return new Point(this.x + x, this.y + y)
	}

	subtract(x, y) {
		if(x.constructor === Point || x.constructor === Rectangle) {
			y = x.y
			x = x.x
		}

		y = y || x

		return new Point(this.x - x, this.y - y)
	}

	divide(x, y) {
		if(x.constructor === Point || x.constructor === Rectangle) {
			y = x.y
			x = x.x
		}

		y = y || x
	
		return new Point(this.x / x, this.y / y)
	}

	multiply(x, y) {
		if(x.constructor === Point || x.constructor === Rectangle) {
			y = x.y
			x = x.x
		}

		y = y || x

		return new Point(this.x * x, this.y * y)
	}

	distance(x, y) {
		if(x.constructor === Point || x.constructor === Rectangle) {
			y = x.y
			x = x.x
		}

		const dx = this.x - x
		const dy = this.y - y
		
		return Math.sqrt(dx * dx + dy * dy)
	}
}
