const util = require('../lib/util.js')


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
        player.incrementPower(3)
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
      player.incrementPower(3)

      const marketCards = game.getZoneById('market').cards()
      const toDevour = game.aChooseCard(player, marketCards)
      game.aDevour(player, toDevour, { noRefill: true })
      game.mMoveCardTo(card, game.getZoneById('market'), { destIndex: 0, verbose: true })
    },
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
      "- Place a spy.",
      "- Return one of your spies > Recruit up to 2 cards that each cost 3 or less without paying their costs."
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
            player.incrementInfluence(2)
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
        .getCardsByZone(player, 'trophyHall')
        .filter(card => card.getOwnerName() !== 'neutral')
        .length

      player.incrementPoints(Math.floor(playerTroops / 5))
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
      player.incrementPower(2)
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
    "points": 1,
    "innerPoints": 3,
    "count": 2,
    "text": [
      "Choose one:",
      "- Place a spy.",
      "- Return one of your spies > For the rest of your turn treat the top card of the devoured deck as if it was in the market."
    ],
    impl: (game, player) => {
      game.aChooseOne(player, [
        {
          title: 'Place a spy',
          impl: () => {
            game.aChooseAndPlaceSpy(player)
          }
        },
        {
          title: 'Return one of your spies > For the rest of your turn treat the top card of the devoured deck as if it was in the market',
          impl: () => game.aReturnASpyAnd(player, () => {
            game.mSetGhostFlag()
          })
        },
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
      "Return another player's troop or spy.",
      "At end of turn, you may promote any number of undead cards played this turn."
    ],
    impl: (game, player, { card }) => {
      game.aChooseAndReturn(player, { noWhite: true })
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
        const targetPlayer = game.aChoosePlayer(player, otherPlayersDistinct, {
          title: 'Choose a player whose dead you will raise'
        })

        if (targetPlayer) {
          for (let i = 0; i < 2; i++) {
            const troopZone = game.getZoneByPlayer(targetPlayer, 'trophyHall')
            const choices = troopZone.cards().map(troop => troop.getOwnerName()).sort()
            const selections = game.aChoose(player, choices, {
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
      }
      else {
        game.mLog({
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
              const chosen = game.aChoose(player, troops.map(t => 'neutral'), {
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
      "- Promote this card, or a card from our hand or discard pile."
    ],
    impl: (game, player) => {
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
    impl: (game, player) => {
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
    impl: (game, player) => {
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
    },
  },
  {
    "name": "Wight",
    "aspect": "malice",
    "race": "undead",
    "expansion": "undead",
    "cost": 3,
    "points": 1,
    "innerPoints": 3,
    "count": 4,
    "text": [
      "Choose one:",
      "- +2 power.",
      "- Devour a card in your hand > Supplant a troop."
    ],
    impl: (game, player) => {
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
    impl: (game, player) => {
    },
  }
]

module.exports = {
  cardData,
}
