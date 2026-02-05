// Hex Tile Definitions for Demonweb Expansion
// Edge labels (pointy-top orientation): N, NE, SE, S, SW, NW (vertices)
// Mid-edge labels: NE-mid, E-mid, SE-mid, SW-mid, W-mid, NW-mid

// Helper to create a site location
function site(short, name, size, neutrals, points, start, position) {
  return {
    name,
    short,
    size,
    neutrals,
    points,
    start: start || false,
    control: { influence: points > 0 ? 1 : 0, points: 0 },
    totalControl: { influence: points > 0 ? 1 : 0, points: points > 2 ? 2 : 1 },
    position,
  }
}

// Helper to create a tunnel space (passageway)
function tunnel(short, position) {
  return {
    name: short,
    short,
    size: 1,
    neutrals: 0,
    points: 0,
    start: false,
    control: { influence: 0, points: 0 },
    totalControl: { influence: 0, points: 0 },
    position,
  }
}

// ============================================================================
// A HEXES (Center Tiles)
// ============================================================================

const A1 = {
  id: 'A1',
  category: 'A',
  region: 'Araumycos',

  locations: [
    site('great-web', 'The Great Web', 6, 6, 8, false, { x: 0.5, y: 0.5 }),
    tunnel('a1-ring-n', { x: 0.5, y: 0.2 }),
    tunnel('a1-ring-ne', { x: 0.75, y: 0.35 }),
    tunnel('a1-ring-se', { x: 0.75, y: 0.65 }),
    tunnel('a1-ring-s', { x: 0.5, y: 0.8 }),
    tunnel('a1-ring-sw', { x: 0.25, y: 0.65 }),
    tunnel('a1-ring-nw', { x: 0.25, y: 0.35 }),
  ],

  paths: [
    ['great-web', 'a1-ring-n'],
    ['a1-ring-n', 'a1-ring-ne'],
    ['a1-ring-ne', 'a1-ring-se'],
    ['a1-ring-se', 'a1-ring-s'],
    ['a1-ring-s', 'a1-ring-sw'],
    ['a1-ring-sw', 'a1-ring-nw'],
    ['a1-ring-nw', 'a1-ring-n'],
  ],

  edgeConnections: [
    { edge: 'N', location: 'a1-ring-n' },
    { edge: 'NE', location: 'a1-ring-ne' },
    { edge: 'SE', location: 'a1-ring-se' },
    { edge: 'S', location: 'a1-ring-s' },
    { edge: 'SW', location: 'a1-ring-sw' },
    { edge: 'NW', location: 'a1-ring-nw' },
  ],

  specialRules: null,
}

const A2 = {
  id: 'A2',
  category: 'A',
  region: 'Zelatar',

  locations: [
    site('fogtown', 'Fogtown', 3, 2, 4, false, { x: 0.5, y: 0.25 }),
    site('gallenghast', 'Gallenghast', 3, 2, 4, false, { x: 0.75, y: 0.6 }),
    site('darkflame', 'Darkflame', 3, 2, 4, false, { x: 0.25, y: 0.6 }),
    tunnel('a2-center', { x: 0.5, y: 0.5 }),
  ],

  paths: [
    ['fogtown', 'a2-center'],
    ['gallenghast', 'a2-center'],
    ['darkflame', 'a2-center'],
  ],

  edgeConnections: [
    { edge: 'N', location: 'fogtown' },
    { edge: 'NE', location: 'fogtown' },
    { edge: 'SE', location: 'gallenghast' },
    { edge: 'S', location: 'darkflame' },
    { edge: 'SW', location: 'darkflame' },
    { edge: 'NW', location: 'fogtown' },
  ],

  specialRules: {
    type: 'triad',
    sites: ['fogtown', 'gallenghast', 'darkflame'],
    bonuses: {
      presence: { influence: 1 },
      control: { influence: 1, power: 1, vp: 1 },
      totalControl: { influence: 2, power: 2, vp: 4 },
    },
  },
}

