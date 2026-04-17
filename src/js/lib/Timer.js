
export class Timer {
	#timer = null;
	#update = null;
	#interval = null;

	constructor(update, interval) {
		this.#update = update;
		this.#interval = interval;
	}

	start() {
		const start = (new Date()).getTime();
		let last = start;

		const step = () => {
			const current = (new Date()).getTime();

			this.#update({
				total: current - start,
				elapsed: current - last
			});

			last = current;
		}

		this.#timer = window.setInterval(step, this.#interval);
	}

	stop() {
		window.clearInterval(this.#timer);

		this.#timer = null;
		this.onstop();
	}

	running() {
		return timer !== null;
	}

	toString() {
		return "[object Timer]";
	}

	onstop() {}

	restart() {
		this.stop();
		this.start();
	}
}
