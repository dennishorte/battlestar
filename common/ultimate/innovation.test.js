Error.stackTraceLimit = 100

const {
  GameOverEvent,
  InputRequestEvent,
} = require('../lib/game.js')

const t = require('./testutil.js')

describe('fixture', () => {
  test('player hands are set as expected', () => {
    const game = t.fixture()
    game.run()

    const dennis = game
      .getZoneByPlayer(game.players.byName('dennis'), 'hand')
      .cards()
      .map(c => c.name)
      .sort()
    expect(dennis).toStrictEqual(['Archery', 'Domestication'])

    const micah = game
      .getZoneByPlayer(game.players.byName('micah'), 'hand')
      .cards()
      .map(c => c.name)
      .sort()
    expect(micah).toStrictEqual(['Code of Laws', 'Mysticism'])
  })

  test('setColor', () => {
    const game = t.fixtureFirstPlayer()
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'red', ['Gunpowder', 'Industrialization'])
    })
    game.run()
    const dennis = game.players.byName('dennis')

    const redCardNames = game.getZoneByPlayer(dennis, 'red').cards().map(c => c.name).sort()
    expect(redCardNames).toStrictEqual(['Gunpowder', 'Industrialization'])
  })
})

describe('Innovation', () => {
  test('game initializes', () => {
    const game = t.fixture()
    game.run()
  })

  describe('first picks', () => {
    test('all players can pick at once', () => {
      const game = t.fixture()
      const result = game.run()

      expect(result).toBeInstanceOf(InputRequestEvent)
      expect(result.selectors.length).toBe(2)
      expect(result.selectors).toEqual(expect.arrayContaining([
        expect.objectContaining({
          actor: 'dennis',
          title: 'Choose First Card',
        }),
        expect.objectContaining({
          actor: 'micah',
          title: 'Choose First Card',
        }),
      ]))
    })

    test('after picking, selected cards are played', () => {
      const game = t.fixture()
      const request1 = game.run()
      const request2 = game.respondToInputRequest({
        actor: 'micah',
        title: 'Choose First Card',
        selection: ['Code of Laws'],
      })
      const request3 = game.respondToInputRequest({
        actor: 'dennis',
        title: 'Choose First Card',
        selection: ['Archery'],
      })

      const dennisRed = game
        .getZoneByPlayer(game.players.byName('dennis'), 'red')
        .cards()
        .map(c => c.name)
      expect(dennisRed).toStrictEqual(['Archery'])

      const micahPurple = game
        .getZoneByPlayer(game.players.byName('micah'), 'purple')
        .cards()
        .map(c => c.name)
      expect(micahPurple).toStrictEqual(['Code of Laws'])
    })

    test('player closest to start of alphabet goes first (test a)', () => {
      const game = t.fixture()
      const request1 = game.run()
      const request2 = game.respondToInputRequest({
        actor: 'micah',
        title: 'Choose First Card',
        selection: ['Code of Laws'],
      })
      const request3 = game.respondToInputRequest({
        actor: 'dennis',
        title: 'Choose First Card',
        selection: ['Archery'],
      })

      expect(game.players.current().name).toBe('dennis')
    })

    test('player closest to start of alphabet goes first (test b)', () => {
      const game = t.fixture()
      const request1 = game.run()
      const request2 = game.respondToInputRequest({
        actor: 'micah',
        title: 'Choose First Card',
        selection: ['Code of Laws'],
      })
      const request3 = game.respondToInputRequest({
        actor: 'dennis',
        title: 'Choose First Card',
        selection: ['Domestication'],
      })

      expect(game.players.current().name).toBe('micah')
    })
  })

  describe('triggers', () => {
    test('unsplay colors with one or fewer cards', () => {
      const game = t.fixtureTopCard('Globalization')
      game.testSetBreakpoint('before-first-player', (game) => {
        t.setColor(game, 'dennis', 'yellow', ['Globalization', 'Stem Cells', 'Fermenting'])
        t.setSplay(game, 'dennis', 'yellow', 'up')
        t.setColor(game, 'micah', 'yellow', ['Agriculture', 'Statistics'])
        t.setSplay(game, 'micah', 'yellow', 'left')
      })
      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Dogma.Globalization')

      expect(t.zone(game, 'yellow', 'micah').splay).toBe('none')
    })
  })

  describe.skip('achievement victory', () => {
    test('check after each step of each action', () => {

    })

    test('list of player achievements includes special ones', () => {

    })
  })

  describe('high draw victory', () => {
    test('most points wins', () => {
      const game = t.fixtureFirstPlayer()
      t.setBoard(game,  {
        dennis: {
          blue: ['Mathematics'],
          hand: ['Fusion'],
          score: ['Navigation'],
        },
        micah: {
          score: ['Sailing'],
          achievements: ['Agriculture'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Dogma.Mathematics')
      const request3 = t.choose(game, request2, 'Fusion')

      t.testGameOver(request3, 'dennis', 'high draw')
    })

    test('number of achievements is tie breaker', () => {
      const game = t.fixtureFirstPlayer()
      t.setBoard(game,  {
        dennis: {
          blue: ['Mathematics'],
          hand: ['Fusion'],
          score: ['Metalworking'],
        },
        micah: {
          score: ['Sailing'],
          achievements: ['Agriculture'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Dogma.Mathematics')
      const request3 = t.choose(game, request2, 'Fusion')

      t.testGameOver(request3, 'micah', 'high draw - tie breaker (achievements)')
    })

    test.skip('draws are handled smoothly', () => {

    })
  })

  describe.skip('figures fade at end of each action', () => {
    test('choose and fade, repeatedly', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      game.testSetBreakpoint('before-first-player', (game) => {
        t.setColor(game, 'dennis', 'red', ['Alexander the Great'])
        t.setColor(game, 'dennis', 'green', ['Alfred Nobel', 'Adam Smith'])
        t.setColor(game, 'dennis', 'yellow', ['Shennong', 'Alex Trebek'])
      })
      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Draw.draw a card')
      const request3 = t.choose(game, request2, 'Shennong')
      const request4 = t.choose(game, request3, 'Alexander the Great')
      const request5 = t.choose(game, request4, 'Alex Trebek')

      t.testIsSecondPlayer(game)
    })
  })

  describe('cities biscuits', () => {
    test('plus icon', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'city'] })
      t.setBoard(game, {
        dennis: {
          red: ['Archery'],
          hand: ['Athens'],
        },
        decks: {
          base: {
            2: ['Calendar'],
          }
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Meld.Athens')

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          red: ['Athens', 'Archery'],
          hand: ['Calendar'],
        }
      })
    })

    test('flag but not most', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'city'] })
      t.setBoard(game, {
        dennis: {
          purple: ['Tokyo'],
        },
        micah: {
          purple: {
            cards: ['Enterprise', 'Code of Laws'],
            splay: 'left',
          },
        },
      })

      const request1 = game.run()

      const achievements = game.getAchievementsByPlayer(t.dennis(game))
      expect(achievements.total).toBe(0)
    })

    test('flag and most', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'city'] })
      t.setBoard(game, {
        dennis: {
          purple: {
            cards: ['Tokyo', 'Code of Laws'],
            splay: 'left'
          },
        },
        micah: {
          purple: ['Enterprise'],
        },
      })

      const request1 = game.run()

      const achievements = game.getAchievementsByPlayer(t.dennis(game))
      expect(achievements.total).toBe(1)
    })

    test('flag and equal', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'city'] })
      t.setBoard(game, {
        dennis: {
          purple: ['Tokyo'],
        },
        micah: {
          purple: ['Enterprise'],
        },
      })

      const request1 = game.run()

      const achievements = game.getAchievementsByPlayer(t.dennis(game))
      expect(achievements.total).toBe(1)
    })

    test('flag and most, but not splayed, so not visible', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'city'] })
      t.setBoard(game, {
        dennis: {
          purple: ['Tokyo', 'Code of Laws', 'The Internet'],
        },
        micah: {
          purple: {
            cards: ['Enterprise', 'Monotheism'],
            splay: 'right',
          },
        },
      })

      const request1 = game.run()

      const achievements = game.getAchievementsByPlayer(t.dennis(game))
      expect(achievements.total).toBe(0)
    })

    test('fountain', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'city'] })
      t.setBoard(game, {
        dennis: {
          yellow: ['Nairobi'],
        },
      })

      const request1 = game.run()

      const achievements = game.getAchievementsByPlayer(t.dennis(game))
      expect(achievements.total).toBe(2)
    })

    test('fountain: not top, but visible', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'city'] })
      t.setBoard(game, {
        dennis: {
          yellow: {
            cards: ['Agriculture', 'Nairobi'],
            splay: 'up'
          }
        },
      })

      const request1 = game.run()

      const achievements = game.getAchievementsByPlayer(t.dennis(game))
      expect(achievements.total).toBe(1)
    })

    test('fountain: hidden', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'city'] })
      t.setBoard(game, {
        dennis: {
          red: ['Archery', 'Brussels'],
        },
      })

      const request1 = game.run()

      const achievements = game.getAchievementsByPlayer(t.dennis(game))
      expect(achievements.total).toBe(0)

    })

    test('splay left', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'city'] })
      t.setBoard(game, {
        dennis: {
          red: ['Archery'],
          hand: ['Delhi'],
        },
        decks: {
          city: {
            3: ['Venice'],
          }
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Meld.Delhi')

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          red: {
            cards: ['Delhi', 'Archery'],
            splay: 'left'
          },
          hand: ['Venice'],
        }
      })
    })

    test('splay right', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'city'] })
      t.setBoard(game, {
        dennis: {
          red: ['Archery'],
          hand: ['Tehran'],
        },
        decks: {
          city: {
            6: ['Vienna'],
          }
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Meld.Tehran')

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          red: {
            cards: ['Tehran', 'Archery'],
            splay: 'right'
          },
          hand: ['Vienna'],
        }
      })
    })

    test('splay up', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'city'] })
      t.setBoard(game, {
        dennis: {
          red: ['Archery'],
          hand: ['Seoul'],
        },
        decks: {
          city: {
            10: ['Bangkok'],
          }
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Meld.Seoul')

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          red: {
            cards: ['Seoul', 'Archery'],
            splay: 'up'
          },
          hand: ['Bangkok'],
        }
      })
    })

    test('discover biscuit: simple', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'city'] })
      t.setBoard(game, {
        dennis: {
          purple: ['Code of Laws'],
          hand: ['Mecca'],
        },
        decks: {
          base: {
            3: ['Medicine', 'Education', 'Compass']
          }
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Meld.Mecca')

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          purple: ['Mecca', 'Code of Laws'],
          hand: ['Medicine', 'Compass'],
        }
      })
    })

    test('discover biscuit: not enough cards of age', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'city'] })
      t.setBoard(game, {
        dennis: {
          purple: ['Code of Laws'],
          hand: ['Mecca'],
        },
        decks: {
          base: {
            3: ['Medicine', 'Education'],
            4: ['Reformation'],
          }
        }
      })

      // Leave only two cards in the 3 deck.
      game.testSetBreakpoint('before-first-player', (game) => {
        const toExile = game.getZoneByDeck('base', 3).cards().slice(2)
        for (const card of toExile) {
          game.mRemove(card)
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Meld.Mecca')

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          purple: ['Mecca', 'Code of Laws'],
          hand: ['Medicine'],
        }
      })
    })

    test.skip('discover biscuit: effects do not trigger', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'city', 'figs'] })
      t.setBoard(game, {
        dennis: {
          purple: ['Code of Laws'],
          yellow: ['Rhazes'],
          hand: ['Mecca', 'Machinery'],
        },
        decks: {
          base: {
            3: ['Medicine', 'Education', 'Compass']
          }
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Meld.Mecca')

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          purple: ['Mecca', 'Code of Laws'],
          yellow: ['Rhazes'],
          hand: ['Medicine', 'Compass', 'Machinery'],
        }
      })
    })

    test('junk biscuit', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'city'] })
      t.setBoard(game, {
        dennis: {
          purple: ['Reformation'],
          hand: ['Seville'],
        },
        achievements: ['Optics', 'Perspective', 'Coal'],
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Meld.Seville')

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          purple: ['Seville', 'Reformation'],
        },
        junk: ['Perspective'],
      })
    })

    test('uplift biscuit', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'city'] })
      t.setBoard(game, {
        dennis: {
          purple: ['Monotheism'],
          hand: ['Luoyang'],
        },
        decks: {
          base: {
            4: ['Gunpowder'],
          }
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Meld.Luoyang')

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          purple: ['Luoyang', 'Monotheism'],
          hand: ['Gunpowder']
        },
        junk: [
          "Alchemy",
          "Compass",
          "Feudalism",
          "Engineering",
          "Machinery",
          "Medicine",
          "Optics",
          "Paper",
          "Translation",
        ]
      })
    })

    test('unsplay biscuit', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'city'] })
      t.setBoard(game, {
        dennis: {
          red: {
            cards: ['Coal', 'Metalworking'],
            splay: 'left',
          },
          hand: ['Warsaw'],
        },
        micah: {
          red: {
            cards: ['Flight', 'Optics'],
            splay: 'up',
          },
          green: {
            cards: ['Measurement', 'Paper'],
            splay: 'right',
          },
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Meld.Warsaw')

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          red: {
            cards: ['Warsaw', 'Coal', 'Metalworking'],
            splay: 'left',
          },
        },
        micah: {
          red: ['Flight', 'Optics'],
          green: {
            cards: ['Measurement', 'Paper'],
            splay: 'right',
          },
        },
      })
    })

  })

  describe.skip('karma', () => {
    test.skip('multiple if/then karmas, only choose one', () => {

    })

    test.skip('karmas do not trigger karmas', () => {

    })
  })

  describe('actions', () => {
    describe('first player gets only one action', () => {
      test.skip('two players', () => {

      })

      test.skip('three players', () => {

      })

      test.skip('four players', () => {

      })
    })

    describe('achieve action', () => {
      test('do not need to achieve in order', () => {
        const game = t.fixtureFirstPlayer()
        game.testSetBreakpoint('before-first-player', (game) => {
          t.setScore(game, 'dennis', ['Canning', 'Experimentation', 'Coal'])
          t.setColor(game, 'dennis', 'red', ['Industrialization'])
          t.setAvailableAchievements(game, ['Writing', 'Mathematics', 'Machinery', 'Reformation'])
        })
        const request1 = game.run()

        expect(t.getChoices(request1, 'Achieve')).toStrictEqual(['*base-1*', '*base-2*', '*base-3*'])
      })

      test('duplicate achievements are deduped', () => {
        const game = t.fixtureFirstPlayer()
        game.testSetBreakpoint('before-first-player', (game) => {
          t.setScore(game, 'dennis', ['Canning', 'Experimentation', 'Coal'])
          t.setColor(game, 'dennis', 'red', ['Industrialization'])
          t.setAvailableAchievements(game, ['Writing', 'The Wheel', 'Construction', 'Mathematics', 'Machinery'])
        })
        const request1 = game.run()

        expect(t.getChoices(request1, 'Achieve')).toStrictEqual(['*base-1*', '*base-2*', '*base-3*'])
      })

      test.skip('cost for second of same age is double (part 1)', () => {
        const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
        game.testSetBreakpoint('before-first-player', (game) => {
          t.setScore(game, 'dennis', ['Canning', 'Experimentation', 'Coal', 'Enterprise']) // 19
          t.setColor(game, 'dennis', 'red', ['Industrialization'])
          t.setAchievements(game, 'dennis', ['Monotheism'])
          t.setAvailableAchievements(game, ['Construction', 'Machinery'])
        })
        const request1 = game.run()

        expect(t.getChoices(request1, 'Achieve')).toStrictEqual(['*base-3*'])
      })

      test.skip('cost for second of same age is double (part 2)', () => {
        const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
        game.testSetBreakpoint('before-first-player', (game) => {
          t.setScore(game, 'dennis', ['Canning', 'Experimentation', 'Coal', 'Statistics']) // 20
          t.setColor(game, 'dennis', 'red', ['Industrialization'])
          t.setAchievements(game, 'dennis', ['Monotheism'])
          t.setAvailableAchievements(game, ['Construction', 'Machinery'])
        })
        const request1 = game.run()

        expect(t.getChoices(request1, 'Achieve')).toStrictEqual(['*base-2*', '*base-3*'])
      })

      test.skip('cost for third of same age is triple (part 1)', () => {
        const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
        game.testSetBreakpoint('before-first-player', (game) => {
          t.setScore(game, 'dennis', ['Canning', 'Experimentation', 'Enterprise']) // 14
          t.setColor(game, 'dennis', 'red', ['Industrialization'])
          t.setAchievements(game, 'dennis', ['The Wheel', 'Code of Laws'])
          t.setAvailableAchievements(game, ['Mysticism'])
        })
        const request1 = game.run()

        expect(t.getChoices(request1, 'Achieve')).toStrictEqual([])
      })

      test.skip('cost for third of same age is triple (part 2)', () => {
        const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
        game.testSetBreakpoint('before-first-player', (game) => {
          t.setScore(game, 'dennis', ['Canning', 'Experimentation', 'Statistics']) // 15
          t.setColor(game, 'dennis', 'red', ['Industrialization'])
          t.setAchievements(game, 'dennis', ['The Wheel', 'Code of Laws'])
          t.setAvailableAchievements(game, ['Mysticism'])
        })
        const request1 = game.run()

        expect(t.getChoices(request1, 'Achieve')).toStrictEqual(['*base-1*'])
      })

      test('age restriction', () => {
        const game = t.fixtureFirstPlayer()
        game.testSetBreakpoint('before-first-player', (game) => {
          t.setScore(game, 'dennis', ['Canning', 'Experimentation', 'Coal'])
          t.setColor(game, 'dennis', 'red', ['Construction'])
          t.setAvailableAchievements(game, ['Writing', 'Mathematics', 'Machinery', 'Reformation'])
        })
        const request1 = game.run()

        expect(t.getChoices(request1, 'Achieve')).toStrictEqual(['*base-1*', '*base-2*'])
      })

      test('achieved cards are moved to achievements', () => {
        const game = t.fixtureFirstPlayer()
        game.testSetBreakpoint('before-first-player', (game) => {
          t.setScore(game, 'dennis', ['Canning', 'Experimentation', 'Coal'])
          t.setColor(game, 'dennis', 'red', ['Construction'])
          t.setAvailableAchievements(game, ['The Wheel', 'Monotheism', 'Machinery'])
        })
        const request1 = game.run()
        const request2 = t.choose(game, request1, 'Achieve.*base-2*')

        expect(t.cards(game, 'achievements')).toStrictEqual(['Monotheism'])
      })

      test.skip('in figures, opponents get a figure', () => {
        const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
        game.testSetBreakpoint('before-first-player', (game) => {
          t.setScore(game, 'dennis', ['Canning', 'Experimentation', 'Coal'])
          t.setColor(game, 'dennis', 'red', ['Construction'])
          t.setAvailableAchievements(game, ['The Wheel', 'Monotheism', 'Machinery'])

          t.setDeckTop(game, 'figs', 1, ['Imhotep'])
          t.setHand(game, 'micah', [])
        })
        const request1 = game.run()
        const request2 = t.choose(game, request1, 'Achieve.*base-2*')

        expect(t.cards(game, 'hand', 'micah')).toStrictEqual(['Imhotep'])
      })

      test.skip('in figures, opponents do not get a figure for non-standard', () => {
        const game = t.fixtureFirstPlayer()
        game.testSetBreakpoint('before-first-player', (game) => {
          t.setScore(game, 'dennis', ['Canning', 'Experimentation', 'Coal'])
          t.setColor(game, 'dennis', 'red', ['Construction'])
          t.setAvailableAchievements(game, ['The Wheel', 'Monotheism', 'Machinery'])

          t.setDeckTop(game, 'figs', 1, ['Imhotep'])
          t.setHand(game, 'micah', [])
        })
        const request1 = game.run()
        const request2 = t.choose(game, request1, 'Achieve.*base-2*')

        expect(t.cards(game, 'hand', 'micah')).toStrictEqual([])
      })

      test.skip('can achieve cards made available by karma', () => {
        const game = t.fixtureTopCard('Amina Sukhera', { expansions: ['base', 'figs'] })
        game.testSetBreakpoint('before-first-player', (game) => {
          t.setAvailableAchievements(game, ['Code of Laws'])
          t.setColor(game, 'dennis', 'green', ['The Wheel'])
          t.setColor(game, 'dennis', 'yellow', ['Fermenting'])
          t.setScore(game, 'dennis', ['Statistics'])
        })
        const request1 = game.run()
        const request2 = t.choose(game, request1, 'Achieve.The Wheel')

        t.testZone(game, 'achievements', ['The Wheel'])
      })

      test.skip('score includes bonuses', () => {
        const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
        t.setBoard(game, {
          dennis: {
            red: ['Plumbing'],
          }
        })

        const request1 = game.run()

        expect(game.getScore(t.dennis(game))).toBe(2)
      })
    })

    describe('achieve action with safe', () => {
      test('not enough points', () => {
        const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
        t.setBoard(game, {
          dennis: {
            safe: ['Tools', 'Optics'],
          },
        })

        const request = game.run()

        const achieveOptions = request.selectors[0].choices.find(x => x.title === 'Achieve').choices
        expect(achieveOptions.length).toBe(0)
      })

      test('enough points', () => {
        const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
        t.setBoard(game, {
          dennis: {
            green: ['The Wheel'],
            safe: ['Tools', 'Optics'],
            score: ['Coal'],
          },
          achievements: ['Agriculture', 'Construction'],
        })

        let request = game.run()

        const achieveOptions = request.selectors[0].choices.find(x => x.title === 'Achieve').choices
        expect(achieveOptions).toStrictEqual(['*base-1*', 'safe: *base-1*'])

        request = t.choose(game, request, 'Achieve.safe: *base-1*')

        t.testBoard(game, {
          dennis: {
            green: ['The Wheel'],
            safe: ['Optics'],
            score: ['Coal'],
            achievements: ['Tools'],
          }
        })
      })
    })

    describe.skip('decree action', () => {
      test('from three figure cards', () => {
        const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
        game.testSetBreakpoint('before-first-player', (game) => {
          t.setHand(game, 'dennis', ['Homer', 'Ptolemy', 'Al-Kindi'])
        })
        const request1 = game.run()

        expect(t.getChoices(request1, 'Decree')).toStrictEqual([
          'Rivalry',
          'Trade',
        ])
      })

      test('from three figure cards (same age does not work)', () => {
        const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
        game.testSetBreakpoint('before-first-player', (game) => {
          t.setHand(game, 'dennis', ['Homer', 'Sinuhe', 'Ptolemy'])
        })
        const request1 = game.run()

        expect(t.getChoices(request1, 'Decree')).toStrictEqual([])
      })

      test('all colors work', () => {
        const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
        game.testSetBreakpoint('before-first-player', (game) => {
          t.setHand(game, 'dennis', ['Homer', 'Ptolemy', 'Yi Sun-Sin', 'Daedalus', 'Shennong'])
        })
        const request1 = game.run()

        expect(t.getChoices(request1, 'Decree')).toStrictEqual([
          'Advancement',
          'Expansion',
          'Rivalry',
          'Trade',
          'War',
        ])
      })

      test.skip('from two figures and a karma (same age)', () => {
        const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
        game.testSetBreakpoint('before-first-player', (game) => {
          t.setColor(game, 'dennis', 'purple', ['Sinuhe'])
          t.setHand(game, 'dennis', ['Homer', 'Fu Xi'])
        })
        const request1 = game.run()

        expect(t.getChoices(request1, 'Decree')).toStrictEqual(['Rivalry'])
      })

      test.skip('karma for two figures, but only one in hand', () => {
        const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
        game.testSetBreakpoint('before-first-player', (game) => {
          t.setColor(game, 'dennis', 'purple', ['Sinuhe'])
          t.setHand(game, 'dennis', ['Homer', 'Mathematics'])
        })
        const request1 = game.run()

        expect(t.getChoices(request1, 'Decree')).toStrictEqual([])
      })

      test('first claim', () => {
        // See the test files for the individual decrees.
      })

      test('already have', () => {

      })

      test('opponent has', () => {
        const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
        t.setBoard(game, {
          dennis: {
            green: ['Navigation', 'The Wheel'],
            hand: ['Sinuhe', 'Ximen Bao', 'Murasaki Shikibu'],
          },
          micah: {
            achievements: ['Expansion'],
          }
        })

        const request1 = game.run()
        const request2 = t.choose(game, request1, 'Decree.Expansion')

        t.testIsSecondPlayer(game)
        t.testBoard(game, {
          dennis: {
            green: ['Navigation', 'The Wheel'],
          },
        })
      })
    })

    describe('dogma action', () => {
      test.skip('echo', () => {
        const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
        game.testSetBreakpoint('before-first-player', (game) => {
          t.setColor(game, 'dennis', 'red', ['Metalworking', 'Bangle'])
          t.setSplay(game, 'dennis', 'red', 'up')
          t.setHand(game, 'dennis', ['Archery'])
          t.setDeckTop(game, 'echo', 1, ['Ruler'])
        })
        const request1 = game.run()
        const request2 = t.choose(game, request1, 'Dogma.Metalworking')

        expect(t.cards(game, 'red')).toStrictEqual(['Metalworking', 'Bangle', 'Archery'])
      })

      test('share', () => {
        const game = t.fixtureTopCard('Writing')
        game.testSetBreakpoint('before-first-player', (game) => {
          t.setColor(game, 'dennis', 'red', [])
          t.setColor(game, 'micah', 'blue', ['Tools'])
        })
        const request = game.run()
        t.choose(game, request, 'Dogma.Writing')

        const dennis = game.players.byName('dennis')
        const dennisHandAges = game.getZoneByPlayer(dennis, 'hand').cards().map(c => c.age).sort()
        expect(dennisHandAges).toStrictEqual([1, 2])

        const micah = game.players.byName('micah')
        const micahHandAges = game.getZoneByPlayer(micah, 'hand').cards().map(c => c.age).sort()
        expect(micahHandAges).toStrictEqual([2])
      })

      test('no share', () => {
        const game = t.fixtureTopCard('Writing')
        game.testSetBreakpoint('before-first-player', (game) => {
          t.clearBoard(game, 'dennis')
          t.clearBoard(game, 'micah')
          t.setColor(game, 'dennis', 'blue', ['Writing'])
        })
        const request = game.run()
        t.choose(game, request, 'Dogma.Writing')

        const dennis = game.players.byName('dennis')
        const dennisHandAges = game.getZoneByPlayer(dennis, 'hand').cards().map(c => c.age).sort()
        expect(dennisHandAges).toStrictEqual([2])

        const micah = game.players.byName('micah')
        const micahHandAges = game.getZoneByPlayer(micah, 'hand').cards().map(c => c.age).sort()
        expect(micahHandAges).toStrictEqual([])
      })

      test('demand', () => {
        // See tests for Construction to see a successful demand.
      })

      test('no share bonus on demand', () => {
        const game = t.fixtureTopCard('Archery')
        game.testSetBreakpoint('before-first-player', (game) => {
          t.clearHand(game, 'dennis')
          t.setHand(game, 'micah', ['Gunpowder'])
          t.setDeckTop(game, 'base', 1, ['Tools'])
        })
        const result1 = game.run()
        const result2 = t.choose(game, result1, 'Dogma.Archery')

        expect(t.cards(game, 'hand')).toStrictEqual(['Gunpowder'])
        expect(t.cards(game, 'hand', 'micah')).toStrictEqual(['Tools'])
      })

      test.skip('compel', () => {

      })

      test.skip('biscuits change during dogma does not affect effects', () => {

      })
    })

    describe('draw action', () => {
      test('player draws a card based on top card age (test 1)', () => {
        const game = t.fixtureFirstPlayer()
        const request = game.run()
        const dennis = game.players.byName('dennis')

        expect(game.getZoneByPlayer(dennis, 'hand').cards().length).toBe(0)

        t.choose(game, request, 'Draw.draw a card')

        const dennisCards = game.getZoneByPlayer(dennis, 'hand').cards()
        expect(dennisCards.length).toBe(1)
        expect(dennisCards.map(c => c.age).sort()).toStrictEqual([1])
      })

      test('player draws a card based on top card age (test 2)', () => {
        const game = t.fixtureFirstPlayer()
        game.testSetBreakpoint('before-first-player', (game) => {
          t.setColor(game, 'dennis', 'purple', ['Specialization'])
        })

        const request = game.run()
        const dennis = game.players.byName('dennis')

        t.choose(game, request, 'Draw.draw a card')

        const dennisCards = game.getZoneByPlayer(dennis, 'hand').cards()
        expect(dennisCards.length).toBe(1)
        expect(dennisCards.map(c => c.age).sort()).toStrictEqual([9])
      })

      test('draw an 11 ends the game', () => {
        const game = t.fixtureFirstPlayer()
        t.setBoard(game,  {
          dennis: {
            blue: ['Mathematics'],
            hand: ['Software'],
            score: ['Navigation'],
          },
          micah: {
            score: ['Sailing'],
            achievements: ['Agriculture'],
          },
        })

        game.run()
        const trigger = () => {
          game.mDraw(game.players.byName('dennis'), 'base', 12)
        }
        expect(trigger).toThrow(GameOverEvent)
      })
    })
  })

  describe('endorse action', () => {
    test('need a card of equal or lower age to tuck', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'city'] })
      game.testSetBreakpoint('before-first-player', (game) => {
        t.setColor(game, 'dennis', 'green', ['The Wheel'])
        t.setColor(game, 'dennis', 'red', ['Tikal'])
        t.setHand(game, 'dennis', ['Cordoba'])
      })
      const result1 = game.run()
      expect(t.getChoices(result1, 'Endorse')).toStrictEqual([])
    })

    test('can choose which card to tuck', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'city'] })
      game.testSetBreakpoint('before-first-player', (game) => {
        t.setColor(game, 'dennis', 'green', ['The Wheel'])
        t.setColor(game, 'dennis', 'red', ['Tikal'])
        t.setHand(game, 'dennis', ['Mathematics', 'Tools', 'Cordoba'])
      })
      const result1 = game.run()
      const result2 = t.choose(game, result1, 'Endorse.green')

      expect(result2.selectors[0].choices).toStrictEqual(['Mathematics', 'Tools'])
    })

    test('leader goes twice, shares once, demands twice', () => {
      const game = t.fixtureTopCard('Mapmaking', { numPlayers: 3 })
      game.testSetBreakpoint('before-first-player', (game) => {
        t.setColor(game, 'dennis', 'red', ['Barcelona'])
        t.setColor(game, 'scott', 'green', ['Venice'])
        t.setColor(game, 'scott', 'purple', ['Ephesus'])

        t.clearBoard(game, 'micah')

        t.setScore(game, 'micah', ['The Wheel', 'Clothing'])
        t.setScore(game, 'scott', [])

        t.setDeckTop(game, 'base', 1, ['Mysticism', 'Tools', 'Code of Laws'])

        t.setHand(game, 'dennis', ['Masonry'])
      })
      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Endorse.green')
      const request3 = t.choose(game, request2, 'Clothing') // Micah's choice

      expect(t.cards(game, 'score').sort()).toStrictEqual([
        'Clothing',
        'Code of Laws',
        'The Wheel',
        'Tools',
      ])
      expect(t.cards(game, 'score', 'scott').sort()).toStrictEqual(['Mysticism'])
    })

    test('city biscuits must match featured biscuit; cities match themselves', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'city'] })
      game.testSetBreakpoint('before-first-player', (game) => {
        t.setColor(game, 'dennis', 'green', ['The Wheel'])
        t.setColor(game, 'dennis', 'blue', ['Cordoba'])
        t.setHand(game, 'dennis', ['Mathematics', 'Tools'])
      })
      const result1 = game.run()
      expect(t.getChoices(result1, 'Endorse')).toStrictEqual(['blue'])
    })

    test.skip('triggers dogma karmas', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs', 'city'] })
      t.setBoard(game, {
        dennis: {
          yellow: ['Vaccination'],
          red: ['Athens'],
          blue: ['Johannes Kepler'],
          hand: ['Masonry', 'Sailing'],
        },
        micah: {
          score: ['The Wheel'],
        },
        decks: {
          base: {
            7: ['Lighting'],
            8: ['Flight', 'Rocketry'],
          }
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Endorse.yellow')
      const request3 = t.choose(game, request2, 'Sailing')

      t.testBoard(game, {
        dennis: {
          yellow: ['Vaccination'],
          blue: ['Rocketry', 'Johannes Kepler'],
          red: ['Flight', 'Athens'],
          hand: ['Masonry'],
        },
        micah: {
          purple: ['Lighting'],
        },
        junk: ['Sailing'],
      })

    })
  })

  describe('meld action', () => {
    test('card goes on top', () => {

    })

    test('promote from forecast', () => {
      const game = t.fixtureFirstPlayer()
      t.setBoard(game, {
        dennis: {
          hand: ['Reformation'],
          forecast: ['Sailing'],
        },
        decks: {
          base: {
            1: ['Tools'],
          }
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Meld.Reformation')

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          purple: ['Reformation'],
          green: ['Sailing'],
          blue: ['Tools'],
        }
      })
    })

    describe.skip('echoes', () => {
      test('draw rule: draw a base card if hand is empty', () => {
        const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
        t.setBoard(game, {
          dennis: {
          },
          decks: {
            base: {
              1: ['Tools'],
            },
          }
        })

        const request1 = game.run()
        const request2 = t.choose(game, request1, 'Draw.draw a card')

        t.testIsSecondPlayer(game)
        t.testBoard(game, {
          dennis: {
            hand: ['Tools'],
          }
        })
      })

      test('draw rule: draw an echoes card if hand is non-empty with no echoes', () => {
        const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
        t.setBoard(game, {
          dennis: {
            hand: ['Tools'],
          },
          decks: {
            echo: {
              1: ['Plumbing'],
            },
          }
        })

        const request1 = game.run()
        const request2 = t.choose(game, request1, 'Draw.draw a card')

        t.testIsSecondPlayer(game)
        t.testBoard(game, {
          dennis: {
            hand: ['Tools', 'Plumbing'],
          }
        })
      })

      test('draw rule: draw a base card if hand already has an echoes card', () => {
        const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
        t.setBoard(game, {
          dennis: {
            hand: ['Tools', 'Plumbing'],
          },
          decks: {
            base: {
              1: ['Sailing'],
            },
          }
        })

        const request1 = game.run()
        const request2 = t.choose(game, request1, 'Draw.draw a card')

        t.testIsSecondPlayer(game)
        t.testBoard(game, {
          dennis: {
            hand: ['Tools', 'Plumbing', 'Sailing'],
          }
        })
      })
    })

    describe('cities', () => {
      test('draw a city for first card of color', () => {
        const game = t.fixtureFirstPlayer({ expansions: ['base', 'city'] })
        t.setBoard(game, {
          dennis: {
            blue: ['Experimentation'],
            hand: ['Athens'],
          },
          decks: {
            base: {
              2: ['Calendar'],
            },
            city: {
              4: ['Florence'],
            }
          }
        })

        const request1 = game.run()
        const request2 = t.choose(game, request1, 'Meld.Athens')

        t.testIsSecondPlayer(game)
        t.testBoard(game, {
          dennis: {
            blue: ['Experimentation'],
            red: ['Athens'],
            hand: ['Calendar', 'Florence'],
          }
        })
      })

      test('draw a card when splaying', () => {
        const game = t.fixtureFirstPlayer({ expansions: ['base', 'city'] })
        t.setBoard(game, {
          dennis: {
            purple: ['Enterprise'],
            hand: ['Vienna'],
          },
          decks: {
            city: {
              6: ['Tehran'],
            }
          }
        })

        const request1 = game.run()
        const request2 = t.choose(game, request1, 'Meld.Vienna')

        t.testIsSecondPlayer(game)
        t.testBoard(game, {
          dennis: {
            purple: {
              cards: ['Vienna', 'Enterprise'],
              splay: 'right'
            },
            hand: ['Tehran'],
          }
        })

      })

      test('do not draw if you already have a city', () => {
        const game = t.fixtureFirstPlayer({ expansions: ['base', 'city'] })
        t.setBoard(game, {
          dennis: {
            blue: ['Experimentation'],
            hand: ['Athens', 'Thebes'],
          },
          decks: {
            base: {
              2: ['Calendar'],
            },
          }
        })

        const request1 = game.run()
        const request2 = t.choose(game, request1, 'Meld.Athens')

        t.testIsSecondPlayer(game)
        t.testBoard(game, {
          dennis: {
            blue: ['Experimentation'],
            red: ['Athens'],
            hand: ['Calendar', 'Thebes'],
          }
        })
      })

      test('plus icon', () => {
        // Tested in 'cities biscuits'
      })

      test('splay left icon', () => {
        // Tested in 'cities biscuits'
      })

      test('splay right icon', () => {
        // Tested in 'cities biscuits'
      })

      test('splay up icon', () => {
        // Tested in 'cities biscuits'
      })

      test('discover biscuit', () => {
        // Tested in 'cities biscuits'
      })
    })

    describe.skip('artifacts', () => {
      test('hex position matching', () => {
        const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
        t.setBoard(game, {
          dennis: {
            red: ['Archery'],
            hand: ['Road Building'],
          },
          decks: {
            arti: {
              1: ['Holmegaard Bows']
            }
          }
        })

        const request1 = game.run()
        const request2 = t.choose(game, request1, 'Meld.Road Building')

        t.testBoard(game, {
          dennis: {
            artifact: ['Holmegaard Bows'],
            red: ['Road Building', 'Archery'],
          },
        })
      })

      test('same age', () => {
        const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
        t.setBoard(game, {
          dennis: {
            green: ['Clothing'],
            hand: ['Sailing'],
          },
          decks: {
            arti: {
              1: ['Holmegaard Bows']
            }
          }
        })

        const request1 = game.run()
        const request2 = t.choose(game, request1, 'Meld.Sailing')

        t.testBoard(game, {
          dennis: {
            artifact: ['Holmegaard Bows'],
            green: ['Sailing', 'Clothing'],
          },
        })
      })

      test('lower age', () => {
        const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
        t.setBoard(game, {
          dennis: {
            green: ['Mapmaking'],
            hand: ['Sailing'],
          },
          decks: {
            arti: {
              2: ['Holy Grail'],
            }
          }
        })

        const request1 = game.run()
        const request2 = t.choose(game, request1, 'Meld.Sailing')

        t.testBoard(game, {
          dennis: {
            artifact: ['Holy Grail'],
            green: ['Sailing', 'Mapmaking'],
          },
        })

      })

      test('higher age (no trigger)', () => {
        const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
        t.setBoard(game, {
          dennis: {
            green: ['Clothing'],
            hand: ['Currency'],
          },
        })

        const request1 = game.run()
        const request2 = t.choose(game, request1, 'Meld.Currency')

        t.testBoard(game, {
          dennis: {
            green: ['Currency', 'Clothing'],
          },
        })
      })

      test('can meld artifact on display', () => {
        const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
        t.setBoard(game, {
          dennis: {
            artifact: ['Holmegaard Bows'],
          },
        })

        const request1 = game.run()
        const request2 = t.choose(game, request1, 'skip')
        const request3 = t.choose(game, request2, 'Meld.Holmegaard Bows')

        t.testBoard(game, {
          dennis: {
            red: ['Holmegaard Bows'],
          },
        })
      })
    })

    describe.skip('relics', () => {
      test('claim from achievements as achievement', () => {
        const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
        t.setBoard(game, {
          dennis: {
            green: ['Compass'],
            hand: ['Sailing'],
          },
          decks: {
            arti: {
              3: ['Dunhuang Star Chart'],
            }
          }
        })

        const request1 = game.run()
        const request2 = t.choose(game, request1, 'Meld.Sailing')
        const request3 = t.choose(game, request2, 'to my achievements')

        t.testIsSecondPlayer(game)
        t.testBoard(game, {
          dennis: {
            green: ['Sailing', 'Compass'],
            artifact: ['Dunhuang Star Chart'],
            achievements: ['Timbuktu'],
          },
        })
      })

      test('claim from achievements to hand', () => {
        const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
        t.setBoard(game, {
          dennis: {
            green: ['Compass'],
            hand: ['Sailing'],
          },
          decks: {
            arti: {
              3: ['Dunhuang Star Chart'],
            }
          }
        })

        const request1 = game.run()
        const request2 = t.choose(game, request1, 'Meld.Sailing')
        const request3 = t.choose(game, request2, 'to my hand')

        t.testIsSecondPlayer(game)
        t.testBoard(game, {
          dennis: {
            green: ['Sailing', 'Compass'],
            artifact: ['Dunhuang Star Chart'],
            hand: ['Timbuktu'],
          },
        })
      })

      test('claim from opponent achievements', () => {
        const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
        t.setBoard(game, {
          dennis: {
            green: ['Compass'],
            hand: ['Sailing'],
          },
          micah: {
            achievements: ['Timbuktu'],
          },
          decks: {
            arti: {
              3: ['Dunhuang Star Chart'],
            }
          }
        })

        const request1 = game.run()
        const request2 = t.choose(game, request1, 'Meld.Sailing')
        const request3 = t.choose(game, request2, 'to my achievements')

        t.testIsSecondPlayer(game)
        t.testBoard(game, {
          dennis: {
            green: ['Sailing', 'Compass'],
            artifact: ['Dunhuang Star Chart'],
            achievements: ['Timbuktu'],
          },
        })
      })

      test('claim from my achievements to my hand', () => {
        const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
        t.setBoard(game, {
          dennis: {
            green: ['Compass'],
            hand: ['Sailing'],
            achievements: ['Timbuktu'],
          },
          decks: {
            arti: {
              3: ['Dunhuang Star Chart'],
            }
          }
        })

        const request1 = game.run()
        const request2 = t.choose(game, request1, 'Meld.Sailing')
        const request3 = t.choose(game, request2, 'to my hand')

        t.testIsSecondPlayer(game)
        t.testBoard(game, {
          dennis: {
            green: ['Sailing', 'Compass'],
            artifact: ['Dunhuang Star Chart'],
            hand: ['Timbuktu'],
          },
        })
      })

      test.skip('return from achievements', () => {
        const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
        t.setBoard(game, {
          dennis: {
            purple: ["'30 World Cup Final Ball"],
          },
          micah: {
            yellow: ['Agriculture'],
            achievements: ['Timbuktu'],
          },
          decks: {
            base: {
              8: ['Flight', 'Mobility', 'Skyscrapers'],
            }
          }
        })

        const request1 = game.run()
        const request2 = t.choose(game, request1, "Dogma.'30 World Cup Final Ball")

        t.testIsSecondPlayer(game)
        t.testBoard(game, {
          dennis: {
            purple: ["'30 World Cup Final Ball"],
            hand: ['Mobility', 'Skyscrapers'],
          },
          micah: {
            yellow: ['Agriculture'],
            hand: ['Flight'],
          },
        })

        const timbuktu = game
          .getZoneById('achievements')
          .cards()
          .find(card => card.name === 'Timbuktu')
        expect(!!timbuktu).toBe(true)
      })

      test.skip('return from hand (as a non-achievements zone)', () => {
        const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
        t.setBoard(game, {
          dennis: {
            yellow: ['Agriculture'],
            hand: ['Timbuktu'],
          },
          decks: {
            base: {
              4: ['Gunpowder'],
            }
          }
        })

        const request1 = game.run()
        const request2 = t.choose(game, request1, 'Dogma.Agriculture')
        const request3 = t.choose(game, request2, 'Timbuktu')

        t.testIsSecondPlayer(game)
        t.testBoard(game, {
          dennis: {
            yellow: ['Agriculture'],
            score: ['Gunpowder'],
          },
        })

        const timbuktu = game
          .getZoneById('achievements')
          .cards()
          .find(card => card.name === 'Timbuktu')
        expect(!!timbuktu).toBe(true)
      })
    })
  })

  describe.skip('logs', () => {
    test('card not visible', () => {
      const game = t.fixtureFirstPlayer()
      const request = game.run()
      t.choose(game, request, 'Draw.draw a card')
    })
  })

  describe('chain achievement', () => {

    test('basic case', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
      t.setBoard(game, {
        dennis: {
          blue: ['Computers'],
        },
        decks: {
          base: {
            10: ['Robotics', 'Databases'],
            11: ['Whataboutism'],
          }
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Dogma.Computers')

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          blue: ['Computers'],
          red: ['Robotics'],
          green: ['Databases'],
          achievements: ['Whataboutism'],
        },
      })
    })

  })
})

