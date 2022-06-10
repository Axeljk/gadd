import { CalcZoom, CalcHeight, CalcWidth, CameraInit } from "./camera.js";
import Map from "./map.js";

const config = {
	audio: {
		noAudio: true
	},
	type: Phaser.AUTO,
	width: CalcWidth(),
	height: CalcHeight(),
	pixelArt: true,
	scale: {
		autoCenter: Phaser.Scale.CENTER_BOTH,
		zoom: CalcZoom()
	},
	scene: {
		init: init,
		preload: preload,
		create: create,
		update: update
	}
};
const gadd = new Phaser.Game(config);

var level;
var player;
var input_;
var input_pos;
var map;


function init(data) {
	if (data.lvl === undefined)
		level = "lvl1";
	else {
		// \D is any not-number. /.../g is replacing all of them. Add one.
		let tmp = parseInt(data.lvl.replace(/\D/g, "")) + 1;
		// \d is any number. Replacing all(+) of them with new number.
		level = data.lvl.replace(/\d+/, tmp);
	}

	map = new Map(this);
}
function preload() {
	map.LoadLevel(level);
	this.load.spritesheet('p', 'assets/img/player.png', { frameWidth: 16, frameHeight: 16 });
}
function create() {
	// Tilemap code dump. For now™.
	map.NewLevel(level);

	// Player sprite code dump. For now™.
	player = this.add.sprite(0, 0, "p", 0).setOrigin(0,0);

	// Camera code dump. For now™.
	CameraInit(this, map.Map(), player);

	// Controls.
	this.input.keyboard.enabled = true;
	input_ = this.input.keyboard.createCursorKeys();
	input_pos = map.Get(1, 1);
	player.setPosition(input_pos.getLeft(), input_pos.getTop());
}
function update() {
	if (input_.up.isDown) {
		MoveTo(this, input_pos.x, input_pos.y-1);
	} else if (input_.right.isDown) {
		MoveTo(this, input_pos.x+1, input_pos.y);
	} else if (input_.down.isDown) {
		MoveTo(this, input_pos.x, input_pos.y+1);
	} else if (input_.left.isDown) {
		MoveTo(this, input_pos.x-1, input_pos.y);
	}
}

function MoveTo(scene, x, y) {
	let success = false;
	let dest = map.Get(x, y);
	let delay = 100;

	if (dest === null) {

	} else if (dest.collides) {
		delay = 25;
	} else {
		success = true;
		input_pos = map.Get(x, y);
		player.setPosition(input_pos.getLeft(), input_pos.getTop());

		if (map.Map().layer.callbacks[input_pos.index] != undefined)
			map.Map().layer.callbacks[input_pos.index].callback(x, y);
	}
	scene.input.keyboard.resetKeys();
	scene.input.keyboard.enabled = false;
	scene.time.delayedCall(delay, () => { scene.input.keyboard.enabled = true; });
}