const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Craftsmanship Promoter (OccD 131)', () => {
  test('gives 1 stone on play', () => {
    const card = res.getCardById('craftsmanship-promoter-d131')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.stone = 0

    card.onPlay(game, dennis)

    expect(dennis.stone).toBe(1)
  })

  test('has allowsMajorOnMinorAction flag', () => {
    const card = res.getCardById('craftsmanship-promoter-d131')
    expect(card.allowsMajorOnMinorAction).toBe(true)
  })

  test('allows clay-oven as major on minor action', () => {
    const card = res.getCardById('craftsmanship-promoter-d131')
    expect(card.allowedMajors).toContain('clay-oven')
  })

  test('allows stone-oven as major on minor action', () => {
    const card = res.getCardById('craftsmanship-promoter-d131')
    expect(card.allowedMajors).toContain('stone-oven')
  })

  test('allows joinery as major on minor action', () => {
    const card = res.getCardById('craftsmanship-promoter-d131')
    expect(card.allowedMajors).toContain('joinery')
  })

  test('allows pottery as major on minor action', () => {
    const card = res.getCardById('craftsmanship-promoter-d131')
    expect(card.allowedMajors).toContain('pottery')
  })

  test('allows basketmakers-workshop as major on minor action', () => {
    const card = res.getCardById('craftsmanship-promoter-d131')
    expect(card.allowedMajors).toContain('basketmakers-workshop')
  })

  test('allows buying Joinery on Minor Improvement action', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })

    t.setBoard(game, {
      dennis: {
        wood: 2,
        stone: 2,
        occupations: ['craftsmanship-promoter-d131'],
        farmyard: { rooms: 3 },
      },
      micah: {
        food: 10,
      },
      actionSpaces: ['Basic Wish for Children'],
    })
    game.run()

    // Dennis takes Basic Wish for Children (family growth + minor improvement)
    t.choose(game, 'Basic Wish for Children')

    // With Craftsmanship Promoter played, Joinery should appear as a major improvement choice
    t.choose(game, 'Major Improvement.Joinery (joinery)')

    const dennis = t.player(game)
    expect(dennis.majorImprovements).toContain('joinery')
    expect(dennis.wood).toBe(0)
    expect(dennis.stone).toBe(0)
  })
})
