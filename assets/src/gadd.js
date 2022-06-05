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
		create: create
	}
};
const gadd = new Phaser.Game(config);

function preload () {
	this.load.image("tiles", "assets/img/tiles.png");
	this.load.tilemapCSV("lvl1", "assets/map/level1.csv");
}

function create () {
	var map = this.make.tilemap({ key: "lvl1", tileWidth: kTileSize, tileHeight: kTileSize });
	var tileset = map.addTilesetImage('tiles');
    var layer = map.createLayer(0, tileset, 0, 0);
    layer.skipCull = true;
}