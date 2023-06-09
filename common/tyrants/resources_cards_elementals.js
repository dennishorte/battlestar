const util = require('../lib/util.js')


const cardData = [
  {
    "name": "Eternal Flame Cultist",
    "aspect": "malice",
    "race": "human",
    "expansion": "Elementals",
    "cost": 4,
    "points": 2,
    "innerPoints": 4,
    "count": 3,
    "text": [
      "Assassinate a troop",
      "Malice Focus > +2 power"
    ]
  },
  {
    "name": "Fire Elemental",
    "aspect": "malice",
    "race": "elemental",
    "expansion": "Elementals",
    "cost": 3,
    "points": 1,
    "innerPoints": 3,
    "count": 3,
    "text": [
      "Choose one:",
      "- +2 power",
      "- +2 influence",
      "Malice focus > Draw a card"
    ]
  },
  {
    "name": "Fire Elemental Myrmidon",
    "aspect": "malice",
    "race": "elemental",
    "expansion": "Elementals",
    "cost": 4,
    "points": 1,
    "innerPoints": 3,
    "count": 2,
    "text": [
      "+2 power",
      "At end of turn, promote an Obedience card played this turn"
    ]
  },
  {
    "name": "Vanifer",
    "aspect": "malice",
    "race": "tiefling",
    "expansion": "Elementals",
    "cost": 5,
    "points": 2,
    "innerPoints": 5,
    "count": 1,
    "text": [
      "Assassinate a troop",
      "Recruit a Malice card that costs 4 or less without paying its cost"
    ]
  },
  {
    "name": "Imix",
    "aspect": "malice",
    "race": "elemental prince",
    "expansion": "Elementals",
    "cost": 6,
    "points": 3,
    "innerPoints": 6,
    "count": 1,
    "text": [
      "+4 power",
      "Malice Focus > +2 power"
    ]
  },
  {
    "name": "Crushing Wave Cultist",
    "aspect": "conquest",
    "race": "human",
    "expansion": "Elementals",
    "cost": 3,
    "points": 1,
    "innerPoints": 4,
    "count": 3,
    "text": [
      "Assassinate a white troop",
      "Conquest Focus > Deploy 2 troops"
    ]
  },
  {
    "name": "Water Elemental",
    "aspect": "conquest",
    "race": "elemental",
    "expansion": "Elementals",
    "cost": 2,
    "points": 1,
    "innerPoints": 2,
    "count": 3,
    "text": [
      "Deploy 2 troops",
      "Conquest Focus > Draw a card"
    ]
  },
  {
    "name": "Water Elemental Myrmidon",
    "aspect": "conquest",
    "race": "elemental",
    "expansion": "Elementals",
    "cost": 4,
    "points": 2,
    "innerPoints": 4,
    "count": 2,
    "text": [
      "Assassinate a white troop",
      "At end of turn, promote an Obedience card played this turn"
    ]
  },
  {
    "name": "Gar Shatterkeel",
    "aspect": "conquest",
    "race": "human",
    "expansion": "Elementals",
    "cost": 5,
    "points": 2,
    "innerPoints": 5,
    "count": 1,
    "text": [
      "Deploy 3 troops",
      "Recruit a Conquest card that costs 4 or less without paying its cost"
    ]
  },
  {
    "name": "Olhydra",
    "aspect": "conquest",
    "race": "elemental prince",
    "expansion": "Elementals",
    "cost": 6,
    "points": 3,
    "innerPoints": 6,
    "count": 1,
    "text": [
      "Supplant a white troop anywhere on the board.",
      "Conquest Focus > Deploy 2 troops."
    ]
  },
  {
    "name": "Air Elemental",
    "aspect": "guile",
    "race": "elemental",
    "expansion": "Elementals",
    "cost": 3,
    "points": 1,
    "innerPoints": 2,
    "count": 4,
    "text": [
      "Choose one:",
      "- Place a spy",
      "- Return one of your spies > Deploy 3 troops",
      "Guile Focus > Draw a card"
    ]
  },
  {
    "name": "Howling Hatred Cultist",
    "aspect": "guile",
    "race": "human",
    "expansion": "Elementals",
    "cost": 3,
    "points": 1,
    "innerPoints": 3,
    "count": 2,
    "text": [
      "Choose one:",
      "- Place a spy",
      "- Return one of your spies > +3 influence",
      "Guile Focus > +1 power"
    ]
  },
  {
    "name": "Air Elemental Myrmidon",
    "aspect": "guile",
    "race": "elemental",
    "expansion": "Elementals",
    "cost": 4,
    "points": 1,
    "innerPoints": 3,
    "count": 2,
    "text": [
      "Place a spy.",
      "At end of turn, promote an Obedience card played this turn."
    ]
  },
  {
    "name": "Aerisi Kalinoth",
    "aspect": "guile",
    "race": "elf",
    "expansion": "Elementals",
    "cost": 5,
    "points": 2,
    "innerPoints": 5,
    "count": 1,
    "text": [
      "+1 power",
      "Place a spy.",
      "Recruit a Guile card that costs 4 or less without paying its cost."
    ]
  },
  {
    "name": "Yan-C-Bin",
    "aspect": "guile",
    "race": "elemental prince",
    "expansion": "Elementals",
    "cost": 6,
    "points": 3,
    "innerPoints": 6,
    "count": 1,
    "text": [
      "Place a spy, then assassinate a troop at that spy’s site.",
      "Guile Focus > Place a spy"
    ]
  },
  {
    "name": "Black Earth Cultist",
    "aspect": "ambition",
    "race": "human",
    "expansion": "Elementals",
    "cost": 2,
    "points": 1,
    "innerPoints": 2,
    "count": 4,
    "text": [
      "At end of turn, promote another card played this turn.",
      "Ambition Focus > +2 influence"
    ]
  },
  {
    "name": "Earth Elemental",
    "aspect": "ambition",
    "race": "elemental",
    "expansion": "Elementals",
    "cost": 3,
    "points": 1,
    "innerPoints": 3,
    "count": 2,
    "text": [
      "+1 influence",
      "Return another player’s troop or spy.",
      "Ambition focus > Draw a card"
    ]
  },
  {
    "name": "Earth Elemental Myrmidon",
    "aspect": "ambition",
    "race": "elemental",
    "expansion": "Elementals",
    "cost": 4,
    "points": 2,
    "innerPoints": 4,
    "count": 2,
    "text": [
      "+2 influence",
      "At end of turn, promote another card played this turn"
    ]
  },
  {
    "name": "Marlos Urnrayle",
    "aspect": "ambition",
    "race": "medusa",
    "expansion": "Elementals",
    "cost": 5,
    "points": 2,
    "innerPoints": 5,
    "count": 1,
    "text": [
      "At end of turn, promote another card played this turn.",
      "Recruit an Ambition card that costs 4 or less without paying its cost."
    ]
  },
  {
    "name": "Ogremoch",
    "aspect": "ambition",
    "race": "elemental prince",
    "expansion": "Elementals",
    "cost": 6,
    "points": 3,
    "innerPoints": 7,
    "count": 1,
    "text": [
      "+2 influence",
      "At end of turn, promote another card played this turn.",
      "Ambition Focus > At end of turn, promote another card played this turn."
    ]
  }
]

module.exports = {
  cardData,
}
