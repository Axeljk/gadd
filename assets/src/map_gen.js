const kHorizontal = 1;
const kVertical = 2;

export function Generate(x, y) {
	// Create Large array for entire level.
	let data = new Array();
	for (let i = 0; i < y; i++)
		data.push(new Array(x).fill(0));

//	TunnelGen(x, y, data);
	// data = Room(x, y);

	// Create rooms.
	let room_width = Math.floor(x / 2) + Phaser.Math.Between(-3, 3);
	let room1 = Room(room_width, y);
	let room2 = Room(x - room_width + 1, y);

	// Copy room data to entire map data.
	for (let i = 0; i < y; i++) {
		for (let j = 0; j < room_width; j++) {
			data[i][j] = room1[i][j];
		}
		for (let j = 0; j < x - room_width + 1; j++) {
			data[i][j + room_width - 1] = room2[i][j];
		}
	}

	// Create doorway between the two rooms.
	let doorless = true;
	while (doorless) {
		let door_y = Phaser.Math.Between(1, y - 2);

		if (data[door_y][room_width] === 0 && data[door_y][room_width - 2] === 0) {
			data[door_y][room_width - 1] = 0;
			doorless = false;
		}
	}

	// Change top-down walls to side-view walls where appropriate.
	for (let i = 0; i < y - 1; i++) {
		for (let j = 0; j < x; j++) {
			if (data[i][j] == 8 && data[i + 1][j] != 8)
				data[i][j] = 4;
		}
	}
	for (let j = 0; j < x; j++) {
		if (data[y-1][j] == 8)
			data[y-1][j] = 4;
	}

	// Add escalator up to the previous floor by your feet.
	data[1][1] = 12;

	// Add escalator down to the next floor.
	let way_down = false;
	while (way_down === false) {
		let tile_x = Math.floor(Math.random() * x);
		let tile_y = Math.floor(Math.random() * y);

		if (data[tile_y][tile_x] == 0) {
			data[tile_y][tile_x] = 13;
			way_down = true;
		}
	}

	return data;
}

function TunnelGen(x, y, data) {
	let t = new Tunnel(x, y);
	t.Plow(data);
}

class Tunnel {
	constructor(width, height) {
		this.width = width;
		this.height = height;
	}
	Plow(data) {
		let x = Phaser.Math.Between(1, this.width - 2);
		let y = Phaser.Math.Between(1, this.height - 2);

		let furthest_wall = 0;
		// Draw main tunnel by getting furthest wall.
		if (Math.abs(x - this.width/2) > Math.abs(y - this.height/2)) {
			if (x < this.width / 2)
				furthest_wall = 1;
			else
				furthest_wall = 3;
		} else {
			if (y < this.height / 2)
				furthest_wall = 2;
			else
				furthest_wall = 0;
		}

		// vertical movement
		// set 

		// horizontal movement
	}
	Draw(x, y, data) {
		if (this.Valid(x, y))
			data[y][x] = 8;
	}
	Valid(x, y) {
		if (x >= 0 && x < this.width) {
			if (y >= 0 && y < this.height)
				return true;
		}
	}
}

function Room(width, height) {
	let style = Phaser.Math.Between(0, 1);
	// Style:	1 = Subdivide
	//			2 = Crawler

	let d = new Array();
	for (let i = 0; i < height; i++)
		d.push(new Array(width).fill(0));
	if (style === 0) {
		return Subdivide(width, height, d);
	} else if (style === 1) {
		return Crawler(width, height);
	}
}

function Crawler(x, y, data=[]) {
	// random spot for crawler to start.
	let start_x = Phaser.Math.Between(1, x - 4);
	let start_y = Phaser.Math.Between(1, y - 4);
	let worms = Math.max(2, Math.floor(x * y / 32));
	let d = new Array();
	for (let i = 0; i < y - 2; i++)
		d.push(new Array(x - 2).fill(0));

	let jims = new Array(worms).fill(new Worm(x - 2, y - 2));
	for (let i = 0; i < jims.length; i++) {
		jims[i].RNGStart(d);
		jims[i].Crawl(d);
		for (let j = 0; j < jims[i].children.length; j++)
			jims[i].children[j].Crawl(d);
	}

	// Add wall around crawler area/room.
	for (let i = 0; i < d.length; i++) {
		d[i].unshift(8);
		d[i].push(8);
	}
	d.unshift(new Array(x).fill(8));
	d.push(new Array(x).fill(8));

	return d;
}

