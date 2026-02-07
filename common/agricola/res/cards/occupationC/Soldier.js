module.exports = {
  id: "soldier-c133",
  name: "Soldier",
  deck: "occupationC",
  number: 133,
  type: "occupation",
  players: "1+",
  text: "During scoring, you get 1 bonus point for each stone-wood pair in your supply. You cannot score additional points for the resources scored with this card.",
  resourcesUsedForScoring: ["stone", "wood"],
  getEndGamePoints(player) {
    return Math.min(player.stone, player.wood)
  },
}
