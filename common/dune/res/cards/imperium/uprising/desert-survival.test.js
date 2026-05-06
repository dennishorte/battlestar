'use strict'

const t = require('../../../../testutil')
const card = require('./desert-survival.js')

describe('desert-survival', () => {
  test('data', () => {
    expect(card.id).toBe('desert-survival')
    expect(card.name).toBe('Desert Survival')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('All')
    expect(card.factionAffiliation).toBe('fremen')
  })

  test('agent ability: trashes a chosen hand card via the generic trash-card flow', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Desert Survival', 'Dagger', 'Convincing Argument', 'Diplomacy', 'Reconnaissance'] },
    })
    game.run()

    // Send Desert Survival to a yellow space (Accept Contract is free).
    t.choose(game, 'Agent Turn.Desert Survival')
    t.choose(game, 'Accept Contract')

    // Card vs. space ordering — resolve card ability first to land on the
    // trash-a-card prompt (the only prompt produced by the card itself).
    let choices = t.currentChoices(game)
    if (choices.includes('Desert Survival')) {
      t.choose(game, 'Desert Survival')
      choices = t.currentChoices(game)
    }

    // The trash-a-card prompt should now offer hand/in-play/discard cards.
    expect(choices).toContain('Pass')
    expect(choices).toContain('Dagger (Hand)')

    t.choose(game, 'Dagger (Hand)')

    const trash = game.zones.byId('common.trash')
    expect(trash.cardlist().some(c => c.name === 'Dagger')).toBe(true)
  })

  test('agent ability: pass produces no trash', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Desert Survival', 'Dagger', 'Convincing Argument', 'Diplomacy', 'Reconnaissance'] },
    })
    game.run()

    t.choose(game, 'Agent Turn.Desert Survival')
    t.choose(game, 'Accept Contract')
    let choices = t.currentChoices(game)
    if (choices.includes('Desert Survival')) {
      t.choose(game, 'Desert Survival')
    }
    t.choose(game, 'Pass')

    const trash = game.zones.byId('common.trash')
    expect(trash.cardlist().length).toBe(0)
  })

  test('reveal: contributes 1 persuasion (revealed alongside other cards)', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Desert Survival', 'Dagger'] },
    })
    game.run()

    t.choose(game, 'Reveal Turn')

    const dennis = game.players.byName('dennis')
    // Desert Survival(1) + Dagger(0) = 1 persuasion
    expect(dennis.getCounter('persuasion')).toBe(1)
  })

})
