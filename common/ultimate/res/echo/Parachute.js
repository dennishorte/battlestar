module.exports = {
  name: `Parachute`,
  color: `red`,
  age: 8,
  expansion: `echo`,
  biscuits: `fhii`,
  dogmaBiscuit: `i`,
  echo: ``,
  dogma: [
    `I demand you transfer all cards with a {i} from your hand to my hand!`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const toTransfer = game
        .cards.byPlayer(player, 'hand')
        .filter(card => card.checkHasBiscuit('i'))

      game.actions.transferMany(player, toTransfer, game.zones.byPlayer(leader, 'hand'))
    }
  ],
  echoImpl: [],
}
