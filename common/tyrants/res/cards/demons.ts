import util from '../../../lib/util.js'
import type { CardData } from './base.js'

const cardData: CardData[] = [
  {
    "name": "Ghoul",
    "aspect": "malice",
    "race": "undead",
    "expansion": "demons",
    "cost": 4,
    "points": 2,
    "innerPoints": 4,
    "count": 3,
    autoplay: true,
    "text": [
      "+2 power",
      "Each opponent recruits an Insane Outcast"
    ],
    impl: (game, player) => {
      player.incrementCounter('power', 2)
      for (const opp of game.players.opponents(player)) {
        game.aRecruit(opp, 'Insane Outcast', { noCost: true })
      }
    },
  },
  {
    "name": "Mind Flayer",
    "aspect": "malice",
    "race": "illithid",
    "expansion": "demons",
    "cost": 3,
    "points": 1,
    "innerPoints": 3,
    "count": 3,
    "text": [
      "Devour a card in your hand > Choose one:",
      "- +3 influence",
      "- Assassinate a troop"
    ],
    impl: (game, player) => {
      game.aChooseAndDevour(player, {
        then: () => game.aChooseOne(player, [
          {
            title: '+3 influence',
            impl: (game: any, player: any) => player.incrementCounter('influence', 3)
          },
          {
            title: 'Assassinate a troop',
            impl: (game: any, player: any) => game.aChooseAndAssassinate(player)
          }
        ])
      })
    },
  },
  {
    "name": "Glavrezu",
    "aspect": "malice",
    "race": "fiend",
    "expansion": "demons",
    "cost": 5,
    "points": 2,
    "innerPoints": 4,
    "count": 1,
    "text": [
      "Devour a card in your hand > Assassinate 2 troops."
    ],
    impl: (game, player) => {
      game.aChooseAndDevour(player, {
        then: () => {
          game.aChooseAndAssassinate(player)
          game.aChooseAndAssassinate(player)
        }
      })
    },
  },
  {
    "name": "Marilith",
    "aspect": "malice",
    "race": "fiend",
    "expansion": "demons",
    "cost": 6,
    "points": 2,
    "innerPoints": 5,
    "count": 2,
    "text": [
      "Devour a card in your hand > +5 power"
    ],
    impl: (game, player) => {
      game.aChooseAndDevour(player, {
        then: () => player.incrementCounter('power', 5)
      })
    },
  },
  {
    "name": "Orcus",
    "aspect": "malice",
    "race": "fiend",
    "expansion": "demons",
    "cost": 8,
    "points": 5,
    "innerPoints": 10,
    "count": 1,
    "text": [
      "Devour a card in your hand > Assassinate 2 troops. Then you may take up to 2 troops from any trophy halls and deploy them anywhere on the board."
    ],
    impl: (game, player) => {
      game.aChooseAndDevour(player, {
        then: () => {
          // Assassinate two troops.
          game.aChooseAndAssassinate(player)
          game.aChooseAndAssassinate(player)

          // Select two troops from any trophy halls.
          const choices = game
            .players.all()
            .flatMap((player: any) => {
              const trophies = game
                .cards.byPlayer(player, 'trophyHall')
                .map((troop: any) => troop.getOwnerName())
              return trophies.map((ownerName: any) => `${player.name}: ${ownerName}`)
            })
            .sort()

          const selected = game.actions.choose(player, choices, {
            title: `Choose up to two trophies to deploy`,
            min: 0,
            max: 2,
          })

          for (const selection of selected) {
            const [trophyName, ownerName] = selection.split(': ')
            const trophyPlayer = game.players.byName(trophyName)
            const troop = game
              .cards.byPlayer(trophyPlayer, 'trophyHall')
              .find((c: any) => c.getOwnerName() === ownerName)
            game.aChooseAndDeploy(player, {
              troop,
              anywhere: true,
            })
          }
        }
      })
    },
  },
  {
    "name": "Gibbering Mouther",
    "aspect": "conquest",
    "race": "aberration",
    "expansion": "demons",
    "cost": 2,
    "points": 1,
    "innerPoints": 3,
    "count": 3,
    "text": [
      "Deploy 2 troops, then choose an opponent with a troop adjacent to at least 1 of them. He or she recruits an Insane Outcast."
    ],
    impl: (game, player) => {
      const loc1 = game.aChooseAndDeploy(player)
      const loc2 = game.aChooseAndDeploy(player)

      // Get locations and adjacent locations of deployed troops
      const locs = [loc1, loc2].filter((l: any) => Boolean(l))
      const neighbors = locs.flatMap((l: any) => game.getLocationNeighbors(l))
      const combined = util.array.distinct(locs.concat(neighbors))

      // Get all opponents at the locations
      const opponents = util
        .array
        .distinct(combined.flatMap((loc: any) => loc.cardlist().map((troop: any) => troop.getOwnerName())))
        .filter((name: any) => name !== 'neutral')
        .map((name: any) => game.players.byName(name))
        .filter((p: any) => p !== player)

      const opponent = game.actions.choosePlayer(player, opponents)
      if (opponent) {
        game.aRecruit(opponent, 'Insane Outcast', { noCost: true })
      }
    },
  },
  {
    "name": "Derro",
    "aspect": "conquest",
    "race": "derro",
    "expansion": "demons",
    "cost": 3,
    "points": 1,
    "innerPoints": 4,
    "count": 2,
    "text": [
      "Supplant a white troop anywhere on the board. You recruit an Insane Outcast.",
      "Insane Outcast Focus: Draw a card",
    ],
    impl: (game, player) => {
      game.aChooseAndSupplant(player, {
        whiteOnly: true,
        anywhere: true,
      })
      game.aRecruit(player, 'Insane Outcast', { noCost: true })
      game.aWithFocusInsaneOutcast(player, () => game.aDraw(player))
    },
  },
  {
    "name": "Ettin",
    "aspect": "conquest",
    "race": "giant",
    "expansion": "demons",
    "cost": 4,
    "points": 1,
    "innerPoints": 2,
    "count": 3,
    "text": [
      "Choose one:",
      "- Deploy 3 troops.",
      "- Assassinate 2 white troops."
    ],
    impl: (game, player) => {
      game.aChooseOne(player, [
        {
          title: 'Deploy 3 troops',
          impl: (game: any, player: any) => {
            game.aChooseAndDeploy(player)
            game.aChooseAndDeploy(player)
            game.aChooseAndDeploy(player)
          }
        },
        {
          title: 'Assassinate 2 white troops',
          impl: (game: any, player: any) => {
            game.aChooseAndAssassinate(player, { whiteOnly: true })
            game.aChooseAndAssassinate(player, { whiteOnly: true })
          }
        }
      ])
    },
  },
  {
    "name": "Balor",
    "aspect": "conquest",
    "race": "fiend",
    "expansion": "demons",
    "cost": 6,
    "points": 3,
    "innerPoints": 6,
    "count": 1,
    "text": [
      "Devour a card in your hand > Supplant a white troop anywhere on the board. Then deploy a white troop."
    ],
    impl: (game, player) => {
      game.aChooseAndDevour(player, {
        then: () => {
          game.aChooseAndSupplant(player, {
            whiteOnly: true,
            anywhere: true,
          })
          game.aChooseAndDeploy(player, {
            white: true,
          })
        }
      })
    },
  },
  {
    "name": "Demogorgon",
    "aspect": "conquest",
    "race": "fiend",
    "expansion": "demons",
    "cost": 8,
    "points": 5,
    "innerPoints": 10,
    "count": 1,
    "text": [
      "Devour a card in your hand > Supplant 2 white troops. Each opponent recruits 2 Insane Outcasts."
    ],
    impl: (game, player) => {
      game.aChooseAndDevour(player, {
        then: () => {
          game.aChooseAndSupplant(player, { whiteOnly: true })
          game.aChooseAndSupplant(player, { whiteOnly: true })

          for (const opp of game.players.opponents(player)) {
            game.aRecruit(opp, 'Insane Outcast', { noCost: true })
            game.aRecruit(opp, 'Insane Outcast', { noCost: true })
          }
        },
      })
    },
  },
  {
    "name": "Night Hag",
    "aspect": "guile",
    "race": "fiend",
    "expansion": "demons",
    "cost": 3,
    "points": 1,
    "innerPoints": 3,
    "count": 3,
    "text": [
      "Choose one:",
      "- Place a spy",
      "- Return one of your spies > Draw 2 cards."
    ],
    impl: (game, player) => {
      game.aChooseOne(player, [
        {
          title: 'Place a spy',
          impl: (game: any, player: any) => game.aChooseAndPlaceSpy(player)
        },
        {
          title: 'Return one of your spies > Draw 2 cards',
          impl: (game: any, player: any) => {
            game.aReturnASpyAnd(player, (game: any, player: any) => {
              game.aDraw(player)
              game.aDraw(player)
            })
          }
        },
      ])
    },
  },
  {
    "name": "Jackalwere",
    "aspect": "guile",
    "race": "shapechanger",
    "expansion": "demons",
    "cost": 4,
    "points": 2,
    "innerPoints": 4,
    "count": 3,
    "text": [
      "Choose one:",
      "- Place a spy",
      "- Return one of your spies > +2 power, +2 influence"
    ],
    impl: (game, player) => {
      game.aChooseOne(player, [
        {
          title: 'Place a spy',
          impl: (game: any, player: any) => game.aChooseAndPlaceSpy(player)
        },
        {
          title: 'Return one of your spies > +2 power, +2 influence',
          impl: (game: any, player: any) => {
            game.aReturnASpyAnd(player, (game: any, player: any) => {
              player.incrementCounter('influence', 2)
              player.incrementCounter('power', 2)
            })
          }
        },
      ])
    },
  },
  {
    "name": "Succubus",
    "aspect": "guile",
    "race": "fiend",
    "expansion": "demons",
    "cost": 5,
    "points": 2,
    "innerPoints": 5,
    "count": 2,
    "text": [
      "Devour a card in your hand > Place a spy, then assassinate a troop at that spy's site."
    ],
    impl: (game, player) => {
      game.aChooseAndDevour(player, {
        then: () => {
          const loc = game.aChooseAndPlaceSpy(player)
          if (loc) {
            game.aChooseAndAssassinate(player, { loc })
          }
        }
      })
    },
  },
  {
    "name": "Vrock",
    "aspect": "guile",
    "race": "fiend",
    "expansion": "demons",
    "cost": 5,
    "points": 2,
    "innerPoints": 4,
    "count": 1,
    "text": [
      "Choose one:",
      "- Place a spy.",
      "- Return one of your spies > +5 power"
    ],
    impl: (game, player) => {
      game.aChooseOne(player, [
        {
          title: 'Place a spy',
          impl: (game: any, player: any) => game.aChooseAndPlaceSpy(player)
        },
        {
          title: 'Return one of your spies > +5 power',
          impl: (game: any, player: any) => {
            game.aReturnASpyAnd(player, (game: any, player: any) => {
              player.incrementCounter('power', 5)
            })
          }
        },
      ])
    },
  },
  {
    "name": "Graz'zt",
    "aspect": "guile",
    "race": "fiend",
    "expansion": "demons",
    "cost": 6,
    "points": 2,
    "innerPoints": 5,
    "count": 1,
    "text": [
      "Choose one:",
      "- Place 2 spies.",
      "- Return any number of your spies > Supplant a troop at each of the returned spies' sites."
    ],
    impl: (game, player) => {
      game.aChooseOne(player, [
        {
          title: 'Place 2 spies',
          impl: (game: any, player: any) => {
            game.aChooseAndPlaceSpy(player)
            game.aChooseAndPlaceSpy(player)
          }
        },
        {
          title: "Return any number of your spies > Supplant a troop at each of the returned spies' sites",
          impl: (game: any, player: any) => {
            while (true) {
              let returned = false
              game.aReturnASpyAnd(player, (game: any, player: any, { loc }: { loc: any }) => {
                if (loc) {
                  returned = true
                  game.aChooseAndSupplant(player, { loc })
                }
              })

              if (!returned) {
                break
              }
            }
          }
        },
      ])
    },
  },
  {
    "name": "Myconid Adult",
    "aspect": "ambition",
    "race": "myconid",
    "expansion": "demons",
    "cost": 3,
    "points": 1,
    "innerPoints": 3,
    "count": 3,
    "text": [
      "+2 influence",
      "Choose an opponent. He or she recruits an Insane Outcast."
    ],
    impl: (game, player) => {
      player.incrementCounter('influence', 2)
      const opp = game.actions.choosePlayer(player, game.players.opponents(player))
      if (opp) {
        game.aRecruit(opp, 'Insane Outcast', { noCost: true })
      }
    },
  },
  {
    "name": "Nalfeshnee",
    "aspect": "ambition",
    "race": "fiend",
    "expansion": "demons",
    "cost": 5,
    "points": 2,
    "innerPoints": 5,
    "count": 2,
    autoplay: true,
    "text": [
      "+3 influence",
      "Promote the top card of your deck."
    ],
    impl: (game, player) => {
      player.incrementCounter('influence', 3)
      game.aPromoteTopCard(player)
    },
  },
  {
    "name": "Hezrou",
    "aspect": "ambition",
    "race": "fiend",
    "expansion": "demons",
    "cost": 3,
    "points": 1,
    "innerPoints": 3,
    "count": 2,
    "text": [
      "Move an enemy troop.",
      "Promote the top card of your deck."
    ],
    impl: (game, player) => {
      game.aChooseAndMoveTroop(player)
      game.aPromoteTopCard(player)
    },
  },
  {
    "name": "Myconid Sovereign",
    "aspect": "ambition",
    "race": "myconid",
    "expansion": "demons",
    "cost": 4,
    "points": 2,
    "innerPoints": 5,
    "count": 2,
    "text": [
      "Choose an opponent. He or she recruits an Insane Outcast.",
      "At end of turn, promote another card played this turn."
    ],
    impl: (game, player, { card }) => {
      const opp = game.actions.choosePlayer(player, game.players.opponents(player))
      if (opp) {
        game.aRecruit(opp, 'Insane Outcast', { noCost: true })
        game.aDeferPromotion(player, card)
      }
    },
  },
  {
    "name": "Zuggtmoy",
    "aspect": "ambition",
    "race": "fiend",
    "expansion": "demons",
    "cost": 6,
    "points": 3,
    "innerPoints": 6,
    "count": 1,
    "text": [
      "Devour a card in your inner circle > +3 influence and at end of turn, promote up to 2 other cards played this turn."
    ],
    impl: (game, player, { card }) => {
      game.aChooseAndDevour(player, {
        zone: 'innerCircle',
        then: () => {
          player.incrementCounter('influence', 3)
          game.aDeferPromotion(player, card, { optional: true })
          game.aDeferPromotion(player, card, { optional: true })
        }
      })
    },
  }
]

export { cardData }
