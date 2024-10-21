# Eloqube

Eloqube is a fun and interactive package that renders a rotating 3D cube in the terminal using colored ASCII characters. 
That's what it is. Useless? Yep. But fun I guarantee you :)

The cube responds to mouse dragging or keyboard events, allowing you to rotate, resize and apply angular velocity for continued movement. Weeeee!

## Features

- **3D ASCII Cube**: Renders a cube in your terminal with vibrant colors using a custom ASCII character set.
- **Interactive Mouse Control**: Drag the cube with your mouse or use the AWSD keys to rotate it in real-time.
- **Angular Velocity**: Release the mouse while dragging to apply angular velocity and watch the cube spin on its own.
- **Size Adjustment**: Resize the cube by pressing Q or E.
- **Configurable Settings**: Easily adjust more properties such the cube's dimensions, rotation speed, FPS, and more through a configuration file.

## Installation

You can actually run it directly using `npx` without installing it:
```bash
npx eloqube
```

But if you still prefer, you can install Eloqube via your preferred Node.js package manager:

```bash
# Using npm
npm install -g eloqube

# Using yarn
yarn global add eloqube

# Using pnpm
pnpm add -g eloqube
```

## Usage

Once installed, you can start having fun with Eloqube by running the following command:

```bash
eloqube
```

Then just be happy and start dragging it with your mouse to interact with it. The cube will rotate based on how you drag, and it will continue spinning if you release the mouse mid-drag. You can also use the AWSD keys to rotate the cube, and the Q and E keys to resize it.

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
