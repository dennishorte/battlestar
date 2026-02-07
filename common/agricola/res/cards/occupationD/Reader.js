module.exports = {
  id: "reader-d085",
  name: "Reader",
  deck: "occupationD",
  number: 85,
  type: "occupation",
  players: "1+",
  text: "As soon as you have 6 occupations in front of you (including this one), this card provides room for one person. In the draft variant, you need 7 occupations to play this.",
  providesRoom: false,
  checkRoomCondition(player, isDraft) {
    const required = isDraft ? 7 : 6
    return player.getOccupationCount() >= required
  },
  onPlayOccupation(game, player) {
    if (!this.providesRoom && this.checkRoomCondition(player, game.isDraftVariant)) {
      this.providesRoom = true
      game.log.add({
        template: '{player} activates Reader room',
        args: { player },
      })
    }
  },
}