describe('zone size limits', () => {

  test('no splay: six is too many', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Tomb'],
        blue: ['Tools', 'Writing'],
        green: ['The Wheel'],
        achievements: ['Agriculture'],
        safe: ['Software', 'Flight', 'Optics', 'Tools', 'Metalworking'],
      },
      achievements: ['Domestication', 'Construction', 'Optics'],
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Tomb')
    request = t.choose(game, request, 'yes')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['The Wheel'],
        hand: ['Domestication'],
        safe: ['Software', 'Flight', 'Optics', 'Tools', 'Metalworking'],
        achievements: ['Agriculture'],
      },
    })
  })

  test('no splay: five is just right', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Tomb'],
        blue: ['Tools', 'Writing'],
        green: ['The Wheel'],
        achievements: ['Agriculture'],
        safe: ['Software', 'Flight', 'Optics', 'Tools'],
      },
      achievements: ['Domestication', 'Construction', 'Optics'],
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Tomb')
    request = t.choose(game, request, 'yes')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['The Wheel'],
        hand: ['Domestication'],
        safe: ['Software', 'Flight', 'Optics', 'Tools', 'Construction'],
        achievements: ['Agriculture'],
      },
    })
  })

  test('left splay: five is too many', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Tomb'],
        blue: ['Tools', 'Writing'],
        green: {
          cards: ['The Wheel', 'Sailing'],
          splay: 'left',
        },
        achievements: ['Agriculture'],
        safe: ['Software', 'Flight', 'Optics', 'Tools'],
      },
      achievements: ['Domestication', 'Construction', 'Optics'],
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Tomb')
    request = t.choose(game, request, 'yes')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: {
          cards: ['The Wheel', 'Sailing'],
          splay: 'left',
        },
        hand: ['Domestication'],
        safe: ['Software', 'Flight', 'Optics', 'Tools'],
        achievements: ['Agriculture'],
      },
    })
  })

  test('left splay: four is just right', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Tomb'],
        blue: ['Tools', 'Writing'],
        green: {
          cards: ['The Wheel', 'Sailing'],
          splay: 'left',
        },
        achievements: ['Agriculture'],
        safe: ['Software', 'Flight', 'Optics'],
      },
      achievements: ['Domestication', 'Construction', 'Optics'],
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Tomb')
    request = t.choose(game, request, 'yes')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: {
          cards: ['The Wheel', 'Sailing'],
          splay: 'left',
        },
        hand: ['Domestication'],
        safe: ['Software', 'Flight', 'Optics', 'Construction'],
        achievements: ['Agriculture'],
      },
    })
  })

  test('right splay: four is too many', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Tomb'],
        blue: ['Tools', 'Writing'],
        green: {
          cards: ['The Wheel', 'Sailing'],
          splay: 'right',
        },
        achievements: ['Agriculture'],
        safe: ['Software', 'Flight', 'Optics'],
      },
      achievements: ['Domestication', 'Construction', 'Optics'],
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Tomb')
    request = t.choose(game, request, 'yes')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: {
          cards: ['The Wheel', 'Sailing'],
          splay: 'right',
        },
        hand: ['Domestication'],
        safe: ['Software', 'Flight', 'Optics'],
        achievements: ['Agriculture'],
      },
    })
  })

  test('right splay: three is just right', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Tomb'],
        blue: ['Tools', 'Writing'],
        green: {
          cards: ['The Wheel', 'Sailing'],
          splay: 'right',
        },
        achievements: ['Agriculture'],
        safe: ['Software', 'Flight'],
      },
      achievements: ['Domestication', 'Construction'],
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Tomb')
    request = t.choose(game, request, 'yes')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: {
          cards: ['The Wheel', 'Sailing'],
          splay: 'right',
        },
        hand: ['Domestication'],
        safe: ['Software', 'Flight', 'Construction'],
        achievements: ['Agriculture'],
      },
    })
  })

  test('up splay: three is too many', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Tomb'],
        blue: ['Tools', 'Writing'],
        green: {
          cards: ['The Wheel', 'Sailing'],
          splay: 'up',
        },
        achievements: ['Agriculture'],
        safe: ['Software', 'Flight'],
      },
      achievements: ['Domestication', 'Construction'],
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Tomb')
    request = t.choose(game, request, 'yes')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: {
          cards: ['The Wheel', 'Sailing'],
          splay: 'up',
        },
        hand: ['Domestication'],
        safe: ['Software', 'Flight'],
        achievements: ['Agriculture'],
      },
    })
  })

  test('up splay: two is just right', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Tomb'],
        blue: ['Tools', 'Writing'],
        green: {
          cards: ['The Wheel', 'Sailing'],
          splay: 'up',
        },
        achievements: ['Agriculture'],
        safe: ['Software'],
      },
      achievements: ['Domestication', 'Construction'],
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Tomb')
    request = t.choose(game, request, 'yes')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: {
          cards: ['The Wheel', 'Sailing'],
          splay: 'up',
        },
        hand: ['Domestication'],
        safe: ['Software', 'Construction'],
        achievements: ['Agriculture'],
      },
    })
  })

  test('aslant splay: two is too many', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Tomb'],
        blue: ['Tools', 'Writing'],
        green: {
          cards: ['The Wheel', 'Sailing'],
          splay: 'aslant',
        },
        achievements: ['Agriculture'],
        safe: ['Software'],
      },
      achievements: ['Domestication', 'Construction'],
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Tomb')
    request = t.choose(game, request, 'yes')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: {
          cards: ['The Wheel', 'Sailing'],
          splay: 'aslant',
        },
        hand: ['Domestication'],
        safe: ['Software'],
        achievements: ['Agriculture'],
      },
    })
  })

  test('aslant splay: one is just right', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Tomb'],
        blue: ['Tools', 'Writing'],
        green: {
          cards: ['The Wheel', 'Sailing'],
          splay: 'aslant',
        },
        achievements: ['Agriculture'],
        safe: [],
      },
      achievements: ['Domestication', 'Construction'],
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Tomb')
    request = t.choose(game, request, 'yes')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: {
          cards: ['The Wheel', 'Sailing'],
          splay: 'aslant',
        },
        hand: ['Domestication'],
        safe: ['Construction'],
        achievements: ['Agriculture'],
      },
    })
  })

})
