module.exports = {
  id: "pig-owner-a153",
  name: "Pig Owner",
  deck: "occupationA",
  number: 153,
  type: "occupation",
  players: "3+",
  text: "The first time after you play this card that you have 5 wild boars on your farm, you immediately get 3 bonus points.",
  checkTrigger(game, player) {
    if (!player.pigOwnerTriggered && player.getTotalAnimals('boar') >= 5) {
      player.pigOwnerTriggered = true
      player.bonusPoints = (player.bonusPoints || 0) + 3
      game.log.add({
        template: '{player} gets 3 bonus points from Pig Owner',
        args: { player },
      })
    }
  },
}
