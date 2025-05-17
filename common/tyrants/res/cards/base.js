const cardData = [
  {
    name: "Priestess of Lolth",
    aspect: "obedience",
    race: "drow",
    expansion: "core",
    cost: 2,
    points: 1,
    innerPoints: 2,
    count: 15,
    autoplay: true,
    text: [
      "+2 influence"
    ],
    impl: (game, player) => player.incrementCounter('influence', 2)
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
    autoplay: true,
    text: [
      "+2 power"
    ],
    impl: (game, player) => player.incrementCounter('power', 2)
  },
  {
    name: "Insane Outcast",
    aspect: "-",
    race: "drow",
    expansion: "core",
    cost: 0,
    points: -1,
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
    cost: 0,
    points: 0,
    innerPoints: 1,
    count: 28,
    autoplay: true,
    text: [
      "+1 influence"
    ],
    impl: (game, player) => player.incrementCounter('influence', 1),
  },
  {
    name: "Soldier",
    aspect: "obedience",
    race: "drow",
    expansion: "starter",
    cost: 0,
    points: 0,
    innerPoints: 1,
    count: 12,
    autoplay: true,
    text: [
      "+1 power"
    ],
    impl: (game, player) => player.incrementCounter('power', 1),
  },
]

module.exports = {
  cardData
}
