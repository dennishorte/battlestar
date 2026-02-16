module.exports = {
  id: "collector-c104",
  name: "Collector",
  deck: "occupationC",
  number: 104,
  type: "occupation",
  players: "1+",
  text: "This card is an action space for you only. When you use it for the 1st/2nd/3rd/4th time, you get 1 begging marker and 6/7/8/9 different goods of your choice.",
  providesActionSpace: true,
  actionSpaceId: 'collector',
  ownerOnly: true,
  onPlay(game, _player) {
    game.cardState(this.id).useCount = 0
  },
  onActionSpaceUsed(game, player) {
    const s = game.cardState(this.id)
    s.useCount = (s.useCount || 0) + 1
    const goodsCount = 5 + s.useCount
    player.beggingCards = (player.beggingCards || 0) + 1
    game.actions.offerChooseGoods(player, this, goodsCount)
  },
}
