'use strict'

// Board layout data for TI4 map generation.
// Defines hex positions for 2-8 player maps in various styles.
//
// Position indexes:
//   0       = Mecatol Rex (center)
//   1-6     = Inner ring
//   7-18    = Middle ring
//   19-36   = Outer ring
//   37-60   = Extended ring (POK large maps only)

const BOARD_SIZE = 37
const POK_BOARD_SIZE = 61

function blankMap() {
  return new Array(POK_BOARD_SIZE).fill(-1)
}

const styles = {
  '2': {
    normal: {
      description: 'A board smaller and more proportioned to modified two player TI.',
      home_worlds: [22, 31],
      primary_tiles: [9, 15],
      secondary_tiles: [5, 2, 21, 30, 32, 23],
      tertiary_tiles: [10, 16, 14, 8, 7, 13, 12, 18, 1, 4, 6, 3],
      hyperlane_tiles: [],
    },
  },
  '3': {
    normal: {
      description: 'Standard 3 player layout.',
      home_worlds: [22, 28, 34],
      primary_tiles: [9, 13, 17],
      secondary_tiles: [6, 4, 2, 21, 27, 33, 35, 29, 23],
      tertiary_tiles: [8, 12, 16, 18, 14, 10, 1, 3, 5, 15, 11, 7],
      hyperlane_tiles: [],
    },
    compact: {
      description: 'A more compact variant that encourages fighting.',
      home_worlds: [10, 14, 18],
      primary_tiles: [2, 4, 6, 1, 5, 3],
      secondary_tiles: [9, 13, 17, 7, 15, 11],
      tertiary_tiles: [12, 16, 8],
      hyperlane_tiles: [],
    },
  },
  '4': {
    normal: {
      description: 'Standard 4 player layout.',
      home_worlds: [23, 27, 32, 36],
      primary_tiles: [9, 12, 15, 18, 7, 16, 13, 10],
      secondary_tiles: [2, 4, 5, 1, 19, 33, 28, 24, 22, 26, 31, 35],
      tertiary_tiles: [3, 6, 17, 14, 11, 8, 20, 25, 29, 34, 30, 21],
      hyperlane_tiles: [],
    },
    horizontal: {
      description: 'A slightly smaller board aligned horizontally.',
      home_worlds: [22, 25, 31, 34],
      primary_tiles: [9, 11, 15, 17],
      secondary_tiles: [6, 5, 3, 2, 21, 26, 30, 35, 33, 32, 24, 23],
      tertiary_tiles: [1, 4, 18, 14, 12, 8, 10, 13, 16, 7],
      hyperlane_tiles: [],
    },
    vertical: {
      description: 'A smaller board aligned vertically.',
      home_worlds: [21, 26, 30, 35],
      primary_tiles: [8, 12, 14, 18],
      secondary_tiles: [6, 5, 3, 2, 20, 27, 29, 36, 17, 15, 11, 9],
      tertiary_tiles: [1, 4, 16, 10, 7, 13],
      hyperlane_tiles: [],
    },
  },
  '5': {
    normal: {
      description: 'Standard 5 player layout.',
      home_worlds: [21, 25, 28, 31, 35],
      primary_tiles: [13, 15, 11, 17, 9],
      secondary_tiles: [4, 3, 5, 6, 2, 29, 30, 26, 8, 18, 27, 24, 32, 34, 22],
      tertiary_tiles: [1, 16, 7, 10, 12, 14, 33, 23, 20, 36, 19],
      hyperlane_tiles: [],
    },
    diamond: {
      description: 'A slightly smaller map focused on being closer to Mecatol Rex.',
      home_worlds: [21, 24, 28, 32, 35],
      primary_tiles: [9, 11, 13, 15, 17],
      secondary_tiles: [6, 5, 4, 3, 2, 18, 16, 29, 10, 8, 20, 23, 27, 33, 36],
      tertiary_tiles: [1, 7, 12, 14, 19],
      hyperlane_tiles: [],
    },
  },
  '6': {
    normal: {
      description: 'Standard 6 player layout.',
      home_worlds: [19, 22, 25, 28, 31, 34],
      primary_tiles: [7, 9, 11, 13, 15, 17],
      secondary_tiles: [6, 5, 4, 3, 2, 1, 20, 21, 24, 27, 30, 33],
      tertiary_tiles: [18, 16, 14, 12, 10, 8, 23, 26, 29, 32, 35, 36],
      hyperlane_tiles: [],
    },
    spiral: {
      description: 'More adjacent home planets, with the same path to the middle.',
      home_worlds: [20, 23, 26, 29, 32, 35],
      primary_tiles: [8, 10, 12, 14, 16, 18, 6, 5, 4, 3, 2, 1],
      secondary_tiles: [19, 22, 25, 28, 31, 34, 17, 15, 13, 11, 9, 7],
      tertiary_tiles: [27, 24, 21, 36, 33, 30],
      hyperlane_tiles: [],
    },
    large: {
      description: 'The large version using POK expansion tiles.',
      home_worlds: [37, 41, 45, 49, 53, 57],
      primary_tiles: [19, 22, 25, 28, 31, 34, 17, 15, 13, 11, 9, 7],
      secondary_tiles: [60, 40, 44, 48, 52, 56, 58, 54, 50, 46, 42, 38],
      tertiary_tiles: [1, 2, 3, 4, 5, 6, 16, 14, 12, 10, 8, 18, 20, 23, 26, 29, 32, 35, 33, 30, 27, 24, 21, 36, 39, 43, 47, 51, 55, 59],
      hyperlane_tiles: [],
    },
  },
  '7': {
    normal: {
      description: 'Standard 7 player layout (requires POK hyperlanes).',
      home_worlds: [37, 40, 43, 46, 52, 55, 58],
      primary_tiles: [19, 21, 23, 25, 31, 33, 35, 18, 16, 15, 11, 10, 8, 7],
      secondary_tiles: [1, 2, 3, 4, 5, 6, 57, 54, 51, 47, 44, 41, 38, 60, 39, 42, 45, 53, 56, 59, 20, 36],
      tertiary_tiles: [17, 14, 12, 9, 34, 32, 30, 26, 24, 22, 28],
      hyperlane_tiles: [[13, '86A', 0], [27, '88A', 0], [29, '87A', 0], [48, '83A', 0], [49, '85A', 0], [50, '84A', 0]],
    },
  },
  '8': {
    normal: {
      description: 'Standard 8 player layout.',
      home_worlds: [37, 40, 43, 46, 49, 52, 55, 58],
      primary_tiles: [19, 35, 33, 30, 28, 26, 24, 21],
      secondary_tiles: [2, 3, 4, 5, 6, 1, 7, 18, 16, 14, 13, 12, 10, 8],
      tertiary_tiles: [60, 57, 54, 51, 48, 45, 42, 39, 41, 44, 47, 50, 53, 56, 59, 38, 36, 20, 27, 29, 17, 15, 11, 9, 34, 32, 31, 25, 23, 22],
      hyperlane_tiles: [],
    },
  },
}

module.exports = {
  BOARD_SIZE,
  POK_BOARD_SIZE,
  blankMap,
  styles,
}
