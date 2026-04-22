const leader = require('./GaiusHelenMohiam.js')

describe('Gaius Helen Mohiam', () => {
  test('data', () => {
    expect(leader.name).toBe('Gaius Helen Mohiam')
    expect(leader.source).toBe('Bloodlines')
  })
})
