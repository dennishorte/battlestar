const util = require('../../../lib/util.js')


const cardData = [
  {
    "name": "Banshee",
    "aspect": "guile",
    "race": "undead",
    "expansion": "undead",
    "cost": 4,
    "points": 2,
    "innerPoints": 4,
    "count": 2,
    "text": [
      "Place a spy. If another player's spy is at that site, gain 3 power."
    ],
    impl: (game, player) => {
      const loc = game.aChooseAndPlaceSpy(player)
      const enemySpies = loc
        .getSpies()
        .filter(spy => spy.owner !== player)
      if (enemySpies.length > 0) {
        player.incrementCounter('power', 3)
      }
    },
  },
  {
    "name": "Carrion Crawler",
    "aspect": "malice",
    "race": "monstrosity",
    "expansion": "undead",
    "cost": 2,
    "points": 0,
    "innerPoints": 2,
    "count": 2,
    "text": [
      "+3 power.",
      "Devour a card in the market. Instead of replacing it with the top card from the market deck, replace it with this card."
    ],
    impl: (game, player, { card }) => {
      player.incrementCounter('power', 3)

      const marketCards = game.zones.byId('market').cards()
      const toDevour = game.actions.chooseCard(player, marketCards)
      game.aDevour(player, toDevour, { noRefill: true })
      game.log.add({
        template: '{player} returns Carrion Crawler to the market',
        args: { player }
      })
      card.moveTo(game.zones.byId('market'), 0)
    }
  },
  {
    "name": "Conjurer",
    "aspect": "guile",
    "race": "human",
    "expansion": "undead",
    "cost": 5,
    "points": 2,
    "innerPoints": 3,
    "count": 3,
    "text": [
      "Choose one:",
      //      "- Place a spy.",
      "- Place two spies.",
      "- Return one of your spies > Recruit up to 2 cards that each cost 3 or less without paying their costs."
    ],
    impl: (game, player) => {
      game.aChooseOne(player, [
        {
          title: 'Place two spies',
          impl: (game, player) => {
            game.aChooseAndPlaceSpy(player)
            game.aChooseAndPlaceSpy(player)
          }
        },
        {
          title: 'Return one of your spies > Recruit up to 2 cards that each cost 3 or less without paying their costs',
          impl: (game, player) => game.aReturnASpyAnd(player, (game, player) => {
            for (let i = 0; i < 2; i++) {
              game.aChooseAndRecruit(player, 3)
            }
          })
        },
      ])
    },
  },
  {
    "name": "Cultist of Myrkul",
    "aspect": "ambition",
    "race": "human",
    "expansion": "undead",
    "cost": 2,
    "points": 1,
    "innerPoints": 2,
    "count": 3,
    "text": [
      "Choose one:",
      "- +2 influence.",
      "- Devour this card > At end of turn, promote up to 2 other cards played this turn."
    ],
    impl: (game, player, { card }) => {
      game.aChooseOne(player, [
        {
          title: '+2 influence',
          impl: (game, player) => {
            player.incrementCounter('influence', 2)
          }
        },
        {
          title: 'Devour this card > At end of turn, promote up to 2 other cards played this turn',
          impl: (game, player) => {
            // Just assume they actually want to devour this card if they took this choice.
            game.aDevour(player, card)
            game.aDeferPromotion(player, card)
            game.aDeferPromotion(player, card)
          }
        },
      ])
    },
  },
  {
    "name": "Death Knight",
    "aspect": "malice",
    "race": "undead",
    "expansion": "undead",
    "cost": 6,
    "points": 3,
    "innerPoints": 7,
    "count": 1,
    "text": [
      "Supplant a troop.",
      "Gain 1 VP for every 5 player troops in your trophy hall."
    ],
    impl: (game, player) => {
      game.aChooseAndSupplant(player)

      const playerTroops = game
        .cards.byPlayer(player, 'trophyHall')
        .filter(card => card.getOwnerName() !== 'neutral')
        .length

      player.incrementCounter('points', Math.floor(playerTroops / 5))
    },
  },
  {
    "name": "Flesh Golem",
    "aspect": "malice",
    "race": "construct",
    "expansion": "undead",
    "cost": 3,
    "points": 1,
    "innerPoints": 3,
    "count": 2,
    "text": [
      "+2 power.",
      "Devour this card > Assassinate a troop."
    ],
    impl: (game, player, { card }) => {
      player.incrementCounter('power', 2)
      game.aDevourThisAnd(
        player,
        card,
        'Devour this card > Assassinate a troop',
        () => game.aChooseAndAssassinate(player)
      )
    },
  },
  {
    "name": "Ghost",
    "aspect": "guile",
    "race": "undead",
    "expansion": "undead",
    "cost": 3,
    "points": 2,
    "innerPoints": 3,
    "count": 2,
    "text": [
      "Choose one:",
      //      "- Place a spy.",
      //      "- Return one of your spies > For the rest of your turn treat the top card of the devoured deck as if it was in the market."
      "- Place a spy. For the rest of your turn treat the top card of the devoured deck as if it was in the market.",
      "- Return one of your spies > You may devour a card in your discard pile. If you do, gain the effects of the devoured card.",
    ],
    impl: (game, player) => {
      game.aChooseOne(player, [
        {
          title: 'Place a spy; for the rest of your turn treat the top card of the devoured deck as if it was in the market',
          impl: () => {
            game.aChooseAndPlaceSpy(player)
            game.mSetGhostFlag()
          }
        },
        {
          title: 'Return one of your spies > You may devour a card in your discard pile; if you do, gain the effects of the devoured card',
          impl: () => {
            game.aReturnASpyAnd(player, () => {
              const discard = game.cards.byPlayer(player, 'discard')
              const card = game.actions.chooseCard(player, discard, {
                title: 'Choose a card to devour',
                min: 0,
              })
              if (card) {
                game.aDevour(player, card)
                game.mExecuteCard(player, card)
              }
            })
          },
        },

        /* {
         *   title: 'Place a spy',
         *   impl: () => {
         *     game.aChooseAndPlaceSpy(player)
         *   }
         * },
         * {
         *   title: 'Return one of your spies > For the rest of your turn treat the top card of the devoured deck as if it was in the market',
         *   impl: () => game.aReturnASpyAnd(player, () => {
         *     game.mSetGhostFlag()
         *   })
         * }, */
      ])
    },
  },
  {
    "name": "High Priest of Myrkul",
    "aspect": "ambition",
    "race": "human",
    "expansion": "undead",
    "cost": 6,
    "points": 3,
    "innerPoints": 6,
    "count": 1,
    "text": [
      // "Return another player's troop or spy."
      // "At end of turn, you may promote any number of undead cards played this turn."

      "Choose one:",
      "- Return another player's troop or spy.",
      "- Undead cascade 4.",
      "At end of turn, you may promote any number of undead cards played this turn."
    ],
    impl: (game, player, { card }) => {
      game.aChooseOne(player, [
        {
          title: "Return another player's troop or spy",
          impl: () => {
            game.aChooseAndReturn(player, { noWhite: true })
          }
        },
        {
          title: "Undead cascade 4",
          impl: () => {
            game.aCascade(player, {
              maxCost: 4,
              key: 'race',
              value: 'undead',
            })
          }
        }
      ])
      game.aDeferPromotionSpecial(player, card)
    },
  },
  {
    "name": "Lich",
    "aspect": "guile",
    "race": "undead",
    "expansion": "undead",
    "cost": 7,
    "points": 4,
    "innerPoints": 7,
    "count": 1,
    "text": [
      "Place a spy. If another player's troop is at that site, take up to 2 troops from their trophy hall and deploy them."
    ],
    impl: (game, player) => {
      const loc = game.aChooseAndPlaceSpy(player)
      const otherPlayers = loc
        .getTroops()
        .filter(troop => troop.isOtherPlayer(player))
        .map(troop => troop.owner)
      const otherPlayersDistinct = util.array.distinct(otherPlayers)

      if (otherPlayersDistinct.length > 0) {
        const targetPlayer = game.actions.choosePlayer(player, otherPlayersDistinct, {
          title: 'Choose a player whose dead you will raise'
        })

        if (targetPlayer) {
          const troopZone = game.zones.byPlayer(targetPlayer, 'trophyHall')
          const choices = troopZone.cards().map(troop => troop.getOwnerName()).sort()
          const selections = game.actions.choose(player, choices, {
            title: 'Choose up to 2 troops to reanimate',
            min: 0,
            max: 2,
          })

          for (const selection of selections) {
            const troop = troopZone.cards().find(c => c.getOwnerName() === selection)
            game.aChooseAndDeploy(player, { troop })
          }
        }
      }
      else {
        game.log.add({
          template: 'The chosen site has no enemy player troops.'
        })
      }
    },
  },
  {
    "name": "Minotaur Skeleton",
    "aspect": "conquest",
    "race": "undead",
    "expansion": "undead",
    "cost": 3,
    "points": 1,
    "innerPoints": 3,
    "count": 2,
    "text": [
      "Choose one:",
      "- Deploy 3 troops.",
      "- Devour this card > Assassinate up to three white troops at a single site."
    ],
    impl: (game, player, { card }) => {
      game.aChooseOne(player, [
        {
          title: 'Deploy 3 troops',
          impl: () => {
            game.aChooseAndDeploy(player)
            game.aChooseAndDeploy(player)
            game.aChooseAndDeploy(player)
          }
        },
        {
          title: 'Devour this card > Assassinate up to three white troops at a single site',
          impl: () => {
            game.aDevour(player, card)
            const loc = game.aChooseLocation(player, game.getPresence(player))
            if (loc) {
              const troops = loc.getTroops().filter(troop => troop.isNeutral())
              const chosen = game.actions.choose(player, troops.map(() => 'neutral'), {
                title: 'Choose which troops to deploy your Minotaur Skeleton against',
                min: 0,
                max: 3,
              })
              for (let i = 0; i < chosen.length; i++) {
                game.aAssassinate(player, loc, 'neutral')
              }
            }
          }
        },
      ])
    },
  },
  {
    "name": "Mummy Lord",
    "aspect": "conquest",
    "race": "undead",
    "expansion": "undead",
    "cost": 6,
    "points": 3,
    "innerPoints": 6,
    "count": 1,
    "text": [
      "Choose 2 times:",
      "- Assassinate a white troop.",
      "- Take a white troop from any trophy hall and deploy it anywhere on the board."
    ],
    impl: (game, player) => {
      for (let i = 0; i < 2; i++) {
        game.aChooseOne(player, [
          {
            title: 'Assassinate a white troop',
            impl: () => game.aChooseAndAssassinate(player, { whiteOnly: true })
          },
          {
            title: 'Take a white troop from any trophy hall and deploy it anywhere on the board',
            impl: () => {
              const players = game
                .players.all()
                .filter(p => game
                  .cards.byPlayer(p, 'trophyHall')
                  .some(troop => troop.isNeutral())
                )
              const targetPlayer = game.actions.choosePlayer(player, players)
              if (targetPlayer) {
                const troop = game
                  .cards.byPlayer(targetPlayer, 'trophyHall')
                  .find(troop => troop.isNeutral())
                game.aChooseAndDeploy(player, {
                  anywhere: true,
                  troop,
                })
              }
            }
          },
        ])
      }
    },
  },
  {
    "name": "Necromancer",
    "aspect": "ambition",
    "race": "human",
    "expansion": "undead",
    "cost": 5,
    "points": 1,
    "innerPoints": 4,
    "count": 2,
    "text": [
      "Choose one:",
      "- +3 influence.",
      "- Promote this card, or a card from your hand or discard pile."
    ],
    impl: (game, player, { card }) => {
      game.aChooseOne(player, [
        {
          title: '+3 influence',
          impl: () => {
            player.incrementCounter('influence', 3)
          }
        },
        {
          title: 'Promote this card, or a card from your hand or discard pile',
          impl: () => {
            const choices = [{
              title: 'this card',
              choices: [card.name],
              min: 0,
              max: 1,
            }]

            if (game.cards.byPlayer(player, 'hand').length > 0) {
              choices.push({
                title: 'hand',
                choices: game.cards.byPlayer(player, 'hand').map(c => c.name),
                min: 0,
                max: 1,
              })
            }

            if (game.cards.byPlayer(player, 'discard').length > 0) {
              choices.push({
                title: 'discard',
                choices: game.cards.byPlayer(player, 'discard').map(c => c.name),
                min: 0,
                max: 1,
              })
            }

            const selection = game.actions.choose(player, choices, { title: 'Choose a card to promote' })[0]

            if (selection.title === 'this card') {
              game.aPromote(player, card)
            }

            else {
              const zone = game.zones.byPlayer(player, selection.title)
              const card = zone.cards().find(c => c.name === selection.selection[0])
              game.aPromote(player, card)
            }
          }
        },
      ])
    },
  },
  {
    "name": "Ogre Zombie",
    "aspect": "conquest",
    "race": "undead",
    "expansion": "undead",
    "cost": 4,
    "points": 2,
    "innerPoints": 4,
    "count": 2,
    "text": [
      "Supplant a white troop anywhere on the board."
    ],
    impl: (game, player) => {
      game.aChooseAndSupplant(player, { whiteOnly: true, anywhere: true })
    },
  },
  {
    "name": "Ravenous Zombies",
    "aspect": "conquest",
    "race": "undead",
    "expansion": "undead",
    "cost": 3,
    "points": 1,
    "innerPoints": 2,
    "count": 2,
    "text": [
      "+1 power.",
      "Assassinate a white troop."
    ],
    impl: (game, player) => {
      player.incrementCounter('power', 1)
      game.aChooseAndAssassinate(player, { whiteOnly: true })
    },
  },
  {
    "name": "Revenant",
    "aspect": "malice",
    "race": "undead",
    "expansion": "undead",
    "cost": 4,
    "points": 1,
    "innerPoints": 4,
    "count": 1,
    "text": [
      "Assassinate two troops. Then, if you have 8 or more troops in your trophy hall, promote this card."
    ],
    impl: (game, player, { card }) => {
      game.aChooseAndAssassinate(player)
      game.aChooseAndAssassinate(player)

      if (game.cards.byPlayer(player, 'trophyHall').length >= 8) {
        game.aPromote(player, card)
      }
    },
  },
  {
    "name": "Skeletal Horde",
    "aspect": "conquest",
    "race": "undead",
    "expansion": "undead",
    "cost": 2,
    "points": 1,
    "innerPoints": 2,
    "count": 3,
    "text": [
      "Deploy 2 troops.",
      "Devour this card > Deploy 3 troops."
    ],
    impl: (game, player, { card }) => {
      game.aChooseAndDeploy(player)
      game.aChooseAndDeploy(player)

      const doDevour = game.actions.chooseYesNo(player, 'Devour Skeletal Horde to deploy 3 more troops?')
      if (doDevour) {
        game.aDevour(player, card)
        game.aChooseAndDeploy(player)
        game.aChooseAndDeploy(player)
        game.aChooseAndDeploy(player)
      }
    },
  },
  {
    "name": "Vampire Spawn",
    "aspect": "ambition",
    "race": "undead",
    "expansion": "undead",
    "cost": 2,
    "points": 1,
    "innerPoints": 3,
    "count": 3,
    "text": [
      "+1 influence.",
      "Return another player's troop or spy."
    ],
    impl: (game, player) => {
      player.incrementCounter('influence', 1)
      game.aChooseAndReturn(player, { noWhite: true })
    },
  },
  {
    "name": "Vampire",
    "aspect": "ambition",
    "race": "undead",
    "expansion": "undead",
    "cost": 7,
    "points": 4,
    "innerPoints": 7,
    "count": 1,
    "text": [
      "Choose one:",
      "- Supplant a troop.",
      "- Promote a card from your discard pile, then gain 1 VP for every 3 cards in your inner circle."
    ],
    impl: (game, player) => {
      game.aChooseOne(player, [
        {
          title: 'Supplant a troop',
          impl: () => {
            game.aChooseAndSupplant(player)
          }
        },
        {
          title: 'Promote a card from your discard pile, then gain 1 VP for every 3 cards in your inner circle',
          impl: () => {
            game.aChooseAndPromote(player, game.cards.byPlayer(player, 'discard'))
            const innerCircle = game.cards.byPlayer(player, 'innerCircle').length
            player.incrementCounter('points', Math.floor(innerCircle / 3))
          }
        },
      ])
    },
  },
  {
    "name": "Wight",
    "aspect": "malice",
    "race": "undead",
    "expansion": "undead",
    "cost": 4,
    "points": 1,
    "innerPoints": 3,
    "count": 4,
    "text": [
      "Choose one:",
      "- +2 power.",
      "- Devour a card in your hand > Supplant a troop."
    ],
    impl: (game, player) => {
      game.aChooseOne(player, [
        {
          title: '+2 power',
          impl: () => {
            player.incrementCounter('power', 2)
          }
        },
        {
          title: 'Devour a card in your hand > Supplant a troop',
          impl: () => {
            const card = game.actions.chooseCard(player, game.cards.byPlayer(player, 'hand'), {
              title: 'Choose a card to feed to your wight',
              min: 0,
              max: 1,
            })
            if (card) {
              game.aDevour(player, card)
              game.aChooseAndSupplant(player)
            }
          }
        },
      ])
    },
  },
  {
    "name": "Wraith",
    "aspect": "guile",
    "race": "undead",
    "expansion": "undead",
    "cost": 2,
    "points": 0,
    "innerPoints": 1,
    "count": 2,
    "text": [
      "Place a spy.",
      "Devour this card > Assassinate a troop at that spy's site."
    ],
    impl: (game, player, { card }) => {
      const loc = game.aChooseAndPlaceSpy(player)

      if (loc) {
        const doDevour = game.actions.chooseYesNo(player, `Devour this wraith to assassinate a troop at ${loc.name}`)
        if (doDevour) {
          game.aDevour(player, card)
          game.aChooseAndAssassinate(player, { loc })
        }
      }
    },
  }
]

module.exports = {
  cardData,
}
