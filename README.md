# 3D Perspective

Using the perspective formula to create the illusion of 3D.

## Usage

Use the mouse or the arrow keys on the keyboard to fly through the orbs.

### Mouse Controls

- **Click**: Move to orb
- **Scroll**: Scroll orbs

### Keyboard Controls

- **&#8593;**: Next orb
- **&#8595;**: Previous orb
- **&#8592;**: First orb
- **&#8594;**: Last orb
- **Space**: Next orb

## Perspective Formula

Based on the perspective formula to scale the orbs size and position.

`scale = focal length / (focal length + z position)`

## Easing Formula

Also uses a simple easing formula to animate the orbs.

`position = position + ((target - position) / speed)`
