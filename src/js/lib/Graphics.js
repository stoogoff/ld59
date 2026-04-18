
import { Rectangle } from './Rectangle.js'

export class Graphics {
	#screen
	#context
	#width
	#height

	constructor(canvas) {
		this.#screen = canvas.constructor === String ? document.getElementById(canvas) : canvas
		this.#context = this.#screen.getContext('2d')

		this.#width = this.#screen.offsetWidth
		this.#height = this.#screen.offsetHeight

		this.#context.canvas.width = this.#width
		this.#context.canvas.height = this.#height
	}

	toString() {
		return "[object Graphics]"
	}

	set background(colour) {
		this.#screen.style.backgroundColor = colour.toString()
	}

	get context() {
		return this.#context
	}

	get width() {
		return this.#width
	}

	get height() {
		return this.#height
	}

	get viewport() {
		return new Rectangle(0, 0, this.#width, this.#height)
	}

	begin() {
		this.#context.clearRect(0, 0, this.width, this.height)
	}

	draw(rect, colour) {
		this.#context.strokeStyle = colour.toString()
		this.#context.strokeRect(rect.x, rect.y, rect.w, rect.h)
	}

	fill(rect, colour) {
		this.#context.fillStyle = colour.toString()
		this.#context.fillRect(rect.x, rect.y, rect.w, rect.h)
	}

	#circle(rect, colour) {
		this.#context.beginPath()
		this.#context.fillStyle = colour.toString()
		this.#context.arc(rect.centroid.x, rect.centroid.y, rect.w / 2, 0, Math.PI * 2, true) 
		this.#context.closePath()
	}

	drawCircle(rect, colour) {
		this.#circle(rect, colour)
		this.#context.stroke()
	}

	fillCircle(rect, colour) {
		this.#circle(rect, colour)
		this.#context.fill()
	}

	drawLine(points, colour, width = 2) {
		if(points.length === 0) return

		this.#context.beginPath()
		this.#context.strokeStyle = colour.toString()
		this.#context.lineWidth = width
		this.#context.moveTo(points[0].x, points[0].y)

		for(let i = 1; i < points.length; i++) {
			this.#context.lineTo(points[i].x, points[i].y)
		}

		this.#context.closePath()
		this.#context.stroke()
	}

	drawSprite(image, source, destination, flip, angle) {
		if(flip) {
			this.#context.save()
			this.#context.translate(destination.x, destination.y)
			this.#context.scale(-1, 1)
			this.#context.translate(-(destination.w || source.w), 0)
			destination.x = destination.y = 0
		}

		if(angle) {
			var offset = new Point(destination.x + (destination.w || source.w) / 2, destination.y + (destination.h || source.h))
			this.#context.save()
			this.#context.translate(offset.x, offset.y)
			this.#context.rotate(angle * (Math.PI / 180))
			this.#context.translate(-offset.x, -offset.y)
		}

		this.#context.drawImage(image, source.x, source.y, source.w, source.h, destination.x, destination.y, destination.w || source.w, destination.h || source.h)

		if(flip || angle) {
			this.#context.restore()
		}
	}

	drawImage(image, source) {
		this.#context.drawImage(image, source.x, source.y)
	}
}
