module.exports = {
  id: "omnifarmer-e134",
  name: "Omnifarmer",
  deck: "occupationE",
  number: 134,
  type: "occupation",
  players: "1+",
  text: "Each harvest, you can place 1 harvested crop or 1 newborn animal on this card, irretrievably. Once this game, exchange 2/3/4/5 different goods on this for 3/5/7/9 bonus points.",
  onPlay(game, _player) {
    const s = game.cardState(this.id)
    s.goods = []
    s.exchanged = false
  },
  onHarvest(game, player) {
    game.actions.offerOmnifarmerPlace(player, this)
  },
  canExchange(game) {
    const s = game.cardState(this.id)
    return !s.exchanged && s.goods && s.goods.length >= 2
  },
  exchange(game, player) {
    const s = game.cardState(this.id)
    const uniqueGoods = new Set(s.goods).size
    const pointsMap = { 2: 3, 3: 5, 4: 7, 5: 9 }
    const points = pointsMap[Math.min(5, uniqueGoods)] || 0
    if (points > 0) {
      player.bonusPoints = (player.bonusPoints || 0) + points
      s.exchanged = true
      game.log.add({
        template: '{player} exchanges goods for {amount} bonus points via Omnifarmer',
        args: { player, amount: points },
      })
    }
  },
}