const A3 = {
  id: 'A3',
  category: 'A',
  region: 'Araumycos',

  locations: [
    site('a3-great-web', 'Great Web', 2, 0, 2, false, { x: 0.5, y: 0.5 }),
    site('a3-web-n', 'Web', 1, 1, 2, false, { x: 0.5, y: 0.2 }),
    site('a3-web-ne', 'Web', 1, 1, 2, false, { x: 0.75, y: 0.35 }),
    site('a3-web-se', 'Web', 1, 1, 2, false, { x: 0.75, y: 0.65 }),
    site('a3-web-sw', 'Web', 1, 1, 2, false, { x: 0.25, y: 0.65 }),
    site('a3-web-nw', 'Web', 1, 1, 2, false, { x: 0.25, y: 0.35 }),
  ],

  paths: [
    ['a3-great-web', 'a3-web-n'],
    ['a3-great-web', 'a3-web-ne'],
    ['a3-great-web', 'a3-web-se'],
    ['a3-great-web', 'a3-web-sw'],
    ['a3-great-web', 'a3-web-nw'],
    ['a3-web-n', 'a3-web-ne'],
    ['a3-web-ne', 'a3-web-se'],
    ['a3-web-se', 'a3-web-sw'],
    ['a3-web-sw', 'a3-web-nw'],
    ['a3-web-nw', 'a3-web-n'],
  ],

  edgeConnections: [
    { edge: 'N', location: 'a3-web-n' },
    { edge: 'NE', location: 'a3-web-ne' },
    { edge: 'SE', location: 'a3-web-se' },
    { edge: 'S', location: 'a3-web-sw' },
    { edge: 'SW', location: 'a3-web-sw' },
    { edge: 'NW', location: 'a3-web-nw' },
  ],

  specialRules: null,
}

const A4 = {
  id: 'A4',
  category: 'A',
  region: 'Webbed Network',

  locations: [
    tunnel('a4-t1', { x: 0.5, y: 0.2 }),
    tunnel('a4-t2', { x: 0.7, y: 0.3 }),
    tunnel('a4-t3', { x: 0.8, y: 0.5 }),
    tunnel('a4-t4', { x: 0.7, y: 0.7 }),
    tunnel('a4-t5', { x: 0.5, y: 0.8 }),
    tunnel('a4-t6', { x: 0.3, y: 0.7 }),
    tunnel('a4-t7', { x: 0.2, y: 0.5 }),
    tunnel('a4-t8', { x: 0.3, y: 0.3 }),
    tunnel('a4-center', { x: 0.5, y: 0.5 }),
  ],

  paths: [
    ['a4-t1', 'a4-t2'],
    ['a4-t2', 'a4-t3'],
    ['a4-t3', 'a4-t4'],
    ['a4-t4', 'a4-t5'],
    ['a4-t5', 'a4-t6'],
    ['a4-t6', 'a4-t7'],
    ['a4-t7', 'a4-t8'],
    ['a4-t8', 'a4-t1'],
    ['a4-center', 'a4-t1'],
    ['a4-center', 'a4-t3'],
    ['a4-center', 'a4-t5'],
    ['a4-center', 'a4-t7'],
  ],

  edgeConnections: [
    { edge: 'N', location: 'a4-t1' },
    { edge: 'NE', location: 'a4-t2' },
    { edge: 'SE', location: 'a4-t4' },
    { edge: 'S', location: 'a4-t5' },
    { edge: 'SW', location: 'a4-t6' },
    { edge: 'NW', location: 'a4-t8' },
  ],

  specialRules: null,
}

const A5 = {
  id: 'A5',
  category: 'A',
  region: 'Branching Tunnels',

  locations: [
    tunnel('a5-t1', { x: 0.5, y: 0.15 }),
    tunnel('a5-t2', { x: 0.65, y: 0.35 }),
    tunnel('a5-t3', { x: 0.8, y: 0.55 }),
    tunnel('a5-t4', { x: 0.5, y: 0.5 }),
    tunnel('a5-t5', { x: 0.35, y: 0.65 }),
    tunnel('a5-t6', { x: 0.2, y: 0.45 }),
    tunnel('a5-t7', { x: 0.5, y: 0.85 }),
  ],

  paths: [
    ['a5-t1', 'a5-t2'],
    ['a5-t2', 'a5-t3'],
    ['a5-t2', 'a5-t4'],
    ['a5-t4', 'a5-t5'],
    ['a5-t4', 'a5-t6'],
    ['a5-t5', 'a5-t7'],
  ],

  edgeConnections: [
    { edge: 'N', location: 'a5-t1' },
    { edge: 'NE', location: 'a5-t3' },
    { edge: 'SE', location: 'a5-t3' },
    { edge: 'S', location: 'a5-t7' },
    { edge: 'SW', location: 'a5-t5' },
    { edge: 'NW', location: 'a5-t6' },
  ],

  specialRules: null,
}

