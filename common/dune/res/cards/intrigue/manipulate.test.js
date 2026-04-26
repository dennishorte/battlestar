'use strict'

const t = require('../../../testutil.js')
const card = require('./manipulate.js')

describe("manipulate", () => {
  test('data', () => {
    expect(card.id).toBe("manipulate")
    expect(card.name).toBe("Manipulate")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })

  test('plotEffect prompts to remove an Imperium Row card and reserves it for -1 persuasion', () => {
    const game = t.fixture()
    t.setBoard(game, { dennis: { intrigue: ['Manipulate'] } })
    game.run()

    expect(t.currentChoices(game)).toContain('Manipulate')
    t.choose(game, 'Manipulate')

    const targetName = game.zones.byId('common.imperiumRow').cardlist()[0].name
    t.choose(game, targetName)

    const reserved = game.zones.byId('common.reservedCards').cardlist()
    expect(reserved).toHaveLength(1)
    expect(reserved[0].name).toBe(targetName)
    expect(game.state.reservedCards).toHaveLength(1)
    expect(game.state.reservedCards[0]).toMatchObject({ player: 'dennis', round: 1 })
    expect(game.state.reservedCards[0].cardId).toBe(reserved[0].id)
    expect(game.zones.byId('common.imperiumRow').cardlist()).toHaveLength(5)
  })
})
