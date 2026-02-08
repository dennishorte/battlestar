const res = require('../../index.js')

describe('Pigswill (D083)', () => {
  test('gives 1 wild boar when using fencing action', () => {
    const card = res.getCardById('pigswill-d083')
    const player = {
      boar: 0,
      addAnimal: function(type, amount) {
        if (type === 'boar') {
          this.boar += amount
        }
      },
    }
    const game = { log: { add: jest.fn() } }

    card.onAction(game, player, 'fencing')

    expect(player.boar).toBe(1)
  })

  test('gives 1 wild boar when using build-fences action', () => {
    const card = res.getCardById('pigswill-d083')
    const player = {
      boar: 0,
      addAnimal: function(type, amount) {
        if (type === 'boar') {
          this.boar += amount
        }
      },
    }
    const game = { log: { add: jest.fn() } }

    card.onAction(game, player, 'build-fences')

    expect(player.boar).toBe(1)
  })

  test('does not give wild boar for other actions', () => {
    const card = res.getCardById('pigswill-d083')
    const player = {
      boar: 0,
      addAnimal: function(type, amount) {
        if (type === 'boar') {
          this.boar += amount
        }
      },
    }
    const game = { log: { add: jest.fn() } }

    card.onAction(game, player, 'take-wood')

    expect(player.boar).toBe(0)
  })

  test('has correct properties', () => {
    const card = res.getCardById('pigswill-d083')
    expect(card.cost).toEqual({ food: 2 })
    expect(card.costAlternative).toEqual({ grain: 1 })
  })
})
