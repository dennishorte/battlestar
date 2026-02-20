describe('Trade System', () => {
  describe('Neighbors', () => {
    test.todo('players with units in same system are neighbors')
    test.todo('players with units in adjacent systems are neighbors')
    test.todo('Hacan can trade with non-neighbors (Guild Ships)')
  })

  describe('Transactions', () => {
    test.todo('active player can propose trade')
    test.todo('target player accepts or rejects')
    test.todo('trade goods exchanged on acceptance')
    test.todo('commodities convert to trade goods on receipt')
    test.todo('one transaction per neighbor per turn')
  })

  describe('Promissory Notes', () => {
    test.todo('can include promissory note in transaction')
    test.todo('max 1 promissory note per transaction')
    test.todo('promissory note changes ownership')
  })

  describe('Trade Strategy Card', () => {
    test.todo('primary: replenish commodities and gain 3 trade goods')
    test.todo('secondary: spend token to replenish commodities')
    test.todo('Hacan does not spend token for secondary')
  })
})
