var Maze = function(opts) {
	if (!opts) opts = {};
	const cols = !!opts.cols ? opts.cols : 25; // amount of cell columns
	const rows = !!opts.rows ? opts.rows : 25; // amount of cell rows
	const scale = !!opts.scale ? opts.scale : 10; // scale of maze
	const thickness = !!opts.thickness ? opts.thickness : 2; // thickness of maze walls
	const depth = !!opts.depth ? opts.depth : 10; // height of maze walls
	const open = !!opts.open ? opts.open : true; // include start and end doors?
	const rnd = !!opts.rnd ? opts.rnd : Math.random; // custom random sampler (between 0 and 1)
	const cells = []; // 2d-array of cells
	const geometry = new THREE.Geometry();
	// Initialize the cells
	for (var i = 0; i < cols; i++) {
		cells.push([]);
		for (var j = 0; j < rows; j++) {
			cells[i][j] = {
				"i": i, "j": j,
				"right": 1, "left": 1, "up": 1, "down": 1,
				"visited": false
			}
		}
	}
	const initial = cells[0][0]; // Choose the beginning cell
	initial.visited = true;
	var current = initial; 		 // Current cell while generating
	const stack = [initial];
	var generating = true;
	var neighbours = function(cell) {
		var result = []
		if (cell.i + 1 < cols)  result.push(cells[cell.i + 1][cell.j]);
		if (cell.i - 1 >= 0) 	 result.push(cells[cell.i - 1][cell.j]);
		if (cell.j + 1 < rows) result.push(cells[cell.i][cell.j + 1]);
		if (cell.j - 1 >= 0) 	 result.push(cells[cell.i][cell.j - 1]);
		result = result.filter(function(x){ return !x.visited });
		return result;
	}
	// Generate the maze
	while (generating) {
		// Choose random unvisited neighbour
		var n = neighbours(current);
		// console.log("visiting " + current.i + "," + current.j)
		if (n.length > 0) {
			var next = n[Math.floor(rnd()*n.length)];
			if (next.i == current.i + 1 && next.j == current.j) {
				// Go right
				// console.log("going right");
				current.right = 0;
				current = next;
				current.left = 0;
			} else if (next.i == current.i - 1 && next.j == current.j) {
				// Go left
				// console.log("going left");
				current.left = 0;
				current = next;
				current.right = 0;
			} else if (next.i == current.i && next.j == current.j + 1) {
				// Go up
				// console.log("going up");
				current.up = 0;
				current = next;
				current.down = 0;
			} else if (next.i == current.i && next.j == current.j - 1) {
				// Go down
				// console.log("going down");
				current.down = 0;
				current = next;
				current.up = 0;
			}
			current.visited = true;
			stack.push(current);
		} else {
			// Backtrack
			while (n.length == 0) {
				if (stack.length > 1) {
					stack.pop();
					current = stack[stack.length-1];
					n = neighbours(current)
				} else {
					// All done
					generating = false;
					break;
				}
			}
		}
	}
	// Create geometry
	if (open) {
		var wall = new THREE.Mesh(new THREE.BoxGeometry(thickness, rows*scale-thickness-scale, depth));
		wall.position.x = -scale/2;
		wall.position.y = rows*scale/2;
		geometry.mergeMesh(wall);
		wall.position.x = cols*scale - scale/2;
		wall.position.y = rows*scale/2 - scale;
		geometry.mergeMesh(wall);
	} else {
		var wall = new THREE.Mesh(new THREE.BoxGeometry(thickness, rows*scale-thickness, depth));
		wall.position.x = -scale/2;
		wall.position.y = rows*scale/2 - scale/2;
		geometry.mergeMesh(wall);
		wall.position.x = cols*scale - scale/2;
		wall.position.y = rows*scale/2 - scale/2;
		geometry.mergeMesh(wall);
	}
	var wall = new THREE.Mesh(new THREE.BoxGeometry(cols*scale-thickness, thickness, depth));
	wall.position.x = cols*scale/2 - scale/2;
	wall.position.y = -scale/2;
	geometry.mergeMesh(wall);
	var wall = new THREE.Mesh(new THREE.BoxGeometry(cols*scale-thickness, thickness, depth));
	wall.position.x = cols*scale/2 - scale/2;
	wall.position.y = rows*scale - scale/2;
	geometry.mergeMesh(wall);
	var pillar = new THREE.Mesh(new THREE.BoxGeometry(thickness, thickness, depth));
	pillar.position.x = -scale/2;
	pillar.position.y = -scale/2;
	geometry.mergeMesh(pillar);
	pillar.position.x = -scale/2;
	pillar.position.y = rows*scale-scale/2;
	geometry.mergeMesh(pillar);
	pillar.position.x = cols*scale-scale/2;
	pillar.position.y = rows*scale-scale/2;
	geometry.mergeMesh(pillar);
	pillar.position.x = cols*scale-scale/2;
	pillar.position.y = -scale/2;
	geometry.mergeMesh(pillar);
	var verticalWall = new THREE.Mesh(new THREE.BoxGeometry(
		thickness, scale - thickness, depth));
	var horizontalWall  = new THREE.Mesh(new THREE.BoxGeometry(
		scale - thickness, thickness, depth));
	for (var i = 0; i < cells.length; i++) {
		for (var j = 0; j < cells[i].length; j++) {
			if (cells[i][j].right && i < cells[i].length-1) {
				verticalWall.position.x = i*scale + scale/2;
				verticalWall.position.y = j*scale;
				geometry.mergeMesh(verticalWall);
			}
			if (cells[i][j].down && j > 0) {
				horizontalWall.position.x = i*scale;
				horizontalWall.position.y = j*scale - scale/2;
				geometry.mergeMesh(horizontalWall);
			}
			if (i < cols-1 && j < rows-1) {
				pillar.position.x = i*scale + scale/2;
				pillar.position.y = j*scale + scale/2;
				geometry.mergeMesh(pillar);
			}
		}
	}
	return geometry;
}
