describe('Tactical Action', () => {
  describe('System Activation', () => {
    test.todo('activating system places command token')
    test.todo('activating system spends tactic token')
    test.todo('cannot activate system with own command token')
    test.todo('cannot activate without tactic tokens')
  })

  describe('Movement', () => {
    test.todo('move ships to activated system')
    test.todo('ships respect move values')
    test.todo('cannot move more than move value allows')
    test.todo('move through wormhole')
    test.todo('cannot move through asteroid field')
    test.todo('cannot move through supernova')
    test.todo('gravity rift: risk roll during movement')
    test.todo('nebula: ships end movement in nebula')
    test.todo('cannot move ships out of a system with own command token')
  })

  describe('Transport', () => {
    test.todo('carriers transport ground forces')
    test.todo('carriers transport fighters')
    test.todo('cannot exceed transport capacity')
    test.todo('dreadnoughts have capacity 1')
    test.todo('fighters require capacity when no Fighter II')
  })

  describe('Fleet Pool', () => {
    test.todo('non-fighter ship count limited by fleet pool')
    test.todo('fighters not counted against fleet pool')
    test.todo('Barony of Letnev armada adds +2 to fleet limit')
  })
})
