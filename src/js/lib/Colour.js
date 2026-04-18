
import { clamp } from './utils.js'

export class Colour {
	constructor(r, g, b, a) {
		if(r.constructor === Object) {
			a = r.a
			b = r.b
			g = r.g
			r = r.r
		}
		this.r = Math.ceil(r)
		this.g = Math.ceil(g)
		this.b = Math.ceil(b)
		this.a = a === undefined ? 1 : a
	}

	toString() {
		return "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + this.a + ")"
	}

	toStringNoA() {
		return "rgb(" + this.r + ", " + this.g + ", " + this.b + ")"
	}

	copy(a) {
		return new Colour(this.r, this.g, this.b, clamp(a || this.a, 0, 1))
	}

	equals(colour) {
		if(colour.constructor !== Colour) {
			return false
		}

		return this.r === colour.r && this.g === colour.g && this.b === colour.b
	}
}
