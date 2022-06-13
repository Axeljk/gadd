// Constants regarding the map.
export const kMaxTilesVisible = 16;
export const kMinTilesVisible = 10;
export const kPremadeMaps = ["lvl1", "lvl2"];
export const kTileSize = 16;

// Constants regarding controls.
export const kDelay = 100;
export const kDelayShort = 25;

// Global variables. These are mutable.
export default {
	level: undefined,
	map: undefined,
	player: undefined,
	keyboard: undefined,
	key_up: "W",
	key_up2: "UP",
	key_left: "A",
	key_left2: "LEFT",
	key_down: "S",
	key_down2: "DOWN",
	key_right: "D",
	key_right2: "RIGHT"
};