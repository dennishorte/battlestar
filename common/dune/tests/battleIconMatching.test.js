const t = require('../testutil')

const SKIRMISH_CRYSKNIFE = require('../res/cards/conflict/conflict-skirmish-crysknife.js')
const SKIRMISH_DESERT_MOUSE = require('../res/cards/conflict/conflict-skirmish-desert-mouse.js')
const SKIRMISH_ORNITHOPTER = require('../res/cards/conflict/conflict-skirmish-ornithopter.js')
const SKIRMISH_WILD = require('../res/cards/conflict/conflict-skirmish-5.js')
const STORMS_IN_THE_SOUTH = require('../res/cards/conflict/conflict-storms-in-the-south.js')

const CRYSKNIFE_OBJ = { id: 'test-obj-crysknife', name: 'Test Objective: Crysknife', battleIcon: 'crysknife', isFirstPlayer: false }
const ORNITHOPTER_OBJ = { id: 'test-obj-ornithopter', name: 'Test Objective: Ornithopter', battleIcon: 'ornithopter', isFirstPlayer: false }
const NO_ICON_OBJ = { id: 'test-obj-no-icon', name: 'Test Objective', battleIcon: null, isFirstPlayer: false }

// Resolve all prompts in the current round, defaulting to choices[0] for any
// non-Reveal/Pass prompts (e.g. faction influence picks). Stops when round
// advances or game ends.
function finishUntilNextRound(game) {
  const startRound = game.state.round
  let safety = 60
  while (game.waiting && !game.gameOver && game.state.round === startRound && safety-- > 0) {
    const choices = t.currentChoices(game)
    if (choices.includes('Reveal Turn')) {
      t.choose(game, 'Reveal Turn')
    }
    else if (choices.includes('Pass')) {
      t.choose(game, 'Pass')
    }
    else {
      t.choose(game, choices[0])
    }
  }
}

// Resolve prompts until game ends. By default passes endgame intrigue prompts;
// pass `{ playIntrigue: true }` to play them instead.
function finishUntilGameOver(game, opts = {}) {
  const playIntrigue = !!opts.playIntrigue
  let safety = 200
  while (game.waiting && !game.gameOver && safety-- > 0) {
    const choices = t.currentChoices(game)
    const title = game.waiting.selectors[0]?.title || ''
    if (playIntrigue && title.includes('Endgame Intrigue')) {
      const nonPass = choices.find(c => c !== 'Pass')
      if (nonPass) {
        t.choose(game, nonPass)
        continue
      }
    }
    if (choices.includes('Reveal Turn')) {
      t.choose(game, 'Reveal Turn')
    }
    else if (choices.includes('Pass')) {
      t.choose(game, 'Pass')
    }
    else {
      t.choose(game, choices[0])
    }
  }
}

// Helper: dennis deploys 2 troops via Reconnaissance, then everyone runs
// through to combat resolution.
function dennisDeploysAndCombatResolves(game) {
  t.choose(game, 'Agent Turn.Reconnaissance')
  t.choose(game, 'Arrakeen')
  t.choose(game, 'Deploy 2 troop(s) from garrison')
  finishUntilNextRound(game)
}


