module.exports = {
  id: "case-builder-b105",
  name: "Case Builder",
  deck: "occupationB",
  number: 105,
  type: "occupation",
  players: "1+",
  text: "When you play this card, you immediately get 1 good of each of the following types, if you have at least 2 of that good already: food, grain, vegetable, reed, wood.",
  onPlay(game, player) {
    const resources = ['food', 'grain', 'vegetables', 'reed', 'wood']
    for (const res of resources) {
      if ((player[res] || 0) >= 2) {
        player.addResource(res, 1)
        game.log.add({
          template: '{player} gets 1 {resource} from {card}',
          args: { player, resource: res , card: this},
        })
      }
    }
  },
}
