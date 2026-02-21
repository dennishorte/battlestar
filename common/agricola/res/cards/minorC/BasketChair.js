module.exports = {
  id: "basket-chair-c022",
  name: "Basket Chair",
  deck: "minorC",
  number: 22,
  type: "minor",
  cost: { reed: 1 },
  vps: 1,
  category: "Actions Booster",
  text: "When you play this card, you can immediately move the first person you placed this work phase to this card. If you do, immediately afterward, you can place another person.",
  onPlay(game, player) {
    const firstAction = player._firstActionThisRound
    if (!firstAction) {
      return
    }

    const choices = ['Move first person to Basket Chair', 'No']
    const selection = game.actions.choose(player, choices, {
      title: 'Basket Chair: Move your first person?',
      min: 1,
      max: 1,
    })

    const sel = Array.isArray(selection) ? selection[0] : selection
    if (sel === 'Move first person to Basket Chair') {
      game.state.actionSpaces[firstAction].occupiedBy = null
      game.state.basketChairBonusTurn = player.name
      game.log.add({
        template: '{player} moves first person to {card} — frees {action}',
        args: { player, action: firstAction , card: this},
      })
    }
  },
}
