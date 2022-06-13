import global from "./constants.js";
import { CalcZoom, CalcHeight, CalcWidth, CameraInit } from "./camera.js";
import { EnableControls, MoveTo } from "./controls.js";
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


function init(data) {
	if (data.lvl === undefined)
		global.level = "lvl1";
	else {
		// \D is any not-number. /.../g is replacing all of them. Add one.
		let tmp = parseInt(data.lvl.replace(/\D/g, "")) + 1;
		// \d is any number. Replacing all(+) of them with new number.
		global.level = data.lvl.replace(/\d+/, tmp);
	}

	global.map = new Map(this);
}
function preload() {
	global.map.LoadLevel(global.level);
	this.load.spritesheet('p', 'assets/img/player.png', { frameWidth: 16, frameHeight: 16 });
}
function create() {
	// Tilemap code dump. For now™.
	global.map.NewLevel(global.level);

	// Player sprite code dump. For now™.
	global.player = this.add.sprite(0, 0, "p", 0).setOrigin(0,0);

	// Camera code dump. For now™.
	CameraInit(this, global.map.Map(), global.player);

	// Controls.
	EnableControls(this, global.map);
}
function update() {
}