describe('Battle Icon Matching — In-Combat', () => {

  test('matching objective + winning conflict awards +1 VP and flips both', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { troopsInGarrison: 5, vp: 0 },
      objectives: { dennis: CRYSKNIFE_OBJ },
      conflictCard: { id: 'conflict-skirmish-crysknife' },
    })
    game.run()

    dennisDeploysAndCombatResolves(game)

    // Skirmish 1st reward = "+1 Influence" (no VP); only the icon match gives VP.
    const dennis = game.players.byName('dennis')
    expect(dennis.vp).toBe(1)

    const flipped = game.state.conflict.flippedCardIds.dennis || []
    expect(flipped).toContain('test-obj-crysknife')
    expect(flipped).toContain('conflict-skirmish-crysknife')
  })

  test('matching previously-won conflict + new conflict awards +1 VP', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { troopsInGarrison: 5, vp: 0 },
      conflict: { wonCards: { dennis: [SKIRMISH_DESERT_MOUSE] } },
      objectives: { dennis: CRYSKNIFE_OBJ },
      conflictCard: { id: 'conflict-skirmish-desert-mouse' },
    })
    game.run()

    dennisDeploysAndCombatResolves(game)

    // Crysknife objective doesn't match desert-mouse conflict; the previously-won
    // desert-mouse DOES match the just-won desert-mouse.
    const dennis = game.players.byName('dennis')
    expect(dennis.vp).toBe(1)

    const flipped = game.state.conflict.flippedCardIds.dennis || []
    expect(flipped).toContain('conflict-skirmish-desert-mouse')
    expect(flipped).not.toContain('test-obj-crysknife')
  })

  test('non-matching icons award no extra VP', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { troopsInGarrison: 5, vp: 0 },
      objectives: { dennis: ORNITHOPTER_OBJ },
      conflictCard: { id: 'conflict-skirmish-crysknife' },
    })
    game.run()

    dennisDeploysAndCombatResolves(game)

    const dennis = game.players.byName('dennis')
    expect(dennis.vp).toBe(0)

    const flipped = game.state.conflict.flippedCardIds?.dennis || []
    expect(flipped).toEqual([])
  })

  test('winning a wild conflict alone awards no VP during combat', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { troopsInGarrison: 5, vp: 0 },
      objectives: { dennis: NO_ICON_OBJ },
      conflictCard: { id: 'conflict-skirmish-5' },
    })
    game.run()

    dennisDeploysAndCombatResolves(game)

    const dennis = game.players.byName('dennis')
    expect(dennis.vp).toBe(0)

    const flipped = game.state.conflict.flippedCardIds?.dennis || []
    expect(flipped).toEqual([])
  })

  test('wild conflict does not match a crysknife objective during combat', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { troopsInGarrison: 5, vp: 0 },
      objectives: { dennis: CRYSKNIFE_OBJ },
      conflictCard: { id: 'conflict-skirmish-5' },
    })
    game.run()

    dennisDeploysAndCombatResolves(game)

    // Wild defers its pairing to endgame — no match during combat.
    const dennis = game.players.byName('dennis')
    expect(dennis.vp).toBe(0)

    const flipped = game.state.conflict.flippedCardIds?.dennis || []
    expect(flipped).toEqual([])
  })

  test('wild conflict does not match a previously-won crysknife conflict during combat', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { troopsInGarrison: 5, vp: 0 },
      conflict: { wonCards: { dennis: [SKIRMISH_CRYSKNIFE] } },
      objectives: { dennis: NO_ICON_OBJ },
      conflictCard: { id: 'conflict-skirmish-5' },
    })
    game.run()

    dennisDeploysAndCombatResolves(game)

    const dennis = game.players.byName('dennis')
    expect(dennis.vp).toBe(0)

    const flipped = game.state.conflict.flippedCardIds?.dennis || []
    expect(flipped).toEqual([])
  })

  test('winning a non-wild conflict ignores a face-up wild conflict during combat', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { troopsInGarrison: 5, vp: 0 },
      conflict: { wonCards: { dennis: [SKIRMISH_WILD] } },
      objectives: { dennis: NO_ICON_OBJ },
      conflictCard: { id: 'conflict-skirmish-crysknife' },
    })
    game.run()

    dennisDeploysAndCombatResolves(game)

    // The face-up wild cannot be a partner during combat matching.
    const dennis = game.players.byName('dennis')
    expect(dennis.vp).toBe(0)

    const flipped = game.state.conflict.flippedCardIds?.dennis || []
    expect(flipped).toEqual([])
  })

  test('flipped objective cannot be matched again', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { troopsInGarrison: 5, vp: 0 },
      conflict: {
        wonCards: { dennis: [SKIRMISH_CRYSKNIFE] },
        flippedCardIds: { dennis: ['test-obj-crysknife', 'conflict-skirmish-crysknife'] },
      },
      objectives: { dennis: CRYSKNIFE_OBJ },
      conflictCard: { id: 'conflict-skirmish-ornithopter' },
    })
    game.run()

    dennisDeploysAndCombatResolves(game)

    const dennis = game.players.byName('dennis')
    expect(dennis.vp).toBe(0)

    const flipped = game.state.conflict.flippedCardIds?.dennis || []
    expect(flipped.sort()).toEqual(['conflict-skirmish-crysknife', 'test-obj-crysknife'])
  })

  test('only one pair flips per win even when multiple candidates are face-up', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { troopsInGarrison: 5, vp: 0 },
      conflict: { wonCards: { dennis: [SKIRMISH_DESERT_MOUSE] } },
      objectives: { dennis: { id: 'test-obj-desert-mouse', name: 'Test Obj', battleIcon: 'desert-mouse', isFirstPlayer: false } },
      conflictCard: { id: 'conflict-skirmish-desert-mouse' },
    })
    game.run()

    dennisDeploysAndCombatResolves(game)

    // Two face-up desert-mouse candidates (objective + previously-won) and a third
    // is won. Only ONE pair forms = +1 VP, exactly two cards flipped.
    const dennis = game.players.byName('dennis')
    expect(dennis.vp).toBe(1)

    const flipped = game.state.conflict.flippedCardIds?.dennis || []
    expect(flipped.length).toBe(2)
    expect(flipped).toContain('conflict-skirmish-desert-mouse')
  })
})


