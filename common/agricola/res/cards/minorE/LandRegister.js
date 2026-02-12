module.exports = {
  id: "land-register-e034",
  name: "Land Register",
  deck: "minorE",
  number: 34,
  type: "minor",
  cost: { wood: 1 },
  text: "During scoring, if your farm has no unused spaces, you get 2 bonus points.",
  getEndGamePoints(player) {
    return player.getUnusedSpaceCount() === 0 ? 2 : 0
  },
}
