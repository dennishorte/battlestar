const leader = require('./LadyAmberMetulli.js')

describe('Lady Amber Metulli', () => {
  test('data', () => {
    expect(leader.name).toBe('Lady Amber Metulli')
    expect(leader.leaderAbility).toContain('Desert Scouts')
  })
})
