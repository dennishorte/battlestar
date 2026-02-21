module.exports = {
  id: "recycled-brick-d077",
  name: "Recycled Brick",
  deck: "minorD",
  number: 77,
  type: "minor",
  cost: { food: 1 },
  prereqs: { occupations: 3 },
  category: "Building Resource Provider",
  text: "Each time any player (including you) renovates to stone, you get 1 clay for each newly renovated room.",
  onAnyRenovate(game, actingPlayer, cardOwner, { newType, roomCount }) {
    if (newType === 'stone') {
      cardOwner.addResource('clay', roomCount)
      game.log.add({
        template: '{player} gets {amount} clay from {card}',
        args: { player: cardOwner, amount: roomCount , card: this},
      })
    }
  },
}
