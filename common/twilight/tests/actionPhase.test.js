describe('Action Phase', () => {
  describe('Turn Order', () => {
    test.todo('player with lowest strategy card number goes first')
    test.todo('turns rotate through active players')
    test.todo('skip passed players in turn rotation')
  })

  describe('Action Types', () => {
    test.todo('player can take tactical action')
    test.todo('player can take strategic action')
    test.todo('player can take component action')
    test.todo('player can pass after using strategy card')
    test.todo('player cannot pass until strategy card is used')
  })

  describe('Passing', () => {
    test.todo('player who passes takes no more turns this phase')
    test.todo('action phase ends when all players have passed')
    test.todo('passed state resets at start of next action phase')
  })

  describe('Strategic Action', () => {
    test.todo('using strategy card marks it as used')
    test.todo('strategic action not available after card is used')
    test.todo('other players can resolve secondary')
    test.todo('secondary costs strategy command token')
  })
})
