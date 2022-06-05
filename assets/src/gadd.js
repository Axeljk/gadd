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
		preload: preload,
		create: create,
		update: update
	}
};
const gadd = new Phaser.Game(config);
var map;
var player;
var input;
var input_pos;
var movement_lock = false;

function preload() {
	this.load.image("tiles", "assets/img/tiles.png");
	this.load.tilemapCSV("lvl1", "assets/map/level1.csv");
	this.load.spritesheet('p', 'assets/img/player.png', { frameWidth: 16, frameHeight: 16 });
}
function create() {
	// Tilemap code dump. For now™.
	map = this.make.tilemap({ key: "lvl1", tileWidth: kTileSize, tileHeight: kTileSize });
	var tileset = map.addTilesetImage('tiles');
    var layer = map.createLayer(0, tileset, 0, 0);
    layer.skipCull = true;

	// Player sprite code dump. For now™.
	player = this.add.sprite(0, 0, "p", 0).setOrigin(0,0);

	// Controls.
	input = this.input.keyboard.createCursorKeys();
	input_pos = map.getTileAt(1, 1);
	player.setPosition(input_pos.getLeft(), input_pos.getTop());
}
function update() {
	if (input.up.isDown) {
		input_pos = map.getTileAt(input_pos.x, input_pos.y-1);
		player.setPosition(input_pos.getLeft(), input_pos.getTop());
		this.input.keyboard.resetKeys();
		this.input.keyboard.enabled = false;
		this.time.delayedCall(100, () => { this.input.keyboard.enabled = true; });
	} else if (input.right.isDown) {
		input_pos = map.getTileAt(input_pos.x+1, input_pos.y);
		player.setPosition(input_pos.getLeft(), input_pos.getTop());
		this.input.keyboard.resetKeys();
		this.input.keyboard.enabled = false;
		this.time.delayedCall(100, () => { this.input.keyboard.enabled = true; });
	} else if (input.down.isDown) {
		input_pos = map.getTileAt(input_pos.x, input_pos.y+1);
		player.setPosition(input_pos.getLeft(), input_pos.getTop());
		this.input.keyboard.resetKeys();
		this.input.keyboard.enabled = false;
		this.time.delayedCall(100, () => { this.input.keyboard.enabled = true; });
	} else if (input.left.isDown) {
		input_pos = map.getTileAt(input_pos.x-1, input_pos.y);
		player.setPosition(input_pos.getLeft(), input_pos.getTop());
		this.input.keyboard.resetKeys();
		this.input.keyboard.enabled = false;
		this.time.delayedCall(100, () => { this.input.keyboard.enabled = true; });
	}
}