const cardData = [
  {
    name: "Blackguard",
    aspect: "malice",
    race: "drow",
    expansion: "drow",
    cost: 3,
    points: 1,
    innerPoints: 3,
    count: 4,
    text: [
      "Choose one:",
      "- +2 power",
      "- Assassinate a troop."
    ],
    impl: (game, player) => {
      game.aChooseOne(player, [
        {
          title: '+2 power',
          impl: (game, player) => player.incrementPower(2),
        },
        {
          title: 'Assassinate a troop',
          impl: (game, player) => game.aChooseAndAssassinate(player),
        },
      ])
    }
  },
  {
    name: "Bounty Hunter",
    aspect: "malice",
    race: "drow",
    expansion: "drow",
    cost: 4,
    points: 2,
    innerPoints: 4,
    count: 2,
    text: [
      "+3 power"
    ],
    impl: (game, player) => player.incrementPower(3),
  },
  {
    name: "Doppelganger",
    aspect: "malice",
    race: "doppelganger",
    expansion: "drow",
    cost: 5,
    points: 3,
    innerPoints: 5,
    count: 2,
    text: [
      "Supplant a troop."
    ],
    impl: (game, player) => game.aChooseAndSupplant(player),
  },
  {
    name: "Deathblade",
    aspect: "malice",
    race: "drow",
    expansion: "drow",
    cost: 6,
    points: 3,
    innerPoints: 6,
    count: 1,
    text: [
      "Assassinate 2 troops."
    ],
    impl: (game, player) => {
      game.aChooseAndAssassinate(player)
      game.aChooseAndAssassinate(player)
    }
  },
  {
    name: "Inquisitor",
    aspect: "malice",
    race: "drow",
    expansion: "drow",
    cost: 3,
    points: 2,
    innerPoints: 4,
    count: 1,
    text: [
      "Choose one:",
      "- +2 influence",
      "- Assassinate a troop."
    ],
    impl: (game, player) => {
      game.aChooseOne(player, [
        {
          title: '+2 influence',
          impl: (game, player) => player.incrementInfluence(2),
        },
        {
          title: 'Assassinate a troop',
          impl: (game, player) => game.aChooseAndAssassinate(player),
        },
      ])
    }
  },
  {
    name: "Advance Scout",
    aspect: "conquest",
    race: "drow",
    expansion: "drow",
    cost: 3,
    points: 1,
    innerPoints: 3,
    count: 3,
    text: [
      "Supplant a white troop."
    ],
    impl: (game, player) => game.aChooseAndSupplant(player, { whiteOnly: true }),
  },
  {
    name: "Mercenary Squad",
    aspect: "conquest",
    race: "drow",
    expansion: "drow",
    cost: 3,
    points: 1,
    innerPoints: 4,
    count: 2,
    text: [
      "Deploy 3 troops."
    ],
    impl: (game, player) => {
      game.aChooseAndDeploy(player)
      game.aChooseAndDeploy(player)
      game.aChooseAndDeploy(player)
    }
  },
  {
    name: "Underdark Ranger",
    aspect: "conquest",
    race: "drow",
    expansion: "drow",
    cost: 4,
    points: 2,
    innerPoints: 4,
    count: 2,
    text: [
      "Assassinate 2 white troops."
    ],
    impl: (game, player) => {
      game.aChooseAndAssassinate(player, { whiteOnly: true })
      game.aChooseAndAssassinate(player, { whiteOnly: true })
    }
  },
  {
    name: "Master of Melee-Magthere",
    aspect: "conquest",
    race: "drow",
    expansion: "drow",
    cost: 5,
    points: 2,
    innerPoints: 5,
    count: 2,
    text: [
      "Choose one:",
      "- Deploy 4 troops.",
      "- Supplant a white troop anywhere on the board."
    ],
    impl: (game, player) => {
      game.aChooseOne(player, [
        {
          title: 'Deploy 4 troops',
          impl: (game, player) => {
            game.aChooseAndDeploy(player)
            game.aChooseAndDeploy(player)
            game.aChooseAndDeploy(player)
            game.aChooseAndDeploy(player)
          }
        },
        {
          title: 'Supplant a white troop anywhere on the board',
          impl: (game, player) => game.aChooseAndSupplant(player, { whiteOnly: true, anywhere: true }),
        },
      ])
    }
  },
  {
    name: "Weaponmaster",
    aspect: "conquest",
    race: "drow",
    expansion: "drow",
    cost: 6,
    points: 3,
    innerPoints: 6,
    count: 1,
    text: [
      "Choose three times:",
      "- Deploy a troop.",
      "- Assassinate a white troop."
    ],
    impl: (game, player) => {
      const choice = [
        {
          title: 'Deploy a troop',
          impl: (game, player) => game.aChooseAndDeploy(player)
        },
        {
          title: 'Assassinate a white troop',
          impl: (game, player) => game.aChooseAndAssassinate(player, { whiteOnly: true })
        }
      ]
      game.aChooseOne(player, choice)
      game.aChooseOne(player, choice)
      game.aChooseOne(player, choice)
    }
  },
  {
    name: "Spellspinner",
    aspect: "guile",
    race: "drow",
    expansion: "drow",
    cost: 3,
    points: 1,
    innerPoints: 3,
    count: 3,
    text: [
      "Choose one:",
      "- Place a spy.",
      "- Return one of your spies > Supplant a troop at that spy's site."
    ],
    impl: (game, player) => {
      game.aChooseOne(player, [
        {
          title: 'Place a spy',
          impl: (game, player) => game.aChooseAndPlaceSpy(player),
        },
        {
          title: "Return one of your spies > Supplant a troop at that spy's site",
          impl: (game, player) => game.aReturnASpyAnd(player, (game, player, { loc }) => {
            game.aChooseAndSupplant(player, { loc })
          })
        },
      ])
    }
  },
  {
    name: "Spy Master",
    aspect: "guile",
    race: "drow",
    expansion: "drow",
    cost: 2,
    points: 1,
    innerPoints: 2,
    count: 2,
    text: [
      "Place a spy."
    ],
    impl: (game, player) => game.aChooseAndPlaceSpy(player),
  },
  {
    name: "Infiltrator",
    aspect: "guile",
    race: "drow",
    expansion: "drow",
    cost: 3,
    points: 1,
    innerPoints: 2,
    count: 2,
    text: [
      "Place a spy. If another player's troop is at that site, gain 1 power."
    ],
    impl: (game, player) => {
      const loc = game.aChooseAndPlaceSpy(player)
      const players = loc
        .getTroops()
        .map(troop => game.getPlayerByCard(troop))
        .filter(other => other !== undefined)
        .filter(other => other !== player)
      if (players.length > 0) {
        player.incrementPower(1)
      }
    },
  },
  {
    name: "Information Broker",
    aspect: "guile",
    race: "drow",
    expansion: "drow",
    cost: 5,
    points: 2,
    innerPoints: 5,
    count: 2,
    text: [
      "Choose one:",
      "- Place a spy.",
      "- Return one of your spies > Draw 3 cards."
    ],
    impl: (game, player) => {
      game.aChooseOne(player, [
        {
          title: 'Place a spy',
          impl: (game, player) => game.aChooseAndPlaceSpy(player),
        },
        {
          title: "Return one of your spies > Draw 3 cards",
          impl: (game, player) => game.aReturnASpyAnd(player, (game, player) => {
            game.aDraw(player)
            game.aDraw(player)
            game.aDraw(player)
          })
        },
      ])
    }
  },
  {
    name: "Masters of Sorcere",
    aspect: "guile",
    race: "drow",
    expansion: "drow",
    cost: 5,
    points: 2,
    innerPoints: 5,
    count: 1,
    text: [
      "Choose one:",
      "- Place 2 spies.",
      "- Return one of your spies > +4 power."
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
          title: "Return one of your spies > +4 power",
          impl: (game, player) => game.aReturnASpyAnd(player, (game, player) => {
            player.incrementPower(4)
          })
        },
      ])
    }
  },
  {
    name: "Advocate",
    aspect: "abmition",
    race: "drow",
    expansion: "drow",
    cost: 2,
    points: 1,
    innerPoints: 2,
    count: 4,
    text: [
      "Choose one:",
      "- +2 influence.",
      "- At end of turn, promote another card played this turn."
    ],
    impl: (game, player, opts) => {
      game.aChooseOne(player, [
        {
          title: '+2 influence',
          impl: (game, player) => player.incrementInfluence(2),
        },
        {
          title: "At end of turn, promote another card played this turn",
          impl: (game, player, { card }) => game.aDeferPromotion(player, card),
        },
      ], opts)
    }
  },
  {
    name: "Chosen of Lolth",
    aspect: "ambition",
    race: "drow",
    expansion: "drow",
    cost: 4,
    points: 2,
    innerPoints: 4,
    count: 2,
    text: [
      "Return another player's troop or spy.",
      "At end of turn, promote another card played this turn."
    ],
    impl: (game, player, { card }) => {
      game.aChooseAndReturn(player, { noWhite: true })
      game.aDeferPromotion(player, card)
    }
  },
  {
    name: "Drow Negotiator",
    aspect: "ambition",
    race: "drow",
    expansion: "drow",
    cost: 3,
    points: 1,
    innerPoints: 2,
    count: 2,
    text: [
      "If there are 4 or more cards in your inner circle, gain +3 influence.",
      "At end of turn, promote another card played this turn."
    ],
    impl: (game, player, { card }) => {
      if (game.getCardsByZone(player, 'innerCircle').length >= 4) {
        player.incrementInfluence(3)
      }
      game.aDeferPromotion(player, card)
    }
  },
  {
    name: "Council Member",
    aspect: "ambition",
    race: "drow",
    expansion: "drow",
    cost: 6,
    points: 3,
    innerPoints: 6,
    count: 1,
    text: [
      "Move up to 2 enemy troops.",
      "At end of turn, promote another card played this turn."
    ],
    impl: (game, player, { card }) => {
      game.aChooseAndMoveTroop(player, { min: 0 })
      game.aChooseAndMoveTroop(player, { min: 0 })
      game.aDeferPromotion(player, card)
    }
  },
  {
    name: "Matron Mother",
    aspect: "ambition",
    race: "drow",
    expansion: "drow",
    cost: 6,
    points: 3,
    innerPoints: 6,
    count: 1,
    text: [
      "Put your deck into your discard pile. Then promote a card from your discard pile."
    ],
    impl: (game, player) => {
      game.mLog({
        template: '{player} moves their deck into their discard pile',
        args: { player }
      })
      const discard = game.getZoneByPlayer(player, 'discard')
      for (const card of game.getCardsByZone(player, 'deck')) {
        game.mMoveCardTo(card, discard)
      }
      game.aChooseAndPromote(player, game.getCardsByZone(player, 'discard'))
    }
  },
]

module.exports = {
  cardData,
}
