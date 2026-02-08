const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Manservant (B107)', () => {
  test('schedules 3 food per round when living in stone house', () => {
    const card = res.getCardById('manservant-b107')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()
    game.state.round = 5

    const dennis = t.player(game)
    dennis.roomType = 'stone'
    dennis.manservantTriggered = false

    card.checkTrigger(game, dennis)

    expect(dennis.manservantTriggered).toBe(true)
    expect(game.state.scheduledFood.dennis[6]).toBe(3)
    expect(game.state.scheduledFood.dennis[7]).toBe(3)
    expect(game.state.scheduledFood.dennis[14]).toBe(3)
  })

  test('does not trigger when not in stone house', () => {
    const card = res.getCardById('manservant-b107')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()
    game.state.round = 5

    const dennis = t.player(game)
    dennis.roomType = 'clay'
    dennis.manservantTriggered = false

    card.checkTrigger(game, dennis)

    expect(dennis.manservantTriggered).toBeFalsy()
    expect(game.state.scheduledFood).toBeUndefined()
  })

  test('only triggers once', () => {
    const card = res.getCardById('manservant-b107')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()
    game.state.round = 5

    const dennis = t.player(game)
    dennis.roomType = 'stone'
    dennis.manservantTriggered = true

    card.checkTrigger(game, dennis)

    expect(game.state.scheduledFood).toBeUndefined()
  })
})
