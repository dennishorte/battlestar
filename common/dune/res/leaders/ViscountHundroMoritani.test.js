const leader = require('./ViscountHundroMoritani.js')

describe('Viscount Hundro Moritani', () => {
  test('data', () => {
    expect(leader.name).toBe('Viscount Hundro Moritani')
    expect(leader.source).toBe('Rise of Ix')
  })
})
