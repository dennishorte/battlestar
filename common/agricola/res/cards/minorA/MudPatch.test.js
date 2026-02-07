const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Mud Patch (A011)', () => {
  test('gives 1 boar on play', () => {
    const card = res.getCardById('mud-patch-a011')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.canPlaceAnimals = () => true

    let boarAdded = 0
    dennis.addAnimals = (type, count) => {
      if (type === 'boar') {
        boarAdded += count
      }
    }

    card.onPlay(game, dennis)

    expect(boarAdded).toBe(1)
  })

  test('does not give boar if cannot place', () => {
    const card = res.getCardById('mud-patch-a011')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.canPlaceAnimals = () => false

    let boarAdded = 0
    dennis.addAnimals = (type, count) => {
      if (type === 'boar') {
        boarAdded += count
      }
    }

    card.onPlay(game, dennis)

    expect(boarAdded).toBe(0)
  })

  test('allows boar on fields', () => {
    const card = res.getCardById('mud-patch-a011')
    expect(card.allowBoarOnFields).toBe(true)
  })
})
