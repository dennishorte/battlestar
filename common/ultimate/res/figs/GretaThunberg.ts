export default {
  id: `Greta Thunberg`,  // Card names are unique in Innovation
  name: `Greta Thunberg`,
  color: `yellow`,
  age: 11,
  expansion: `figs`,
  biscuits: `hlpl`,
  dogmaBiscuit: `l`,
  karma: [
    `If a player would dogma a card, first junk another top card with {f} from any board. Then if there is no top card with {f} on any board, you win.`
  ],
  karmaImpl: [
    {
      trigger: 'dogma',
      triggerAll: true,
      kind: 'would-first',
      matches: () => true,
      func: (game, player, { card, owner, self }) => {
        const junkChoices = game
          .cards
          .topsAll()
          .filter(card => card.checkHasBiscuit('f'))
          .filter(other => other.id !== card.id)
        game.actions.chooseAndJunk(owner, junkChoices)

        const topFactories = game
          .cards
          .topsAll()
          .filter(card => card.checkHasBiscuit('f'))
        if (topFactories.length === 0) {
          game.youWin(owner, self.name)
        }
      }
    }
  ]
}
