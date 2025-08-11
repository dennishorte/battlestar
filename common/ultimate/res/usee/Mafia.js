module.exports = {
  name: `Mafia`,
  color: `yellow`,
  age: 7,
  expansion: `usee`,
  biscuits: `fhff`,
  dogmaBiscuit: `f`,
  dogma: [
    `I demand you transfer your lowest secret to my safe!`,
    `Tuck a card from any score pile.`,
    `You may splay your red or yellow cards right.`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const opponentSecrets = game.cards.byPlayer(player, 'safe')
      const lowestSecret = game.util.lowestCards(opponentSecrets)[0]

      if (!lowestSecret) {
        game.log.addNoEffect()
        return
      }

      game.actions.transfer(player, lowestSecret, game.zones.byPlayer(leader, 'safe'))
    },

    (game, player) => {
      const players = game
        .players.all(player)
        .filter(p => game.cards.byPlayer(p, 'score').length > 0)
        .map(p => p.name)

      const targetName = game.actions.choose(player, players, {
        title: 'Choose a player to tuck from'
      })[0]

      if (targetName) {
        const target = game.players.byName(targetName)

        const card = game.actions.chooseCards(player, game.cards.byPlayer(target, 'score'), {
          title: 'Choose a card to tuck',
          hidden: targetName !== player.name
        })[0]

        game.actions.tuck(player, card)
      }
    },

    (game, player) => {
      game.actions.chooseAndSplay(player, ['red', 'yellow'], 'right')
    }
  ],
}