function Subdivide(x, y, data, offset_x=0, offset_y=0) {
	let root = new Node(0, 0, x, y, null);
	let rooms = new Array();
	rooms.push(root);
	rooms = rooms.concat(root.Split());
	for (let i = 1; i < 7; i++)
		rooms = rooms.concat(rooms[i].Split());
	for (let i = 0; i < rooms.length; i++) {
		if (rooms[i].IsBottom())
			rooms[i].Furnish(data);
	}
	for (let i = 0; i < rooms.length; i++) {
		if (rooms[i].IsBottom())
			rooms[i].Door(data);
	}

	return data;
}

class Node {
	constructor(x, y, width, height, parent) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.split = this.height > this.width ? kVertical : kHorizontal;
		this.parent = parent;
		this.children = [];
	}
	AddChild(x, y, width, height) {
		this.children.push(new Node(x, y, width, height, this));
	}
	Split() {
		if (this.width > this.height * 2)
			this.split = kVertical;
		else if (this.width < this.height / 2)
			this.split = kHorizontal;
		else
			this.split = Phaser.Math.Between(kHorizontal, kVertical);

		let space = (this.split === kVertical ? this.width : this.height);
		let wide = (this.split === kVertical ? this.height : this.width);
		let ratio = Math.max(3, Math.min(Math.floor(wide / 3), Math.floor(space/3)));

		if (space < 6)
			return [];

		let slice = Phaser.Math.Between(ratio, space - ratio);

		if (this.split === kVertical) {
			this.AddChild(0, 0, slice, wide);
			this.AddChild(slice, 0, space - slice, wide);
		} else {
			this.AddChild(0, 0, wide, slice);
			this.AddChild(0, slice, wide, space - slice);
		}

		return this.children;
	}
	Furnish(data) {
		for (let i = this.AbsY(); i < this.AbsY() + this.height; i++) {
			for(let j = this.AbsX(); j < this.AbsX() + this.width; j++) {
				if (i === data.length - 1)
					data[i][j] = 8;
				else if (j === this.AbsX())
					data[i][j] = 8; //16
				else if (j === data[i].length - 1)
					data[i][j] = 8; //16
				else if (i === this.AbsY())
					data[i][j] = 8; //8
				else
					data[i][j] = 0;
			}
		}
	}
	Door(map) {
		if (this.parent == null)
			return;

		let success = false;
		do {
			if (this.parent.split === kVertical && this.IsFirst() === false) {
				let d = Phaser.Math.Between(1, this.height - 2);

				if (map[d + this.AbsY()][this.AbsX() - 1 ] != 8
					&& map[d + this.AbsY()][this.AbsX() + 1 ] != 8) {
					map[d + this.AbsY()][this.AbsX()] = 0;
					success = true;
				}
			} else if (this.parent.split === kHorizontal && this.IsFirst() === false) {
				let d = Phaser.Math.Between(1, this.width - 2);

				if (map[this.AbsY() - 1][this.AbsX() + d] != 8
					&& map[this.AbsY() + 1][this.AbsX() + d ] != 8) {
					map[this.AbsY()][this.AbsX() + d] = 0;
					success = true;
				}
			} else if (this.IsFirst() && this.parent != null) {
				this.parent.Door(map);
				success = true;
			}
		} while (success === false);
	}
	Ratio() {
		return Math.max(this.width, this.height) / Math.min(this.width, this.height);
	}
	AbsX() {
		if (this.parent === null)
			return this.x;
		else
			return this.parent.AbsX() + this.x;
	}
	AbsY() {
		if (this.parent === null)
			return this.y;
		else
			return this.parent.AbsY() + this.y;
	}
	Area() {
		return this.width * this.height;
	}
	IsFirst() {
		if (this.x === 0 && this.y === 0)
			return true;
		else
			return false;
	}
	IsBottom() {
		if (this.children.length === 0)
			return true;
		else
			return false;
	}
}

