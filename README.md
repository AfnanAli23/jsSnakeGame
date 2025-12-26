# 🐍 Snake Game – Code Explanation & Architecture

This project is a **classic Snake Game** implemented using **vanilla JavaScript**, HTML, and CSS. The JavaScript file acts as the **core game engine**, managing grid creation, snake movement, food generation, collision detection, scoring, timing, and user interaction through keyboard controls and UI buttons.

The overall design follows a **state-driven game loop** where the board is continuously re-rendered at fixed intervals.

---

## 1. Board and Grid System

The game board is a fixed-size container divided into small, equally sized square blocks. Each block represents a **cell in the grid**.

* Every block has a fixed width and height (30px × 30px).
* The total number of rows and columns is calculated dynamically based on the board’s actual size.
* This makes the game **responsive**, as the grid adapts automatically to the board dimensions.

Each grid cell is created once at the start and stored in a lookup structure so it can be accessed quickly using its row and column coordinates.

---

## 2. UI Elements and Modals

The game uses modal overlays for user interaction:

* **Start Modal**: Displayed when the game loads.
* **Restart Modal**: Shown when the game ends due to collision.

Additional UI elements display:

* Current score
* High score (persisted)
* Elapsed time in `MM:SS` format

These elements are updated dynamically during gameplay.

---

## 3. Game State Management

The entire game relies on a few core state variables:

### Snake

* Represented as an **array of segments**.
* Each segment contains grid coordinates (`x` and `y`).
* The first element of the array is always the **snake’s head**.

### Food

* Stored as a single coordinate on the grid.
* Generated randomly within the grid boundaries.

### Direction

* Stored as a string (`up`, `down`, `left`, `right`).
* Updated via keyboard input.
* Determines how the snake’s head moves in each game tick.

### Timers

* One interval controls **snake movement**.
* Another interval controls **elapsed time tracking**.
* Both are cleared when the game ends.

---

## 4. Grid Rendering Strategy

Instead of recreating DOM elements repeatedly:

* All grid cells are created **once** at initialization.
* CSS classes are added and removed to visually represent:

  * Snake body
  * Food position
  * Empty cells

This approach is efficient and avoids unnecessary DOM manipulation.

---

## 5. Main Game Loop (Render Cycle)

The game runs inside a repeating render cycle triggered by a fixed interval.

Each cycle performs the following steps:

### a) Food Rendering

The current food cell is visually marked on the board.

### b) Snake Movement Calculation

A new head position is calculated based on the current direction.

### c) Wall Collision Detection

If the new head position goes outside the grid:

* The game stops immediately.
* All intervals are cleared.
* The restart modal is shown.

### d) Food Consumption Logic

If the snake’s head reaches the food:

* The snake grows in length.
* A new food position is generated.
* The score increases.
* High score is updated and saved if exceeded.

### e) Snake Redrawing

* Previous snake cells are cleared.
* A new head is added.
* The tail is removed unless food was eaten.
* The updated snake is drawn again on the board.

---

## 6. Scoring System

* The score increases by **1** for every food item eaten.
* The high score is stored in **localStorage**, ensuring it persists even after refreshing the page.
* High score updates only when the current score exceeds it.

---

## 7. Time Tracking System

* A separate timer tracks total play time.
* Time is displayed in `MM:SS` format.
* Seconds roll over into minutes automatically.
* The timer starts with the game and resets on restart.

---

## 8. Game Start Flow

When the user clicks the **Start button**:

* The start modal is hidden.
* The main game loop begins.
* The time counter starts simultaneously.

This ensures gameplay and timing are perfectly synchronized.

---

## 9. Game Restart Flow

When the game ends and the user clicks **Restart**:

* Snake and food visuals are cleared.
* Game state resets to default values.
* Score and timer reset to zero.
* High score remains preserved.
* Both intervals restart cleanly.

This guarantees a fresh and predictable game restart without leftover state.

---

## 10. Keyboard Controls

The snake is controlled using **arrow keys**:

* Left Arrow → Move left
* Right Arrow → Move right
* Up Arrow → Move up
* Down Arrow → Move down

Key presses update the direction variable, which directly affects movement in the next render cycle.

---

## 11. Overall Design Philosophy

* **Simple state-driven logic**
* **Minimal DOM manipulation**
* **Separation of concerns** (UI, state, rendering, controls)
* **Beginner-friendly structure**
* **No external libraries**

This makes the project ideal for:

* Learning JavaScript fundamentals
* Understanding loops
* Practicing DOM manipulation
* Exploring localStorage usage

---

## 12. Summary

This Snake Game implementation demonstrates how a complete interactive game can be built using plain JavaScript. It combines grid-based movement, real-time rendering, user input handling, persistent storage, and UI state management into a clean and maintainable structure suitable for learning and extension.

---
