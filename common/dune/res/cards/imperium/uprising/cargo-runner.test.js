'use strict'

const t = require('../../../../testutil')
const card = require('./cargo-runner.js')

describe('cargo-runner', () => {

  test('data', () => {
    expect(card.id).toBe('cargo-runner')
    expect(card.name).toBe('Cargo Runner')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('Uprising')
    expect(card.factionAffiliation).toBe('guild')
  })

  function setupAndPlay(completedCount) {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        handExact: ['Cargo Runner'],
        contractsCompleted: completedCount,
      },
    })
    game.run()

    t.choose(game, 'Agent Turn.Cargo Runner')
    t.choose(game, 'Assembly Hall')
    // Order prompt: card vs space
    t.choose(game, 'Cargo Runner')
    return game
  }

  test('agent ability with 0 completed contracts: no draws', () => {
    const game = setupAndPlay(0)
    const handCount = game.zones.byId('dennis.hand').cardlist().length
    expect(handCount).toBe(0)
  })

  test('agent ability with 2 completed contracts: draws 1 card', () => {
    const game = setupAndPlay(2)
    const handCount = game.zones.byId('dennis.hand').cardlist().length
    expect(handCount).toBe(1)
  })

  test('agent ability with 4 completed contracts: draws 2 cards', () => {
    const game = setupAndPlay(4)
    const handCount = game.zones.byId('dennis.hand').cardlist().length
    expect(handCount).toBe(2)
  })

  test('reveal grants 1 persuasion', () => {
    const game = t.fixture()
    t.setBoard(game, { dennis: { handExact: ['Cargo Runner'] } })
    game.run()

    t.choose(game, 'Reveal Turn')

    const dennis = game.players.byName('dennis')
    expect(dennis.getCounter('persuasion')).toBe(1)
  })
})