const A6 = {
  id: 'A6',
  category: 'A',
  region: 'Sparse Network',

  locations: [
    tunnel('a6-t1', { x: 0.5, y: 0.15 }),
    tunnel('a6-t2', { x: 0.75, y: 0.25 }),
    tunnel('a6-t3', { x: 0.85, y: 0.5 }),
    tunnel('a6-t4', { x: 0.6, y: 0.6 }),
    tunnel('a6-t5', { x: 0.4, y: 0.75 }),
    tunnel('a6-t6', { x: 0.2, y: 0.6 }),
    tunnel('a6-t7', { x: 0.3, y: 0.35 }),
  ],

  paths: [
    ['a6-t1', 'a6-t2'],
    ['a6-t2', 'a6-t3'],
    ['a6-t3', 'a6-t4'],
    ['a6-t4', 'a6-t5'],
    ['a6-t5', 'a6-t6'],
    ['a6-t6', 'a6-t7'],
    ['a6-t7', 'a6-t1'],
    ['a6-t4', 'a6-t7'],
  ],

  edgeConnections: [
    { edge: 'N', location: 'a6-t1' },
    { edge: 'NE', location: 'a6-t2' },
    { edge: 'SE', location: 'a6-t3' },
    { edge: 'S', location: 'a6-t5' },
    { edge: 'SW', location: 'a6-t6' },
    { edge: 'NW', location: 'a6-t7' },
  ],

  specialRules: null,
}

const A7 = {
  id: 'A7',
  category: 'A',
  region: 'Hub',

  locations: [
    tunnel('a7-hub', { x: 0.5, y: 0.5 }),
  ],

  paths: [],

  edgeConnections: [
    { edge: 'N', location: 'a7-hub' },
    { edge: 'NE', location: 'a7-hub' },
    { edge: 'SE', location: 'a7-hub' },
    { edge: 'S', location: 'a7-hub' },
    { edge: 'SW', location: 'a7-hub' },
    { edge: 'NW', location: 'a7-hub' },
  ],

  specialRules: null,
}

const A8 = {
  id: 'A8',
  category: 'A',
  region: 'Moderate Network',

  locations: [
    tunnel('a8-t1', { x: 0.5, y: 0.15 }),
    tunnel('a8-t2', { x: 0.7, y: 0.35 }),
    tunnel('a8-t3', { x: 0.7, y: 0.65 }),
    tunnel('a8-t4', { x: 0.5, y: 0.85 }),
    tunnel('a8-t5', { x: 0.3, y: 0.65 }),
    tunnel('a8-t6', { x: 0.3, y: 0.35 }),
    tunnel('a8-center', { x: 0.5, y: 0.5 }),
  ],

  paths: [
    ['a8-t1', 'a8-t2'],
    ['a8-t2', 'a8-t3'],
    ['a8-t3', 'a8-t4'],
    ['a8-t4', 'a8-t5'],
    ['a8-t5', 'a8-t6'],
    ['a8-t6', 'a8-t1'],
    ['a8-center', 'a8-t2'],
    ['a8-center', 'a8-t5'],
  ],

  edgeConnections: [
    { edge: 'N', location: 'a8-t1' },
    { edge: 'NE', location: 'a8-t2' },
    { edge: 'SE', location: 'a8-t3' },
    { edge: 'S', location: 'a8-t4' },
    { edge: 'SW', location: 'a8-t5' },
    { edge: 'NW', location: 'a8-t6' },
  ],

  specialRules: null,
}

const A9 = {
  id: 'A9',
  category: 'A',
  region: 'Wells of Darkness',

  locations: [
    site('wells-of-darkness', 'Wells of Darkness', 9, 0, 9, false, { x: 0.5, y: 0.5 }),
  ],

  paths: [],

  edgeConnections: [
    { edge: 'N', location: 'wells-of-darkness' },
    { edge: 'NE', location: 'wells-of-darkness' },
    { edge: 'SE', location: 'wells-of-darkness' },
    { edge: 'S', location: 'wells-of-darkness' },
    { edge: 'SW', location: 'wells-of-darkness' },
    { edge: 'NW', location: 'wells-of-darkness' },
  ],

  specialRules: null,
}

// ============================================================================
// B HEXES (Border/Start Tiles)
// ============================================================================

