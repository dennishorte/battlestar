const res = require('../../index.js')

describe('Fodder Chamber (D035)', () => {
  test('gives points based on animals in 1 player game (every 7th)', () => {
    const card = res.getCardById('fodder-chamber-d035')
    const player = {
      getTotalAnimals: (type) => {
        const animals = { sheep: 7, boar: 7, cattle: 7 }
        return animals[type]
      },
    }
    const game = {
      players: { all: () => [{ name: 'dennis' }] },
    }

    expect(card.getEndGamePoints(player, game)).toBe(3)
  })

  test('gives points based on animals in 2 player game (every 5th)', () => {
    const card = res.getCardById('fodder-chamber-d035')
    const player = {
      getTotalAnimals: (type) => {
        const animals = { sheep: 5, boar: 5, cattle: 5 }
        return animals[type]
      },
    }
    const game = {
      players: { all: () => [{ name: 'dennis' }, { name: 'frank' }] },
    }

    expect(card.getEndGamePoints(player, game)).toBe(3)
  })

  test('gives points based on animals in 3 player game (every 4th)', () => {
    const card = res.getCardById('fodder-chamber-d035')
    const player = {
      getTotalAnimals: (type) => {
        const animals = { sheep: 4, boar: 4, cattle: 4 }
        return animals[type]
      },
    }
    const game = {
      players: { all: () => [{ name: 'p1' }, { name: 'p2' }, { name: 'p3' }] },
    }

    expect(card.getEndGamePoints(player, game)).toBe(3)
  })

  test('gives points based on animals in 4+ player game (every 3rd)', () => {
    const card = res.getCardById('fodder-chamber-d035')
    const player = {
      getTotalAnimals: (type) => {
        const animals = { sheep: 3, boar: 3, cattle: 3 }
        return animals[type]
      },
    }
    const game = {
      players: { all: () => [{ name: 'p1' }, { name: 'p2' }, { name: 'p3' }, { name: 'p4' }] },
    }

    expect(card.getEndGamePoints(player, game)).toBe(3)
  })

  test('rounds down partial points', () => {
    const card = res.getCardById('fodder-chamber-d035')
    const player = {
      getTotalAnimals: (type) => {
        const animals = { sheep: 2, boar: 2, cattle: 2 }
        return animals[type]
      },
    }
    const game = {
      players: { all: () => [{ name: 'p1' }, { name: 'p2' }, { name: 'p3' }, { name: 'p4' }] },
    }

    expect(card.getEndGamePoints(player, game)).toBe(2)
  })

  test('has correct properties', () => {
    const card = res.getCardById('fodder-chamber-d035')
    expect(card.cost).toEqual({ stone: 3, grain: 3 })
    expect(card.vps).toBe(2)
  })
})
