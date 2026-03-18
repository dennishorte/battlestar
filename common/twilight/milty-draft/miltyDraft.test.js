const {
  HIGH_TIER,
  MID_TIER,
  LOW_TIER,
  RED_TILES,
  computeOptimalValues,
  computeSliceStats,
  generateSlices,
} = require('./sliceGenerator.js')

const {
  buildDraftOrder,
  createDraftState,
  getCurrentPlayer,
  getAvailableCategories,
  getAvailableOptions,
  applyPick,
  isDraftComplete,
} = require('./draftEngine.js')

const seedrandom = require('seedrandom')

function makeShuffleFn(seed) {
  const rng = seedrandom(seed)
  return function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
  }
}

describe('Slice Generator', () => {
  test('tile tiers contain no duplicates', () => {
    const all = [...HIGH_TIER, ...MID_TIER, ...LOW_TIER]
    expect(new Set(all).size).toBe(all.length)
  })

  test('all blue tiles are classified', () => {
    // 8+5+7 base + 4+7+5 PoK = 36
    expect(HIGH_TIER.length + MID_TIER.length + LOW_TIER.length).toBe(36)
  })

  test('computeOptimalValues returns correct values for tile 35 (Bereg + Lirta IV)', () => {
    // Bereg: 3R/1I, Lirta IV: 2R/3I
    // Optimal: Bereg max(3,1)=3, min(3,1)=1
    //          Lirta IV max(2,3)=3, min(2,3)=2
    const vals = computeOptimalValues(35)
    expect(vals.resources).toBe(6)
    expect(vals.influence).toBe(3)
    expect(vals.optimalTotal).toBe(9)
  })

  test('computeOptimalValues returns 0 for empty red tile', () => {
    const vals = computeOptimalValues(46) // empty red tile
    expect(vals.resources).toBe(0)
    expect(vals.influence).toBe(0)
    expect(vals.optimalTotal).toBe(0)
  })

  test('generateSlices returns correct count', () => {
    const shuffle = makeShuffleFn('test-slices')
    const slices = generateSlices(shuffle, 6)
    expect(slices.length).toBe(6)
  })

  test('each slice has exactly 5 tiles', () => {
    const shuffle = makeShuffleFn('test-slices-5')
    const slices = generateSlices(shuffle, 5)
    for (const slice of slices) {
      expect(slice.tiles.length).toBe(5)
    }
  })

  test('no tile duplicated across slices', () => {
    const shuffle = makeShuffleFn('test-no-dups')
    const slices = generateSlices(shuffle, 7)
    const allTiles = slices.flatMap(s => s.tiles)
    expect(new Set(allTiles).size).toBe(allTiles.length)
  })

  test('each slice has 1 high, 1 mid, 1 low, 2 red', () => {
    const shuffle = makeShuffleFn('test-composition')
    const slices = generateSlices(shuffle, 6)
    const highSet = new Set(HIGH_TIER)
    const midSet = new Set(MID_TIER)
    const lowSet = new Set(LOW_TIER)
    const redSet = new Set(RED_TILES)

    for (const slice of slices) {
      const high = slice.tiles.filter(t => highSet.has(t))
      const mid = slice.tiles.filter(t => midSet.has(t))
      const low = slice.tiles.filter(t => lowSet.has(t))
      const red = slice.tiles.filter(t => redSet.has(t))

      expect(high.length).toBe(1)
      expect(mid.length).toBe(1)
      expect(low.length).toBe(1)
      expect(red.length).toBe(2)
    }
  })

  test('deterministic with same seed', () => {
    const slices1 = generateSlices(makeShuffleFn('determinism'), 6)
    const slices2 = generateSlices(makeShuffleFn('determinism'), 6)
    expect(slices1).toEqual(slices2)
  })

  test('stats are computed correctly', () => {
    const shuffle = makeShuffleFn('test-stats')
    const slices = generateSlices(shuffle, 4)
    for (const slice of slices) {
      const recomputed = computeSliceStats(slice.tiles)
      expect(slice.stats).toEqual(recomputed)
    }
  })
})