/*
	Worm:
		Crawl(): The main function.
		Check(): Checks available directions to turn, or go straight, or die.
		Move(): Draws the crawler along a straight path.
		Draw(): Changes the tile value in the given data array.
		Clear(): Checks to make sure there's room to at a coordinate.
		Valid(): Makes sure the coord isn't out of bounds.
		RNGLength(): An acceptably random distance between two numbers.
		Rush(): Pick an open edge and run all the way to it.
		Spawn(): Creates more crawlers.
		OutsideEdge(): Like Valid but only the outermost row/column.
*/
class Worm {
	constructor(area_x, area_y, x=null, y=null, dir=null, child=false) {
		if (x === null)
			this.x = Phaser.Math.Between(1, area_x - 2);
		else
			this.x = x;
		if (y === null)
			this.y = Phaser.Math.Between(1, area_y - 2);
		else
			this.y = y;
		this.width = area_x;
		this.height = area_y;
		this.lifespan = Phaser.Math.Between(2, 4);
		if (dir === null)
			this.direction = Phaser.Math.Between(0, 3);
		else
			this.direction = dir;
		this.children = [];
		this.is_child = child;
	}
	Crawl(data) {
		let alive = true;
			// 0 north, 1 east, 2 south, 3 west

		while (alive) {
			let directions = this.Check(data);
			if (directions.length === 0)
				alive = false;
			else if (this.lifespan <= 0) {
				// Run to the edge if possible.
				this.Rush(data);
				alive = false;
			} else {
				this.direction = directions[Phaser.Math.Between(0, directions.length - 1)];
				this.Move(data, this.direction);
				this.lifespan--;
			}
		}
	}
	Check(data) {
		let dirs = [];
		let max = 2;

		// Kill if the edge is reached.
		if (this.OutsideEdge(this.x, this.y))
			return dirs;

		if (this.direction === 1 || this.direction === 3) {
			if (this.Clear(data, this.x, this.y - 1, 0))
				dirs.push(0);
			if (this.Clear(data, this.x, this.y + 1, 2))
				dirs.push(2);
		}
		if (this.direction === 0 || this.direction === 2)
			if (this.Clear(data, this.x + 1, this.y, 1))
				dirs.push(1);
			if (this.Clear(data, this.x - 1, this.y, 3)) {
				dirs.push(3);
		}

		// Go forward if it's the only option.
		if (dirs.length === 0) {
			if (this.direction === 0 && this.Clear(data, this.x, this.y - 1, 0))
				dirs.push(0);
			else if (this.direction === 1 && this.Clear(data, this.x + 1, this.y, 1))
				dirs.push(1);
			else if (this.direction === 2 && this.Clear(data, this.x, this.y + 1, 2))
				dirs.push(2);
			else if (this.direction === 3 && this.Clear(data, this.x - 1, this.y, 3))
				dirs.push(3);
		}

		return dirs;
	}
	Move(data, dir) {
		let alive = true;
		let temp_x = this.x;
		let temp_y = this.y;
		let dist = 0;

		if (dir === 0) {
			while (alive) {
				temp_y -= 1;
				alive = this.Clear(data, temp_x, temp_y, 0);
			}
			dist = this.RNGLength(this.y, temp_y);
			for (let i = 0; i < dist; i++) {
				this.Draw(data);
				this.y -= 1;
			}
		} else if (dir === 1) {
			while (alive) {
				temp_x += 1;
				alive = this.Clear(data, temp_x, temp_y, 1);
			}
			dist = this.RNGLength(this.x, temp_x);
			for (let i = 0; i < dist; i++) {
				this.Draw(data);
				this.x += 1;
			}
		} else if (dir === 2) {
			while (alive) {
				temp_y += 1;
				alive = this.Clear(data, temp_x, temp_y, 2);
			}
			dist = this.RNGLength(this.y, temp_y);
			for (let i = 0; i < dist; i++) {
				this.Draw(data);
				this.y += 1;
			}
		} else if (dir === 3) {
			while (alive) {
				temp_x -= 1;
				alive = this.Clear(data, temp_x, temp_y, 3);
			}
			dist = this.RNGLength(this.x, temp_x);
			for (let i = 0; i < dist; i++) {
				this.Draw(data);
				this.x -= 1;
			}
		}

		this.direction = dir;
		this.Spawn(data, dist);

		if (this.Valid(this.x, this.y))
			this.Draw(data);

		return dist;
	}
	Draw(data) {
		if (this.is_child === false || this.OutsideEdge(this.x, this.y) === false) {
			data[this.y][this.x] = 8;
			return true;
		} else {
			return false;
		}
	}
	Clear(data, x, y, dir=4, max=1) {
		let walls = 0;
		let left_edge = x - 1;
		let right_edge = x + 1;
		let top_edge = y - 1;
		let bottom_edge = y + 1;

		if (this.Valid(x, y) === false)
			return false;

		if (dir === 0 || y === this.height - 1)
			bottom_edge--;
		if (dir === 1 || x === 0)
			left_edge++;
		if (dir === 2 || y === 0)
			top_edge++;
		if (dir === 3 || x === this.width - 1)
			right_edge--;

		for (let i = top_edge; i <= bottom_edge; i++) {
			for (let j = left_edge; j <= right_edge; j++) {
				if (this.Valid(j, i)) {
					if (data[i][j] === 8)
						walls++;
				}
			}
		}

		// Results.
		if (walls < max)
			return true;
		else
			return false;
	}
	Valid(x, y) {
		if (x >= 0 && x < this.width) {
			if (y >= 0 && y < this.height)
				return true;
		}

		return false;
	}
	RNGLength(d, d2) {
		let dist = Math.abs(d - d2);
		dist = Math.max(1, dist - 1);
		return Phaser.Math.Between(dist/2, dist);
	}
	Rush(data) {
		let dirs = [];
		let alive = true;

		// Ignore if child.
		if (this.is_child) {
			return;
		}

		// N check.
		let tmp = this.y;
		while (alive) {
			tmp--;
			alive = this.Clear(data, this.x, tmp, 0);
		}
		if (tmp <= 0)
			dirs.push(0);

		// E check.
		tmp = this.x;
		alive = true;
		while (alive) {
			tmp++;
			alive = this.Clear(data, tmp, this.y, 1);
		}
		if (tmp >= this.width)
			dirs.push(1);

		// S check.
		tmp = this.y;
		alive = true;
		while (alive) {
			tmp++;
			alive = this.Clear(data, this.x, tmp, 2);
		}
		if (tmp >= this.height)
			dirs.push(2);

		// W check.
		tmp = this.x;
		alive = true;
		while (alive) {
			tmp--;
			alive = this.Clear(data, tmp, this.y, 3);
		}
		if (tmp <= 0)
			dirs.push(3);

		// No edges could be reached.
		if (dirs.length === 0)
			return;

		// Pick and draw.
		let dir = Phaser.Math.Between(0, dirs.length - 1);
		if (dirs[dir] === 0) {
			for (let i = this.y; i >= 0; i--) {
				data[i][this.x] = 8;
			}
		} else if (dirs[dir] === 1) {
			for (let i = this.x; i < this.width; i++) {
				data[this.y][i] = 8;
			}
		} else if (dirs[dir] === 2) {
			for (let i = this.y; i < this.height; i++) {
				data[i][this.x] = 8;
			}
		} else if (dirs[dir] === 3) {
			for (let i = this.x; i >= 0; i--) {
				data[this.y][i] = 8;
			}
		}
	}
	Spawn(data, d) {
		if (this.is_child === true)
			return

		let space = Phaser.Math.Between(0, 2);
		let temp_x = this.x;
		let temp_y = this.y;
		if (this.direction === 1)
			temp_x -= d;
		else if (this.direction === 2)
			temp_y -= d;

		// Vertical movement.
		if (this.direction === 0 || this.direction === 2) {
			for (let i = 0; i < d; i++) {
				let open_l = this.Clear(data, temp_x - 1, temp_y + i, 3);
				let open_r = this.Clear(data, temp_x + 1, temp_y + i, 1);
				if (open_l && space === 0)
					this.children.push(new Worm(this.width, this.height, temp_x - 1, temp_y + i, 3, true));
				if (open_r && space === 0)
					this.children.push(new Worm(this.width, this.height, temp_x + 1, temp_y + i, 1, true));

				if (space === 0)
					space = Phaser.Math.Between(2, 4);
				else
					space--;
			}
		} else { // Horizontal movement.
			for (let i = 0; i < d; i++) {
				let open_t = this.Clear(data, temp_x + i, temp_y - 1, 0);
				let open_b = this.Clear(data, temp_x + i, temp_y + 1, 2);
				if (open_t && space === 0)
					this.children.push(new Worm(this.width, this.height, temp_x + i, temp_y - 1, 0, true));
				if (open_b && space === 0)
					this.children.push(new Worm(this.width, this.height, temp_x + i, temp_y, 2, true));

				if (space === 0)
					space = Phaser.Math.Between(2, 4);
				else
					space--;
			}
		}

		
	}
	RNGStart(data) {
		let valid_start = false;
		while(valid_start === false) {
			this.x = Phaser.Math.Between(1, this.width - 2);
			this.y = Phaser.Math.Between(1, this.height - 2);
			valid_start = this.Clear(data, this.x, this.y);
		}
	}
	OutsideEdge(x, y) {
		if (x === 0 || y === 0)
			return true;
		if (x === (this.width - 1) || y === (this.height - 1))
			return true;
		return false;
	}
}