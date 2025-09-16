module.exports = {
  name: `Dead Sea Scrolls`,
  color: `purple`,
  age: 2,
  expansion: `arti`,
  biscuits: `hksk`,
  dogmaBiscuit: `k`,
  dogma: [
    `Draw an Artifact of value equal to the value of your highest top card.`
  ],
  dogmaImpl: [
    (game, player) => {
      const highestTopCard = game.getHighestTopCard(player)
      game.aDraw(player, { age: highestTopCard.getAge(), exp: 'arti' })
    }
  ],
}
