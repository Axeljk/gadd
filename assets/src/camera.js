import { kTileSize, kMinTilesVisible, kMaxTilesVisible } from "./constants.js";

export function CalcZoom() {
	return Math.floor(Math.min(window.innerWidth, window.innerHeight) / kTileSize / (kMinTilesVisible + 1));
}
export function CalcHeight() {
	return Math.min(kMaxTilesVisible, Math.floor(window.innerHeight / kTileSize / CalcZoom()) - 1) * kTileSize;
}
export function CalcWidth() {
	return Math.min(kMaxTilesVisible, Math.floor(window.innerWidth / kTileSize / CalcZoom()) - 1) * kTileSize;
}

export function CameraInit(scene, map, player) {
	scene.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
	scene.cameras.main.startFollow(player, true);
}