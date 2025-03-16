Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Avicenna', () => {

  test('karma decree', () => {
    t.testDecreeForTwo('Avicenna', 'Expansion')
  })

  test('karma no-fade', () => {
    t.testNoFade('Avicenna')
  })
})
