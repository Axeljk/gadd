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
	
}

function create () {
	var logo = this.add.text(0, 0, height + " x " + width, { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
}