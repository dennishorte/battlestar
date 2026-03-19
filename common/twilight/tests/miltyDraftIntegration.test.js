const t = require('../testutil.js')
const res = require('../res/index.js')

describe('Milty Draft Integration', () => {
  test('3-player milty draft completes and initializes game', () => {
    const game = t.fixture({
      numPlayers: 3,
      factions: [],
      randomFactions: false,
      deterministicLayout: false,
      miltyDraft: { numSlices: 4, numFactions: 5 },
    })
    game.run()

    // Should be waiting for first player's draft pick
    expect(game.waiting).toBeTruthy()
    const firstChoices = t.currentChoices(game)
    expect(firstChoices.length).toBeGreaterThan(0)

    // Choices should include slice, faction, and position options
    const hasSlice = firstChoices.some(c => c.startsWith('Slice'))
    const hasFaction = firstChoices.some(c => c.startsWith('Faction'))
    const hasPosition = firstChoices.some(c => c.startsWith('Speaker'))
    expect(hasSlice).toBe(true)
    expect(hasFaction).toBe(true)
    expect(hasPosition).toBe(true)

    // Draft order: 3 players × 3 picks = 9 total picks (snake: ABC CBA ABC)
    // Pick slices first round, factions second, positions third
    const sliceChoices = firstChoices.filter(c => c.startsWith('Slice'))

    // Round 1: dennis, micah, scott pick slices
    t.choose(game, sliceChoices[0])  // dennis picks slice 1
    t.choose(game, sliceChoices[1])  // micah picks slice 2
    t.choose(game, sliceChoices[2])  // scott picks slice 3

    // Round 2 (reverse): scott, micah, dennis pick factions
    const scottFactions = t.currentChoices(game).filter(c => c.startsWith('Faction'))
    t.choose(game, scottFactions[0])  // scott picks a faction

    const micahFactions = t.currentChoices(game).filter(c => c.startsWith('Faction'))
    t.choose(game, micahFactions[0])  // micah picks a faction

    const dennisFactions = t.currentChoices(game).filter(c => c.startsWith('Faction'))
    t.choose(game, dennisFactions[0])  // dennis picks a faction

    // Round 3: dennis, micah, scott pick positions
    const dennisPositions = t.currentChoices(game).filter(c => c.startsWith('Speaker'))
    t.choose(game, dennisPositions[0])  // dennis picks position

    const micahPositions = t.currentChoices(game).filter(c => c.startsWith('Speaker'))
    t.choose(game, micahPositions[0])  // micah picks position

    const scottPositions = t.currentChoices(game).filter(c => c.startsWith('Speaker'))
    t.choose(game, scottPositions[0])  // scott picks position

    // After draft completes, game should initialize with the drafted factions
    // All players should have factions assigned
    for (const player of game.players.all()) {
      expect(player.factionId).toBeTruthy()
      const faction = res.getFaction(player.factionId)
      expect(faction).toBeTruthy()
    }

    // All players should have different factions
    const factionIds = game.players.all().map(p => p.factionId)
    expect(new Set(factionIds).size).toBe(3)

    // Speaker should be set
    expect(game.state.speaker).toBeTruthy()

    // Mecatol Rex should exist
    expect(game.state.systems[18]).toBeDefined()

    // Home systems should be placed
    for (const player of game.players.all()) {
      const faction = res.getFaction(player.factionId)
      const homeId = faction.homeSystem
      // Creuss uses creuss-gate instead of home system at the board position
      const effectiveId = homeId === 'creuss-home' ? 'creuss-gate' : homeId
      expect(game.state.systems[effectiveId]).toBeDefined()
    }

    // Slice tiles should be placed on the map
    const miltySlices = game.state.miltyDraftSlices
    expect(miltySlices).toBeDefined()
    for (const player of game.players.all()) {
      const sliceData = miltySlices[player.name]
      expect(sliceData).toBeDefined()
      for (const tileId of sliceData.tiles) {
        expect(game.state.systems[tileId]).toBeDefined()
      }
    }
  })

  test('deterministic: same seed produces same draft results', () => {
    function runDraft(seed) {
      const game = t.fixture({
        numPlayers: 3,
        factions: [],
        randomFactions: false,
        deterministicLayout: false,
        seed,
        miltyDraft: { numSlices: 4, numFactions: 5 },
      })
      game.run()

      // Make the same picks each time — always pick the first available option
      for (let i = 0; i < 9; i++) {
        const choices = t.currentChoices(game)
        t.choose(game, choices[0])
      }

      return {
        factions: game.players.all().map(p => p.factionId),
        speaker: game.state.speaker,
        systems: Object.keys(game.state.systems).sort(),
      }
    }

    const result1 = runDraft('milty-determinism')
    const result2 = runDraft('milty-determinism')
    expect(result1).toEqual(result2)
  })
})