describe('Battle Icon Matching — Endgame Wild Pairing', () => {

  test('endgame: face-up wild pairs with crysknife objective for +1 VP', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { vp: 10, troopsInGarrison: 0 },
      conflict: { wonCards: { dennis: [SKIRMISH_WILD] } },
      objectives: { dennis: CRYSKNIFE_OBJ },
    })
    game.run()

    finishUntilGameOver(game)

    expect(game.gameOver).toBe(true)
    // 10 going in + 1 from endgame wild auto-pair (wild + crysknife objective)
    expect(game.players.byName('dennis').vp).toBe(11)

    const flipped = game.state.conflict.flippedCardIds.dennis || []
    expect(flipped).toContain('conflict-skirmish-5')
    expect(flipped).toContain('test-obj-crysknife')
  })

  test('endgame: face-up wild pairs with previously-won crysknife conflict', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { vp: 10, troopsInGarrison: 0 },
      conflict: { wonCards: { dennis: [SKIRMISH_WILD, SKIRMISH_CRYSKNIFE] } },
      objectives: { dennis: NO_ICON_OBJ },
    })
    game.run()

    finishUntilGameOver(game)

    expect(game.gameOver).toBe(true)
    expect(game.players.byName('dennis').vp).toBe(11)

    const flipped = game.state.conflict.flippedCardIds.dennis || []
    expect(flipped).toContain('conflict-skirmish-5')
    expect(flipped).toContain('conflict-skirmish-crysknife')
  })

  test('endgame: two wilds plus two non-wilds yield two pairs (+2 VP)', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { vp: 10, troopsInGarrison: 0 },
      conflict: {
        wonCards: { dennis: [SKIRMISH_WILD, STORMS_IN_THE_SOUTH, SKIRMISH_CRYSKNIFE, SKIRMISH_ORNITHOPTER] },
      },
      objectives: { dennis: NO_ICON_OBJ },
    })
    game.run()

    finishUntilGameOver(game)

    expect(game.gameOver).toBe(true)
    expect(game.players.byName('dennis').vp).toBe(12) // 10 + 2 pairs

    const flipped = game.state.conflict.flippedCardIds.dennis || []
    expect(flipped.length).toBe(4)
  })

  test('endgame: two wilds with only one non-wild form one pair (+1 VP)', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { vp: 10, troopsInGarrison: 0 },
      conflict: {
        wonCards: { dennis: [SKIRMISH_WILD, STORMS_IN_THE_SOUTH, SKIRMISH_CRYSKNIFE] },
      },
      objectives: { dennis: NO_ICON_OBJ },
    })
    game.run()

    finishUntilGameOver(game)

    // Iter 1: wild#1 pairs with the crysknife (only non-wild battle icon) → +1 VP.
    // Iter 2: wild#2 has no non-wild partner remaining (wild-on-wild is not allowed).
    expect(game.gameOver).toBe(true)
    expect(game.players.byName('dennis').vp).toBe(11)

    const flipped = game.state.conflict.flippedCardIds.dennis || []
    expect(flipped.length).toBe(2)
    expect(flipped).toContain('conflict-skirmish-crysknife')
  })

  test('endgame: lone wild with no partner gives no VP', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { vp: 10, troopsInGarrison: 0 },
      conflict: { wonCards: { dennis: [SKIRMISH_WILD] } },
      objectives: { dennis: NO_ICON_OBJ },
    })
    game.run()

    finishUntilGameOver(game)

    expect(game.gameOver).toBe(true)
    expect(game.players.byName('dennis').vp).toBe(10)

    const flipped = game.state.conflict.flippedCardIds?.dennis || []
    expect(flipped).toEqual([])
  })

  test('endgame: wild already flipped (e.g. by intrigue) is not double-counted', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { vp: 10, troopsInGarrison: 0 },
      conflict: {
        wonCards: { dennis: [SKIRMISH_WILD, SKIRMISH_CRYSKNIFE] },
        flippedCardIds: { dennis: ['conflict-skirmish-5'] },
      },
      objectives: { dennis: NO_ICON_OBJ },
    })
    game.run()

    finishUntilGameOver(game)

    // Wild is already flipped — auto-pair has no wild to consume.
    expect(game.gameOver).toBe(true)
    expect(game.players.byName('dennis').vp).toBe(10)

    const flipped = game.state.conflict.flippedCardIds.dennis || []
    expect(flipped.sort()).toEqual(['conflict-skirmish-5'])
  })

  test('endgame Crysknife intrigue runs before auto-pair and consumes wild', () => {
    // Player has a wild + Crysknife intrigue + no other battle-icon cards. The
    // intrigue should flip the wild for +1 VP; auto-pair has nothing left.
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { vp: 10, troopsInGarrison: 0, intrigue: ['Crysknife'] },
      conflict: { wonCards: { dennis: [SKIRMISH_WILD] } },
      objectives: { dennis: NO_ICON_OBJ },
    })
    game.run()

    finishUntilGameOver(game, { playIntrigue: true })

    // 10 + 1 (Crysknife intrigue flips wild) + 0 (no partner left for auto-pair).
    expect(game.gameOver).toBe(true)
    expect(game.players.byName('dennis').vp).toBe(11)

    const flipped = game.state.conflict.flippedCardIds.dennis || []
    expect(flipped).toContain('conflict-skirmish-5')
  })

  test('endgame Crysknife intrigue + wild + crysknife conflict: intrigue first then auto-pair has nothing', () => {
    // Crysknife intrigue flips the first flippable card in wonCards order:
    // SKIRMISH_CRYSKNIFE → +1 VP. Auto-pair then sees a face-up wild but no
    // non-wild battle-icon partner remaining → no pair.
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { vp: 10, troopsInGarrison: 0, intrigue: ['Crysknife'] },
      conflict: { wonCards: { dennis: [SKIRMISH_CRYSKNIFE, SKIRMISH_WILD] } },
      objectives: { dennis: NO_ICON_OBJ },
    })
    game.run()

    finishUntilGameOver(game, { playIntrigue: true })

    expect(game.gameOver).toBe(true)
    expect(game.players.byName('dennis').vp).toBe(11)

    const flipped = game.state.conflict.flippedCardIds.dennis || []
    expect(flipped).toContain('conflict-skirmish-crysknife')
    expect(flipped).not.toContain('conflict-skirmish-5')
  })

  test('endgame: wild auto-pairs with conflict if intrigue is passed', () => {
    // Same setup as previous test but the player passes their Crysknife
    // intrigue. Auto-pair fires: wild + crysknife → +1 VP, both flipped.
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { vp: 10, troopsInGarrison: 0, intrigue: ['Crysknife'] },
      conflict: { wonCards: { dennis: [SKIRMISH_CRYSKNIFE, SKIRMISH_WILD] } },
      objectives: { dennis: NO_ICON_OBJ },
    })
    game.run()

    finishUntilGameOver(game) // Pass on intrigue

    expect(game.gameOver).toBe(true)
    expect(game.players.byName('dennis').vp).toBe(11)

    const flipped = game.state.conflict.flippedCardIds.dennis || []
    expect(flipped).toContain('conflict-skirmish-crysknife')
    expect(flipped).toContain('conflict-skirmish-5')
  })
})


describe('Battle Icon Matching — Card Data', () => {

  test('wild battle icons exist on conflict cards', () => {
    const conflictCards = require('../res/cards/conflict')
    const wild = conflictCards.filter(c => c.battleIcon === 'wild')
    expect(wild.length).toBeGreaterThan(0)
  })

  test('all conflict battle icons are valid', () => {
    const conflictCards = require('../res/cards/conflict')
    const valid = new Set(['crysknife', 'desert-mouse', 'ornithopter', 'wild', null])
    for (const c of conflictCards) {
      expect(valid.has(c.battleIcon || null)).toBe(true)
    }
  })

  test('all objective battle icons are one of the three real icons', () => {
    const objectives = require('../res/cards/objectives')
    const valid = new Set(['crysknife', 'desert-mouse', 'ornithopter'])
    for (const o of objectives) {
      expect(valid.has(o.battleIcon)).toBe(true)
    }
  })
})
