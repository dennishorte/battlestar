const Card = require('./Card.js')

const baseData = [
  {
    "name": "Priestess of Lolth",
    "aspect": "obedience",
    "race": "drow",
    "expansion": "core",
    "cost": 2,
    "points": 1,
    "innerPoints": 2,
    "count": 15,
    "text": [
      "+2 influence"
    ]
  },
  {
    "name": "House Guard",
    "aspect": "obedience",
    "race": "drow",
    "expansion": "core",
    "cost": 3,
    "points": 1,
    "innerPoints": 3,
    "count": 15,
    "text": [
      "+2 power"
    ]
  },
  {
    "name": "Insane Outcast",
    "aspect": "-",
    "race": "drow",
    "expansion": "core",
    "cost": -1,
    "points": null,
    "innerPoints": -1,
    "count": 30,
    "text": [
      "Discard a card from your hand > Return Insane Outcast to the supply.",
      "If Insane Outcast would be devoured or promoted, return it to the supply instead."
    ]
  },
  {
    "name": "Noble",
    "aspect": "obedience",
    "race": "drow",
    "expansion": "starter",
    "cost": -1,
    "points": 0,
    "innerPoints": 1,
    "count": 28,
    "text": [
      "+1 influence"
    ]
  },
  {
    "name": "Soldier",
    "aspect": "obedience",
    "race": "drow",
    "expansion": "starter",
    "cost": -1,
    "points": 0,
    "innerPoints": 1,
    "count": 12,
    "text": [
      "+1 power"
    ]
  },
  {
    "name": "Blackguard",
    "aspect": "malice",
    "race": "drow",
    "expansion": "drow",
    "cost": 3,
    "points": 1,
    "innerPoints": 3,
    "count": 4,
    "text": [
      "Choose one:",
      "- +2 power",
      "- Assassinate a troop."
    ]
  },
  {
    "name": "Bounty Hunter",
    "aspect": "malice",
    "race": "drow",
    "expansion": "drow",
    "cost": 4,
    "points": 2,
    "innerPoints": 4,
    "count": 2,
    "text": [
      "+3 power"
    ]
  },
  {
    "name": "Doppelganger",
    "aspect": "malice",
    "race": "doppelganger",
    "expansion": "drow",
    "cost": 5,
    "points": 3,
    "innerPoints": 5,
    "count": 2,
    "text": [
      "Supplant a troop."
    ]
  },
  {
    "name": "Deathblade",
    "aspect": "malice",
    "race": "drow",
    "expansion": "drow",
    "cost": 6,
    "points": 3,
    "innerPoints": 6,
    "count": 1,
    "text": [
      "Assassinate 2 troops."
    ]
  },
  {
    "name": "Inquisitor",
    "aspect": "malice",
    "race": "drow",
    "expansion": "drow",
    "cost": 3,
    "points": 2,
    "innerPoints": 4,
    "count": 1,
    "text": [
      "Choose one:",
      "- +2 influence",
      "- Assassinate a troop."
    ]
  },
  {
    "name": "Advance Scout",
    "aspect": "conquest",
    "race": "drow",
    "expansion": "drow",
    "cost": 3,
    "points": 1,
    "innerPoints": 3,
    "count": 3,
    "text": [
      "Supplant a white troop."
    ]
  },
  {
    "name": "Mercenary Squad",
    "aspect": "conquest",
    "race": "drow",
    "expansion": "drow",
    "cost": 3,
    "points": 1,
    "innerPoints": 4,
    "count": 2,
    "text": [
      "Deploy 3 troops."
    ]
  },
  {
    "name": "Underdark Ranger",
    "aspect": "conquest",
    "race": "drow",
    "expansion": "drow",
    "cost": 4,
    "points": 2,
    "innerPoints": 4,
    "count": 2,
    "text": [
      "Assassinate 2 white troops."
    ]
  },
  {
    "name": "Master of Melee-Magthere",
    "aspect": "conquest",
    "race": "drow",
    "expansion": "drow",
    "cost": 5,
    "points": 2,
    "innerPoints": 5,
    "count": 2,
    "text": [
      "Choose one:",
      "- Deploy 4 troops.",
      "- Supplant a white troop anywhere on the board."
    ]
  },
  {
    "name": "Weaponmaster",
    "aspect": "conquest",
    "race": "drow",
    "expansion": "drow",
    "cost": 6,
    "points": 3,
    "innerPoints": 6,
    "count": 1,
    "text": [
      "Choose three times:",
      "- Deploy a troop.",
      "- Assassinate a white troop."
    ]
  },
  {
    "name": "Spellspinner",
    "aspect": "guile",
    "race": "drow",
    "expansion": "drow",
    "cost": 3,
    "points": 1,
    "innerPoints": 3,
    "count": 3,
    "text": [
      "Choose one:",
      "- Place a spy.",
      "- Return one of your spies > Supplant a troop at that spy's site."
    ]
  },
  {
    "name": "Spy Master",
    "aspect": "guile",
    "race": "drow",
    "expansion": "drow",
    "cost": 2,
    "points": 1,
    "innerPoints": 2,
    "count": 2,
    "text": [
      "Place a spy."
    ]
  },
  {
    "name": "Infiltrator",
    "aspect": "guile",
    "race": "drow",
    "expansion": "drow",
    "cost": 3,
    "points": 1,
    "innerPoints": 2,
    "count": 2,
    "text": [
      "Place a spy. If another player's troop is at that site, gain 1 power."
    ]
  },
  {
    "name": "Information Broker",
    "aspect": "guile",
    "race": "drow",
    "expansion": "drow",
    "cost": 5,
    "points": 2,
    "innerPoints": 5,
    "count": 2,
    "text": [
      "Choose one:",
      "- Place a spy.",
      "- Return one of your spies > Draw 3 cards."
    ]
  },
  {
    "name": "Masters of Sorcere",
    "aspect": "guile",
    "race": "drow",
    "expansion": "drow",
    "cost": 5,
    "points": 2,
    "innerPoints": 5,
    "count": 1,
    "text": [
      "Choose one:",
      "- Place 2 spies.",
      "- Return one of your spies > +4 power."
    ]
  },
  {
    "name": "Advocate",
    "aspect": "abmition",
    "race": "drow",
    "expansion": "drow",
    "cost": 2,
    "points": 1,
    "innerPoints": 2,
    "count": 4,
    "text": [
      "Choose one:",
      "- +2 influence.",
      "- At end of turn, promote another card played this turn."
    ]
  },
  {
    "name": "Chosen of Lloth",
    "aspect": "ambition",
    "race": "drow",
    "expansion": "drow",
    "cost": 4,
    "points": 2,
    "innerPoints": 4,
    "count": 2,
    "text": [
      "Return another player's troop or spy.",
      "At end of turn, promote another card played this turn."
    ]
  },
  {
    "name": "Drow Negotiator",
    "aspect": "ambition",
    "race": "drow",
    "expansion": "drow",
    "cost": 3,
    "points": 1,
    "innerPoints": 2,
    "count": 2,
    "text": [
      "If there are 4 or more cards in your inner circle, gain +3 influence.",
      "At end of turn, promote another card played this turn."
    ]
  },
  {
    "name": "Council Member",
    "aspect": "ambition",
    "race": "drow",
    "expansion": "drow",
    "cost": 6,
    "points": 3,
    "innerPoints": 6,
    "count": 1,
    "text": [
      "Move up to 2 enemy troops.",
      "At end of turn, promote another card played this turn."
    ]
  },
  {
    "name": "Matron Mother",
    "aspect": "ambition",
    "race": "drow",
    "expansion": "drow",
    "cost": 6,
    "points": 3,
    "innerPoints": 6,
    "count": 1,
    "text": [
      "Put your deck into your discard pile. Then promote a card from your discard pile."
    ]
  },
  {
    "name": "Dragon Cultist",
    "aspect": "malice",
    "race": "human",
    "expansion": "dragons",
    "cost": 3,
    "points": 1,
    "innerPoints": 4,
    "count": 4,
    "text": [
      "Choose one:",
      "- +2 power",
      "- +2 influence"
    ]
  },
  {
    "name": "Red Wyrmling",
    "aspect": "malice",
    "race": "dragon",
    "expansion": "dragons",
    "cost": 5,
    "points": 3,
    "innerPoints": 5,
    "count": 2,
    "text": [
      "+2 power",
      "+2 influence"
    ]
  },
  {
    "name": "Dragonclaw",
    "aspect": "malice",
    "race": "human",
    "expansion": "dragons",
    "cost": 4,
    "points": 1,
    "innerPoints": 3,
    "count": 2,
    "text": [
      "Assassinate a troop. Then, if you have 5 or more player troops in your trophy hall, gain +2 power."
    ]
  },
  {
    "name": "Severin Silrajin",
    "aspect": "malice",
    "race": "human",
    "expansion": "dragons",
    "cost": 7,
    "points": 4,
    "innerPoints": 8,
    "count": 1,
    "text": [
      "+5 power"
    ]
  },
  {
    "name": "Red Dragon",
    "aspect": "malice",
    "race": "dragon",
    "expansion": "dragons",
    "cost": 8,
    "points": 4,
    "innerPoints": 8,
    "count": 1,
    "text": [
      "Supplant a troop.",
      "Return an enemy spy.",
      "Gain 1 VP for each site under your total control."
    ]
  },
  {
    "name": "Kobold",
    "aspect": "conquest",
    "race": "kobold",
    "expansion": "dragons",
    "cost": 1,
    "points": 1,
    "innerPoints": 2,
    "count": 3,
    "text": [
      "Choose one:",
      "- Deploy a troop.",
      "- Assassinate a white troop."
    ]
  },
  {
    "name": "White Wyrmling",
    "aspect": "conquest",
    "race": "dragon",
    "expansion": "dragons",
    "cost": 2,
    "points": 1,
    "innerPoints": 3,
    "count": 3,
    "text": [
      "Deploy 2 troops.",
      "You may devour a card in the market."
    ]
  },
  {
    "name": "Black Wyrmling",
    "aspect": "conquest",
    "race": "dragon",
    "expansion": "dragons",
    "cost": 3,
    "points": 1,
    "innerPoints": 4,
    "count": 2,
    "text": [
      "+1 influence",
      "Assassinate a white troop."
    ]
  },
  {
    "name": "White Dragon",
    "aspect": "conquest",
    "race": "dragon",
    "expansion": "dragons",
    "cost": 6,
    "points": 2,
    "innerPoints": 5,
    "count": 1,
    "text": [
      "Deploy 3 troops.",
      "Gain 1 VP for every 2 sites you control."
    ]
  },
  {
    "name": "Black Dragon",
    "aspect": "conquest",
    "race": "dragon",
    "expansion": "dragons",
    "cost": 7,
    "points": 3,
    "innerPoints": 7,
    "count": 1,
    "text": [
      "Supplant a white troop anywhere on the board.",
      "Gain 1 VP for every 3 white troops in your trophy hall."
    ]
  },
  {
    "name": "Watcher of Thay",
    "aspect": "guile",
    "race": "human",
    "expansion": "dragons",
    "cost": 3,
    "points": 2,
    "innerPoints": 3,
    "count": 3,
    "text": [
      "Choose one:",
      "- Place a spy.",
      "- Return one of your spies > +3 influence"
    ]
  },
  {
    "name": "Enchanter of Thay",
    "aspect": "guile",
    "race": "human",
    "expansion": "dragons",
    "cost": 4,
    "points": 1,
    "innerPoints": 3,
    "count": 3,
    "text": [
      "Choose one:",
      "- Place a spy.",
      "- Return one of your spies > +4 power"
    ]
  },
  {
    "name": "Green Wyrmling",
    "aspect": "guile",
    "race": "dragon",
    "expansion": "dragons",
    "cost": 4,
    "points": 2,
    "innerPoints": 4,
    "count": 2,
    "text": [
      "Place a spy. If another player's troop is at that site, gain +2 influence."
    ]
  },
  {
    "name": "Rath Modar",
    "aspect": "guile",
    "race": "human",
    "expansion": "dragons",
    "cost": 6,
    "points": 2,
    "innerPoints": 5,
    "count": 1,
    "text": [
      "Draw 2 cards.",
      "Place a spy."
    ]
  },
  {
    "name": "Green Dragon",
    "aspect": "guile",
    "race": "dragon",
    "expansion": "dragons",
    "cost": 7,
    "points": 3,
    "innerPoints": 7,
    "count": 1,
    "text": [
      "Choose one:",
      "- Place a spy, then supplant a troop at that spy's site.",
      "- Return one of your spies > Supplant a troop at that spy's site, then gain 1 VP for each site control market you have."
    ]
  },
  {
    "name": "Cult Fanatic",
    "aspect": "ambition",
    "race": "half-dragon",
    "expansion": "dragons",
    "cost": 3,
    "points": 1,
    "innerPoints": 4,
    "count": 2,
    "text": [
      "+2 influence",
      "You may devour a card in the market."
    ]
  },
  {
    "name": "Cleric of Loagzed",
    "aspect": "ambition",
    "race": "troglodyte",
    "expansion": "dragons",
    "cost": 4,
    "points": 2,
    "innerPoints": 4,
    "count": 2,
    "text": [
      "Move an enemy troop.",
      "At end of turn, promote another card played this turn."
    ]
  },
  {
    "name": "Wyrmspeaker",
    "aspect": "ambition",
    "race": "dwarf",
    "expansion": "dragons",
    "cost": 3,
    "points": 1,
    "innerPoints": 3,
    "count": 3,
    "text": [
      "+1 influence",
      "At end of turn, promote another card played this turn."
    ]
  },
  {
    "name": "Blue Wyrmling",
    "aspect": "ambition",
    "race": "dragon",
    "expansion": "dragons",
    "cost": 5,
    "points": 2,
    "innerPoints": 4,
    "count": 2,
    "text": [
      "+3 influence",
      "Return another player's troop or spy."
    ]
  },
  {
    "name": "Blue Dragon",
    "aspect": "ambition",
    "race": "dragon",
    "expansion": "dragons",
    "cost": 8,
    "points": 4,
    "innerPoints": 8,
    "count": 1,
    "text": [
      "At end of turn, promote up to 2 other cards played this turn, then gain 1 VP for every 3 cards in your inner circle."
    ]
  }
]

const cards = []
const byExpansion = {}
const byId = {}
const byName = {}
for (const data of baseData) {
  for (let i = 0; i < data.count; i++) {
    const id = data.name.toLowerCase().replace(' ', '-') + '-' + i
    const card = new Card(id, data)

    cards.push(card)
    byId[card.id] = card

    if (!byExpansion.hasOwnProperty(card.expansion)) {
      byExpansion[card.expansion] = []
    }
    byExpansion[card.expansion].push(card)

    if (!byName.hasOwnProperty(card.name)) {
      byName[card.name] = []
    }
    byName[card.name].push(card)
  }
}

module.exports = {
  all: cards,
  byExpansion,
  byId,
  byName,
}
