const t = require('../../../testutil')
const ilesa = require('../../../res/leaders/IlesaEcaz')
const card = require('./foldspace.js')

describe('Foldspace', () => {
  test('data', () => {
    expect(card.id).toBe('foldspace')
    expect(card.name).toBe('Foldspace')
    expect(card.source).toBe('Base')
    expect(card.compatibility).toBe('Dune Imperium (Base Only)')
    expect(card.agentAbility).toBe('Draw a card')
  })

  test('agent ability draws a card', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      leaders: { dennis: ilesa },
      dennis: { handExact: ['Dagger'] },
    })
    // Ilesa's assignment builds the Foldspace pile. Put one copy in hand.
    game.testSetBreakpoint('after-round-start', (g) => {
      const foldspace = g.zones.byId('common.reserve.foldspace').cardlist()[0]
      foldspace.moveTo(g.zones.byId('dennis.hand'))
    })
    game.run()

    // Set aside Dagger so Foldspace stays available for the agent turn.
    t.choose(game, 'Dagger')

    const handBefore = game.zones.byId('dennis.hand').cardlist().length
    const deckBefore = game.zones.byId('dennis.deck').cardlist().length

    t.choose(game, 'Agent Turn.Foldspace')
    // Guild space, no draw of its own, so the only new card is Foldspace's.
    t.choose(game, 'Deliver Supplies')
    let choices = t.currentChoices(game)
    while (choices.includes('Foldspace') && choices.includes('Deliver Supplies')) {
      t.choose(game, 'Foldspace')
      choices = t.currentChoices(game)
    }

    // Played Foldspace (-1) and drew one (+1). The space only gives water.
    expect(game.zones.byId('dennis.hand').cardlist().length).toBe(handBefore)
    expect(game.zones.byId('dennis.deck').cardlist().length).toBe(deckBefore - 1)
    expect(game.zones.byId('dennis.played').cardlist().some(c => c.name === 'Foldspace')).toBe(true)
    expect(game.players.byName('dennis').water).toBe(2)
  })
})
