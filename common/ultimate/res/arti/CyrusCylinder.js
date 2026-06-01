module.exports = {
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
        .map(x => game.actions.option({
          id: `${x.player.name}-${x.color}`,
          title: `${x.player.name}-${x.color}`,
          kind: 'splay-target',
        }))

      const selections = game.actions.choose(player, splayChoices)
      if (selections && selections.length > 0) {
        const pick = selections[0]
        const pickId = (pick && typeof pick === 'object') ? pick.id : pick
        const [playerName, color] = pickId.split('-')
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
        game.executeAllEffects(player, card, 'dogma')
      }
    },
  ],
}
