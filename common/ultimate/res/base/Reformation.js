module.exports = {
  name: `Reformation`,
  color: `purple`,
  age: 4,
  expansion: `base`,
  biscuits: `llhl`,
  dogmaBiscuit: `l`,
  dogma: [
    `You may splay your yellow or purple cards right.`,
    `You may tuck a card from your hand for every splayed color on your board.`,
  ],
  dogmaImpl: [
    (game, player) => {
      game.aChooseAndSplay(player, ['yellow', 'purple'], 'right')
    },
    (game, player) => {
      const count = game
        .getSplayedZones(player)
        .length

      if (count === 0) {
        game.log.add({ template: 'no splayed colors' })
        return
      }

      const proceed = game.requestInputSingle({
        actor: player.name,
        title: `Tuck ${count} cards from your hand?`,
        choices: ['yes', 'no']
      })[0]

      if (proceed === 'no') {
        game.log.add({
          template: '{player} does nothing',
          args: { player }
        })
        return
      }

      const choices = game
        .zones.byPlayer(player, 'hand')
        .cards()
        .map(c => c.id)
      game.actions.chooseAndTuck(player, choices, { count })
    }
  ],
}
