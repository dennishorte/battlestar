'use strict'

const t = require('../../../../testutil')
const card = require('./northern-watermaster.js')

describe("northern-watermaster", () => {
  test('data', () => {
    expect(card.id).toBe("northern-watermaster")
    expect(card.name).toBe("Northern Watermaster")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
    expect(card.factionAffiliation).toBe("fremen")
  })

  test('agent ability: +1 Water when sent to a purple space', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Northern Watermaster'] },
    })
    game.run()

    const before = game.players.byName('dennis').getCounter('water')
    t.choose(game, 'Agent Turn.Northern Watermaster')
    t.choose(game, 'Spice Refinery')
    // Resolve order: card first to apply +1 water, then space
    let choices = t.currentChoices(game)
    if (choices.includes('Northern Watermaster')) {
      t.choose(game, 'Northern Watermaster')
    }
    // Spice Refinery effect: pick the free 2 solari option
    choices = t.currentChoices(game)
    if (choices.includes('Gain 2 Solari')) {
      t.choose(game, 'Gain 2 Solari')
    }
    // Deploy 0 troops (combat space)
    choices = t.currentChoices(game)
    const deployChoice = choices.find(c => c.startsWith('Deploy 0'))
    if (deployChoice) {
      t.choose(game, deployChoice)
    }

    const dennis = game.players.byName('dennis')
    expect(dennis.getCounter('water')).toBe(before + 1)
  })

  test('reveal: Fremen Bond grants +2 Spice when another Fremen card is revealed', () => {
    const game = t.fixture()
    t.setBoard(game, {
      // Desert Survival is Fremen-affiliated; bond fires.
      dennis: { handExact: ['Northern Watermaster', 'Desert Survival'] },
    })
    game.run()

    const before = game.players.byName('dennis').getCounter('spice')
    t.choose(game, 'Reveal Turn')

    expect(game.players.byName('dennis').getCounter('spice')).toBe(before + 2)
  })

  test('reveal: Fremen Bond does NOT fire without another Fremen card', () => {
    const game = t.fixture()
    t.setBoard(game, {
      // Other starter cards are not Fremen-affiliated.
      dennis: { handExact: ['Northern Watermaster', 'Dagger'] },
    })
    game.run()

    const before = game.players.byName('dennis').getCounter('spice')
    t.choose(game, 'Reveal Turn')

    // No bond → no spice gain.
    expect(game.players.byName('dennis').getCounter('spice')).toBe(before)
  })

  test('reveal: Northern Watermaster contributes its base persuasion (1)', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Northern Watermaster'] },
    })
    game.run()

    t.choose(game, 'Reveal Turn')

    // revealPersuasion: 1 with nothing else
    expect(game.players.byName('dennis').getCounter('persuasion')).toBe(1)
  })
})
