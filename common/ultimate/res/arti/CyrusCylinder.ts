export default {
  name: `Cyrus Cylinder`,
  color: `purple`,
  age: 2,
  expansion: `arti`,
  biscuits: `hssk`,
  dogmaBiscuit: `s`,
  dogma: [
    `Splay left a color on any player's board.`,
    `Choose any top purple card other than Cyrus Cylinder on any player's board. Self-execute it.`,
  ],
  dogmaImpl: [
    (game, player) => {
      const splayChoices = game
        .players.all()
        .flatMap(player => game.util.colors().map(color => ({ player, color })))
        .map(x => `${x.player.name}-${x.color}`)

      const selections = game.actions.choose(player, splayChoices)
      if (selections && selections.length > 0) {
        const [playerName, color] = selections[0].split('-')
        const other = game.players.byName(playerName)
        game.actions.splay(player, color, 'left', { owner: other })
      }
    },

    (game, player, { self }) => {
      const choices = game
        .players.all()
        .map(player => game.cards.top(player, 'purple'))
        .filter(card => card !== undefined)
        .filter(card => card.name !== self.name)

      const card = game.actions.chooseCard(player, choices)
      if (card) {
        game.aCardEffects(player, card, 'dogma')
      }
    },
  ],
}
