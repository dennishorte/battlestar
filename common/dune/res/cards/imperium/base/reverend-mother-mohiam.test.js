'use strict'

const t = require('../../../../testutil')
const card = require('./reverend-mother-mohiam.js')

describe("reverend-mother-mohiam", () => {
  test('data', () => {
    expect(card.id).toBe("reverend-mother-mohiam")
    expect(card.name).toBe("Reverend Mother Mohiam")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })

  test('agent ability: no discard without another BG card in play', () => {
    const game = t.fixture({ numPlayers: 2 })
    t.setBoard(game, {
      dennis: { handExact: ['Reverend Mother Mohiam'] },
      micah: { handExact: ['Dagger', 'Diplomacy'] },
    })
    game.run()

    t.choose(game, 'Agent Turn.Reverend Mother Mohiam')
    t.choose(game, 'Secrets')
    t.choose(game, 'Reverend Mother Mohiam')

    const micahHand = game.zones.byId('micah.hand').cardlist()
    expect(micahHand.length).toBe(2)
  })

  test('agent ability (v4): single prompt to discard 2 cards', () => {
    const game = t.fixture({ numPlayers: 2 })
    t.setBoard(game, {
      dennis: {
        handExact: ['Reverend Mother Mohiam'],
        played: ['Bene Gesserit Sister'],
      },
      micah: { handExact: ['Dagger', 'Diplomacy', 'Dune, The Desert Planet'] },
    })
    game.run()

    t.choose(game, 'Agent Turn.Reverend Mother Mohiam')
    t.choose(game, 'Secrets')
    t.choose(game, 'Reverend Mother Mohiam')

    // v4: one prompt asking for 2 cards at once
    const choices = t.currentChoices(game)
    expect(choices.length).toBe(3)
    expect(game.waiting.selectors[0].count).toBe(2)

    t.choose(game, 'Dagger', 'Diplomacy')

    const micahHand = game.zones.byId('micah.hand').cardlist()
    expect(micahHand.length).toBe(1)
    expect(micahHand[0].name).toBe('Dune, The Desert Planet')
  })

  test('agent ability (v3 legacy): two separate discard prompts', () => {
    const game = t.fixture({ numPlayers: 2, version: 3 })
    t.setBoard(game, {
      dennis: {
        handExact: ['Reverend Mother Mohiam'],
        played: ['Bene Gesserit Sister'],
      },
      micah: { handExact: ['Dagger', 'Diplomacy', 'Dune, The Desert Planet'] },
    })
    game.run()

    t.choose(game, 'Agent Turn.Reverend Mother Mohiam')
    t.choose(game, 'Secrets')
    t.choose(game, 'Reverend Mother Mohiam')

    // v3: first of two separate prompts
    t.choose(game, 'Dagger')
    // v3: second prompt
    t.choose(game, 'Diplomacy')

    const micahHand = game.zones.byId('micah.hand').cardlist()
    expect(micahHand.length).toBe(1)
    expect(micahHand[0].name).toBe('Dune, The Desert Planet')
  })
})
