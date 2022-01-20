Error.stackTraceLimit = 100

const t = require('../../../testutil.js')

describe('Monument achievement', () => {

  test('tuck six', () => {

    expect(game.getAchievements('micah').cards).toStrictEqual(['Monument'])
  })

  test('score six', () => {

    expect(game.getAchievements('micah').cards).toStrictEqual(['Monument'])
  })

  test('tuck three and score three does not work', () => {

    expect(game.getAchievements('micah').cards).toStrictEqual([])
  })

})
