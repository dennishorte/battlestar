module.exports = {
  id: "potato-planter-d142",
  name: "Potato Planter",
  deck: "occupationD",
  number: 142,
  type: "occupation",
  players: "1+",
  text: "At the end of each work phase in which you occupy the \"Clay Pit\" or \"Reed Bank\" accumulation space while the respective other is unoccupied, you get 1 vegetable.",
  onWorkPhaseEnd(game, player) {
    const usedClayPit = player.usedActionThisRound('take-clay')
    const usedReedBank = player.usedActionThisRound('reed-bank')
    const clayPitOccupied = game.isActionOccupied('take-clay')
    const reedBankOccupied = game.isActionOccupied('reed-bank')

    if ((usedClayPit && !reedBankOccupied) || (usedReedBank && !clayPitOccupied)) {
      player.addResource('vegetables', 1)
      game.log.add({
        template: '{player} gets 1 vegetable from Potato Planter',
        args: { player },
      })
    }
  },
}