const B1 = {
  id: 'B1',
  category: 'B',
  region: 'Menzoberranzan',

  locations: [
    site('council-chamber', 'Council Chamber', 3, 2, 4, true, { x: 0.5, y: 0.7 }),
    tunnel('b1-ring-n', { x: 0.5, y: 0.2 }),
    tunnel('b1-ring-ne', { x: 0.7, y: 0.35 }),
    tunnel('b1-ring-se', { x: 0.7, y: 0.55 }),
    tunnel('b1-ring-sw', { x: 0.3, y: 0.55 }),
    tunnel('b1-ring-nw', { x: 0.3, y: 0.35 }),
  ],

  paths: [
    ['council-chamber', 'b1-ring-se'],
    ['council-chamber', 'b1-ring-sw'],
    ['b1-ring-n', 'b1-ring-ne'],
    ['b1-ring-ne', 'b1-ring-se'],
    ['b1-ring-se', 'b1-ring-sw'],
    ['b1-ring-sw', 'b1-ring-nw'],
    ['b1-ring-nw', 'b1-ring-n'],
  ],

  edgeConnections: [
    { edge: 'N', location: 'b1-ring-n' },
    { edge: 'NE', location: 'b1-ring-ne' },
    { edge: 'SE', location: 'b1-ring-se' },
    { edge: 'S', location: 'council-chamber' },
    { edge: 'SW', location: 'b1-ring-sw' },
    { edge: 'NW', location: 'b1-ring-nw' },
  ],

  specialRules: null,
}

const B2 = {
  id: 'B2',
  category: 'B',
  region: 'Tsenviilyq',

  locations: [
    site('vrith', 'Vrith', 1, 1, 2, false, { x: 0.5, y: 0.25 }),
    site('lolth-shrine', 'Lolth Shrine', 4, 2, 3, true, { x: 0.5, y: 0.7 }),
    tunnel('b2-ring-ne', { x: 0.7, y: 0.35 }),
    tunnel('b2-ring-se', { x: 0.7, y: 0.55 }),
    tunnel('b2-ring-sw', { x: 0.3, y: 0.55 }),
    tunnel('b2-ring-nw', { x: 0.3, y: 0.35 }),
  ],

  paths: [
    ['vrith', 'b2-ring-ne'],
    ['vrith', 'b2-ring-nw'],
    ['lolth-shrine', 'b2-ring-se'],
    ['lolth-shrine', 'b2-ring-sw'],
    ['b2-ring-ne', 'b2-ring-se'],
    ['b2-ring-sw', 'b2-ring-nw'],
  ],

  edgeConnections: [
    { edge: 'N', location: 'vrith' },
    { edge: 'NE', location: 'b2-ring-ne' },
    { edge: 'SE', location: 'b2-ring-se' },
    { edge: 'S', location: 'lolth-shrine' },
    { edge: 'SW', location: 'b2-ring-sw' },
    { edge: 'NW', location: 'b2-ring-nw' },
  ],

  specialRules: null,
}

const B3 = {
  id: 'B3',
  category: 'B',
  region: 'Gauntlgrym',

  locations: [
    site('xith-idrana', 'Xith Idrana', 3, 2, 2, true, { x: 0.5, y: 0.7 }),
    tunnel('b3-ring-n', { x: 0.5, y: 0.2 }),
    tunnel('b3-ring-ne', { x: 0.7, y: 0.35 }),
    tunnel('b3-ring-nw', { x: 0.3, y: 0.35 }),
    tunnel('b3-ring-se', { x: 0.65, y: 0.55 }),
    tunnel('b3-ring-sw', { x: 0.35, y: 0.55 }),
  ],

  paths: [
    ['xith-idrana', 'b3-ring-se'],
    ['xith-idrana', 'b3-ring-sw'],
    ['b3-ring-n', 'b3-ring-ne'],
    ['b3-ring-n', 'b3-ring-nw'],
    ['b3-ring-ne', 'b3-ring-se'],
    ['b3-ring-nw', 'b3-ring-sw'],
  ],

  edgeConnections: [
    { edge: 'N', location: 'b3-ring-n' },
    { edge: 'NE', location: 'b3-ring-ne' },
    { edge: 'SE', location: 'b3-ring-se' },
    { edge: 'S', location: 'xith-idrana' },
    { edge: 'SW', location: 'b3-ring-sw' },
    { edge: 'NW', location: 'b3-ring-nw' },
  ],

  specialRules: null,
}

const B4 = {
  id: 'B4',
  category: 'B',
  region: "Ch'Chitl",

  locations: [
    site('faerholme', 'Faerholme', 3, 2, 2, true, { x: 0.5, y: 0.7 }),
    tunnel('b4-ring-n', { x: 0.5, y: 0.25 }),
    tunnel('b4-ring-ne', { x: 0.7, y: 0.4 }),
    tunnel('b4-ring-nw', { x: 0.3, y: 0.4 }),
  ],

  paths: [
    ['faerholme', 'b4-ring-ne'],
    ['faerholme', 'b4-ring-nw'],
    ['b4-ring-n', 'b4-ring-ne'],
    ['b4-ring-n', 'b4-ring-nw'],
  ],

  edgeConnections: [
    { edge: 'N', location: 'b4-ring-n' },
    { edge: 'NE', location: 'b4-ring-ne' },
    { edge: 'SE', location: 'faerholme' },
    { edge: 'S', location: 'faerholme' },
    { edge: 'SW', location: 'faerholme' },
    { edge: 'NW', location: 'b4-ring-nw' },
  ],

  specialRules: null,
}

