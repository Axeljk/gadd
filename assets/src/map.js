import { kTileSize, kPremadeMaps } from "./constants.js"
import { Generate } from "./map_gen.js"

export default class Map {
	constructor(scene) {
		this.scene = scene;
		this.map = undefined;
		this.level = undefined;
	}
	LoadLevel(level="lvl1", tiles="tiles") {
		this.scene.load.image(tiles, "assets/img/" + tiles + ".png");
		if (kPremadeMaps.includes(level))
			this.scene.load.tilemapCSV(level, "assets/map/" + level + ".csv");
	}
	NewLevel(level="lvl1", tiles="tiles") {
		// Defines map.
		if (kPremadeMaps.includes(level)) {
			this.map = this.scene.make.tilemap({
				key: level,
				tileWidth: kTileSize,
				tileHeight: kTileSize
			});
		} else {
			this.map = this.scene.make.tilemap({
				data: Generate(Phaser.Math.Between(16, 40), Phaser.Math.Between(11, 25)),
				tileWidth: kTileSize,
				tileHeight: kTileSize
			});
		}

		// Defines level.
		this.level = this.map.createLayer(0, this.map.addTilesetImage(tiles));
		this.level.setCollisionBetween(4, 11);
		this.level.setTileIndexCallback(13, () => {
				this.scene.registry.destroy();
				this.scene.events.off();﻿
				this.scene.scene.restart({lvl: level});
			}, this.scene);
		this.level.setTileIndexCallback(14, (x, y) => {
			this.map.putTileAt(15, x, y);
			if (this.map.getTileAt(x, y - 1).index == 8)
				this.map.putTileAt(4, x, y - 1);
		}, this.scene);
		this.level.setTileIndexCallback(16, (x, y) => {
			this.map.putTileAt(17, x, y);
		}, this.scene);
		this.level.setTileIndexCallback(18, (x, y) => {
			this.map.putTileAt(19, x, y);
		}, this.scene);
	}
	CheckCollision(x, y) {
		return (this.level.getTileAt(x, y).collides === true);
	}
	Get(x, y) {
		return this.map.getTileAt(x, y);
	}
	Map() {
		return this.map;
	}
}