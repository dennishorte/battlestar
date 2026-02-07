module.exports = {
  id: "resource-hoarder-e123",
  name: "Resource Hoarder",
  deck: "occupationE",
  number: 123,
  type: "occupation",
  players: "1+",
  text: "Pile resources as depicted on this card. You can use the top item(s) when building a room, playing/building an improvement, or renovating. (From bottom to top: Stone, Clay, Stone, Reed, Wood, Clay)",
  onPlay(_game, _player) {
    this.pile = ['stone', 'clay', 'stone', 'reed', 'wood', 'clay']
  },
  canUseTopResource(resourceType) {
    return this.pile && this.pile.length > 0 && this.pile[this.pile.length - 1] === resourceType
  },
  useTopResource(game, player) {
    if (this.pile && this.pile.length > 0) {
      const resource = this.pile.pop()
      game.log.add({
        template: '{player} uses 1 {resource} from Resource Hoarder',
        args: { player, resource },
      })
      return resource
    }
    return null
  },
}
