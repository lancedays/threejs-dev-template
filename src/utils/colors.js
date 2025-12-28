import * as THREE from 'three';

/**
 * Named color palette for easy color specification.
 * Includes common web colors and a curated set of nice defaults.
 */
const NAMED_COLORS = {
    // Basic colors
    red: 0xff0000,
    green: 0x00ff00,
    blue: 0x0000ff,
    white: 0xffffff,
    black: 0x000000,
    yellow: 0xffff00,
    cyan: 0x00ffff,
    magenta: 0xff00ff,

    // Extended palette
    orange: 0xff8c00,
    purple: 0x8b00ff,
    pink: 0xff69b4,
    lime: 0x32cd32,
    teal: 0x008080,
    indigo: 0x4b0082,
    coral: 0xff7f50,
    salmon: 0xfa8072,
    gold: 0xffd700,
    silver: 0xc0c0c0,

    // Grays
    gray: 0x808080,
    grey: 0x808080,
    lightgray: 0xd3d3d3,
    darkgray: 0x404040,

    // Nice defaults for 3D
    sky: 0x87ceeb,
    forest: 0x228b22,
    ocean: 0x006994,
    sunset: 0xff6b35,
    midnight: 0x191970,
    steel: 0x4a6fa5,
    copper: 0xb87333,
    bronze: 0xcd7f32,
};

/**
 * Parses a color value into a format Three.js can use.
 * Accepts:
 * - Named colors: 'red', 'blue', 'coral'
 * - Hex strings: '#ff0000', '0xff0000'
 * - Hex numbers: 0xff0000
 * - RGB strings: 'rgb(255, 0, 0)'
 *
 * @param {string|number} color - The color to parse
 * @returns {number|string} A color value Three.js can use
 *
 * @example
 * parseColor('red')        // 0xff0000
 * parseColor('#ff0000')    // '#ff0000'
 * parseColor(0xff0000)     // 0xff0000
 */
function parseColor(color) {
    // If it's a number, return as-is
    if (typeof color === 'number') {
        return color;
    }

    // If it's a string
    if (typeof color === 'string') {
        // Check named colors (case-insensitive)
        const lowerColor = color.toLowerCase();
        if (NAMED_COLORS[lowerColor] !== undefined) {
            return NAMED_COLORS[lowerColor];
        }

        // Otherwise return as-is (Three.js can parse hex strings, rgb, etc.)
        return color;
    }

    // Default fallback
    return 0x4a90d9;
}

/**
 * Creates a random color.
 * @returns {number} A random hex color
 */
function randomColor() {
    return Math.floor(Math.random() * 0xffffff);
}

/**
 * Creates a random color from the named palette.
 * @returns {number} A random color from NAMED_COLORS
 */
function randomNamedColor() {
    const keys = Object.keys(NAMED_COLORS);
    const key = keys[Math.floor(Math.random() * keys.length)];
    return NAMED_COLORS[key];
}

/**
 * Interpolates between two colors.
 * @param {string|number} color1 - Start color
 * @param {string|number} color2 - End color
 * @param {number} t - Interpolation factor (0-1)
 * @returns {THREE.Color}
 */
function lerpColor(color1, color2, t) {
    const c1 = new THREE.Color(parseColor(color1));
    const c2 = new THREE.Color(parseColor(color2));
    return c1.lerp(c2, t);
}

export {
    NAMED_COLORS,
    parseColor,
    randomColor,
    randomNamedColor,
    lerpColor
};
