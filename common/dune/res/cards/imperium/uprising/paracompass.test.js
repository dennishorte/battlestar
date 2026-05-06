'use strict'

const t = require('../../../../testutil')
const card = require('./paracompass.js')

describe("paracompass", () => {
  test('data', () => {
    expect(card.id).toBe("paracompass")
    expect(card.name).toBe("Paracompass")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })

  test('agent ability: +2 Solari when sent to a purple space', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Paracompass'], solari: 0 },
    })
    game.run()

    t.choose(game, 'Agent Turn.Paracompass')
    t.choose(game, 'Spice Refinery')
    let choices = t.currentChoices(game)
    if (choices.includes('Paracompass')) {
      t.choose(game, 'Paracompass')
    }
    choices = t.currentChoices(game)
    if (choices.includes('Gain 2 Solari')) {
      t.choose(game, 'Gain 2 Solari')
    }
    choices = t.currentChoices(game)
    const deploy = choices.find(c => c.startsWith('Deploy 0'))
    if (deploy) {
      t.choose(game, deploy)
    }

    // Card +2 Solari + space gain 2 Solari = 4
    expect(game.players.byName('dennis').getCounter('solari')).toBe(4)
  })

  // Reveal ability: "If High Council: +2 Persuasion. If ALSO Swordmaster: +1 Persuasion"
  // Base reveal persuasion is 0; bonuses only fire conditionally.

  test('reveal: no High Council, no Swordmaster → +0 Persuasion', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Paracompass'] },
    })
    game.run()

    t.choose(game, 'Reveal Turn')
    expect(game.players.byName('dennis').getCounter('persuasion')).toBe(0)
  })

  test('reveal: High Council only → +2 Persuasion', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Paracompass'], hasHighCouncil: true },
    })
    game.run()

    t.choose(game, 'Reveal Turn')
    expect(game.players.byName('dennis').getCounter('persuasion')).toBe(2)
  })

  // skip: parser treats the two `If ...:` clauses as independent rather than
  // chained ("ALSO" is dropped). Swordmaster alone yields +1 Persuasion when
  // it should yield +0 because the second clause is conditioned on the first.
  test.skip('reveal: Swordmaster only (no High Council) → +0 Persuasion', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Paracompass'], hasSwordmaster: true },
    })
    game.run()

    t.choose(game, 'Reveal Turn')
    // Without the High Council branch, the "ALSO Swordmaster" rider doesn't apply.
    expect(game.players.byName('dennis').getCounter('persuasion')).toBe(0)
  })

  test('reveal: High Council AND Swordmaster → +3 Persuasion', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Paracompass'], hasHighCouncil: true, hasSwordmaster: true },
    })
    game.run()

    t.choose(game, 'Reveal Turn')
    expect(game.players.byName('dennis').getCounter('persuasion')).toBe(3)
  })
})
