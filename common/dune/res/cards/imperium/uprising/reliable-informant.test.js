'use strict'

const t = require('../../../../testutil')
const card = require('./reliable-informant.js')

describe("reliable-informant", () => {
  test('data', () => {
    expect(card.id).toBe("reliable-informant")
    expect(card.name).toBe("Reliable Informant")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("Uprising")
    expect(card.factionAccess).toEqual(['guild'])
  })

  test('agent ability: spy placement is restricted to Emperor/BG/Fremen posts', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Reliable Informant'], spiesInSupply: 3 },
    })
    game.run()

    t.choose(game, 'Agent Turn.Reliable Informant')
    t.choose(game, 'Deliver Supplies')

    // Scan choices forward until we reach the spy-placement prompt; prior
    // prompts (card vs space ordering, etc.) are auto-resolved when there's
    // only one option, but if multiple appear we pick deterministically.
    let choices = t.currentChoices(game)
    while (!choices.some(c => c.startsWith('Post '))) {
      // resolve any intervening single-pick prompts by choosing the first
      t.choose(game, choices[0])
      choices = t.currentChoices(game)
    }

    // Only Emperor (J), Bene Gesserit (L), and Fremen (M) posts allowed.
    // K (Spacing Guild) and other non-faction posts must NOT appear.
    const postIds = choices
      .filter(c => c.startsWith('Post '))
      .map(c => c.match(/Post (\w+)/)[1])
    expect(postIds.sort()).toEqual(['J', 'L', 'M'])
  })

  test('agent ability: spy lands on the chosen faction post', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Reliable Informant'], spiesInSupply: 3 },
    })
    game.run()

    t.choose(game, 'Agent Turn.Reliable Informant')
    t.choose(game, 'Deliver Supplies')

    let choices = t.currentChoices(game)
    while (!choices.some(c => c.startsWith('Post '))) {
      t.choose(game, choices[0])
      choices = t.currentChoices(game)
    }

    const lChoice = choices.find(c => c.startsWith('Post L'))
    t.choose(game, lChoice)

    expect(game.state.spyPosts.L).toContain('dennis')
    const dennis = game.players.byName('dennis')
    expect(dennis.spiesInSupply).toBe(2)
  })
})
