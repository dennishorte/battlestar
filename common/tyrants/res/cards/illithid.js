const cardData = [
  {
    name: "Aboleth",
    aspect: "guile",
    race: "aberration",
    expansion: "illithid",
    cost: 7,
    points: 4,
    innerPoints: 7,
    count: 1,
    text: [
      "Choose one:",
      "- Place 2 spies.",
      "- Draw a card for each spy you have on the board."
    ],
    impl: (game, player) => {
      game.aChooseOne(player, [
        {
          title: 'Place 2 spies',
          impl: (game, player) => {
            game.aChooseAndPlaceSpy(player)
            game.aChooseAndPlaceSpy(player)
          }
        },
        {
          title: 'Draw a card for each spy you have on the board',
          impl: (game, player) => {
            const count = 5 - game.getCardsByZone(player, 'spies').length
            for (let i = 0; i < count; i++) {
              game.aDraw(player)
            }
          }
        },
      ])
    }
  },
  {
    name: "Ambassador",
    aspect: "ambition",
    race: "illithid",
    expansion: "illithid",
    cost: 3,
    points: 1,
    innerPoints: 3,
    count: 4,
    autoplay: true,
    text: [
      "At end of turn, promote another card played this turn.",
      //      "If an opponent causes you to discard this, you may promote it instead."
      "If an opponent causes you to discard this, you may promote it instead. If you do, draw a card.",
    ],
    impl: (game, player, { card }) => {
      game.aDeferPromotion(player, card)
    },
    triggers: [
      {
        kind: 'discard-this',
        impl: (game, player, { card }) => {
          game.log.add({
            template: '{player} was forced to discard {card}, and may choose to promote it',
            args: { player, card }
          })
          const promote = game.actions.chooseYesNo(player, 'Promote Ambassador instead of discarding?')
          if (promote) {
            game.aPromote(player, card)
            game.aDraw(player)
          }
          else {
            game.aDiscard(player, card)
          }
        }
      },
    ]
  },
  {
    name: "Beholder",
    aspect: "malice",
    race: "aberration",
    expansion: "illithid",
    cost: 5,
    points: 3,
    innerPoints: 6,
    count: 1,
    text: [
      "Assassinate a troop.",
      "Gain 1 power for every 3 troops in your trophy hall."
    ],
    impl: (game, player) => {
      game.aChooseAndAssassinate(player)
      const troops = game.getCardsByZone(player, 'trophyHall').length
      const power = Math.floor(troops / 3)
      player.incrementCounter('power', power)
    }
  },
  {
    name: "Brainwashed Slave",
    aspect: "guile",
    race: "aberration",
    expansion: "illithid",
    cost: 4,
    points: 2,
    innerPoints: 3,
    count: 2,
    text: [
      "Choose one:",
      "- Place a spy.",
      "- Return one of your spies > +2 power, + 2 influence."
    ],
    impl: (game, player) => {
      game.aChooseOne(player, [
        {
          title: 'Place a spy',
          impl: (game, player) => {
            game.aChooseAndPlaceSpy(player)
          }
        },
        {
          title: 'Return one of your spies > +2 power, + 2 influence',
          impl: (game, player) => game.aReturnASpyAnd(player, (game, player) => {
            player.incrementCounter('power', 2)
            player.incrementCounter('influence', 2)
          })
        },
      ])
    }
  },
  {
    name: "Chuul",
    aspect: "guile",
    race: "aberration",
    expansion: "illithid",
    cost: 3,
    points: 1,
    innerPoints: 4,
    count: 2,
    text: [
      "Place a spy. Each opponent who has a troop at that spy's site and more than 3 cards, must discard a card."
    ],
    impl: (game, player) => {
      const location = game.aChooseAndPlaceSpy(player)

      const opponents = game
        .players.opponentsOf(player)
        .filter(p => location.getTroops().some(troop => troop.owner === p))

      for (const opponent of opponents) {
        game.aChooseAndDiscard(opponent, {
          forced: true,
          requireThree: true,
          forcedBy: player.name,
        })
      }
    }
  },
  {
    name: "Cloaker",
    aspect: "guile",
    race: "aberration",
    expansion: "illithid",
    cost: 2,
    points: 1,
    innerPoints: 3,
    count: 3,
    text: [
      "Choose one:",
      "- Place a spy.",
      "- Return one of your spies > Assassinate a troop at that spy's site."
    ],
    impl: (game, player) => {
      game.aChooseOne(player, [
        {
          title: 'Place a spy',
          impl: (game, player) => {
            game.aChooseAndPlaceSpy(player)
          }
        },
        {
          title: "Return one of your spies > Assassinate a troop at that spy's site",
          impl: (game, player) => game.aReturnASpyAnd(player, (game, player, { loc }) => {
            game.aChooseAndAssassinate(player, { loc })
          })
        },
      ])
    }
  },
  {
    name: "Cranium Rats",
    aspect: "conquest",
    race: "beast",
    expansion: "illithid",
    cost: 2,
    points: 1,
    innerPoints: 3,
    count: 3,
    text: [
      "Deploy 2 troops.",
      "Choose one opponent with more than 3 cards to discard a card."
    ],
    impl: (game, player) => {
      game.aChooseAndDeploy(player)
      game.aChooseAndDeploy(player)
      game.aChooseToDiscard(player)
    }
  },
  {
    name: "Death Tyrant",
    aspect: "malice",
    race: "aberration",
    expansion: "illithid",
    cost: 7,
    points: 3,
    innerPoints: 6,
    count: 1,
    text: [
      "Assassinate up to 3 troops at a single site. For each troop removed, gain 1 influence."
    ],
    impl: (game, player) => {
      const loc = game.aChooseLocation(player, game.getPresence(player))
      const troops = loc
        .getTroops()
        .filter(troop => troop.owner !== player)
        .map(troop => troop.getOwnerName())
      const targets = game.actions.choose(player, troops, { min: 0, max: 3, title: 'Choose up to three troops to assassinate' })

      for (const target of targets) {
        const owner = target === 'neutral' ? 'neutral' : game.players.byName(target)
        game.aAssassinate(player, loc, owner)
      }

      player.incrementCounter('influence', targets.length)
    }
  },
  {
    name: "Elder Brain",
    aspect: "ambition",
    race: "aberration",
    expansion: "illithid",
    cost: 7,
    points: 4,
    innerPoints: 9,
    count: 1,
    text: [
      "Promote the top card of your deck.",
      "Play a card from your inner circle as if it were in your hand, then return it to your inner circle."
    ],
    impl: (game, player) => {
      const card = game.aDraw(player, { silent: true })
      if (card === 'no-more-cards') {
        game.log.add({
          template: '{player} has no more cards in their deck or discard pile',
          args: { player }
        })
      }
      else {
        game.aPromote(player, card, { silent: true })
        game.log.add({
          template: '{player} promotes {card} from the top of their library',
          args: { player, card }
        })
      }

      const choices = game.getCardsByZone(player, 'innerCircle')
      const toPlay = game.actions.chooseCard(player, choices)
      if (toPlay) {
        game.log.add({
          template: '{player} choose {card} to play from their innerCircle',
          args: { player, card: toPlay }
        })
        game.mMoveCardTo(toPlay, game.zones.byPlayer(player, 'hand'))
        game.aPlayCard(player, toPlay)
        game.mMoveCardTo(toPlay, game.zones.byPlayer(player, 'innerCircle'))
        game.log.add({
          template: '{player} returns {card} to their inner circle',
          args: { player, card: toPlay }
        })
      }
    }
  },
  {
    name: "Gauth",
    aspect: "malice",
    race: "aberration",
    expansion: "illithid",
    cost: 3,
    points: 2,
    innerPoints: 3,
    count: 2,
    text: [
      "Choose one:",
      "- +2 influence.",
      "- Draw a card. Choose one opponent with more than 3 cards to discard a card."
    ],
    impl: (game, player) => {
      game.aChooseOne(player, [
        {
          title: '+2 influence',
          impl: (game, player) => player.incrementCounter('influence', 2),
        },
        {
          title: 'Draw a card. Choose one opponent with more than 3 cards to discard a card',
          impl: (game, player) => {
            game.aDraw(player)
            game.aChooseToDiscard(player)
          }
        },
      ])
    }
  },
  {
    name: "Grimlock",
    aspect: "conquest",
    race: "grimlock",
    expansion: "illithid",
    cost: 1,
    points: 0,
    innerPoints: 1,
    count: 2,
    text: [
      "Deploy a troop.",
      "If an opponent causes you to dicard this, draw 2 cards."
    ],
    impl: (game, player) => {
      game.aChooseAndDeploy(player)
    },
    triggers: [
      {
        kind: 'discard-this',
        impl: (game, player, { card }) => {
          game.log.add({
            template: '{player} was forced to discard {card}, so will draw two cards',
            args: { player, card }
          })
          game.aDiscard(player, card)
          game.aDraw(player)
          game.aDraw(player)
        }
      },
    ]
  },
  {
    name: "Intellect Devourer",
    aspect: "ambition",
    race: "aberration",
    expansion: "illithid",
    cost: 4,
    points: 1,
    innerPoints: 3,
    count: 2,
    text: [
      "Choose one:",
      "- +3 influence.",
      "- Return up to two troops or spies."
    ],
    impl: (game, player) => {
      game.aChooseOne(player, [
        {
          title: '+3 influence',
          impl: (game, player) => player.incrementCounter('influence', 3),
        },
        {
          title: 'Return up to two troops or spies',
          impl: (game, player) => {
            game.aChooseAndReturn(player)
            game.aChooseAndReturn(player)
          }
        },
      ])
    }
  },
  {
    name: "Mindwitness",
    aspect: "malice",
    race: "aberration",
    expansion: "illithid",
    cost: 3,
    points: 1,
    innerPoints: 3,
    count: 3,
    text: [
      "Assassinate a troop. If that troop belonged to another player and they have more than 3 cards, they must discard a card."
    ],
    impl: (game, player) => {
      const troop = game.aChooseAndAssassinate(player)
      if (troop && Boolean(troop.owner)) {
        game.aChooseAndDiscard(troop.owner, {
          requireThree: true,
          forced: true,
          forcedBy: player.name,
        })
      }
    }
  },
  {
    name: "Neogi",
    aspect: "conquest",
    race: "aberration",
    expansion: "illithid",
    cost: 7,
    points: 4,
    innerPoints: 8,
    count: 1,
    text: [
      "Deploy 4 troops.",
      "At end of turn, each opponent must discard a card."
    ],
    impl: (game, player, { card }) => {
      game.aChooseAndDeploy(player)
      game.aChooseAndDeploy(player)
      game.aChooseAndDeploy(player)
      game.aChooseAndDeploy(player)

      const opponents = game
        .players.all()
        .filter(p => p !== player)
      for (const opp of opponents) {
        game.aDeferDiscard(opp, card, player)
      }
    }
  },
  {
    name: "Nothic",
    aspect: "guile",
    race: "aberration",
    expansion: "illithid",
    cost: 3,
    points: 1,
    innerPoints: 3,
    count: 2,
    text: [
      "Choose one:",
      "- Place a spy.",
      "- Return one of your spies > Draw a card. Each opponent with more than 3 cards must discard a card."
    ],
    impl: (game, player) => {
      game.aChooseOne(player, [
        {
          title: 'Place a spy',
          impl: (game, player) => {
            game.aChooseAndPlaceSpy(player)
          }
        },
        {
          title: 'Return one of your spies > Draw a card. Each opponent with more than 3 cards must discard a card',
          impl: (game, player) => {
            game.aReturnASpyAnd(player, (game, player) => {
              game.aDraw(player)
              game
                .players.opponentsOf(player)
                .forEach(opp => game.aChooseAndDiscard(opp, {
                  requireThree: true,
                  forced: true,
                  forcedBy: player.name,
                }))
            })
          }
        },
      ])
    }
  },
  {
    name: "Puppeteer",
    aspect: "ambition",
    race: "illithid",
    expansion: "illithid",
    cost: 5,
    points: 2,
    innerPoints: 6,
    count: 2,
    autoplay: true,
    text: [
      "+2 influence.",
      "At end of turn, promote another card played this turn."
    ],
    impl: (game, player, { card }) => {
      player.incrementCounter('influence', 2)
      game.aDeferPromotion(player, card)
    }
  },
  {
    name: "Quaggoth",
    aspect: "conquest",
    race: "quaggoth",
    expansion: "illithid",
    cost: 5,
    points: 2,
    innerPoints: 4,
    count: 2,
    text: [
      "Assassinate one white troop for each site you control."
    ],
    impl: (game, player) => {
      const controlCount = game
        .getLocationAll()
        .filter(loc => loc.getController() === player)
        .length
      for (let i = 0; i < controlCount; i++) {
        game.aChooseAndAssassinate(player, { whiteOnly: true })
      }
    }
  },
  {
    name: "Spectator",
    aspect: "malice",
    race: "aberration",
    expansion: "illithid",
    cost: 4,
    points: 2,
    innerPoints: 3,
    count: 3,
    autoplay: true,
    text: [
      "Choose 1:",
      "- +2 power and +1 influence",
      "- +1 power and +2 influence",
      /* "+2 power",
       * "+1 influence" */
    ],
    impl: (game, player) => {
      game.aChooseOne(player, [
        {
          title: '+2 power and +1 influence',
          impl: (game, player) => {
            player.incrementCounter('power', 2)
            player.incrementCounter('influence', 1)
          }
        },
        {
          title: '+1 power and +2 influence',
          impl: (game, player) => {
            player.incrementCounter('power', 1)
            player.incrementCounter('influence', 2)
          }
        },
      ])

      /* player.incrementCounter('power', 2)
       * player.incrementCounter('influence', 1) */
    }
  },
  {
    name: "Ulitharid",
    aspect: "ambition",
    race: "illithid",
    expansion: "illithid",
    cost: 6,
    points: 3,
    innerPoints: 6,
    count: 1,
    text: [
      //      "Play a card in the market that costs 4 or less as if it was in your hand, then devour that card."
      "Play a card in the market that costs 6 or less as if it was in your hand, then devour that card."
    ],
    impl: (game, player) => {
      const choices = game
        .zones.byId('market')
        .cards()
        .filter(card => card.cost <= 6)
      const card = game.actions.chooseCard(player, choices)
      if (card) {
        game.mMoveCardTo(card, game.zones.byPlayer(player, 'hand'))
        game.aPlayCard(player, card)
        game.aDevour(player, card)
        game.mRefillMarket()
      }
    }
  },
  {
    name: "Umber Hulk",
    aspect: "conquest",
    race: "monstrosity",
    expansion: "illithid",
    cost: 4,
    points: 2,
    innerPoints: 4,
    count: 2,
    text: [
      "Deploy 3 troops.",
      "If an opponent causes you to discard this, you draw a card and they draw only 4 cards the next time they would refill their hand."
    ],
    impl: (game, player) => {
      game.aChooseAndDeploy(player)
      game.aChooseAndDeploy(player)
      game.aChooseAndDeploy(player)
    },
    triggers: [
      {
        kind: 'discard-this',
        impl: (game, player, { card, forcedBy }) => {
          const opp = game.players.byName(forcedBy)
          game.log.add({
            template: '{player} will draw one fewer card on their next hand refill',
            args: { player: opp }
          })
          game.aDiscard(player, card)
          game.aDraw(player)
          game.aReduceDraw(opp)
        }
      },
    ]
  }
]

module.exports = {
  cardData,
}