const B5 = {
  id: 'B5',
  category: 'B',
  region: "Ss'Zuraass'Nee",

  locations: [
    site('darklight-realm', 'Darklight Realm', 3, 2, 2, true, { x: 0.5, y: 0.7 }),
    tunnel('b5-ring-n', { x: 0.5, y: 0.2 }),
    tunnel('b5-ring-ne', { x: 0.7, y: 0.35 }),
    tunnel('b5-ring-nw', { x: 0.3, y: 0.35 }),
    tunnel('b5-ring-se', { x: 0.65, y: 0.55 }),
    tunnel('b5-ring-sw', { x: 0.35, y: 0.55 }),
  ],

  paths: [
    ['darklight-realm', 'b5-ring-se'],
    ['darklight-realm', 'b5-ring-sw'],
    ['b5-ring-n', 'b5-ring-ne'],
    ['b5-ring-n', 'b5-ring-nw'],
    ['b5-ring-ne', 'b5-ring-se'],
    ['b5-ring-nw', 'b5-ring-sw'],
  ],

  edgeConnections: [
    { edge: 'N', location: 'b5-ring-n' },
    { edge: 'NE', location: 'b5-ring-ne' },
    { edge: 'SE', location: 'b5-ring-se' },
    { edge: 'S', location: 'darklight-realm' },
    { edge: 'SW', location: 'b5-ring-sw' },
    { edge: 'NW', location: 'b5-ring-nw' },
  ],

  specialRules: null,
}

const B6 = {
  id: 'B6',
  category: 'B',
  region: 'The Phaerlin',

  locations: [
    site('shedaklah', 'Shedaklah', 3, 2, 2, true, { x: 0.5, y: 0.7 }),
    tunnel('b6-ring-n', { x: 0.5, y: 0.2 }),
    tunnel('b6-ring-ne', { x: 0.7, y: 0.35 }),
    tunnel('b6-ring-nw', { x: 0.3, y: 0.35 }),
    tunnel('b6-ring-se', { x: 0.65, y: 0.55 }),
    tunnel('b6-ring-sw', { x: 0.35, y: 0.55 }),
  ],

  paths: [
    ['shedaklah', 'b6-ring-se'],
    ['shedaklah', 'b6-ring-sw'],
    ['b6-ring-n', 'b6-ring-ne'],
    ['b6-ring-n', 'b6-ring-nw'],
    ['b6-ring-ne', 'b6-ring-se'],
    ['b6-ring-nw', 'b6-ring-sw'],
  ],

  edgeConnections: [
    { edge: 'N', location: 'b6-ring-n' },
    { edge: 'NE', location: 'b6-ring-ne' },
    { edge: 'SE', location: 'b6-ring-se' },
    { edge: 'S', location: 'shedaklah' },
    { edge: 'SW', location: 'b6-ring-sw' },
    { edge: 'NW', location: 'b6-ring-nw' },
  ],

  specialRules: null,
}

// ============================================================================
// C HEXES (Surrounding Tiles)
// ============================================================================

const C1 = {
  id: 'C1',
  category: 'C',
  region: 'Twilight Realm',

  locations: [
    site('the-twilight', 'The Twilight', 3, 0, 3, false, { x: 0.4, y: 0.25 }),
    site('spiral-desert', 'Spiral Desert', 3, 0, 3, false, { x: 0.25, y: 0.55 }),
    site('magma-gate', 'Magma Gate', 2, 0, 2, true, { x: 0.7, y: 0.45 }),
    tunnel('c1-t1', { x: 0.5, y: 0.75 }),
  ],

  paths: [
    ['the-twilight', 'magma-gate'],
    ['the-twilight', 'spiral-desert'],
    ['spiral-desert', 'c1-t1'],
    ['magma-gate', 'c1-t1'],
  ],

  edgeConnections: [
    { edge: 'N', location: 'the-twilight' },
    { edge: 'NE', location: 'magma-gate' },
    { edge: 'SE', location: 'c1-t1' },
    { edge: 'S', location: 'c1-t1' },
    { edge: 'SW', location: 'spiral-desert' },
    { edge: 'NW', location: 'the-twilight' },
  ],

  specialRules: null,
}

