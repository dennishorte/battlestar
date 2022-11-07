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
      game.aChooseAndPlaceSpy(player)
      game.aChooseAndPlaceSpy(player)

      const count = game.getCardsByZone(player, 'spies').length
      for (let i = 0; i < count; i++) {
        game.aDraw(player)
      }
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
    text: [
      "At end of turn, promote another card played this turn.",
      "If an opponent causes you to discard this, you may promote it instead."
    ],
    impl: (game, player, { card }) => {
      game.aDeferPromotion(player, card)
    },
    triggers: [
      {
        kind: 'discard-this',
        impl: (game, player, { card }) => {
          game.mLog({
            template: '{player} was forced to discard {card}, and may choose to promote it',
            args: { player, card }
          })
          const promote = game.aChooseYesNo(player, 'Promote Ambassador instead of discarding?')
          if (promote) {
            game.aPromote(player, card)
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
    impl: (game, player) => {}
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
    impl: (game, player) => {}
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
    impl: (game, player) => {}
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
    impl: (game, player) => {}
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
    impl: (game, player) => {}
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
    impl: (game, player) => {}
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
    impl: (game, player) => {}
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
          impl: (game, player) => player.incrementInfluence(2),
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
    impl: (game, player) => {}
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
    impl: (game, player) => {}
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
    impl: (game, player) => {}
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
    impl: (game, player) => {}
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
    impl: (game, player) => {}
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
    text: [
      "+2 influence.",
      "At end of turn, promote another card played this turn."
    ],
    impl: (game, player) => {}
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
    impl: (game, player) => {}
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
    text: [
      "+2 power",
      "+1 influence"
    ],
    impl: (game, player) => {}
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
      "Play a card in the market that costs 4 or less as if it was in your hand, then devour that card."
    ],
    impl: (game, player) => {}
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
      "If an opponent causes you to discard this, they must discard a card."
    ],
    impl: (game, player) => {}
  }
]

module.exports = {
  cardData,
}
