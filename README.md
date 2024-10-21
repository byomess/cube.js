# Eloqube

Eloqube is a fun and interactive package that renders a rotating 3D cube in the terminal using colored ASCII characters. 
That's what it is. Useless? Yep. But fun I guarantee you :)
The cube responds to mouse dragging, allowing you to rotate it and apply angular velocity for continued movement.

## Features

- **3D ASCII Cube**: Renders a cube in your terminal with vibrant colors using a custom ASCII character set.
- **Interactive Mouse Control**: Drag the cube with your mouse to rotate it in real-time.
- **Angular Velocity**: Release the mouse while dragging to apply angular velocity and watch the cube spin on its own.
- **Configurable Settings**: Easily adjust cube dimensions, rotation speed, FPS, and more through a configuration file.

## Installation

You can install Eloqube via npm:

```bash
npm install -g eloqube
```

## Usage

Once installed, you can start the 3D cube animation in your terminal with:

```bash
terminal-eloqube
```

Then just be happy with your eloqube and start dragging it with your mouse to interact with it. The cube will rotate based on how you drag, and it will continue spinning if you release the mouse mid-drag.

You can stop the program at any time by pressing `Ctrl + C`.

## Configuration

Eloqube comes with a `config.json` file that allows you to tweak several parameters:

- **WIDTH**: Width of the terminal output.
- **HEIGHT**: Height of the terminal output.
- **FPS**: Frames per second of the animation.
- **SIZE**: Size of the cube.
- **DRAG_FACTOR**: Factor that influences how much the cube rotates when dragged.
- **ANG_VEL_FACTOR**: Factor that influences how much angular velocity is applied when dragging is released.
- **DAMPING**: Damping applied to angular velocity after release.
- **INCREMENT_SPEED**: Precision of the cube's surface rendering.
- **BACKGROUND_CHAR**: ASCII character for empty spaces.
- **CHARS**: ASCII characters used for the cube's shading.
- **COLORS**: Colors for each cube face (`front`, `right`, `left`, `back`, `top`, `bottom`).


## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
