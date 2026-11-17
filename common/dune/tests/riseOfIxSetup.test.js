const t = require('../testutil')
const res = require('../res/index.js')

function cardsIn(game, zoneId) {
  return game.zones.byId(zoneId).cardlist()
}

function ixImperiumCopies(game) {
  const cards = [
    ...cardsIn(game, 'common.imperiumDeck'),
    ...cardsIn(game, 'common.imperiumRow'),
  ]
  return cards.filter(card => card.definition.source === 'Rise of Ix')
}

describe('Rise of Ix card gate', () => {

  test('flag off keeps Rise of Ix shipping, tech, and tile cards out', () => {
    const game = t.fixture()
    game.run()

    const imperium = [
      ...cardsIn(game, 'common.imperiumDeck'),
      ...cardsIn(game, 'common.imperiumRow'),
    ]
    expect(imperium.filter(card => card.definition.source === 'Rise of Ix')).toHaveLength(0)
    expect(res.getTechCards({ useBaseGameCards: true })).toHaveLength(0)
    expect(res.getLeaders({ useBaseGameCards: true }).some(leader => leader.name === 'Prince Rhombur Vernius')).toBe(false)
    expect(cardsIn(game, 'common.reserve.foldspace')).toHaveLength(0)
  })

  test('flag on adds the expansion cards and leaves the conflict deck alone', () => {
    const game = t.fixture({ useRiseOfIx: true })
    game.run()

    expect(ixImperiumCopies(game)).toHaveLength(35)
    const intrigue = cardsIn(game, 'common.intrigueDeck').filter(card => card.definition.source === 'Rise of Ix')
    expect(intrigue).toHaveLength(17)

    const tech = res.getTechCards({ useRiseOfIx: true })
    expect(tech).toHaveLength(18)
    expect(tech.every(tile => tile.source === 'Rise of Ix')).toBe(true)

    const leaders = res.getLeaders({ useRiseOfIx: true }).filter(leader => leader.source === 'Rise of Ix')
    expect(leaders).toHaveLength(6)

    const conflict = [
      ...cardsIn(game, 'common.conflictDeck'),
      ...cardsIn(game, 'common.conflictActive'),
    ]
    expect(conflict).toHaveLength(10)
    expect(conflict.some(card => card.definition.source === 'Rise of Ix')).toBe(false)

    const starting = [
      ...cardsIn(game, 'dennis.hand'),
      ...cardsIn(game, 'dennis.deck'),
    ]
    expect(starting.some(card => card.definition.id === 'control-the-spice')).toBe(false)
    expect(cardsIn(game, 'common.reserve.foldspace')).toHaveLength(0)
  })

  test('Ilesa gets a six-card Foldspace pile and a second assignment does not add more', () => {
    const ilesa = require('../res/leaders/IlesaEcaz.js')
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, { leaders: { dennis: ilesa } })
    game.run()

    expect(cardsIn(game, 'common.reserve.foldspace')).toHaveLength(6)
    expect(cardsIn(game, 'common.reserve.foldspace').every(card => card.name === 'Foldspace')).toBe(true)

    ilesa.onAssign(game)
    expect(cardsIn(game, 'common.reserve.foldspace')).toHaveLength(6)
  })

  test('Ilesa does not get Foldspace when the expansion is off', () => {
    const ilesa = require('../res/leaders/IlesaEcaz.js')
    const game = t.fixture()
    t.setBoard(game, { leaders: { dennis: ilesa } })
    game.run()
    expect(cardsIn(game, 'common.reserve.foldspace')).toHaveLength(0)
  })

  test('Bloodlines tiles stay out of the Rise of Ix tile list', () => {
    const tech = res.getTechCards({ useRiseOfIx: true, useBloodlines: false })
    expect(tech.some(tile => tile.source === 'Bloodlines')).toBe(false)
  })
})
