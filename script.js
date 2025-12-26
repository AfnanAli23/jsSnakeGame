// script.js — Main game logic for a simple Snake game
// This file handles grid setup, game state, rendering, user input, and score/time UI.

// Board and grid configuration
const board = document.querySelector(".board");
const blockHeight = 30; // pixel height of each grid block
const blockWidth = 30; // pixel width of each grid block

// Compute how many columns and rows the board can fit based on CSS size
const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);

// Modal and control elements for starting/restarting the game UI
const modal = document.querySelector(".modal");
const startButton = document.querySelector(".btn-start");
const reStartButton = document.querySelector(".btn-restart");
const startGameModal = document.querySelector(".start-game");
const restartGameModal = document.querySelector(".restart-game");

// UI elements for displaying high score, current score and elapsed time
const highScoreElement = document.querySelector("#high-score");
const scoreElement = document.querySelector("#score");
const timeElement = document.querySelector("#time");

// Interval IDs so we can clear the timers when needed
let intervalId = null;
let timeIntervalId = null;

// Game state variables
let snake = [{ x: 1, y: 3 }]; // snake is an array of segments with x,y grid coordinates

let food = {
	x: Math.floor(Math.random() * rows),
	y: Math.floor(Math.random() * cols),
}; // food position is a random grid cell

let blocks = []; // map of grid cells -> DOM elements for quick access

let direction = "down"; // initial movement direction

// Score and time tracking
let highScore = localStorage.getItem("highScore") || 0; // persisted best score
let score = 0; // current score
let time = "00:00"; // elapsed time displayed as MM:SS

// Initialize high score in the UI
highScoreElement.textContent = highScore;

// Build the grid of blocks (DOM) and store references in `blocks` for fast lookup
for (let row = 0; row < rows; row++) {
	for (let col = 0; col < cols; col++) {
		const block = document.createElement("div");
		block.classList.add("block");
		board.appendChild(block);
		// Debug helper to show coordinates on each block (commented out)

		// block.textContent = `${row},${col}`;
		blocks[`${row},${col}`] = block;
	}
}

// Main render/update function called repeatedly by interval
function render() {
	let head = null;

	// Ensure the current food cell has the 'food' class
	blocks[`${food.x},${food.y}`].classList.add("food");

	// Compute the new head position based on current direction
	if (direction === "left") {
		head = { x: snake[0].x, y: snake[0].y - 1 };
	} else if (direction === "right") {
		head = { x: snake[0].x, y: snake[0].y + 1 };
	} else if (direction === "up") {
		head = { x: snake[0].x - 1, y: snake[0].y };
	} else if (direction === "down") {
		head = { x: snake[0].x + 1, y: snake[0].y };
	}

	// Wall collision logic: if the head goes outside the grid, stop the game
	if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
		clearInterval(intervalId);
		clearInterval(timeIntervalId);

		// Show the game over / restart modal
		modal.style.display = "flex";
		startGameModal.style.display = "none";
		restartGameModal.style.display = "flex";
		return; // stop further processing for this frame
	}

	// Food consume logic: when head and food overlap
	if (head.x === food.x && head.y === food.y) {
		// Remove the 'food' class from old food cell
		blocks[`${food.x},${food.y}`].classList.remove("food");

		// Generate a new random food position
		food = {
			x: Math.floor(Math.random() * rows),
			y: Math.floor(Math.random() * cols),
		};

		// Add 'food' class to the new food cell
		blocks[`${food.x},${food.y}`].classList.add("food");

		// Grow the snake by adding the new head without removing the tail
		snake.unshift(head);

		// Update score and UI
		score++;
		scoreElement.textContent = score;

		// Persist new high score if surpassed
		if (score > highScore) {
			highScore = score;
			localStorage.setItem("highScore", highScore.toString());
		}
	}

	// Clear 'fill' class on every cell previously occupied by the snake so we can redraw
	snake.forEach((segment) => {
		const block = blocks[`${segment.x},${segment.y}`];
		block.classList.remove("fill");
	});

	// Move the snake forward: add new head and remove tail (unless we ate food earlier)
	snake.unshift(head);
	snake.pop();

	// Draw the snake by adding 'fill' class to each segment cell
	snake.forEach((segment) => {
		const block = blocks[`${segment.x},${segment.y}`];
		block.classList.add("fill");
	});
}

// Start button handler: hide modal and start both game and time intervals
startButton.addEventListener("click", () => {
	modal.style.display = "none";
	intervalId = setInterval(() => {
		render();
	}, 300); // game ticks every 300ms

	// Time updater: increment seconds and roll over to minutes as needed
	timeIntervalId = setInterval(() => {
		let [mins, secs] = time.split(":").map(Number);
		if (secs === 59) {
			mins++;
			secs = 0;
		} else {
			secs++;
		}

		time = `${mins.toString().padStart(2, "0")}:${secs
			.toString()
			.padStart(2, "0")}`;
		// Update time UI
		timeElement.textContent = time;
	}, 1000);
});

// Restart button handler delegates to restartGame function
reStartButton.addEventListener("click", restartGame);

// Reset the game state and restart intervals
function restartGame() {
	// Remove 'food' from current food cell if present
	if (blocks[`${food.x},${food.y}`]) {
		blocks[`${food.x},${food.y}`].classList.remove("food");
	}

	// Clear snake fill from the board
	snake.forEach((segment) => {
		const block = blocks[`${segment.x},${segment.y}`];
		block.classList.remove("fill");
	});

	// Reset game state to defaults
	modal.style.display = "none";
	direction = "down";
	snake = [{ x: 1, y: 3 }];
	food = {
		x: Math.floor(Math.random() * rows),
		y: Math.floor(Math.random() * cols),
	};

	// Restart the intervals
	intervalId = setInterval(() => {
		render();
	}, 300);
	timeIntervalId = setInterval(() => {
		let [mins, secs] = time.split(":").map(Number);
		if (secs === 59) {
			mins++;
			secs = 0;
		} else {
			secs++;
		}

		time = `${mins.toString().padStart(2, "0")}:${secs
			.toString()
			.padStart(2, "0")}`;
		// Update time UI
		timeElement.textContent = time;
	}, 1000);

	// Reset score and time displays
	score = 0;
	time = "00:00";
	timeElement.textContent = time;
	scoreElement.textContent = score;
	highScoreElement.textContent = highScore;
}

// Keyboard controls: change movement direction based on arrow keys
addEventListener("keydown", (e) => {
	if (e.key === "ArrowLeft") {
		direction = "left";
	} else if (e.key === "ArrowRight") {
		direction = "right";
	} else if (e.key === "ArrowUp") {
		direction = "up";
	} else if (e.key === "ArrowDown") {
		direction = "down";
	}
});
