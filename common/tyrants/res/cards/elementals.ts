import type { CardData } from './base.js'

const cardData: CardData[] = [
  {
    "name": "Eternal Flame Cultist",
    "aspect": "malice",
    "race": "human",
    "expansion": "elementals",
    "cost": 4,
    "points": 2,
    "innerPoints": 4,
    "count": 3,
    "text": [
      "Assassinate a troop",
      "Malice Focus > +2 power"
    ],
    impl: (game, player) => {
      game.aChooseAndAssassinate(player)
      game.aWithFocusAspect(player, 'malice', () => {
        player.incrementCounter('power', 2)
      })
    },
  },
  {
    "name": "Fire Elemental",
    "aspect": "malice",
    "race": "elemental",
    "expansion": "elementals",
    "cost": 3,
    "points": 1,
    "innerPoints": 3,
    "count": 3,
    "text": [
      "Choose one:",
      "- +2 power",
      "- +2 influence",
      "Malice focus > Draw a card"
    ],
    impl: (game, player) => {
      game.aChooseOne(player, [
        {
          title: '+2 power',
          impl: (game: any, player: any) => player.incrementCounter('power', 2),
        },
        {
          title: '+2 influence',
          impl: (game: any, player: any) => player.incrementCounter('influence', 2),
        },
      ])
      game.aWithFocusAspect(player, 'malice', () => {
        game.aDraw(player)
      })
    },
  },
  {
    "name": "Fire Elemental Myrmidon",
    "aspect": "malice",
    "race": "elemental",
    "expansion": "elementals",
    "cost": 4,
    "points": 1,
    "innerPoints": 3,
    "count": 2,
    autoplay: true,
    "text": [
      "+2 power",
      "At end of turn, promote an Obedience card played this turn"
    ],
    impl: (game, player, { card }) => {
      player.incrementCounter('power', 2)
      game.aDeferPromotionAspect(player, card, 'obedience')
    }
  },
  {
    "name": "Vanifer",
    "aspect": "malice",
    "race": "tiefling",
    "expansion": "elementals",
    "cost": 5,
    "points": 2,
    "innerPoints": 5,
    "count": 1,
    "text": [
      "Assassinate a troop",
      "Recruit a Malice card that costs 4 or less without paying its cost"
    ],
    impl: (game, player) => {
      game.aChooseAndAssassinate(player)
      game.aChooseAndRecruit(player, 4, { aspect: 'malice' })
    }
  },
  {
    "name": "Imix",
    "aspect": "malice",
    "race": "elemental prince",
    "expansion": "elementals",
    "cost": 6,
    "points": 3,
    "innerPoints": 6,
    "count": 1,
    autoplay: true,
    "text": [
      "+4 power",
      "Malice Focus > +2 power"
    ],
    impl: (game, player) => {
      player.incrementCounter('power', 4)
      game.aWithFocusAspect(player, 'malice', () => {
        player.incrementCounter('power', 2)
      })
    }
  },
  {
    "name": "Crushing Wave Cultist",
    "aspect": "conquest",
    "race": "human",
    "expansion": "elementals",
    "cost": 3,
    "points": 1,
    "innerPoints": 4,
    "count": 3,
    "text": [
      "Assassinate a white troop",
      "Conquest Focus > Deploy 2 troops"
    ],
    impl: (game, player) => {
      game.aChooseAndAssassinate(player, { whiteOnly: true })
      game.aWithFocusAspect(player, 'conquest', () => {
        game.aChooseAndDeploy(player)
        game.aChooseAndDeploy(player)
      })
    }
  },
  {
    "name": "Water Elemental",
    "aspect": "conquest",
    "race": "elemental",
    "expansion": "elementals",
    "cost": 2,
    "points": 1,
    "innerPoints": 2,
    "count": 3,
    "text": [
      "Deploy 2 troops",
      "Conquest Focus > Draw a card"
    ],
    impl: (game, player) => {
      game.aChooseAndDeploy(player)
      game.aChooseAndDeploy(player)
      game.aWithFocusAspect(player, 'conquest', () => {
        game.aDraw(player)
      })
    }
  },
  {
    "name": "Water Elemental Myrmidon",
    "aspect": "conquest",
    "race": "elemental",
    "expansion": "elementals",
    "cost": 4,
    "points": 2,
    "innerPoints": 4,
    "count": 2,
    "text": [
      "Assassinate a white troop",
      "At end of turn, promote an Obedience card played this turn"
    ],
    impl: (game, player, { card }) => {
      game.aChooseAndAssassinate(player, { whiteOnly: true })
      game.aDeferPromotionAspect(player, card, 'obedience')
    }
  },
  {
    "name": "Gar Shatterkeel",
    "aspect": "conquest",
    "race": "human",
    "expansion": "elementals",
    "cost": 5,
    "points": 2,
    "innerPoints": 5,
    "count": 1,
    "text": [
      "Deploy 3 troops",
      "Recruit a Conquest card that costs 4 or less without paying its cost"
    ],
    impl: (game, player) => {
      game.aChooseAndDeploy(player)
      game.aChooseAndDeploy(player)
      game.aChooseAndDeploy(player)
      game.aChooseAndRecruit(player, 4, { aspect: 'conquest' })
    }
  },
  {
    "name": "Olhydra",
    "aspect": "conquest",
    "race": "elemental prince",
    "expansion": "elementals",
    "cost": 6,
    "points": 3,
    "innerPoints": 6,
    "count": 1,
    "text": [
      "Supplant a white troop anywhere on the board.",
      "Conquest Focus > Deploy 2 troops."
    ],
    impl: (game, player) => {
      game.aChooseAndSupplant(player, { whiteOnly: true, anywhere: true })
      game.aWithFocusAspect(player, 'conquest', () => {
        game.aChooseAndDeploy(player)
        game.aChooseAndDeploy(player)
      })
    }
  },
  {
    "name": "Air Elemental",
    "aspect": "guile",
    "race": "elemental",
    "expansion": "elementals",
    "cost": 3,
    "points": 1,
    "innerPoints": 2,
    "count": 4,
    "text": [
      "Choose one:",
      "- Place a spy",
      "- Return one of your spies > Deploy 3 troops",
      "Guile Focus > Draw a card"
    ],
    impl: (game, player) => {
      game.aChooseOne(player, [
        {
          title: 'Place a spy',
          impl: () => game.aChooseAndPlaceSpy(player)
        },
        {
          title: 'Return one of your spies > Deploy 3 troops',
          impl: () => {
            game.aReturnASpyAnd(player, () => {
              game.aChooseAndDeploy(player)
              game.aChooseAndDeploy(player)
              game.aChooseAndDeploy(player)
            })
          }
        },
      ])

      game.aWithFocusAspect(player, 'guile', () => {
        game.aDraw(player)
      })
    }
  },
  {
    "name": "Howling Hatred Cultist",
    "aspect": "guile",
    "race": "human",
    "expansion": "elementals",
    "cost": 3,
    "points": 1,
    "innerPoints": 3,
    "count": 2,
    "text": [
      "Choose one:",
      "- Place a spy",
      "- Return one of your spies > +3 influence",
      "Guile Focus > +1 power"
    ],
    impl: (game, player) => {
      game.aChooseOne(player, [
        {
          title: 'Place a spy',
          impl: () => game.aChooseAndPlaceSpy(player)
        },
        {
          title: 'Return one of your spies > +3 influence',
          impl: () => {
            game.aReturnASpyAnd(player, () => {
              player.incrementCounter('influence', 3)
            })
          }
        },
      ])

      game.aWithFocusAspect(player, 'guile', () => {
        player.incrementCounter('power', 1)
      })
    }
  },
  {
    "name": "Air Elemental Myrmidon",
    "aspect": "guile",
    "race": "elemental",
    "expansion": "elementals",
    "cost": 4,
    "points": 1,
    "innerPoints": 3,
    "count": 2,
    "text": [
      "Place a spy.",
      "At end of turn, promote an Obedience card played this turn."
    ],
    impl: (game, player, { card }) => {
      game.aChooseAndPlaceSpy(player)
      game.aDeferPromotionAspect(player, card, 'obedience')
    }
  },
  {
    "name": "Aerisi Kalinoth",
    "aspect": "guile",
    "race": "elf",
    "expansion": "elementals",
    "cost": 5,
    "points": 2,
    "innerPoints": 5,
    "count": 1,
    "text": [
      "+1 power",
      "Place a spy.",
      "Recruit a Guile card that costs 4 or less without paying its cost."
    ],
    impl: (game, player) => {
      player.incrementCounter('power', 1)
      game.aChooseAndPlaceSpy(player)
      game.aChooseAndRecruit(player, 4, { aspect: 'guile' })
    }
  },
  {
    "name": "Yan-C-Bin",
    "aspect": "guile",
    "race": "elemental prince",
    "expansion": "elementals",
    "cost": 6,
    "points": 3,
    "innerPoints": 6,
    "count": 1,
    "text": [
      "Place a spy, then assassinate a troop at that spy's site.",
      "Guile Focus > Place a spy"
    ],
    impl: (game, player) => {
      const loc = game.aChooseAndPlaceSpy(player)
      if (loc) {
        game.aChooseAndAssassinate(player, { loc })
      }

      game.aWithFocusAspect(player, 'guile', () => {
        game.aChooseAndPlaceSpy(player)
      })
    }
  },
  {
    "name": "Black Earth Cultist",
    "aspect": "ambition",
    "race": "human",
    "expansion": "elementals",
    "cost": 2,
    "points": 1,
    "innerPoints": 2,
    "count": 4,
    autoplay: true,
    "text": [
      "At end of turn, promote another card played this turn.",
      "Ambition Focus > +2 influence"
    ],
    impl: (game, player, { card }) => {
      game.aDeferPromotion(player, card)
      game.aWithFocusAspect(player, 'ambition', () => {
        player.incrementCounter('influence', 2)
      })
    }
  },
  {
    "name": "Earth Elemental",
    "aspect": "ambition",
    "race": "elemental",
    "expansion": "elementals",
    "cost": 3,
    "points": 1,
    "innerPoints": 3,
    "count": 2,
    "text": [
      "+1 influence",
      "Return another player's troop or spy.",
      "Ambition focus > Draw a card"
    ],
    impl: (game, player) => {
      player.incrementCounter('influence', 1)
      game.aChooseAndReturn(player, { noWhite: true })
      game.aWithFocusAspect(player, 'ambition', () => {
        game.aDraw(player)
      })
    }
  },
  {
    "name": "Earth Elemental Myrmidon",
    "aspect": "ambition",
    "race": "elemental",
    "expansion": "elementals",
    "cost": 4,
    "points": 2,
    "innerPoints": 4,
    "count": 2,
    autoplay: true,
    "text": [
      "+2 influence",
      "At end of turn, promote another card played this turn"
    ],
    impl: (game, player, { card }) => {
      player.incrementCounter('influence', 2)
      game.aDeferPromotion(player, card)
    }
  },
  {
    "name": "Marlos Urnrayle",
    "aspect": "ambition",
    "race": "medusa",
    "expansion": "elementals",
    "cost": 5,
    "points": 2,
    "innerPoints": 5,
    "count": 1,
    "text": [
      "At end of turn, promote another card played this turn.",
      "Recruit an Ambition card that costs 4 or less without paying its cost."
    ],
    impl: (game, player, { card }) => {
      game.aDeferPromotion(player, card)
      game.aChooseAndRecruit(player, 4, { aspect: 'ambition' })
    }
  },
  {
    "name": "Ogremoch",
    "aspect": "ambition",
    "race": "elemental prince",
    "expansion": "elementals",
    "cost": 6,
    "points": 3,
    "innerPoints": 7,
    "count": 1,
    autoplay: true,
    "text": [
      "+2 influence",
      "At end of turn, promote another card played this turn.",
      "Ambition Focus > At end of turn, promote another card played this turn."
    ],
    impl: (game, player, { card }) => {
      player.incrementCounter('influence', 2)
      game.aDeferPromotion(player, card)
      game.aWithFocusAspect(player, 'ambition', () => {
        game.aDeferPromotion(player, card)
      })
    }
  }
]

export { cardData }
