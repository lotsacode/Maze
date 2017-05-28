# 3D Maze generator for Three.js

Example usage with explicit default options

    var maze = new Maze({
	    cols: 25,         // amount of cell columns
	    rows: 25,         // amount of cell rows
	    scale: 10,        // scale of maze
	    thickness: 2,     // thickness of maze walls
	    depth: 10,        // height of maze walls
	    open: true,       // include start and end doors?
	    rnd: Math.random  // custom random sampler (between 0 and 1)
    });
    scene.add(new THREE.Mesh(maze, material).geometry);

The returned object also contains <code>cells</code> which is the data structure for the maze
