
export class Point {
	constructor(x, y) {
		if(x.constructor === Object) {
			y = x.y;
			x = x.x;
		}

		this.x = x;
		this.y = y;
	}
	
	toString() {
		return "{ x = " + this.x + ", y = " + this.y + " }";
	}

	copy() {
		return new Point(this.x, this.y);
	}

	add(point) {
		if(point.constructor !== Point) {
			return;
		}

		return new Point(this.x + point.x, this.y + point.y);
	}

	divide(x, y) {
		y = y || x;
	
		return new Point(this.x / x, this.y / y);
	}

	multiply(x, y) {
		y = y || x;

		return new Point(this.x * x, this.y * y);
	}
}
