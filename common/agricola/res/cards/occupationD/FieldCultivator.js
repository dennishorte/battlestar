module.exports = {
  id: "field-cultivator-d126",
  name: "Field Cultivator",
  deck: "occupationD",
  number: 126,
  type: "occupation",
  players: "1+",
  text: "Pile 1 wood, 1 clay, 1 reed, 1 stone, 1 reed, 1 clay, and 1 wood on this card. Each time you harvest a field tile, you can also take the top good from the pile.",
  onPlay(game, _player) {
    game.cardState(this.id).pile = ['wood', 'clay', 'reed', 'stone', 'reed', 'clay', 'wood']
  },
  onHarvestField(game, player) {
    const s = game.cardState(this.id)
    if (!s.pile || s.pile.length === 0) {
      return
    }
    const nextGood = s.pile[0]
    const choices = [`Take 1 ${nextGood} from pile`, 'Skip']
    const selection = game.actions.choose(player, choices, {
      title: 'Field Cultivator',
      min: 1,
      max: 1,
    })
    if (selection[0] !== 'Skip') {
      const good = s.pile.shift()
      player.addResource(good, 1)
      game.log.add({
        template: '{player} takes 1 {good} from Field Cultivator pile',
        args: { player, good },
      })
    }
  },
}
