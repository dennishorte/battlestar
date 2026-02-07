module.exports = {
  id: "stable-cleaner-c094",
  name: "Stable Cleaner",
  deck: "occupationC",
  number: 94,
  type: "occupation",
  players: "1+",
  text: "At any time, you can take the \"Build Stables\" action without placing a person. If you do, each stable costs you 1 wood and 1 food.",
  allowsAnytimeAction: true,
  anytimeActionType: "build-stables",
  modifyStableCostForAnytime() {
    return { wood: 1, food: 1 }
  },
}
