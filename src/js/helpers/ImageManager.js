
export class ImageManager {
	#paths = []
	#images = {}

	constructor(paths = []) {
		this.#paths = paths
	}

	init(callback) {
		let readyCount = 0

		this.#paths.forEach(path => {
			const image = new Image()

			image.src = path
			image.onload = () => {
				++readyCount

				if(readyCount >= this.#paths.length) {
					callback()
				}
			}

			this.#images[path] = image
		})
	}

	getImage(path) {
		if(!(path in this.#images)) {
			throw new Error(`Image '${ path }' not found`)
		}

		return this.#images[path]
	}

	getImages(...paths) {
		return paths.map(path => this.getImage(path))
	}
}