describe('Draft Engine', () => {
  test('buildDraftOrder produces correct snake for 3 players', () => {
    const order = buildDraftOrder(['A', 'B', 'C'])
    expect(order).toEqual(['A', 'B', 'C', 'C', 'B', 'A', 'A', 'B', 'C'])
  })

  test('buildDraftOrder length is 3 * N', () => {
    const order = buildDraftOrder(['A', 'B', 'C', 'D'])
    expect(order.length).toBe(12)
  })

  describe('draft flow', () => {
    let state

    beforeEach(() => {
      const slices = [
        { tiles: [35, 26, 19, 39, 40], stats: { resources: 8, influence: 4, optimalTotal: 12 } },
        { tiles: [36, 27, 20, 41, 42], stats: { resources: 7, influence: 5, optimalTotal: 12 } },
        { tiles: [38, 31, 21, 43, 44], stats: { resources: 9, influence: 2, optimalTotal: 11 } },
        { tiles: [28, 34, 22, 45, 46], stats: { resources: 6, influence: 6, optimalTotal: 12 } },
      ]
      state = createDraftState({
        slices,
        factionPool: ['federation-of-sol', 'emirates-of-hacan', 'barony-of-letnev'],
        playerNames: ['alice', 'bob', 'carol'],
      })
    })

    test('initial state is correct', () => {
      expect(state.currentPickIndex).toBe(0)
      expect(state.draftOrder.length).toBe(9)
      expect(getCurrentPlayer(state)).toBe('alice')
      expect(isDraftComplete(state)).toBe(false)
    })

    test('all categories available at start', () => {
      expect(getAvailableCategories(state, 'alice')).toEqual(['slice', 'faction', 'position'])
    })

    test('picking advances to next player', () => {
      applyPick(state, 'alice', 'slice', 0)
      expect(getCurrentPlayer(state)).toBe('bob')
    })

    test('picked category is no longer available', () => {
      applyPick(state, 'alice', 'slice', 0)
      expect(getAvailableCategories(state, 'alice')).toEqual(['faction', 'position'])
    })

    test('picked option is no longer available', () => {
      applyPick(state, 'alice', 'slice', 0)
      const available = getAvailableOptions(state, 'slice')
      expect(available).not.toContain(0)
      expect(available).toContain(1)
    })

    test('cannot pick same category twice', () => {
      applyPick(state, 'alice', 'slice', 0)
      applyPick(state, 'bob', 'slice', 1)
      applyPick(state, 'carol', 'slice', 2)
      // Carol's second pick (snake back) — already has slice
      expect(() => applyPick(state, 'carol', 'slice', 3)).toThrow('already picked')
    })

    test('cannot pick already-taken option', () => {
      applyPick(state, 'alice', 'faction', 'federation-of-sol')
      applyPick(state, 'bob', 'slice', 0)
      expect(() => applyPick(state, 'carol', 'faction', 'federation-of-sol')).toThrow('not available')
    })

    test('full draft completes after 3N picks', () => {
      // Round 1: alice, bob, carol
      applyPick(state, 'alice', 'slice', 0)
      applyPick(state, 'bob', 'slice', 1)
      applyPick(state, 'carol', 'slice', 2)
      // Round 2 (reverse): carol, bob, alice
      applyPick(state, 'carol', 'faction', 'barony-of-letnev')
      applyPick(state, 'bob', 'faction', 'emirates-of-hacan')
      applyPick(state, 'alice', 'faction', 'federation-of-sol')
      // Round 3: alice, bob, carol
      applyPick(state, 'alice', 'position', 1)
      applyPick(state, 'bob', 'position', 2)
      applyPick(state, 'carol', 'position', 3)

      expect(isDraftComplete(state)).toBe(true)
      expect(state.playerState.alice).toEqual({ faction: 'federation-of-sol', slice: 0, position: 1 })
      expect(state.playerState.bob).toEqual({ faction: 'emirates-of-hacan', slice: 1, position: 2 })
      expect(state.playerState.carol).toEqual({ faction: 'barony-of-letnev', slice: 2, position: 3 })
    })
  })
})
