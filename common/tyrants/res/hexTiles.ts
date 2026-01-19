interface Site {
  name: string
  dx?: number
  dy?: number
  size?: number
  neutrals?: number
  value?: number
  start?: boolean
  token?: string
  kind?: string
  paths: string[]
}

interface HexTile {
  name: string
  sites: Site[]
}

interface LayoutEntry {
  id: string
  pos: [number, number]
  neighbors?: string[]
}

const a2sites: Site[] = [
  {
    name: 'Fogtown',
    dx: -35,
    dy: -70,
    size: 3,
    neutrals: 2,
    value: 4,
    paths: [
      'Gallenghast',
      'Darkflame',
      'hex0',
      'hex5',
    ],
  },
  {
    name: 'Gallenghast',
    dx: +60,
    dy: +10,
    size: 6,
    neutrals: 2,
    value: 2,
    paths: [
      'Fogtown',
      'Darkflame',
      'hex1',
      'hex2',
    ],
  },
  {
    name: 'Darkflame',
    dx: -30,
    dy: +80,
    size: 3,
    neutrals: 2,
    value: 3,
    paths: [
      'Fogtown',
      'Gallenghast',
      'hex3',
      'hex4',
    ],
  },
]

const b2sites: Site[] = [
  {
    name: 'Lolth Shrine',
    token: 'Tsenviilyq',
    dx: -2,
    dy: +20,
    size: 4,
    neutrals: 2,
    value: 3,
    paths: [
      'Vrith',
      'b2-troop-a',
      'b2-troop-b',
      'b2-troop-c',
      'b2-troop-d',
    ],
  },
  {
    name: 'Vrith',
    dx: +0,
    dy: -70,
    size: 1,
    neutrals: 1,
    value: 2,
    paths: [
      'Lolth Shrine',
      'hex0',
    ],
  },
  {
    name: 'b2-troop-a',
    kind: 'troop-spot',
    dx: -90,
    dy: -35,
    paths: [
      'Lolth Shrine',
      'hex5',
    ],
  },
  {
    name: 'b2-troop-b',
    kind: 'troop-spot',
    dx: -80,
    dy: +60,
    paths: [
      'Lolth Shrine',
      'hex4',
    ],
  },
  {
    name: 'b2-troop-c',
    kind: 'troop-spot',
    dx: +85,
    dy: -30,
    paths: [
      'Lolth Shrine',
      'hex1',
    ],
  },
  {
    name: 'b2-troop-d',
    kind: 'troop-spot',
    dx: +80,
    dy: +55,
    paths: [
      'Lolth Shrine',
      'hex2',
    ],
  },
]

const c1sites: Site[] = [
  {
    name: 'The Twilight',
    dx: -15,
    dy: -70,
    size: 3,
    value: 3,
    paths: [
      'c1-troop-a',
      'c1-troop-c',
      'hex0',
    ],
  },
  {
    name: 'Magma Gate',
    dx: +70,
    dy: +10,
    size: 6,
    value: 2,
    start: true,
    paths: [
      'c1-troop-c',
      'c1-troop-d',
      'hex1',
      'hex2',
    ],
  },
  {
    name: 'Spiral Desert',
    dx: -40,
    dy: +35,
    size: 3,
    value: 3,
    paths: [
      'c1-troop-a',
      'c1-troop-b',
      'c1-troop-d',
    ],
  },
  {
    name: 'c1-troop-a',
    kind: 'troop-spot',
    dx: -90,
    dy: -35,
    paths: [
      'The Twilight',
      'Spiral Desert',
    ],
  },
  {
    name: 'c1-troop-b',
    kind: 'troop-spot',
    dx: -25,
    dy: +100,
    paths: [
      'Spiral Desert',
      'hex3',
    ],
  },
  {
    name: 'c1-troop-c',
    kind: 'troop-spot',
    dx: +65,
    dy: -60,
    paths: [
      'The Twilight',
      'Magma Gate',
    ],
  },
  {
    name: 'c1-troop-d',
    kind: 'troop-spot',
    dx: +40,
    dy: +75,
    paths: [
      'Magma Gate',
      'Spiral Desert',
    ],
  },
]

const layout_test: LayoutEntry[] = [
  {
    id: 'a0',
    pos: [0, .5],
  },
  {
    id: 'b0',
    pos: [1, 0],
  },
  {
    id: 'c0',
    pos: [1, 1],
  },
]


const layout_2p: LayoutEntry[] = [
  {
    id: 'a0',
    neighbors: ['c0', 'c1', 'c2', 'c3', 'c4', 'c5'],
    pos: [1, 1.5],
  },
  {
    id: 'b0',
    neighbors: ['c0', 'c5'],
    pos: [0, 0],
  },
  {
    id: 'b1',
    neighbors: ['c2', 'c3'],
    pos: [2, 3],
  },
  {
    id: 'c0',
    neighbors: ['a0', 'b0', 'c1', 'c5'],
    pos: [1, .5],
  },
  {
    id: 'c1',
    neighbors: ['a0', 'c0', 'c2'],
    pos: [2, 1],
  },
  {
    id: 'c2',
    neighbors: ['a0', 'b1', 'c1', 'c3'],
    pos: [2, 2],
  },
  {
    id: 'c3',
    neighbors: ['a0', 'b1', 'c2', 'c4'],
    pos: [1, 2.5],
  },
  {
    id: 'c4',
    neighbors: ['a0', 'c3', 'c5'],
    pos: [0, 2],
  },
  {
    id: 'c5',
    neighbors: ['a0', 'b0', 'c0', 'c4'],
    pos: [0, 1],
  },
]

const directions = {
  N: 0,
  NE: 1,
  SE: 2,
  S: 3,
  SW: 4,
  NW: 5,
}

export default {
  hexes: {
    a: [
      {
        name: 'a2',
        sites: a2sites,
      },
    ],
    b: [
      {
        name: 'b2',
        sites: b2sites,
      },
    ],
    c: [
      {
        name: 'c1',
        sites: c1sites,
      },
    ],
  },

  layouts: {
    test: layout_test,
    2: layout_2p,
  },

  directions,

  translate: (_hex: unknown, _dir: number) => {
    // Implementation incomplete in original
  },

  oppositeDirection: (dir: number) => (dir + 3) % 6,
  rotatedDirection: (dir: number, r: number) => (dir + r) % 6,
}

export type { Site, HexTile, LayoutEntry }
