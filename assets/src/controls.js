import global, { kTileSize, kDelay, kDelayShort } from "./constants.js";

export function EnableControls(scene, map) {
	global.keyboard = scene.input.keyboard;
	global.keyboard.enabled = true;

	// Primary keys.
	global.keyboard.on("keydown-" + global.key_up, () => {
		MoveTo(scene, 0, -1);
	}, scene);
	global.keyboard.on("keydown-" + global.key_left, () => {
		MoveTo(scene, -1, 0);
	}, scene);
	global.keyboard.on("keydown-" + global.key_down, () => {
		MoveTo(scene, 0, 1);
	}, scene);
	global.keyboard.on("keydown-" + global.key_right, () => {
		MoveTo(scene, 1, 0);
	}, scene);

	// Secondary keys.
	global.keyboard.on("keydown-" + global.key_up2, () => {
		MoveTo(scene, 0, -1);
	}, scene);
	global.keyboard.on("keydown-" + global.key_left2, () => {
		MoveTo(scene, -1, 0);
	}, scene);
	global.keyboard.on("keydown-" + global.key_down2, () => {
		MoveTo(scene, 0, 1);
	}, scene);
	global.keyboard.on("keydown-" + global.key_right2, () => {
		MoveTo(scene, 1, 0);
	}, scene);

	// Initial position on map.
	global.player.setPosition(kTileSize, kTileSize);
}

export function MoveTo(scene, x, y) {
	let cur_x = Math.floor(global.player.x / kTileSize);
	let cur_y = Math.floor(global.player.y / kTileSize);
	let dest = global.map.Get(cur_x + x, cur_y + y);
	let delay = kDelay;

	if (dest === null) {
		delay = kDelayShort;
	} else if (dest.collides) {
		delay = kDelayShort;
	} else {
		global.player.setPosition(dest.getLeft(), dest.getTop());

		if (global.map.Map().layer.callbacks[dest.index] != undefined)
			global.map.Map().layer.callbacks[dest.index].callback(dest.x, dest.y);
	}

	global.keyboard.resetKeys();
	global.keyboard.enabled = false;
	scene.time.delayedCall(delay, () => { global.keyboard.enabled = true; });
}