const Card = require('./Card.js')

const baseData = [
  {
    name: "Priestess of Lolth",
    aspect: "obedience",
    race: "drow",
    expansion: "core",
    cost: 2,
    points: 1,
    innerPoints: 2,
    count: 15,
    text: [
      "+2 influence"
    ],
    impl: (game, player) => player.incrementInfluence(2)
  },
  {
    name: "House Guard",
    aspect: "obedience",
    race: "drow",
    expansion: "core",
    cost: 3,
    points: 1,
    innerPoints: 3,
    count: 15,
    text: [
      "+2 power"
    ],
    impl: (game, player) => player.incrementPower(2)
  },
  {
    name: "Insane Outcast",
    aspect: "-",
    race: "drow",
    expansion: "core",
    cost: -1,
    points: 0,
    innerPoints: 0,
    count: 30,
    text: [
      "Discard a card from your hand > Return Insane Outcast to the supply.",
      "If Insane Outcast would be devoured or promoted, return it to the supply instead."
    ],
    impl: (game, player, { card }) => {
      const discarded = game.aChooseAndDiscard(player, {
        title: 'Choose a card to discard',
        min: 0,
        max: 1,
      })
      if (discarded) {
        game.mMoveCardTo(card, game.getZoneById('outcast'))
      }
    }
  },
  {
    name: "Noble",
    aspect: "obedience",
    race: "drow",
    expansion: "starter",
    cost: -1,
    points: 0,
    innerPoints: 1,
    count: 28,
    text: [
      "+1 influence"
    ],
    impl: (game, player) => player.incrementInfluence(1),
  },
  {
    name: "Soldier",
    aspect: "obedience",
    race: "drow",
    expansion: "starter",
    cost: -1,
    points: 0,
    innerPoints: 1,
    count: 12,
    text: [
      "+1 power"
    ],
    impl: (game, player) => player.incrementPower(1),
  },
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
        .getSpies()
        .map(spy => game.getPlayerByCard(spy))
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
          title: 'Place a Spy',
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
    impl: (game, player) => {
      game.aChooseOne(player, [
        {
          title: '+2 influence',
          impl: (game, player) => player.incrementInfluence(2),
        },
        {
          title: "At end of turn, promote another card played this turn.",
          impl: (game, player, { card }) => game.aDeferPromotion(player, card),
        },
      ])
    }
  },
  {
    name: "Chosen of Lloth",
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
      game.aChooseAndReturn(player)
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
      game.aChooseAndMove(player, { min: 0 })
      game.aChooseAndMove(player, { min: 0 })
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
  {
    name: "Dragon Cultist",
    aspect: "malice",
    race: "human",
    expansion: "dragons",
    cost: 3,
    points: 1,
    innerPoints: 4,
    count: 4,
    text: [
      "Choose one:",
      "- +2 power",
      "- +2 influence"
    ],
    impl: (game, player) => game.aChooseOne(player, [
      {
        title: '+2 power',
        impl: (game, player) => player.incrementPower(2),
      },
      {
        title: '+2 influence',
        impl: (game, player) => player.incrementInfluence(2),
      },
    ])
  },
  {
    name: "Red Wyrmling",
    aspect: "malice",
    race: "dragon",
    expansion: "dragons",
    cost: 5,
    points: 3,
    innerPoints: 5,
    count: 2,
    text: [
      "+2 power",
      "+2 influence"
    ],
    impl: (game, player) => {
      player.incrementPower(2)
      player.incrementInfluence(2)
    }
  },
  {
    name: "Dragonclaw",
    aspect: "malice",
    race: "human",
    expansion: "dragons",
    cost: 4,
    points: 1,
    innerPoints: 3,
    count: 2,
    text: [
      "Assassinate a troop. Then, if you have 5 or more player troops in your trophy hall, gain +2 power."
    ],
    impl: (game, player) => {
      game.aChooseAndAssassinate(player)

      if (game.getCardsByZone(player, 'trophyHall').length >= 5) {
        player.incrementPower(2)
      }
    }
  },
  {
    name: "Severin Silrajin",
    aspect: "malice",
    race: "human",
    expansion: "dragons",
    cost: 7,
    points: 4,
    innerPoints: 8,
    count: 1,
    text: [
      "+5 power"
    ],
    impl: (game, player) => player.incrementPower(5),
  },
  {
    name: "Red Dragon",
    aspect: "malice",
    race: "dragon",
    expansion: "dragons",
    cost: 8,
    points: 4,
    innerPoints: 8,
    count: 1,
    text: [
      "Supplant a troop.",
      "Return an enemy spy.",
      "Gain 1 VP for each site under your total control."
    ],
    impl: (game, player) => {
      game.aChooseAndSupplant(player)
      game.aChooseAndReturn(player, { noTroops: true })

      const totalControl = game
        .getLocationAll()
        .filter(loc => loc.getTotalController() === player)
        .length

      player.incrementPoints(totalControl)
    }
  },
  {
    name: "Kobold",
    aspect: "conquest",
    race: "kobold",
    expansion: "dragons",
    cost: 1,
    points: 1,
    innerPoints: 2,
    count: 3,
    text: [
      "Choose one:",
      "- Deploy a troop.",
      "- Assassinate a white troop."
    ],
    impl: (game, player) => game.aChooseOne(player, [
      {
        title: 'Deploy a troop',
        impl: (game, player) => game.aChooseAndDeploy(player)
      },
      {
        title: 'Assassinate a white troop',
        impl: (game, player) => game.aChooseAndAssassinate(player, { whiteOnly: true })
      },
    ])
  },
  {
    name: "White Wyrmling",
    aspect: "conquest",
    race: "dragon",
    expansion: "dragons",
    cost: 2,
    points: 1,
    innerPoints: 3,
    count: 3,
    text: [
      "Deploy 2 troops.",
      "You may devour a card in the market."
    ],
    impl: (game, player) => {
      game.aChooseAndDeploy(player)
      game.aChooseAndDeploy(player)
      game.aChooseAndDevourMarket(player)
    }
  },
  {
    name: "Black Wyrmling",
    aspect: "conquest",
    race: "dragon",
    expansion: "dragons",
    cost: 3,
    points: 1,
    innerPoints: 4,
    count: 2,
    text: [
      "+1 influence",
      "Assassinate a white troop."
    ],
    impl: (game, player) => {
      player.incrementInfluence(1)
      game.aChooseAndAssassinate(player, { whiteOnly: true })
    }
  },
  {
    name: "White Dragon",
    aspect: "conquest",
    race: "dragon",
    expansion: "dragons",
    cost: 6,
    points: 2,
    innerPoints: 5,
    count: 1,
    text: [
      "Deploy 3 troops.",
      "Gain 1 VP for every 2 sites you control."
    ],
    impl: (game, player) => {
      game.aChooseAndDeploy(player)
      game.aChooseAndDeploy(player)
      game.aChooseAndDeploy(player)

      const controlledSites = game
        .getLocationAll()
        .filter(loc => loc.getController() === player)
        .length
      player.incrementPoints(controlledSites)
    }
  },
  {
    name: "Black Dragon",
    aspect: "conquest",
    race: "dragon",
    expansion: "dragons",
    cost: 7,
    points: 3,
    innerPoints: 7,
    count: 1,
    text: [
      "Supplant a white troop anywhere on the board.",
      "Gain 1 VP for every 3 white troops in your trophy hall."
    ],
    impl: (game, player) => {
      game.aChooseAndSupplant(player, { whiteOnly: true, anywhere: true })

      const whiteTrophies = game
        .getCardsByZone(player, 'trophyHall')
        .filter(card => card.name === 'neutral')
        .length
      player.incrementPoints(Math.floor(whiteTrophies / 3))
    }
  },
  {
    name: "Watcher of Thay",
    aspect: "guile",
    race: "human",
    expansion: "dragons",
    cost: 3,
    points: 2,
    innerPoints: 3,
    count: 3,
    text: [
      "Choose one:",
      "- Place a spy.",
      "- Return one of your spies > +3 influence"
    ],
    impl: (game, player) => game.aChooseOne(player, [
      {
        title: 'Place a spy',
        impl: (game, player) => game.aChooseAndPlaceSpy(player),
      },
      {
        title: 'Return one of your spies > +3 influence',
        impl: (game, player) => game.aReturnASpyAnd(player, (game, player) => {
          player.incrementInfluence(3)
        })
      }
    ])
  },
  {
    name: "Enchanter of Thay",
    aspect: "guile",
    race: "human",
    expansion: "dragons",
    cost: 4,
    points: 1,
    innerPoints: 3,
    count: 3,
    text: [
      "Choose one:",
      "- Place a spy.",
      "- Return one of your spies > +4 power"
    ],
    impl: (game, player) => game.aChooseOne(player, [
      {
        title: 'Place a spy',
        impl: (game, player) => game.aChooseAndPlaceSpy(player),
      },
      {
        title: 'Return one of your spies > +4 power',
        impl: (game, player) => game.aReturnASpyAnd(player, (game, player) => {
          player.incrementPower(4)
        })
      }
    ])
  },
  {
    name: "Green Wyrmling",
    aspect: "guile",
    race: "dragon",
    expansion: "dragons",
    cost: 4,
    points: 2,
    innerPoints: 4,
    count: 2,
    text: [
      "Place a spy. If another player's troop is at that site, gain +2 influence."
    ],
    impl: (game, player) => {
      const loc = game.aChooseAndPlaceSpy(player)

      const anotherPlayer = loc
        .getTroops()
        .filter(troop => game.getPlayerByCard(troop) !== player)
        .length > 0
      if (anotherPlayer) {
        player.incrementInfluence(2)
      }
    }
  },
  {
    name: "Rath Modar",
    aspect: "guile",
    race: "human",
    expansion: "dragons",
    cost: 6,
    points: 2,
    innerPoints: 5,
    count: 1,
    text: [
      "Draw 2 cards.",
      "Place a spy."
    ],
    impl: (game, player) => {
      game.aDraw(player)
      game.aDraw(player)
      game.aChooseAndPlaceSpy(player)
    }
  },
  {
    name: "Green Dragon",
    aspect: "guile",
    race: "dragon",
    expansion: "dragons",
    cost: 7,
    points: 3,
    innerPoints: 7,
    count: 1,
    text: [
      "Choose one:",
      "- Place a spy, then supplant a troop at that spy's site.",
      "- Return one of your spies > Supplant a troop at that spy's site, then gain 1 VP for each site control marker you have."
    ],
    impl: (game, player) => game.aChooseOne(player, [
      {
        title: "Place a spy, then supplant a troop at that spy's site",
        impl: (game, player) => {
          const loc = game.aChooseAndPlaceSpy(player)
          if (loc) {
            game.aChooseAndSupplant(player, { loc })
          }
        }
      },
      {
        title: "Return one of your spies > Supplant a troop at that spy's site, then gain 1 VP for each site control marker you have",
        impl: (game, player) => game.aReturnASpyAnd(player, (game, player, { loc }) => {
          game.aChooseAndSupplant(player, { loc })
          player.incrementPoints(game.getControlMarkers(player).length)
        })
      }
    ])
  },
  {
    name: "Cult Fanatic",
    aspect: "ambition",
    race: "half-dragon",
    expansion: "dragons",
    cost: 3,
    points: 1,
    innerPoints: 4,
    count: 2,
    text: [
      "+2 influence",
      "You may devour a card in the market."
    ],
    impl: (game, player) => {
      player.incrementInfluence(2)
      game.aChooseAndDevourMarket(player)
    }
  },
  {
    name: "Cleric of Loagzed",
    aspect: "ambition",
    race: "troglodyte",
    expansion: "dragons",
    cost: 4,
    points: 2,
    innerPoints: 4,
    count: 2,
    text: [
      "Move an enemy troop.",
      "At end of turn, promote another card played this turn."
    ],
    impl: (game, player, { card }) => {
      game.aChooseAndMove(player, { enemyOnly: true })
      game.aDeferPromotion(player, card)
    }
  },
  {
    name: "Wyrmspeaker",
    aspect: "ambition",
    race: "dwarf",
    expansion: "dragons",
    cost: 3,
    points: 1,
    innerPoints: 3,
    count: 3,
    text: [
      "+1 influence",
      "At end of turn, promote another card played this turn."
    ],
    impl: (game, player, { card }) => {
      player.incrementInfluence(1)
      game.aDeferPromotion(player, card)
    }
  },
  {
    name: "Blue Wyrmling",
    aspect: "ambition",
    race: "dragon",
    expansion: "dragons",
    cost: 5,
    points: 2,
    innerPoints: 4,
    count: 2,
    text: [
      "+3 influence",
      "Return another player's troop or spy."
    ],
    impl: (game, player) => {
      player.incrementInfluence(3)
      game.aChooseAndReturn(player)
    }
  },
  {
    name: "Blue Dragon",
    aspect: "ambition",
    race: "dragon",
    expansion: "dragons",
    cost: 8,
    points: 4,
    innerPoints: 8,
    count: 1,
    text: [
      "At end of turn, promote up to 2 other cards played this turn, then gain 1 VP for every 3 cards in your inner circle."
    ],
    impl: (game, player, { card }) => {
      game.aDeferPromotion(player, card)
      game.aDeferPromotion(player, card)

      const innerCircle = game.getCardsByZone(player, 'innerCircle').length
      player.incrementPoints(Math.floor(innerCircle / 3))
    }
  }
]

const cards = []
const byExpansion = {}
const byId = {}
const byName = {}
for (const data of baseData) {
  for (let i = 0; i < data.count; i++) {
    const id = data.name.toLowerCase().replace(' ', '-') + '-' + i
    const card = new Card(id, data)

    cards.push(card)
    byId[card.id] = card

    if (!byExpansion.hasOwnProperty(card.expansion)) {
      byExpansion[card.expansion] = []
    }
    byExpansion[card.expansion].push(card)

    if (!byName.hasOwnProperty(card.name)) {
      byName[card.name] = []
    }
    byName[card.name].push(card)
  }
}

module.exports = {
  all: cards,
  byExpansion,
  byId,
  byName,
}
