const util = require('../lib/util.js')


const cardData = [
  {
    "name": "Ghoul",
    "aspect": "malice",
    "race": "undead",
    "expansion": "demons",
    "cost": 4,
    "points": 2,
    "innerPoints": 4,
    "count": 3,
    "text": [
      "+2 power",
      "Each opponent recruits an Insane Outcast"
    ],
    impl: (game, player) => {},
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
    impl: (game, player, { card }) => {
      game.aChooseAndDevour(player, {
        then: () => game.aChooseOne(player, [
          {
            title: '+3 influence',
            impl: (game, player) => player.incrementInfluence(3)
          },
          {
            title: 'Assassinate a troop',
            impl: (game, player) => game.aChooseAndAssassinate(player)
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
    impl: (game, player) => {},
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
    impl: (game, player) => {},
  },
  {
    "name": "Orcus",
    "aspect": "malice",
    "race": "fiend",
    "expansion": "demons",
    "cost": 8,
    "points": 5,
    "innerPoints": 1,
    "count": 1,
    "text": [
      "Devour a card in your hand > Assassinate 2 troops. Then you may take up to 2 troops from any trophy halls and deploy them anywhere on the board."
    ],
    impl: (game, player) => {},
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
    impl: (game, player) => {},
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
      "Supplant a white troop anywhere on the board. You recruit an Insane Outcast."
    ],
    impl: (game, player) => {},
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
    impl: (game, player) => {},
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
    impl: (game, player) => {},
  },
  {
    "name": "Demogorgon",
    "aspect": "conquest",
    "race": "fiend",
    "expansion": "demons",
    "cost": 8,
    "points": 5,
    "innerPoints": 1,
    "count": 1,
    "text": [
      "Devour a card in your hand > Supplant 2 white troops. Each opponent recruits 2 Insane Outcasts."
    ],
    impl: (game, player) => {},
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
    impl: (game, player) => {},
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
    impl: (game, player) => {},
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
      "Devour a card in your hand > Place a spy, then assassinate a troop at that spy’s site."
    ],
    impl: (game, player) => {},
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
    impl: (game, player) => {},
  },
  {
    "name": "Graz’zt",
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
      "- Return any number of your spies > Supplant a troop at each of the returned spies’ sites."
    ],
    impl: (game, player) => {},
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
    impl: (game, player) => {},
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
    "text": [
      "+3 influence",
      "Promote the top card of your deck."
    ],
    impl: (game, player) => {},
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
    impl: (game, player) => {},
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
    impl: (game, player) => {},
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
    impl: (game, player) => {},
  }
]

module.exports = {
  cardData,
}
