const cardData = [
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
        impl: (game, player) => player.incrementCounter('power', 2),
      },
      {
        title: '+2 influence',
        impl: (game, player) => player.incrementCounter('influence', 2),
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
    autoplay: true,
    text: [
      "+2 power",
      "+2 influence"
    ],
    impl: (game, player) => {
      player.incrementCounter('power', 2)
      player.incrementCounter('influence', 2)
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

      const playerTroops = game
        .cards.byPlayer(player, 'trophyHall')
        .filter(troop => !troop.isNeutral())
        .length

      if (playerTroops >= 5) {
        player.incrementCounter('power', 2)
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
    autoplay: true,
    text: [
      "+5 power"
    ],
    impl: (game, player) => player.incrementCounter('power', 5),
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

      player.incrementCounter('points', totalControl)
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
      "You may devour up to three cards in the market."
    ],
    impl: (game, player) => {
      game.aChooseAndDeploy(player)
      game.aChooseAndDeploy(player)
      game.aChooseAndDevourMarket(player, { max: 3 })
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
      player.incrementCounter('influence', 1)
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
      game.log.add({
        template: '{player} controls {count} sites',
        args: {
          player,
          count: controlledSites
        }
      })
      player.incrementCounter('points', Math.floor(controlledSites / 2))
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
        .cards.byPlayer(player, 'trophyHall')
        .filter(card => card.name === 'neutral')
        .length
      player.incrementCounter('points', Math.floor(whiteTrophies / 3))
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
          player.incrementCounter('influence', 3)
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
          player.incrementCounter('power', 4)
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

      if (loc) {
        const anotherPlayer = loc
          .getTroops()
          .filter(troop => Boolean(troop.owner))
          .filter(troop => game.players.byOwner(troop) !== player)
          .length > 0
        if (anotherPlayer) {
          player.incrementCounter('influence', 2)
        }
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
          player.incrementCounter('points', game.getControlMarkers(player).length)
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
      "You may devour up to three cards in the market."
    ],
    impl: (game, player) => {
      player.incrementCounter('influence', 2)
      game.aChooseAndDevourMarket(player, { max: 3 })
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
      game.aChooseAndMoveTroop(player)
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
    autoplay: true,
    text: [
      "+1 influence",
      "At end of turn, promote another card played this turn."
    ],
    impl: (game, player, { card }) => {
      player.incrementCounter('influence', 1)
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
      player.incrementCounter('influence', 3)
      game.aChooseAndReturn(player, { noWhite: true })
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
    autoplay: true,
    text: [
      "At end of turn, promote up to 2 other cards played this turn, then gain 1 VP for every 3 cards in your inner circle."
    ],
    impl: (game, player, { card }) => {
      game.aDeferPromotion(player, card, { optional: true })
      game.aDeferPromotion(player, card, { optional: true })
      game.aDeferSpecial(player, card, (game, player) => {
        const innerCircle = game.cards.byPlayer(player, 'innerCircle').length
        player.incrementCounter('points', Math.floor(innerCircle / 3))
      })
    }
  }
]

module.exports = {
  cardData
}