const C2 = {
  id: 'C2',
  category: 'C',
  region: 'Araumycos',

  locations: [
    site('c2-araumycos', 'Araumycos', 4, 2, 3, false, { x: 0.6, y: 0.3 }),
    site('c2-menzoberranzan', 'Menzoberranzan', 6, 2, 5, true, { x: 0.55, y: 0.7 }),
    tunnel('c2-t1', { x: 0.25, y: 0.5 }),
  ],

  paths: [
    ['c2-araumycos', 'c2-t1'],
    ['c2-menzoberranzan', 'c2-t1'],
    ['c2-araumycos', 'c2-menzoberranzan'],
  ],

  edgeConnections: [
    { edge: 'N', location: 'c2-araumycos' },
    { edge: 'NE', location: 'c2-araumycos' },
    { edge: 'SE', location: 'c2-menzoberranzan' },
    { edge: 'S', location: 'c2-menzoberranzan' },
    { edge: 'SW', location: 'c2-t1' },
    { edge: 'NW', location: 'c2-t1' },
  ],

  specialRules: null,
}

const C3 = {
  id: 'C3',
  category: 'C',
  region: 'Red Forest',

  locations: [
    site('red-forest', 'Red Forest', 3, 1, 4, false, { x: 0.5, y: 0.2 }),
    site('xal-veldrin', 'Xal Veldrin', 4, 0, 3, true, { x: 0.5, y: 0.5 }),
    site('iron-wastes', 'Iron Wastes', 3, 1, 3, false, { x: 0.5, y: 0.8 }),
    tunnel('c3-t1', { x: 0.75, y: 0.35 }),
  ],

  paths: [
    ['red-forest', 'xal-veldrin'],
    ['xal-veldrin', 'iron-wastes'],
    ['red-forest', 'c3-t1'],
    ['xal-veldrin', 'c3-t1'],
  ],

  edgeConnections: [
    { edge: 'N', location: 'red-forest' },
    { edge: 'NE', location: 'c3-t1' },
    { edge: 'SE', location: 'xal-veldrin' },
    { edge: 'S', location: 'iron-wastes' },
    { edge: 'SW', location: 'iron-wastes' },
    { edge: 'NW', location: 'red-forest' },
  ],

  specialRules: null,
}

const C4 = {
  id: 'C4',
  category: 'C',
  region: 'Kulggen',

  locations: [
    site('kulggen', 'Kulggen', 2, 2, 4, false, { x: 0.65, y: 0.25 }),
    site('red-gate', 'Red Gate', 2, 2, 4, false, { x: 0.35, y: 0.25 }),
    site('iblith', 'Iblith', 1, 0, 1, false, { x: 0.5, y: 0.5 }),
    site('caer-sidi', 'Caer Sidi', 3, 0, 3, true, { x: 0.5, y: 0.8 }),
    tunnel('c4-t1', { x: 0.25, y: 0.6 }),
    tunnel('c4-t2', { x: 0.75, y: 0.6 }),
  ],

  paths: [
    ['red-gate', 'iblith'],
    ['kulggen', 'iblith'],
    ['iblith', 'caer-sidi'],
    ['caer-sidi', 'c4-t1'],
    ['caer-sidi', 'c4-t2'],
    ['c4-t1', 'red-gate'],
    ['c4-t2', 'kulggen'],
  ],

  edgeConnections: [
    { edge: 'N', location: 'red-gate' },
    { edge: 'NE', location: 'kulggen' },
    { edge: 'SE', location: 'c4-t2' },
    { edge: 'S', location: 'caer-sidi' },
    { edge: 'SW', location: 'c4-t1' },
    { edge: 'NW', location: 'red-gate' },
  ],

  specialRules: null,
}

const C5 = {
  id: 'C5',
  category: 'C',
  region: 'Erelhei-Cinlu',

  locations: [
    site('erelhei-cinlu', 'Erelhei-Cinlu', 6, 2, 4, false, { x: 0.35, y: 0.3 }),
    site('ath-qua', 'Ath-Qua', 4, 0, 3, true, { x: 0.65, y: 0.55 }),
    tunnel('c5-t1', { x: 0.5, y: 0.15 }),
    tunnel('c5-t2', { x: 0.35, y: 0.7 }),
    tunnel('c5-t3', { x: 0.7, y: 0.8 }),
  ],

  paths: [
    ['erelhei-cinlu', 'c5-t1'],
    ['erelhei-cinlu', 'ath-qua'],
    ['erelhei-cinlu', 'c5-t2'],
    ['ath-qua', 'c5-t3'],
  ],

  edgeConnections: [
    { edge: 'N', location: 'c5-t1' },
    { edge: 'NE', location: 'ath-qua' },
    { edge: 'SE', location: 'c5-t3' },
    { edge: 'S', location: 'c5-t2' },
    { edge: 'SW', location: 'c5-t2' },
    { edge: 'NW', location: 'erelhei-cinlu' },
  ],

  specialRules: null,
}

