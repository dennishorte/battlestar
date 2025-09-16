module.exports = {
  name: `Cyrus Cylinder`,
  color: `purple`,
  age: 2,
  expansion: `arti`,
  biscuits: `hssk`,
  dogmaBiscuit: `s`,
  dogma: [
    `Choose any other top purple card on any player's board. Execute its non-demand dogma effects. Do not share them.`,
    `Splay left a color on any player's board.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const choices = game
        .players.all()
        .map(player => game.getTopCard(player, 'purple'))
        .filter(card => card !== undefined)
        .filter(card => card.name !== self.name)

      const card = game.actions.chooseCard(player, choices)
      if (card) {
        game.aCardEffects(player, card, 'dogma')
      }
    },

    (game, player) => {
      const splayChoices = game
        .players.all()
        .flatMap(player => game.utilColors().map(color => ({ player, color })))
        .map(x => `${x.player.name}-${x.color}`)

      const selections = game.actions.choose(player, splayChoices)
      if (selections && selections.length > 0) {
        const [playerName, color] = selections[0].split('-')
        const other = game.getPlayerByName(playerName)
        game.aSplay(player, color, 'left', { owner: other })
      }
    }
  ],
}
