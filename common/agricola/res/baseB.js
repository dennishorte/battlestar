const cardData = [
  {
    id: 'mini_pasture',
    name: 'Mini Pasture',
    type: 'minor improvement',
    cost: { food: '2' },
    vps: 0,
    prereqs: [],
    passLeft: true,
    text: [
      'Immediately fence a farmyard space, without paying wood for the fences. (If you already have pastures, the new one must be adjacent to an existing one.)'
    ],
    players: 1,
  },
  {
    id: 'market_stall',
    name: 'Market Stall',
    type: 'minor improvement',
    cost: { grain: '1' },
    vps: 0,
    prereqs: [],
    passLeft: true,
    text: [
      'You immediately get 1 vegetable. (Effectively, you are exchanging 1 grain for 1 vegetable).'
    ],
    players: 1,
  },
  {
    id: 'caravan',
    name: 'Caravan',
    type: 'minor improvement',
    cost: { wood: '3', food: '3' },
    vps: 0,
    prereqs: [],
    passLeft: false,
    text: [ 'This card provides room for 1 person.' ],
    players: 1,
  },
  {
    id: "carpenter_s_parlor",
    name: "Carpenter's Parlor",
    type: 'minor improvement',
    cost: { wood: '1', stone: '1' },
    vps: 0,
    prereqs: [],
    passLeft: false,
    text: [ 'Wooden rooms only cost you 2 wood and 2 reed each.' ],
    players: 1,
  },
  {
    id: 'mining_hammer',
    name: 'Mining Hammer',
    type: 'minor improvement',
    cost: { wood: '1' },
    vps: 0,
    prereqs: [],
    passLeft: false,
    text: [
      'When you play this card, you immediately get 1 food. Each time you renovate, you can also build a stable without paying wood.'
    ],
    players: 1,
  },
  {
    id: 'moldboard_plow',
    name: 'Moldboard Plow',
    type: 'minor improvement',
    cost: { wood: '2' },
    vps: 0,
    prereqs: [ '1 Occupation' ],
    passLeft: false,
    text: [
      'Place 2 field tiles on this card. Twice this game, when you use the "Farmland" action space, you can also plow 1 field from this card.'
    ],
    players: 1,
  },
  {
    id: 'lasso',
    name: 'Lasso',
    type: 'minor improvement',
    cost: { reed: '1' },
    vps: 0,
    prereqs: [],
    passLeft: false,
    text: [
      'You can place exactly two people immediately after one another if at least one of them uses the "Sheep Market", "Pig Market", or "Cattle Market" accumulation space.'
    ],
    players: 1,
  },
  {
    id: 'bread_paddle',
    name: 'Bread Paddle',
    type: 'minor improvement',
    cost: { wood: '1' },
    vps: 0,
    prereqs: [],
    passLeft: false,
    text: [
      'When you play this card, you immediately get 1 food. For each occupation you play, you get an additional "Bake Bread" action.'
    ],
    players: 1,
  },
  {
    id: 'mantlepiece',
    name: 'Mantlepiece',
    type: 'minor improvement',
    cost: { stone: '1' },
    vps: -3,
    prereqs: [ 'Clay or Stone House' ],
    passLeft: false,
    text: [
      'When you play this card, you immediately get 1 bonus point for each complete round left to play. You may no longer renovate your house.'
    ],
    players: 1,
  },
  {
    id: 'bottles',
    name: 'Bottles',
    type: 'minor improvement',
    cost: { special: 'TBD' },
    vps: 4,
    prereqs: [],
    passLeft: false,
    text: [
      'For each person you have, you must pay an additional 1 clay and 1 food to play this card.'
    ],
    players: 1,
  },
  {
    id: 'loom',
    name: 'Loom',
    type: 'minor improvement',
    cost: { wood: '1' },
    vps: 1,
    prereqs: [ '2 Occupations' ],
    passLeft: false,
    text: [
      'In the field phase of each harvest, if you have at least 1/4/7 sheep, you get 1/2/3 food. During scoring, you get 1 bonus point for every 3 sheep.'
    ],
    players: 1,
  },
  {
    id: 'strawberry_patch',
    name: 'Strawberry Patch',
    type: 'minor improvement',
    cost: { wood: '1' },
    vps: 2,
    prereqs: [ '2 Vegetable Fields' ],
    passLeft: false,
    text: [
      'Place 1 food on each of the next 3 round spaces. At the start of these rounds, you get the food.'
    ],
    players: 1,
  },
  {
    id: 'herring_pot',
    name: 'Herring Pot',
    type: 'minor improvement',
    cost: { clay: '1' },
    vps: 0,
    prereqs: [],
    passLeft: false,
    text: [
      'Each time you use the "Fishing" accumulation space, place 1 food on each of the next 3 round spaces. At the start of these rounds, you get the food.'
    ],
    players: 1,
  },
  {
    id: 'butter_churn',
    name: 'Butter Churn',
    type: 'minor improvement',
    cost: { wood: '1' },
    vps: 1,
    prereqs: [ 'At Most 3 Occupations' ],
    passLeft: false,
    text: [
      'In the field phase of each harvest, you get 1 food for every 3 sheep and 1 food for every 2 cattle you have.'
    ],
    players: 1,
  },
  {
    id: 'brook',
    name: 'Brook',
    type: 'minor improvement',
    cost: [],
    vps: 0,
    prereqs: [ '1 of Your People on "Fishing"' ],
    passLeft: false,
    text: [
      'Each time you use one of the four action spaces above the "Fishing" accumulation space, you get 1 additional food. (These are, Forest, Clay Pit, Reed Bank, and the first action card.)'
    ],
    players: 1,
  },
  {
    id: 'scullery',
    name: 'Scullery',
    type: 'minor improvement',
    cost: { wood: '1', clay: '1' },
    vps: 0,
    prereqs: [],
    passLeft: false,
    text: [
      'At the start of each round, if you live in a wooden house, you get 1 food.'
    ],
    players: 1,
  },
  {
    id: 'three_field_rotation',
    name: 'Three-Field Rotation',
    type: 'minor improvement',
    cost: [],
    vps: 0,
    prereqs: [ '3 Occupations' ],
    passLeft: false,
    text: [
      'At the start of the field phase of each harvest, if you have at least 1 grain field, 1 vegetable field, and 1 empty field, you get 3 food.'
    ],
    players: 1,
  },
  {
    id: 'pitchfork',
    name: 'Pitchfork',
    type: 'minor improvement',
    cost: { wood: '1' },
    vps: 0,
    prereqs: [],
    passLeft: false,
    text: [
      'Each time you use the "Grain Seeds" action space, if the "Farmland" action space is occupied you also get 3 food.'
    ],
    players: 1,
  },
  {
    id: 'sack_cart',
    name: 'Sack Cart',
    type: 'minor improvement',
    cost: { wood: '2' },
    vps: 0,
    prereqs: [ '2 Occupations' ],
    passLeft: false,
    text: [
      'Place 1 grain each on the remaining spaces for rounds 5, 8, 11, and 14. At the start of these rounds, you get the grain.'
    ],
    players: 1,
  },
  {
    id: 'beanfield',
    name: 'Beanfield',
    type: 'minor improvement',
    cost: { food: '1' },
    vps: 1,
    prereqs: [ '2 Occupations' ],
    passLeft: false,
    text: [ 'This card is a field that can only grow vegetables.' ],
    players: 1,
  },
  {
    id: 'thick_forest',
    name: 'Thick Forest',
    type: 'minor improvement',
    cost: [],
    vps: 0,
    prereqs: [ '5 Clay in Your Supply' ],
    passLeft: false,
    text: [
      'Place 1 wood on each remaining even-numbered round space. At the start of these rounds, you get the wood.'
    ],
    players: 1,
  },
  {
    id: 'loam_pit',
    name: 'Loam Pit',
    type: 'minor improvement',
    cost: { food: '1' },
    vps: 1,
    prereqs: [ '3 Occupations' ],
    passLeft: false,
    text: [
      'Each time you use the "Day Laborer" action space, you also get 3 clay.'
    ],
    players: 1,
  },
  {
    id: 'hard_porcelain',
    name: 'Hard Porcelain',
    type: 'minor improvement',
    cost: { clay: '1' },
    vps: 0,
    prereqs: [],
    passLeft: false,
    text: [ 'At any time, you can exchange 2/3/4 clay for 1/2/3 stone.' ],
    players: 1,
  },
  {
    id: 'acorns_basket',
    name: 'Acorns Basket',
    type: 'minor improvement',
    cost: { reed: '1' },
    vps: 0,
    prereqs: [ '3 Occupations' ],
    passLeft: false,
    text: [
      'Place 1 wild boar on each of the 2 round spaces. At the start of these rounds, you get the wild boar.'
    ],
    players: 1,
  },
  {
    id: 'cottager',
    name: 'Cottager',
    type: 'occupation',
    cost: [],
    vps: 0,
    prereqs: [],
    passLeft: false,
    text: [
      'Each time you use the "Day Laborer" action space, you can also either build exactly 1 room or renovate your house. Either way, you have to pay the cost.'
    ],
    players: 1,
  },
  {
    id: 'groom',
    name: 'Groom',
    type: 'occupation',
    cost: [],
    vps: 0,
    prereqs: [],
    passLeft: false,
    text: [
      'When you play this card, you immediately get 1 wood. Once you live in a stone house, at the start of each round, you can build exactly 1 stable for 1 wood.'
    ],
    players: 1,
  },
  {
    id: 'assistant_tiller',
    name: 'Assistant Tiller',
    type: 'occupation',
    cost: [],
    vps: 0,
    prereqs: [],
    passLeft: false,
    text: [
      'Each time you use the "Day Laborer" action space, you can also plow 1 field.'
    ],
    players: 1,
  },
  {
    id: 'master_bricklayer',
    name: 'Master Bricklayer',
    type: 'occupation',
    cost: [],
    vps: 0,
    prereqs: [],
    passLeft: false,
    text: [
      'Each time you build a major improvement, reduce the stone cost by the number of rooms you have built onto you initial house.'
    ],
    players: 1,
  },
  {
    id: 'scholar',
    name: 'Scholar',
    type: 'occupation',
    cost: [],
    vps: 0,
    prereqs: [],
    passLeft: false,
    text: [
      'Once you live in a stone house, at the start of each round, you can play an occupation for an occupation cost of 1 food, or a minor improvement (by paying its cost).'
    ],
    players: 1,
  },
  {
    id: 'organic_farmer',
    name: 'Organic Farmer',
    type: 'occupation',
    cost: [],
    vps: 0,
    prereqs: [],
    passLeft: false,
    text: [
      'During the scoring, you get 1 bonus point for each pasture containing at least 1 animal while having unused capacity for at least three more animals.'
    ],
    players: 1,
  },
  {
    id: 'tutor',
    name: 'Tutor',
    type: 'occupation',
    cost: [],
    vps: 0,
    prereqs: [],
    passLeft: false,
    text: [
      'During scoring, you get 1 bonus point for each occupation played after this one.'
    ],
    players: 1,
  },
  {
    id: 'consultant',
    name: 'Consultant',
    type: 'occupation',
    cost: [],
    vps: 0,
    prereqs: [],
    passLeft: false,
    text: [
      'When you play this card in a 1-/2-/3-/4- player game, you immediately get 2 grain/3 clay/2 reed/2 sheep.'
    ],
    players: 1,
  },
  {
    id: 'sheep_walker',
    name: 'Sheep Walker',
    type: 'occupation',
    cost: [],
    vps: 0,
    prereqs: [],
    passLeft: false,
    text: [
      'At any time, you can exchange 1 sheep for either 1 wild boar, 1 vegetable, or 1 stone.'
    ],
    players: 1,
  },
  {
    id: 'manservant',
    name: 'Manservant',
    type: 'occupation',
    cost: [],
    vps: 0,
    prereqs: [],
    passLeft: false,
    text: [
      'Once you live in a stone house, place 3 food on each remaining round space. At the start of these rounds, you get the food.'
    ],
    players: 1,
  },
  {
    id: 'oven_firing_boy',
    name: 'Oven Firing Boy',
    type: 'occupation',
    cost: [],
    vps: 0,
    prereqs: [],
    passLeft: false,
    text: [
      'Each time you use a wood accumulation space, you get an additional "Bake Bread" action.'
    ],
    players: 1,
  },
  {
    id: 'paper_maker',
    name: 'Paper Maker',
    type: 'occupation',
    cost: [],
    vps: 0,
    prereqs: [],
    passLeft: false,
    text: [
      'Immediately before playing each occupation after this one, you can pay 1 wood total to get 1 food for each occupation you have in front of you.'
    ],
    players: 1,
  },
  {
    id: 'childless',
    name: 'Childless',
    type: 'occupation',
    cost: [],
    vps: 0,
    prereqs: [],
    passLeft: false,
    text: [
      'At the start of each round, if you have at least 3 rooms but only 2 people, you get 1 food and 1 crop of your choice (grain or vegetable)'
    ],
    players: 1,
  },
  {
    id: 'small_scale_farmer',
    name: 'Small-scale Farmer',
    type: 'occupation',
    cost: [],
    vps: 0,
    prereqs: [],
    passLeft: false,
    text: [
      'As long as you live in a house with exactly 2 rooms, at the start of each round, you get 1 wood.'
    ],
    players: 1,
  },
  {
    id: 'geologist',
    name: 'Geologist',
    type: 'occupation',
    cost: [],
    vps: 0,
    prereqs: [],
    passLeft: false,
    text: [
      'Each time you use the "Forest" or "Reed Bank" accumulation space, you also get 1 clay. In games with 3 or more players, this also applies to the "Clay Pit".'
    ],
    players: 1,
  },
  {
    id: 'roof_ballaster',
    name: 'Roof Ballaster',
    type: 'occupation',
    cost: [],
    vps: 0,
    prereqs: [],
    passLeft: false,
    text: [
      'When you play this card, you can immediately pay 1 food to get 1 stone for each room you have.'
    ],
    players: 1,
  },
  {
    id: 'carpenter',
    name: 'Carpenter',
    type: 'occupation',
    cost: [],
    vps: 0,
    prereqs: [],
    passLeft: false,
    text: [
      'Every new room only costs you 3 of the appropriate building resource and 2 reed (e.g. if you live in a wooden house, 3 wood and 2 reed).'
    ],
    players: 1,
  },
  {
    id: 'house_steward',
    name: 'House Steward',
    type: 'occupation',
    cost: [],
    vps: 0,
    prereqs: [],
    passLeft: false,
    text: [
      'If there are still 1/3/6/9 complete rounds left to play, you immediately get 1/2/3/4 wood. During scoring, each player with the most rooms gets 3 bonus points.'
    ],
    players: 1,
  },
  {
    id: 'greengrocer',
    name: 'Greengrocer',
    type: 'occupation',
    cost: [],
    vps: 0,
    prereqs: [],
    passLeft: false,
    text: [
      'Each time you use the "Grain Seeds" action space, you also get 1 vegetable.'
    ],
    players: 1,
  },
  {
    id: 'brushwood_collector',
    name: 'Brushwood Collector',
    type: 'occupation',
    cost: [],
    vps: 0,
    prereqs: [],
    passLeft: false,
    text: [
      'Each time you renovate or build a room, you can replace the required 1 or 2 reed with a total of 1 wood.'
    ],
    players: 1,
  },
  {
    id: 'storehouse_keeper',
    name: 'Storehouse Keeper',
    type: 'occupation',
    cost: [],
    vps: 0,
    prereqs: [],
    passLeft: false,
    text: [
      'Each time you use the "resource Market" action space, you also get your choice of 1 clay or 1 grain.'
    ],
    players: 1,
  },
  {
    id: 'pastor',
    name: 'Pastor',
    type: 'occupation',
    cost: [],
    vps: 0,
    prereqs: [],
    passLeft: false,
    text: [
      'Once you are the only player to live in a house with only 2 rooms, you immediately get 3 wood, 2 clay, 1 reed, and 1 stone (only once).'
    ],
    players: 1,
  },
  {
    id: 'sheep_whisperer',
    name: 'Sheep Whisperer',
    type: 'occupation',
    cost: [],
    vps: 0,
    prereqs: [],
    passLeft: false,
    text: [
      'Add 2, 5, 8, and 10 to the current round and place 1 sheep on each corresponding round space. At the start of these rounds, you get the sheep.'
    ],
    players: 1,
  },
  {
    id: 'cattle_feeder',
    name: 'Cattle Feeder',
    type: 'occupation',
    cost: [],
    vps: 0,
    prereqs: [],
    passLeft: false,
    text: [
      'Each time you use the "Grain Seeds" action space, you can also buy 1 cattle for 1 food.'
    ],
    players: 1,
  },
]

const Card = require('../card.js')

const common = {
  expansion: 'revised',
  deck: 'A',
}

const cards = cardData
  .map(datum => Object.assign({}, common, datum))
  .map(datum => Card.fromObject(datum))

module.exports = {
  minorImprovements: cards.filter(c => c.type === 'minor improvement'),
  occupations: cards.filter(c => c.type === 'occupation'),
}
