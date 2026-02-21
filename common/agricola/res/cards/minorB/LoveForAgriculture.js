module.exports = {
  id: "love-for-agriculture-b072",
  name: "Love for Agriculture",
  deck: "minorB",
  number: 72,
  type: "minor",
  cost: {},
  category: "Farm Planner",
  text: "You can sow crops in pastures covering 1 or 2 farmyard spaces. If you do, these pastures are also considered fields and hold 1 and 2 animals less, respectively.",
  allowSowInSmallPastures: true,

  onPlay(game, player) {
    player.syncPastureLinkedVirtualFields()
    const count = player.virtualFields.filter(vf => vf.cardId === this.id).length
    if (count > 0) {
      game.log.add({
        template: '{player} plays {card}, creating {count} sowable pasture field(s)',
        args: { player, count , card: this},
      })
    }
  },

  modifyPastureCapacity(player, pasture, capacity) {
    const key = pasture.spaces.map(s => `${s.row},${s.col}`).sort().join('|')
    const linkedField = player.virtualFields.find(vf =>
      vf.cardId === this.id && vf.pastureSpaces === key
    )
    if (linkedField && linkedField.crop && linkedField.cropCount > 0) {
      return Math.max(0, capacity - pasture.spaces.length)
    }
    return capacity
  },
}
