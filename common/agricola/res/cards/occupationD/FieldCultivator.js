module.exports = {
  id: "field-cultivator-d126",
  name: "Field Cultivator",
  deck: "occupationD",
  number: 126,
  type: "occupation",
  players: "1+",
  text: "Pile 1 wood, 1 clay, 1 reed, 1 stone, 1 reed, 1 clay, and 1 wood on this card. Each time you harvest a field tile, you can also take the top good from the pile.",
  onPlay(_game, _player) {
    this.pile = ['wood', 'clay', 'reed', 'stone', 'reed', 'clay', 'wood']
  },
  onHarvestField(game, player) {
    if (this.pile && this.pile.length > 0) {
      const good = this.pile.shift()
      player.addResource(good, 1)
      game.log.add({
        template: '{player} gets 1 {good} from Field Cultivator',
        args: { player, good },
      })
    }
  },
}