const C6 = {
  id: 'C6',
  category: 'C',
  region: "Zi'Xzolca",

  locations: [
    site('zixzolca', "Zi'Xzolca", 2, 0, 2, true, { x: 0.65, y: 0.3 }),
    site('black-gate', 'Black Gate', 2, 2, 4, false, { x: 0.35, y: 0.65 }),
    tunnel('c6-t1', { x: 0.5, y: 0.45 }),
    tunnel('c6-t2', { x: 0.25, y: 0.35 }),
    tunnel('c6-t3', { x: 0.7, y: 0.7 }),
  ],

  paths: [
    ['zixzolca', 'c6-t1'],
    ['zixzolca', 'c6-t2'],
    ['black-gate', 'c6-t1'],
    ['black-gate', 'c6-t3'],
    ['c6-t2', 'c6-t1'],
  ],

  edgeConnections: [
    { edge: 'N', location: 'zixzolca' },
    { edge: 'NE', location: 'zixzolca' },
    { edge: 'SE', location: 'c6-t3' },
    { edge: 'S', location: 'black-gate' },
    { edge: 'SW', location: 'black-gate' },
    { edge: 'NW', location: 'c6-t2' },
  ],

  specialRules: null,
}

const C7 = {
  id: 'C7',
  category: 'C',
  region: 'Spiderhome',

  locations: [
    site('spiderhome', 'Spiderhome', 6, 2, 5, false, { x: 0.5, y: 0.25 }),
    site('thanatos-gate', 'Thanatos Gate', 6, 2, 5, false, { x: 0.5, y: 0.75 }),
    tunnel('c7-t1', { x: 0.5, y: 0.5 }),
  ],

  paths: [
    ['spiderhome', 'c7-t1'],
    ['thanatos-gate', 'c7-t1'],
  ],

  edgeConnections: [
    { edge: 'N', location: 'spiderhome' },
    { edge: 'NE', location: 'spiderhome' },
    { edge: 'SE', location: 'thanatos-gate' },
    { edge: 'S', location: 'thanatos-gate' },
    { edge: 'SW', location: 'thanatos-gate' },
    { edge: 'NW', location: 'spiderhome' },
  ],

  specialRules: null,
}

const C8 = {
  id: 'C8',
  category: 'C',
  region: 'Enzithir',

  locations: [
    site('enzithir', 'Enzithir', 2, 1, 3, false, { x: 0.5, y: 0.2 }),
    site('xelathir', 'Xelathir', 2, 1, 3, false, { x: 0.75, y: 0.55 }),
    site('venathir', 'Venathir', 2, 1, 3, false, { x: 0.35, y: 0.7 }),
    tunnel('c8-center', { x: 0.5, y: 0.5 }),
  ],

  paths: [
    ['enzithir', 'c8-center'],
    ['xelathir', 'c8-center'],
    ['venathir', 'c8-center'],
  ],

  edgeConnections: [
    { edge: 'N', location: 'enzithir' },
    { edge: 'NE', location: 'enzithir' },
    { edge: 'SE', location: 'xelathir' },
    { edge: 'S', location: 'venathir' },
    { edge: 'SW', location: 'venathir' },
    { edge: 'NW', location: 'enzithir' },
  ],

  specialRules: null,
}

// ============================================================================
// X HEXES (Experimental)
// ============================================================================

const X1 = {
  id: 'X1',
  category: 'X',
  region: 'The Barrens',

  locations: [
    site('the-barrens', 'The Barrens', 5, 0, 3, false, { x: 0.5, y: 0.2 }),
    site('heaving-hills', 'Heaving Hills', 3, 2, 3, false, { x: 0.7, y: 0.55 }),
    site('rotting-plain', 'Rotting Plain', 3, 2, 3, false, { x: 0.3, y: 0.55 }),
    tunnel('x1-t1', { x: 0.5, y: 0.8 }),
  ],

  paths: [
    ['the-barrens', 'heaving-hills'],
    ['the-barrens', 'rotting-plain'],
    ['heaving-hills', 'x1-t1'],
    ['rotting-plain', 'x1-t1'],
  ],

  edgeConnections: [
    { edge: 'N', location: 'the-barrens' },
    { edge: 'NE', location: 'heaving-hills' },
    { edge: 'SE', location: 'heaving-hills' },
    { edge: 'S', location: 'x1-t1' },
    { edge: 'SW', location: 'rotting-plain' },
    { edge: 'NW', location: 'rotting-plain' },
  ],

  specialRules: null,
}

