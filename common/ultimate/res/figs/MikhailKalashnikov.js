module.exports = {
  id: `Mikhail Kalashnikov`,  // Card names are unique in Innovation
  name: `Mikhail Kalashnikov`,
  color: `red`,
  age: 9,
  expansion: `figs`,
  biscuits: `*ffh`,
  dogmaBiscuit: `f`,
  echo: ``,
  karma: [
    `If you would tuck a red card, instead choose a top red card on an opponent's board. Either transfer it to your score pile, or execute its non-demand Dogma effects for yourself only.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: [],
  karmaImpl: [
    {
      trigger: 'tuck',
      kind: 'would-instead',
      matches: (game, player, { card }) => card.color === 'red',
      func: (game, player) => {
        const choices = game
          .getPlayerOpponents(player)
          .map(opp => game.getTopCard(opp, 'red'))
          .filter(card => card !== undefined)
        const selected = game.actions.chooseCard(player, choices)
        game.log.add({
          template: '{player} chooses {card}',
          args: {
            player,
            card: selected
          }
        })

        const action = game.actions.choose(player, ['transfer it', 'execute it'])[0]

        if (action === 'transfer it') {
          game.actions.transfer(player, selected, game.zones.byPlayer(player, 'score'))
        }
        else {
          game.aCardEffects(player, selected, 'dogma')
        }
      }
    }
  ]
}
