import { Generate } from "./map_gen.js";

const kTileSize = 16;
const kMinTilesVisible = 10;
const kMaxTilesVisible = 16;

let zoomLevel = Math.floor(Math.min(window.innerWidth, window.innerHeight) / kTileSize / (kMinTilesVisible + 1));
let height = Math.min(kMaxTilesVisible, Math.floor(window.innerHeight / kTileSize / zoomLevel) - 1);
let width = Math.min(kMaxTilesVisible, Math.floor(window.innerWidth / kTileSize / zoomLevel) - 1);

const config = {
	audio: {
		noAudio: true
	},
	type: Phaser.AUTO,
	width: width * kTileSize,
	height: height * kTileSize,
	pixelArt: true,
	scale: {
		autoCenter: Phaser.Scale.CENTER_BOTH,
		zoom: zoomLevel
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
var level_gen;
var map;
var player;
var input_;
var input_pos;

function init(data) {
	if (data.level === undefined)
		level = 1;
	else
		level = data.level + 1;

	// Check if next level exists to determine whether it needs to be generated.
	let next_level = new XMLHttpRequest();
	next_level.open("Head", "assets/map/level" + level + ".csv", false);
	next_level.send();
	if (next_level.status >= 400)
		level_gen = true;
	else
		level_gen = false;
}
function preload() {
	this.load.image("tiles", "assets/img/tiles.png");
	if (level_gen === false)
		this.load.tilemapCSV("lvl" + level, "assets/map/level" + level + ".csv");
	this.load.spritesheet('p', 'assets/img/player.png', { frameWidth: 16, frameHeight: 16 });
}
function create() {
	// Tilemap code dump. For now™.
	if (level_gen === false)
		map = this.make.tilemap({ key: "lvl" + level, tileWidth: kTileSize, tileHeight: kTileSize });
	else {
		let data = Generate(Phaser.Math.Between(16, 40), Phaser.Math.Between(11, 25));
		map = this.make.tilemap({ data, tileWidth: kTileSize, tileHeight: kTileSize});
	}
	var tileset = map.addTilesetImage('tiles');
    var layer = map.createLayer(0, tileset, 0, 0);
	map.setCollisionBetween(4,11);
    layer.skipCull = true;
	layer.setTileIndexCallback(13, () => { this.registry.destroy(); this.events.off();﻿ this.scene.restart({level: level}); }, this);
	layer.setTileIndexCallback(14, (map, x, y) => { map.putTileAt(15, x, y); if (map.getTileAt(x, y - 1).index == 8) map.putTileAt(4, x, y - 1); }, this);
	layer.setTileIndexCallback(16, (map, x, y) => { map.putTileAt(17, x, y); }, this);
	layer.setTileIndexCallback(18, (map, x, y) => { map.putTileAt(19, x, y); }, this);

	// Player sprite code dump. For now™.
	player = this.add.sprite(0, 0, "p", 0).setOrigin(0,0);

	// Camera code dump. For now™.
	this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
	this.cameras.main.startFollow(player, true);

	// Controls.
	this.input.keyboard.enabled = true;
	input_ = this.input.keyboard.createCursorKeys();
	input_pos = map.getTileAt(1, 1);
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
	let dest = map.getTileAt(x, y);
	let delay = 100;

	if (dest === null) {

	} else if (dest.collides) {
		delay = 25;
	} else {
		success = true;
		input_pos = map.getTileAt(x, y);
		player.setPosition(input_pos.getLeft(), input_pos.getTop());

		if (map.layers[0].callbacks[input_pos.index] != undefined)
			map.layers[0].callbacks[input_pos.index].callback(map, x, y);
	}
	scene.input.keyboard.resetKeys();
	scene.input.keyboard.enabled = false;
	scene.time.delayedCall(delay, () => { scene.input.keyboard.enabled = true; });
}