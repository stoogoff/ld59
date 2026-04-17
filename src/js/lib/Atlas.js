
export class Atlas {
	constructor(json, image) {
		var ready = 2;

		this.sprites = new Image();
		this.sprites.onload = _.bind(function() {
			if (--ready == 0)
				this.onload();
		}, this);
		this.sprites.src = image;
		this.data = {};

		new microAjax(json, _.bind(function(response) {
			var data = JSON.parse(response).frames;
			for (var i in data) {
				var key = i.replace('.png', '');
				var frame = data[i].frame;
				this.data[key] = new Rectangle(frame.x, frame.y, frame.w, frame.h);
			}
			if (--ready == 0)
				this.onload();
		}, this));


		this.get = function(id) {
			return this.data[id] ? this.data[id] : new Rectangle(0, 0, 0);
		};
		this.toString = function() {
			return '[object Atlas]';
		};
		this.onload = function() {};
		if (ready == 0)
			this.onload();
	};
}