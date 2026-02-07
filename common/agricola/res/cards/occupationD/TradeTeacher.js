module.exports = {
  id: "trade-teacher-d137",
  name: "Trade Teacher",
  deck: "occupationD",
  number: 137,
  type: "occupation",
  players: "1+",
  text: "Each time after you use a \"Lesson\" action space, you can buy up to 2 different goods: grain, stone, sheep, and wild boar for 1 food each; cattle and vegetable for 2 food each.",
  onAction(game, player, actionId) {
    if (actionId === 'lessons-1' || actionId === 'lessons-2') {
      game.actions.offerTradeTeacherPurchase(player, this)
    }
  },
}
