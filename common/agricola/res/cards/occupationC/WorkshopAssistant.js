module.exports = {
  id: "workshop-assistant-c146",
  name: "Workshop Assistant",
  deck: "occupationC",
  number: 146,
  type: "occupation",
  players: "3+",
  text: "Place a unique pair of different building resources on each of your improvements. Each time another player renovates, you may move one such pair to your supply.",
  onPlay(game, _player) {
    const s = game.cardState(this.id)
    s.resourcePairs = []
  },
  // Note: onAnyRenovate hook is not fired by engine. This card's renovation
  // trigger cannot fire in the current implementation.
  onAnyRenovate(game, actingPlayer, cardOwner) {
    const s = game.cardState(this.id)
    if (actingPlayer.name !== cardOwner.name && s.resourcePairs && s.resourcePairs.length > 0) {
      void(game)
    }
  },
}
