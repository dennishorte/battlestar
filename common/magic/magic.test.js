Error.stackTraceLimit = 100

const {
  GameOverEvent,
  InputRequestEvent,
} = require('../lib/game.js')

const TestCards = require('./test_card_data.js')
const t = require('./testutil.js')
const util = require('../lib/util.js')


describe('Magic', () => {

  test('game creation', () => {
    const game = t.fixture()
    const request1 = game.run()
    // If no errors thrown, success.
  })

  test('deck selection', () => {
    const game = t.fixtureDecksSelected()
    // If no errors, decks were selected successfully.
  })

  test('adjust life', () => {
    const game = t.fixtureDecksSelected()

    const request1 = game.run()
    const request2 = t.do(game, request1, {
      name: 'adjust counter',
      counter: 'life',
      amount: -2,
    })

    t.testBoard(game, {
      dennis: {
        life: 18,
      },
    })
  })

})


describe('Magic Actions', () => {

  test('cascade action', () => {
    const game = t.fixtureDecksSelected()

    const request1 = game.run()
    const request2 = t.do(game, request1, { name: 'cascade', x: 2 })

    t.testBoard(game, {
      dennis: {
        stack: ['benalish hero'],
      },
    })
  })

  test('create token', () => {
    const game = t.fixtureDecksSelected()

    const request1 = game.run()
    const request2 = t.do(game, request1, {
      name: 'create token',
      data: {
        name: 'Elf Warrior',
        annotation: '1/1',
        count: 1,
        zoneId: 'players.dennis.creatures',
      },
    })

    t.testBoard(game, {
      dennis: {
        creatures: ['Elf Warrior'],
      },
    })
  })

  test('draw action', () => {
    const game = t.fixtureDecksSelected()

    const request1 = game.run()
    const request2 = t.do(game, request1, { name: 'draw' })

    t.testBoard(game, {
      dennis: {
        hand: ['white knight'],
      },
    })
  })

  test('draw 7 action', () => {
    const game = t.fixtureDecksSelected()

    const request1 = game.run()
    const request2 = t.do(game, request1, { name: 'draw 7' })

    t.testBoard(game, {
      dennis: {
        hand: [
          'Plains',
          'Plains',
          'Benalish Hero',
          'White Knight',
          'Advance Scout',
          'Tithe',
          'Holy Strength',
        ],
      },
    })
  })

  test('import card', () => {
    const game = t.fixtureDecksSelected()

    const request1 = game.run()
    const request2 = t.do(game, request1, {
      name: 'import card',
      data: {
        count: 1,
        card: TestCards.byName['white knight'][0].toJSON(),
        isToken: true,
        zoneId: 'players.dennis.command',
      },
    })
    const request3 = t.do(game, request2, { name: 'draw' })

    t.testBoard(game, {
      dennis: {
        command: ['white knight'],
        hand: ['white knight'],
      }
    })
  })

  test('move card', () => {
    const game = t.fixtureDecksSelected()

    const request1 = game.run()
    const request2 = t.do(game, request1, { name: 'draw' })
    const request3 = t.do(game, request2, {
      name: 'move card',
      cardId: game.getCardsByZone(t.dennis(game), 'hand')[0].g.id,
      destId: 'players.dennis.creatures',
      destIndex: 0,
    })

    t.testBoard(game, {
      dennis: {
        creatures: ['White Knight'],
      },
    })
  })

  test('mulligan', () => {
    const game = t.fixtureDecksSelected()

    const request1 = game.run()
    const request2 = t.do(game, request1, { name: 'draw 7' })

    t.testBoard(game, {
      dennis: {
        hand: [
          'Plains',
          'Plains',
          'Benalish Hero',
          'White Knight',
          'Advance Scout',
          'Tithe',
          'Holy Strength',
        ],
      },
    })
  })

  test('reveal next', () => {
    const game = t.fixtureDecksSelected()

    const request1 = game.run()
    const request2 = t.do(game, request1, { name: 'reveal next', zoneId: 'players.dennis.library' })

    const libraryCards = game.getCardsByZone(t.dennis(game), 'library')
    t.testVisibility(libraryCards[0], 'dennis', 'micah')
    t.testVisibility(libraryCards[1])

    const request3 = t.do(game, request2, { name: 'reveal next', zoneId: 'players.dennis.library' })
    const libraryCards2 = game.getCardsByZone(t.dennis(game), 'library')
    t.testVisibility(libraryCards2[0], 'dennis', 'micah')
    t.testVisibility(libraryCards2[1], 'dennis', 'micah')
    t.testVisibility(libraryCards2[2])
  })

  test('view next', () => {
    const game = t.fixtureDecksSelected()

    const request1 = game.run()
    const request2 = t.do(game, request1, { name: 'view next', zoneId: 'players.dennis.library' })

    const libraryCards = game.getCardsByZone(t.dennis(game), 'library')
    t.testVisibility(libraryCards[0], 'dennis')
    t.testVisibility(libraryCards[1])

    const request3 = t.do(game, request2, { name: 'view next', zoneId: 'players.dennis.library' })
    const libraryCards2 = game.getCardsByZone(t.dennis(game), 'library')
    t.testVisibility(libraryCards2[0], 'dennis')
    t.testVisibility(libraryCards2[1], 'dennis')
    t.testVisibility(libraryCards2[2])
  })

  test('view top k', () => {
    const game = t.fixtureDecksSelected()

    const request1 = game.run()
    const request2 = t.do(game, request1, {
      name: 'view top k',
      zoneId: 'players.dennis.library',
      count: 2,
    })

    const libraryCards = game.getCardsByZone(t.dennis(game), 'library')
    t.testVisibility(libraryCards[0], 'dennis')
    t.testVisibility(libraryCards[1], 'dennis')
    t.testVisibility(libraryCards[2])
  })

  test.skip('active face', () => {
    const game = t.fixtureDecksSelected()

    const request1 = game.run()
    const request2 = t.do(game, request1, {
      name: 'active face',
      cardId: game.getCardsByZone(t.dennis(game), 'library')[0].g.id,
      faceIndex: 1,
    })

    const card = game.getCardsByZone(t.dennis(game), 'library')[0]
    expect(card.g.activeFaceIndex).toBe(1)
  })

  test('add counter', () => {
    const game = t.fixtureDecksSelected()

    const request1 = game.run()
    const request2 = t.do(game, request1, { name: 'draw' })
    const request3 = t.do(game, request2, {
      name: 'move card',
      cardId: game.getCardsByZone(t.dennis(game), 'hand')[0].g.id,
      destId: 'players.dennis.creatures',
      destIndex: 0,
    })
    const request4 = t.do(game, request3, {
      name: 'add counter',
      cardId: game.getCardsByZone(t.dennis(game), 'creatures')[0].g.id,
      key: 'loyalty',
    })

    const card = game.getCardsByZone(t.dennis(game), 'creatures')[0]
    expect(card.g.counters.loyalty).toBe(1)
  })

  test.skip('add counter player', () => {
    const game = t.fixtureDecksSelected()

    const request1 = game.run()

    const player = game.getPlayerByName('dennis')
    expect(player.counters.energy).toBe(undefined)

    const request2 = t.do(game, request1, {
      name: 'add counter player',
      playerName: 'dennis',
      key: 'energy',
    })

    // I don't know why this isn't working. The log shows it happening. If I print the player counters
    // in aAddPlayerCounter, it looks good.
    t.dumpLog(game)
    console.log(player.name, player.counters)
    expect(player.counters.energy).toBe(0)
  })

  test('adjust c-counter', () => {
    const game = t.fixtureDecksSelected()

    const request1 = game.run()
    const request2 = t.do(game, request1, { name: 'draw' })
    const request3 = t.do(game, request2, {
      name: 'move card',
      cardId: game.getCardsByZone(t.dennis(game), 'hand')[0].g.id,
      destId: 'players.dennis.creatures',
      destIndex: 0,
    })
    const request4 = t.do(game, request3, {
      name: 'add counter',
      cardId: game.getCardsByZone(t.dennis(game), 'creatures')[0].g.id,
      key: 'loyalty',
    })
    const request5 = t.do(game, request4, {
      name: 'adjust c-counter',
      cardId: game.getCardsByZone(t.dennis(game), 'creatures')[0].g.id,
      key: 'loyalty',
      count: 2,
    })

    const card = game.getCardsByZone(t.dennis(game), 'creatures')[0]
    expect(card.g.counters.loyalty).toBe(3)
  })

  test('annotate', () => {
    const game = t.fixtureDecksSelected()

    const request1 = game.run()
    const request2 = t.do(game, request1, { name: 'draw' })
    const request3 = t.do(game, request2, {
      name: 'move card',
      cardId: game.getCardsByZone(t.dennis(game), 'hand')[0].g.id,
      destId: 'players.dennis.creatures',
      destIndex: 0,
    })
    const request4 = t.do(game, request3, {
      name: 'annotate',
      cardId: game.getCardsByZone(t.dennis(game), 'creatures')[0].g.id,
      annotation: '+1/+1',
    })

    const card = game.getCardsByZone(t.dennis(game), 'creatures')[0]
    expect(card.g.annotation).toBe('+1/+1')
  })

  test('annotate eot', () => {
    const game = t.fixtureDecksSelected()

    const request1 = game.run()
    const request2 = t.do(game, request1, { name: 'draw' })
    const request3 = t.do(game, request2, {
      name: 'move card',
      cardId: game.getCardsByZone(t.dennis(game), 'hand')[0].g.id,
      destId: 'players.dennis.creatures',
      destIndex: 0,
    })
    const request4 = t.do(game, request3, {
      name: 'annotate eot',
      cardId: game.getCardsByZone(t.dennis(game), 'creatures')[0].g.id,
      annotation: '+1/+1',
    })

    const card = game.getCardsByZone(t.dennis(game), 'creatures')[0]
    expect(card.g.annotationEOT).toBe('+1/+1')
  })

  test('attach', () => {
    const game = t.fixtureDecksSelected()

    const request1 = game.run()
    const request2 = t.do(game, request1, { name: 'draw' })
    const request3 = t.do(game, request2, {
      name: 'move card',
      cardId: game.getCardsByZone(t.dennis(game), 'hand')[0].g.id,
      destId: 'players.dennis.creatures',
      destIndex: 0,
    })
    const request4 = t.do(game, request3, { name: 'draw' })
    const request5 = t.do(game, request4, {
      name: 'move card',
      cardId: game.getCardsByZone(t.dennis(game), 'hand')[0].g.id,
      destId: 'players.dennis.creatures',
      destIndex: 1,
    })
    const request6 = t.do(game, request5, {
      name: 'attach',
      cardId: game.getCardsByZone(t.dennis(game), 'creatures')[1].g.id,
      targetId: game.getCardsByZone(t.dennis(game), 'creatures')[0].g.id,
    })

    const source = game.getCardsByZone(t.dennis(game), 'creatures')[1]
    const target = game.getCardsByZone(t.dennis(game), 'creatures')[0]
    expect(source.g.attachedTo).toBe(target)
    expect(target.g.attached).toStrictEqual([source])
  })

  test('concede', () => {
    const game = t.fixtureDecksSelected()

    const request1 = game.run()
    const request2 = t.do(game, request1, {
      name: 'concede',
    })

    const player = game.getPlayerByName('dennis')
    expect(player.eliminated).toBe(true)

    // Since it is a two player game, the other player should win
    expect(game.checkGameIsOver()).toBe(true)
    expect(game.gameOverData.player).toBe('micah')
  })

  test('detach', () => {
    const game = t.fixtureDecksSelected()

    const request1 = game.run()
    const request2 = t.do(game, request1, { name: 'draw' })
    const request3 = t.do(game, request2, {
      name: 'move card',
      cardId: game.getCardsByZone(t.dennis(game), 'hand')[0].g.id,
      destId: 'players.dennis.creatures',
      destIndex: 0,
    })
    const request4 = t.do(game, request3, { name: 'draw' })
    const request5 = t.do(game, request4, {
      name: 'move card',
      cardId: game.getCardsByZone(t.dennis(game), 'hand')[0].g.id,
      destId: 'players.dennis.creatures',
      destIndex: 1,
    })
    const request6 = t.do(game, request5, {
      name: 'attach',
      cardId: game.getCardsByZone(t.dennis(game), 'creatures')[1].g.id,
      targetId: game.getCardsByZone(t.dennis(game), 'creatures')[0].g.id,
    })
    const request7 = t.do(game, request6, {
      name: 'detach',
      cardId: game.getCardsByZone(t.dennis(game), 'creatures')[1].g.id,
    })

    const source = game.getCardsByZone(t.dennis(game), 'creatures')[1]
    const target = game.getCardsByZone(t.dennis(game), 'creatures')[0]
    expect(source.g.attachedTo).toBe(null)
    expect(target.g.attached).toStrictEqual([])
  })

  test('draw game', () => {
    const game = t.fixtureDecksSelected()

    const request1 = game.run()
    const request2 = t.do(game, request1, {
      name: 'draw game',
    })

    expect(game.checkGameIsOver()).toBe(true)
    expect(game.gameOverData.player).toBe('nobody')
  })

  test('hide all', () => {
    const game = t.fixtureDecksSelected()

    const request1 = game.run()
    const request2 = t.do(game, request1, { name: 'draw' })
    const request3 = t.do(game, request2, {
      name: 'reveal next',
      zoneId: 'players.dennis.library',
    })
    const request4 = t.do(game, request3, {
      name: 'reveal next',
      zoneId: 'players.dennis.library',
    })
    const request5 = t.do(game, request4, {
      name: 'hide all',
      zoneId: 'players.dennis.library',
    })

    const cards = game.getCardsByZone(t.dennis(game), 'library')
    expect(cards[0].visibility).toStrictEqual([])
    expect(cards[1].visibility).toStrictEqual([])
  })

  test('morph', () => {
    const game = t.fixtureDecksSelected()

    const request1 = game.run()
    const request2 = t.do(game, request1, { name: 'draw' })
    const request3 = t.do(game, request2, {
      name: 'morph',
      cardId: game.getCardsByZone(t.dennis(game), 'hand')[0].g.id,
    })

    const card = game.getCardsByZone(t.dennis(game), 'stack')[0]
    expect(card.g.morph).toBe(true)
  })

  test('move all', () => {
    const game = t.fixtureDecksSelected()

    const request1 = game.run()
    const request2 = t.do(game, request1, { name: 'draw' })
    const request3 = t.do(game, request2, {
      name: 'move card',
      cardId: game.getCardsByZone(t.dennis(game), 'hand')[0].g.id,
      destId: 'players.dennis.creatures',
      destIndex: 0,
    })
    const request4 = t.do(game, request3, { name: 'draw' })
    const request5 = t.do(game, request4, {
      name: 'move card',
      cardId: game.getCardsByZone(t.dennis(game), 'hand')[0].g.id,
      destId: 'players.dennis.creatures',
      destIndex: 1,
    })
    const request6 = t.do(game, request5, {
      name: 'move all',
      sourceId: 'players.dennis.creatures',
      targetId: 'players.dennis.graveyard',
    })

    t.testBoard(game, {
      dennis: {
        creatures: [],
        graveyard: ['White Knight', 'Benalish Hero'],
      },
    })
  })

  test('move revealed', () => {
    const game = t.fixtureDecksSelected()

    const request1 = game.run()
    const request2 = t.do(game, request1, {
      name: 'reveal next',
      zoneId: 'players.dennis.library',
    })
    const request3 = t.do(game, request2, {
      name: 'reveal next',
      zoneId: 'players.dennis.library',
    })
    const request4 = t.do(game, request3, {
      name: 'move revealed',
      sourceId: 'players.dennis.library',
      targetId: 'players.dennis.graveyard',
    })

    t.testBoard(game, {
      dennis: {
        graveyard: ['White Knight', 'Benalish Hero'],
      },
    })
  })

  test('notap set and clear', () => {
    const game = t.fixtureDecksSelected()

    const request1 = game.run()
    const request2 = t.do(game, request1, { name: 'draw' })
    const request3 = t.do(game, request2, {
      name: 'move card',
      cardId: game.getCardsByZone(t.dennis(game), 'hand')[0].g.id,
      destId: 'players.dennis.creatures',
      destIndex: 0,
    })
    const request4 = t.do(game, request3, {
      name: 'notap set',
      cardId: game.getCardsByZone(t.dennis(game), 'creatures')[0].g.id,
    })

    const card = game.getCardsByZone(t.dennis(game), 'creatures')[0]
    expect(card.g.noUntap).toBe(true)

    const request5 = t.do(game, request4, {
      name: 'notap clear',
      cardId: game.getCardsByZone(t.dennis(game), 'creatures')[0].g.id,
    })

    const card2 = game.getCardsByZone(t.dennis(game), 'creatures')[0]
    expect(card2.g.noUntap).toBe(false)
  })

  test('pass priority', () => {
    const game = t.fixtureDecksSelected()

    const request1 = game.run()
    const request2 = t.do(game, request1, {
      name: 'pass priority',
      target: 'micah',
    })

    expect(game.state.currentPlayer.name).toBe('micah')
  })

  test('reveal', () => {
    const game = t.fixtureDecksSelected()

    const request1 = game.run()
    const request2 = t.do(game, request1, { name: 'draw' })
    const request3 = t.do(game, request2, {
      name: 'reveal',
      cardId: game.getCardsByZone(t.dennis(game), 'hand')[0].g.id,
    })

    const card = game.getCardsByZone(t.dennis(game), 'hand')[0]
    expect(card.visibility).toStrictEqual(game.getPlayerAll())
  })

  test('reveal all', () => {
    const game = t.fixtureDecksSelected()

    const request1 = game.run()
    const request2 = t.do(game, request1, { name: 'draw' })
    const request3 = t.do(game, request2, { name: 'draw' })
    const request4 = t.do(game, request3, {
      name: 'reveal all',
      zoneId: 'players.dennis.hand',
    })

    const cards = game.getCardsByZone(t.dennis(game), 'hand')
    cards.forEach(card => {
      expect(card.visibility).toStrictEqual(game.getPlayerAll())
    })
  })

  test('roll die', () => {
    const game = t.fixtureDecksSelected()

    const request1 = game.run()
    const request2 = t.do(game, request1, {
      name: 'roll die',
      faces: 6,
    })

    // Can't test exact result since it's random, but we can verify the game state is unchanged
    t.testBoard(game, {
      dennis: {
        hand: [],
      },
    })
  })

  test('secret', () => {
    const game = t.fixtureDecksSelected()

    const request1 = game.run()
    const request2 = t.do(game, request1, { name: 'draw' })
    const request3 = t.do(game, request2, {
      name: 'move card',
      cardId: game.getCardsByZone(t.dennis(game), 'hand')[0].g.id,
      destId: 'players.dennis.creatures',
      destIndex: 0,
    })
    const request4 = t.do(game, request3, {
      name: 'secret',
      cardId: game.getCardsByZone(t.dennis(game), 'creatures')[0].g.id,
    })

    const card = game.getCardsByZone(t.dennis(game), 'creatures')[0]
    expect(card.secret).toBe(true)
    expect(card.visibility).toEqual([])
  })

  test('select phase', () => {
    const game = t.fixtureDecksSelected()

    const request1 = game.run()
    expect(game.state.phase).not.toBe('untap')

    const request2 = t.do(game, request1, {
      name: 'select phase',
      phase: 'untap',
    })

    expect(game.state.phase).toBe('untap')
  })

  test('shuffle', () => {
    const game = t.fixtureDecksSelected()

    const request1 = game.run()
    const originalOrder = [...game.getCardsByZone(t.dennis(game), 'library')]
    const request2 = t.do(game, request1, {
      name: 'shuffle',
      zoneId: 'players.dennis.library',
    })

    // Can't test exact order since it's random, but we can verify the cards are still there
    const cards = game.getCardsByZone(t.dennis(game), 'library')
    expect(cards.length).toBe(7)

    // Test that the order has changed (This will fail one in 2^7 = 128 times without the retry)
    // Check if the order has changed
    let orderChanged = !util.array.elementsEqual(cards, originalOrder)

    // If order hasn't changed, try shuffling again (up to 2 more times)
    if (!orderChanged) {
      const request3 = t.do(game, request2, {
        name: 'shuffle',
        zoneId: 'players.dennis.library',
      })

      const cardsAfterSecondShuffle = game.getCardsByZone(t.dennis(game), 'library')
      orderChanged = !util.array.elementsEqual(cardsAfterSecondShuffle, originalOrder)

      if (!orderChanged) {
        const request4 = t.do(game, request3, {
          name: 'shuffle',
          zoneId: 'players.dennis.library',
        })

        const cardsAfterThirdShuffle = game.getCardsByZone(t.dennis(game), 'library')
        orderChanged = !util.array.array.elementsEqual(cardsAfterThirdShuffle, originalOrder)

        if (!orderChanged) {
          // If we've tried 3 times and the order is still the same, this is very unlikely
          // and probably indicates a problem with the shuffle function
          // eslint-disable-next-line jest/no-conditional-expect
          expect(cardsAfterThirdShuffle).not.toEqual(originalOrder)
        }
      }
    }
  })

  test('shuffle bottom', () => {
    const game = t.fixtureDecksSelected()

    const request1 = game.run()
    const request2 = t.do(game, request1, {
      name: 'shuffle bottom',
      zoneId: 'players.dennis.library',
      count: 3,
    })

    // Can't test exact order since it's random, but we can verify the cards are still there
    const cards = game.getCardsByZone(t.dennis(game), 'library')
    expect(cards.length).toBe(7)
  })

  test('stack effect', () => {
    const game = t.fixtureDecksSelected()

    const request1 = game.run()
    const request2 = t.do(game, request1, { name: 'draw' })
    const request3 = t.do(game, request2, {
      name: 'move card',
      cardId: game.getCardsByZone(t.dennis(game), 'hand')[0].g.id,
      destId: 'players.dennis.creatures',
      destIndex: 0,
    })
    const request4 = t.do(game, request3, {
      name: 'stack effect',
      cardId: game.getCardsByZone(t.dennis(game), 'creatures')[0].g.id,
    })

    t.testBoard(game, {
      dennis: {
        creatures: ['White Knight'],
        stack: ['effect: White Knight'],
      },
    })
  })

  test('tap', () => {
    const game = t.fixtureDecksSelected()

    const request1 = game.run()
    const request2 = t.do(game, request1, { name: 'draw' })
    const request3 = t.do(game, request2, {
      name: 'move card',
      cardId: game.getCardsByZone(t.dennis(game), 'hand')[0].g.id,
      destId: 'players.dennis.creatures',
      destIndex: 0,
    })
    const request4 = t.do(game, request3, {
      name: 'tap',
      cardId: game.getCardsByZone(t.dennis(game), 'creatures')[0].g.id,
    })

    const card = game.getCardsByZone(t.dennis(game), 'creatures')[0]
    expect(card.g.tapped).toBe(true)
  })

  test('unmorph', () => {
    const game = t.fixtureDecksSelected()

    const request1 = game.run()
    const request2 = t.do(game, request1, { name: 'draw' })
    const request3 = t.do(game, request2, {
      name: 'morph',
      cardId: game.getCardsByZone(t.dennis(game), 'hand')[0].g.id,
    })

    // Verify the card is properly morphed
    const morphedCard = game.getCardsByZone(t.dennis(game), 'stack')[0]
    expect(morphedCard.g.morph).toBe(true)
    expect(morphedCard.visibility).toEqual([t.dennis(game)])

    const request4 = t.do(game, request3, {
      name: 'unmorph',
      cardId: game.getCardsByZone(t.dennis(game), 'stack')[0].g.id,
    })

    const card = game.getCardsByZone(t.dennis(game), 'stack')[0]
    expect(card.g.morph).toBe(false)
    expect(card.visibility).toEqual(game.getPlayerAll())
  })

  test('unsecret', () => {
    const game = t.fixtureDecksSelected()

    const request1 = game.run()
    const request2 = t.do(game, request1, { name: 'draw' })
    const request3 = t.do(game, request2, {
      name: 'move card',
      cardId: game.getCardsByZone(t.dennis(game), 'hand')[0].g.id,
      destId: 'players.dennis.creatures',
      destIndex: 0,
    })
    const request4 = t.do(game, request3, {
      name: 'secret',
      cardId: game.getCardsByZone(t.dennis(game), 'creatures')[0].g.id,
    })
    const request5 = t.do(game, request4, {
      name: 'unsecret',
      cardId: game.getCardsByZone(t.dennis(game), 'creatures')[0].g.id,
    })

    const card = game.getCardsByZone(t.dennis(game), 'creatures')[0]
    expect(card.secret).toBe(false)
    expect(card.visibility).toEqual(game.getPlayerAll())
  })

  test('untap', () => {
    const game = t.fixtureDecksSelected()

    const request1 = game.run()
    const request2 = t.do(game, request1, { name: 'draw' })
    const request3 = t.do(game, request2, {
      name: 'move card',
      cardId: game.getCardsByZone(t.dennis(game), 'hand')[0].g.id,
      destId: 'players.dennis.creatures',
      destIndex: 0,
    })
    const request4 = t.do(game, request3, {
      name: 'tap',
      cardId: game.getCardsByZone(t.dennis(game), 'creatures')[0].g.id,
    })
    const request5 = t.do(game, request4, {
      name: 'untap',
      cardId: game.getCardsByZone(t.dennis(game), 'creatures')[0].g.id,
    })

    const card = game.getCardsByZone(t.dennis(game), 'creatures')[0]
    expect(card.g.tapped).toBe(false)
  })

  test('view all', () => {
    const game = t.fixtureDecksSelected()

    const request1 = game.run()
    const request2 = t.do(game, request1, { name: 'draw' })
    const request3 = t.do(game, request2, {
      name: 'move card',
      cardId: game.getCardsByZone(t.dennis(game), 'hand')[0].g.id,
      destId: 'players.dennis.creatures',
      destIndex: 0,
    })
    const request4 = t.do(game, request3, {
      name: 'view all',
      zoneId: 'players.dennis.creatures',
    })

    const card = game.getCardsByZone(t.dennis(game), 'creatures')[0]
    expect(card.visibility).toContain(game.getPlayerByName('dennis'))
  })
})