const X2 = {
  id: 'X2',
  category: 'X',
  region: 'Indifference',

  locations: [
    site('indifference', 'Indifference', 6, 0, 4, false, { x: 0.55, y: 0.5 }),
    tunnel('x2-t1', { x: 0.2, y: 0.3 }),
    tunnel('x2-t2', { x: 0.2, y: 0.7 }),
  ],

  paths: [
    ['indifference', 'x2-t1'],
    ['indifference', 'x2-t2'],
  ],

  edgeConnections: [
    { edge: 'N', location: 'x2-t1' },
    { edge: 'NE', location: 'indifference' },
    { edge: 'SE', location: 'indifference' },
    { edge: 'S', location: 'x2-t2' },
    { edge: 'SW', location: 'x2-t2' },
    { edge: 'NW', location: 'x2-t1' },
  ],

  specialRules: null,
}

const X3 = {
  id: 'X3',
  category: 'X',
  region: 'Dark Tunnels',

  locations: [
    tunnel('x3-t1', { x: 0.5, y: 0.3 }),
    tunnel('x3-t2', { x: 0.5, y: 0.7 }),
  ],

  paths: [
    ['x3-t1', 'x3-t2'],
  ],

  edgeConnections: [
    { edge: 'N', location: 'x3-t1' },
    { edge: 'NE', location: 'x3-t1' },
    { edge: 'SE', location: 'x3-t2' },
    { edge: 'S', location: 'x3-t2' },
    { edge: 'SW', location: 'x3-t2' },
    { edge: 'NW', location: 'x3-t1' },
  ],

  specialRules: null,
}

const X4 = {
  id: 'X4',
  category: 'X',
  region: 'Fountain of Screams',

  locations: [
    site('fountain-of-screams', 'Fountain of Screams', 4, 0, 5, false, { x: 0.5, y: 0.35 }),
    tunnel('x4-t1', { x: 0.35, y: 0.65 }),
    tunnel('x4-t2', { x: 0.65, y: 0.65 }),
  ],

  paths: [
    ['fountain-of-screams', 'x4-t1'],
    ['fountain-of-screams', 'x4-t2'],
    ['x4-t1', 'x4-t2'],
  ],

  edgeConnections: [
    { edge: 'N', location: 'fountain-of-screams' },
    { edge: 'NE', location: 'fountain-of-screams' },
    { edge: 'SE', location: 'x4-t2' },
    { edge: 'S', location: 'x4-t1' },
    { edge: 'SW', location: 'x4-t1' },
    { edge: 'NW', location: 'fountain-of-screams' },
  ],

  specialRules: null,
}

// ============================================================================
// Exports
// ============================================================================

const allTiles = {
  A1, A2, A3, A4, A5, A6, A7, A8, A9,
  B1, B2, B3, B4, B5, B6,
  C1, C2, C3, C4, C5, C6, C7, C8,
  X1, X2, X3, X4,
}

const byCategory = {
  A: [A1, A2, A3, A4, A5, A6, A7, A8, A9],
  B: [B1, B2, B3, B4, B5, B6],
  C: [C1, C2, C3, C4, C5, C6, C7, C8],
  X: [X1, X2, X3, X4],
}

// Edge rotation mapping for pointy-top hexes
// Rotating clockwise by 60° (rotation = 1) shifts edges: N->NE, NE->SE, SE->S, S->SW, SW->NW, NW->N
const EDGES = ['N', 'NE', 'SE', 'S', 'SW', 'NW']

function rotateEdge(edge, rotation) {
  const index = EDGES.indexOf(edge)
  if (index === -1) {
    return edge  // Mid-edge, handle separately if needed
  }
  return EDGES[(index + rotation) % 6]
}

function getRotatedEdgeConnections(tile, rotation) {
  return tile.edgeConnections.map(conn => ({
    edge: rotateEdge(conn.edge, rotation),
    location: conn.location,
  }))
}

// Get the opposite edge for matching connections between adjacent hexes
const OPPOSITE_EDGE = {
  N: 'S',
  NE: 'SW',
  SE: 'NW',
  S: 'N',
  SW: 'NE',
  NW: 'SE',
}

function getOppositeEdge(edge) {
  return OPPOSITE_EDGE[edge]
}

module.exports = {
  allTiles,
  byCategory,
  EDGES,
  rotateEdge,
  getRotatedEdgeConnections,
  getOppositeEdge,
  // Individual tiles for direct access
  A1, A2, A3, A4, A5, A6, A7, A8, A9,
  B1, B2, B3, B4, B5, B6,
  C1, C2, C3, C4, C5, C6, C7, C8,
  X1, X2, X3, X4,
}
