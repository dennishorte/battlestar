module.exports = {
  id: "culinary-artist-a158",
  name: "Culinary Artist",
  deck: "occupationA",
  number: 158,
  type: "occupation",
  players: "4+",
  text: "Each time another player uses the \"Traveling Players\" accumulation space, you can exchange your choice of 1 grain/sheep/vegetable for 4/5/7 food.",
  onAnyAction(game, actingPlayer, actionId, cardOwner) {
    if (actionId === 'traveling-players' && actingPlayer.name !== cardOwner.name) {
      game.actions.offerCulinaryArtistExchange(cardOwner, this)
    }
  },
}
