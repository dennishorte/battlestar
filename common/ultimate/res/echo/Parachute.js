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
        .getCardsByZone(player, 'hand')
        .filter(card => card.checkHasBiscuit('i'))

      game.aTransferMany(player, toTransfer, game.getZoneByPlayer(leader, 'hand'))
    }
  ],
  echoImpl: [],
}
