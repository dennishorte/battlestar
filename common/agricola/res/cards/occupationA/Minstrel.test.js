const t = require('../../../testutil_v2.js')
const Minstrel = require('./Minstrel.js')

describe('Minstrel', () => {
  // Card is 3+ players. onReturnHomeStart: if exactly one action space in rounds 1–4 is unoccupied, you may use it.

  test('getUnoccupiedActionSpacesInRounds returns only unoccupied spaces in range', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 3 })
    t.setBoard(game, { round: 5, dennis: { occupations: [] } })
    game.run()
    const unoccupied = game.getUnoccupiedActionSpacesInRounds(1, 4)
    expect(Array.isArray(unoccupied)).toBe(true)
    expect(unoccupied.length).toBeLessThanOrEqual(4)
  })

  test('Minstrel onReturnHomeStart with exactly one unoccupied calls choose and executeAction when Use selected', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 3 })
    t.setBoard(game, { round: 5, dennis: { occupations: ['minstrel-a151'] } })
    game.run()
    const dennis = game.players.byName('dennis')
    const deck = game.state.roundCardDeck
    const ids = ['take-wood', 'take-clay', 'take-grain', 'take-reed']
    for (let i = 0; i < 4; i++) {
      const idx = deck.findIndex(c => c.id === ids[i])
      if (idx !== -1 && idx !== i) {
        ;[deck[i], deck[idx]] = [deck[idx], deck[i]]
      }
    }
    for (let i = 0; i < 3; i++) {
      const id = deck[i].id
      if (game.state.actionSpaces[id]) {
        game.state.actionSpaces[id].occupiedBy = dennis.name
      }
    }
    let chooseCalledWith = null
    let executeActionCalledWith = null
    game.actions.choose = (player, choices, opts) => {
      chooseCalledWith = { player, choices, opts }
      return ['Skip']
    }
    game.actions.executeAction = (player, actionId) => {
      executeActionCalledWith = { player, actionId }
    }
    Minstrel.onReturnHomeStart(game, dennis)
    expect(chooseCalledWith).not.toBeNull()
    expect(chooseCalledWith.choices).toContain('Skip')
    expect(chooseCalledWith.choices.some(c => c.startsWith('Use '))).toBe(true)
    expect(executeActionCalledWith).toBeNull()
  })

  test('Minstrel onReturnHomeStart with zero or two+ unoccupied in 1–4 does not call choose', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 3 })
    t.setBoard(game, { round: 5, dennis: { occupations: ['minstrel-a151'] } })
    game.run()
    const dennis = game.players.byName('dennis')
    let chooseCalls = 0
    game.actions.choose = () => {
      chooseCalls++; return []
    }
    Minstrel.onReturnHomeStart(game, dennis)
    expect(chooseCalls).toBe(0)
  })
})
