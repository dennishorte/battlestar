module.exports = {
  name: `Camcorder`,
  color: `red`,
  age: 10,
  expansion: `echo`,
  biscuits: `hiif`,
  dogmaBiscuit: `i`,
  echo: ``,
  dogma: [
    `I demand you transfer all cards in your hand to my hand! Draw a {9}!`,
    `Meld all {9} from your hand. Return all other cards from your hand. Draw three {9}.`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      game.aTransferMany(player, game.getCardsByZone(player, 'hand'), game.getZoneByPlayer(leader, 'hand'))
      game.aDraw(player, { age: game.getEffectAge(this, 9) })
    },

    (game, player) => {
      const toMeld = game
        .getCardsByZone(player, 'hand')
        .filter(card => card.getAge() === game.getEffectAge(this, 9))
      game.aMeldMany(player, toMeld)
      game.aReturnMany(player, game.getCardsByZone(player, 'hand'))
      game.aDraw(player, { age: game.getEffectAge(this, 9) })
      game.aDraw(player, { age: game.getEffectAge(this, 9) })
      game.aDraw(player, { age: game.getEffectAge(this, 9) })
    }
  ],
  echoImpl: [],
}
