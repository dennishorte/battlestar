module.exports = {
  id: "childs-toy-e030",
  name: "Child's Toy",
  deck: "minorE",
  number: 30,
  type: "minor",
  cost: { wood: 1 },
  vps: 2,
  prereqs: { exactlyAdults: 2 },
  text: "During the feeding phase of each harvest, your newborns require 2 food (instead of 1).",
  modifyNewbornFoodCost(_game, _player, _cost) {
    return 2
  },
}
