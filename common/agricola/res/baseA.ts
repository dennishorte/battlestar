import { CardData, fromObject, Card } from '../card.js'

const cardData: CardData[] = [
  {
    id: 'shifting_cultivation',
    name: 'Shifting Cultivation',
    type: 'minor improvement',
    cost: { food: '2' },
    vps: 0,
    prereqs: [],
    passLeft: true,
    text: [ 'Immediately plow 1 field.' ],
    players: 1,
  },
  {
    id: 'clay_embankment',
    name: 'Clay Embankment',
    type: 'minor improvement',
    cost: { food: '1' },
    vps: 0,
    prereqs: [],
    passLeft: true,
    text: [
      'You immediately get 1 clay for every 2 clay you already have in your supply.'
    ],
    players: 1,
  },
  {
    id: 'young_animal market',
    name: 'Young Animal Market',
    type: 'minor improvement',
    cost: { sheep: '1' },
    vps: 0,
    prereqs: [],
    passLeft: true,
    text: [
      'You immediately get 1 cattle. (Effectively, you are exchanging 1 sheep for 1 cattle.)'
    ],
    players: 1,
  },
  {
    id: 'drinking_trough',
    name: 'Drinking Trough',
    type: 'minor improvement',
    cost: { clay: '1' },
    vps: 0,
    prereqs: [],
    passLeft: false,
    text: [
      'Each of your pastures (with or without a stable) can hold up to 2 more animals.'
    ],
    players: 1,
  },
  {
    id: 'rammed_clay',
    name: 'Rammed Clay',
    type: 'minor improvement',
    cost: [],
    vps: 0,
    prereqs: [],
    passLeft: false,
    text: [
      'When you play this card, you immediately get 1 clay. You can use clay instead of wood to build fences.'
    ],
    players: 1,
  },
  {
    id: 'handplow',
    name: 'Handplow',
    type: 'minor improvement',
    cost: { wood: '1' },
    vps: 0,
    prereqs: [],
    passLeft: false,
    text: [
      'Add 5 to the current round and place 1 field tile on the corresponding round space. At the start of that round, you can plow the field.'
    ],
    players: 1,
  },
  {
    id: 'threshing_board',
    name: 'Threshing Board',
    type: 'minor improvement',
    cost: { wood: '1' },
    vps: 1,
    prereqs: [ '2 Occupations' ],
    passLeft: false,
    text: [
      'Each time you use the "Farmland" or "Cultivation" action space, you get an additional "Bake Bread" action.'
    ],
    players: 1,
  },
  {
    id: 'sleeping_corner',
    name: 'Sleeping Corner',
    type: 'minor improvement',
    cost: { wood: '1' },
    vps: 1,
    prereqs: [ '2 Grain Fields' ],
    passLeft: false,
    text: [
      `You can use any "Wish for Children" action space even if it is occupied by one other player's person.`
    ],
    players: 1,
  },
  {
    id: 'manger',
    name: 'Manger',
    type: 'minor improvement',
    cost: { wood: '2' },
    vps: 0,
    prereqs: [],
    passLeft: false,
    text: [
      'During scoring, if your pastures cover at least 6/7/8/10 farm yard spaces, you get 1/2/3/4 bonus points.'
    ],
    players: 1,
  },
  {
    id: 'big_country',
    name: 'Big Country',
    type: 'minor improvement',
    cost: [],
    vps: 0,
    prereqs: [ 'All Farmyard Spaces Used' ],
    passLeft: false,
    text: [
      'For each complete round left to play, you immediately get 1 bonus point and 2 food.'
    ],
    players: 1,
  },
  {
    id: 'wool_blankets',
    name: 'Wool Blankets',
    type: 'minor improvement',
    cost: [],
    vps: 0,
    prereqs: [ '5 Sheep' ],
    passLeft: false,
    text: [
      'During scoring, if you live in a wooden/clay/stone house by then, you get 3/2/0 bonus points.'
    ],
    players: 1,
  },
  {
    id: 'pond_hut',
    name: 'Pond Hut',
    type: 'minor improvement',
    cost: { wood: '1' },
    vps: 1,
    prereqs: [ 'Exactly 2 Occupations' ],
    passLeft: false,
    text: [
      'Place 1 food on each of the next 3 round spaces. At the start of these rounds, you get the food.'
    ],
    players: 1,
  },
  {
    id: 'milk_jug',
    name: 'Milk Jug',
    type: 'minor improvement',
    cost: { clay: '1' },
    vps: 0,
    prereqs: [],
    passLeft: false,
    text: [
      'Each time any player (including you) uses the "Cattle Market" accumulation space, you get 3 food, and each other player gets 1 food.'
    ],
    players: 1,
  },
  {
    id: 'claypipe',
    name: 'Claypipe',
    type: 'minor improvement',
    cost: { clay: '1' },
    vps: 0,
    prereqs: [],
    passLeft: false,
    text: [
      'In the returning home phase of each round, if you gained at least 7 building resources in the preceding work phase, you get 2 food.'
    ],
    players: 1,
  },
  {
    id: 'junk_room',
    name: 'Junk Room',
    type: 'minor improvement',
    cost: { wood: '1', clay: '1' },
    vps: 0,
    prereqs: [],
    passLeft: false,
    text: [
      'Each time after you build an improvement, including this one, you get 1 food.'
    ],
    players: 1,
  },
  {
    id: 'basket',
    name: 'Basket',
    type: 'minor improvement',
    cost: { reed: '1' },
    vps: 0,
    prereqs: [],
    passLeft: false,
    text: [
      'Immediately after each time you use a wood accumulation space, you can exchange 2 wood for 3 food. If you do, place those 2 wood on the accumulation space.'
    ],
    players: 1,
  },
  {
    id: 'dutch_windmill',
    name: 'Dutch Windmill',
    type: 'minor improvement',
    cost: { wood: '2', stone: '2' },
    vps: 2,
    prereqs: [],
    passLeft: false,
    text: [
      'Each time you take a "Bake Bread" action in a round immediately following a harvest, you get 3 additional food.'
    ],
    players: 1,
  },
  {
    id: 'corn_scoop',
    name: 'Corn Scoop',
    type: 'minor improvement',
    cost: { wood: '1' },
    vps: 0,
    prereqs: [],
    passLeft: false,
    text: [
      'Each time you use the "Grain Seeds" action space, you get 1 additional grain.'
    ],
    players: 1,
  },
  {
    id: 'large_greenhouse',
    name: 'Large Greenhouse',
    type: 'minor improvement',
    cost: { wood: '2' },
    vps: 0,
    prereqs: [ '2 Occupations' ],
    passLeft: false,
    text: [
      'Add 4, 7, and 9 to the current round and place 1 vegetable on each corresponding round space. At the start of these rounds, you get the vegetable.'
    ],
    players: 1,
  },
  {
    id: 'clearing_spade',
    name: 'Clearing Spade',
    type: 'minor improvement',
    cost: { wood: '1' },
    vps: 0,
    prereqs: [],
    passLeft: false,
    text: [
      'At any time, you can move 1 crop from a planted field containing at least 2 crops to an empty field.'
    ],
    players: 1,
  },
  {
    id: 'lumber_mill',
    name: 'Lumber Mill',
    type: 'minor improvement',
    cost: { stone: '2' },
    vps: 2,
    prereqs: [ 'At Most 3 Occupations' ],
    passLeft: false,
    text: [ 'Every improvement costs you 1 wood less.' ],
    players: 1,
  },
  {
    id: 'canoe',
    name: 'Canoe',
    type: 'minor improvement',
    cost: { wood: '2' },
    vps: 1,
    prereqs: [ '1 Occupation' ],
    passLeft: false,
    text: [
      'Each time you use the "Fishing" accumulation space, you get an additional 1 food and 1 reed.'
    ],
    players: 1,
  },
  {
    id: 'stone_tongs',
    name: 'Stone Tongs',
    type: 'minor improvement',
    cost: { wood: '1' },
    vps: 0,
    prereqs: [],
    passLeft: false,
    text: [
      'Each time you use a stone accumulation space, you get 1 additional stone.'
    ],
    players: 1,
  },
  {
    id: "shepherd_s_crook",
    name: "Shepherd's Crook",
    type: 'minor improvement',
    cost: { wood: '1' },
    vps: 0,
    prereqs: [],
    passLeft: false,
    text: [
      'Each time you fence a new pasture covering at least 4 farmyard spaces, you immediately get 2 sheep on this pasture.'
    ],
    players: 1,
  },
  {
    id: 'animal_tamer',
    name: 'Animal Tamer',
    type: 'occupation',
    cost: [],
    vps: 0,
    prereqs: [],
    passLeft: false,
    text: [
      'When you play this card, you immediately get your choice of 1 wood or 1 grain. Instead of just 1 animal total, you can keep any 1 animal in each room of your house.'
    ],
    players: 1,
  },
  {
    id: 'conservator',
    name: 'Conservator',
    type: 'occupation',
    cost: [],
    vps: 0,
    prereqs: [],
    passLeft: false,
    text: [
      'You can renovate your wooden house directly to stone without renovating it to clay first.'
    ],
    players: 1,
  },
  {
    id: 'hedge_keeper',
    name: 'Hedge Keeper',
    type: 'occupation',
    cost: [],
    vps: 0,
    prereqs: [],
    passLeft: false,
    text: [
      'Each time you take a "Build Fences" action, you do not have to pay wood for 3 of the fences you build.'
    ],
    players: 1,
  },
  {
    id: 'plow_driver',
    name: 'Plow Driver',
    type: 'occupation',
    cost: [],
    vps: 0,
    prereqs: [],
    passLeft: false,
    text: [
      'Once you live in a stone house, at the start of each round, you can pay 1 food to plow 1 field.'
    ],
    players: 1,
  },
  {
    id: 'adoptive_parents',
    name: 'Adoptive Parents',
    type: 'occupation',
    cost: [],
    vps: 0,
    prereqs: [],
    passLeft: false,
    text: [
      'For 1 food, you can take an action with offspring in the same round you get it. If you do, the offspring does not count as "newborn".'
    ],
    players: 1,
  },
  {
    id: 'stable_architect',
    name: 'Stable Architect',
    type: 'occupation',
    cost: [],
    vps: 0,
    prereqs: [],
    passLeft: false,
    text: [
      'During scoring, you get 1 bonus point for each unfenced stable in your farmyard.'
    ],
    players: 1,
  },
  {
    id: 'grocer',
    name: 'Grocer',
    type: 'occupation',
    cost: [],
    vps: 0,
    prereqs: [],
    passLeft: false,
    text: [
      'Pile the following goods on this card (wood, grain, reed, stone, vegetable, clay, reed, vegetable). At any time, you can buy the top good for 1 food.'
    ],
    players: 1,
  },
  {
    id: 'mushroom_collector',
    name: 'Mushroom Collector',
    type: 'occupation',
    cost: [],
    vps: 0,
    prereqs: [],
    passLeft: false,
    text: [
      'Immediately after each time you use a wood accumulation space, you can exchange 1 wood for 2 food. If you do, place the wood on the accumulation space.'
    ],
    players: 1,
  },
  {
    id: 'roughcaster',
    name: 'Roughcaster',
    type: 'occupation',
    cost: [],
    vps: 0,
    prereqs: [],
    passLeft: false,
    text: [
      'Each time you build at least 1 clay room or renovate your house from clay to stone, you also get 3 food.'
    ],
    players: 1,
  },
  {
    id: 'wall_builder',
    name: 'Wall Builder',
    type: 'occupation',
    cost: [],
    vps: 0,
    prereqs: [],
    passLeft: false,
    text: [
      'Each time you build at least 1 room, you can place 1 food on each of the next 4 round spaces. At the start of these rounds, you get the food.'
    ],
    players: 1,
  },
  {
    id: 'scythe_worker',
    name: 'Scythe Worker',
    type: 'occupation',
    cost: [],
    vps: 0,
    prereqs: [],
    passLeft: false,
    text: [
      'When you play this card, you immediately get 1 grain. In the filed phase of each harvest, you can harvest 1 additional grain from each of your grain fields.'
    ],
    players: 1,
  },
  {
    id: 'seasonal_worker',
    name: 'Seasonal Worker',
    type: 'occupation',
    cost: [],
    vps: 0,
    prereqs: [],
    passLeft: false,
    text: [
      'Each time you use the "Day Laborer" action space, you get 1 additional grain. From round 6 on, you can choose to get 1 vegetable instead.'
    ],
    players: 1,
  },
  {
    id: 'wood_cutter',
    name: 'Wood Cutter',
    type: 'occupation',
    cost: [],
    vps: 0,
    prereqs: [],
    passLeft: false,
    text: [
      'Each time you use a wood accumulation space, you get 1 additional wood.'
    ],
    players: 1,
  },
  {
    id: 'firewood_collector',
    name: 'Firewood Collector',
    type: 'occupation',
    cost: [],
    vps: 0,
    prereqs: [],
    passLeft: false,
    text: [
      'Each time you use the "Farmland", "Grain Seeds", Grain Utilization", or "Cultivation" action space, at the end of that turn, you get 1 wood.'
    ],
    players: 1,
  },
  {
    id: 'clay_hut builder',
    name: 'Clay Hut Builder',
    type: 'occupation',
    cost: [],
    vps: 0,
    prereqs: [],
    passLeft: false,
    text: [
      'Once you no longer live in a wooden house, place 2 clay on each of the next 5 round spaces. At the start of these rounds, you get the clay.'
    ],
    players: 1,
  },
  {
    id: 'frame_builder',
    name: 'Frame Builder',
    type: 'occupation',
    cost: [],
    vps: 0,
    prereqs: [],
    passLeft: false,
    text: [
      'Each time you build a room/renovate, but only once per room/action, you can replace exactly 2 clay or 2 stone with 1 wood.'
    ],
    players: 1,
  },
  {
    id: 'priest',
    name: 'Priest',
    type: 'occupation',
    cost: [],
    vps: 0,
    prereqs: [],
    passLeft: false,
    text: [
      'When you play this card, if you live in a clay house with exactly 2 rooms, you immediately get 3 clay, 2 reed, and 2 stone.'
    ],
    players: 1,
  },
  {
    id: 'braggart',
    name: 'Braggart',
    type: 'occupation',
    cost: [],
    vps: 0,
    prereqs: [],
    passLeft: false,
    text: [
      'During the scoring, you get 2/3/4/5/7/9 bonus points for having at least 5/6/7/8/9/10 improvements in front of you.'
    ],
    players: 1,
  },
  {
    id: 'harpooner',
    name: 'Harpooner',
    type: 'occupation',
    cost: [],
    vps: 0,
    prereqs: [],
    passLeft: false,
    text: [
      'Each time you use the "Fishing" accumulation space you can also pay 1 wood to get 1 food for each person you have, and 1 reed'
    ],
    players: 1,
  },
  {
    id: 'stonecutter',
    name: 'Stonecutter',
    type: 'occupation',
    cost: [],
    vps: 0,
    prereqs: [],
    passLeft: false,
    text: [ 'Every improvement, room, and renovation costs you 1 stone less.' ],
    players: 1,
  },
  {
    id: 'animal_dealer',
    name: 'Animal Dealer',
    type: 'occupation',
    cost: [],
    vps: 0,
    prereqs: [],
    passLeft: false,
    text: [
      'Each time you use the "Sheep Market", "Pig Market", "or "Cattle Market" accumulation space, you can buy 1 additional animal of the respective type for 1 food.'
    ],
    players: 1,
  },
  {
    id: 'conjurer',
    name: 'Conjurer',
    type: 'occupation',
    cost: [],
    vps: 0,
    prereqs: [],
    passLeft: false,
    text: [
      'Each time you use the "traveling Players" accumulation space, you get an additional 1 wood and 1 grain.'
    ],
    players: 1,
  },
  {
    id: 'lutenist',
    name: 'Lutenist',
    type: 'occupation',
    cost: [],
    vps: 0,
    prereqs: [],
    passLeft: false,
    text: [
      'Each time another player uses the "Traveling Players" accumulation space, you get 1 food and 1 wood. Immediately after, you can buy exactly 1 vegetable for 2 food.'
    ],
    players: 1,
  },
  {
    id: 'pig_breeder',
    name: 'Pig Breeder',
    type: 'occupation',
    cost: [],
    vps: 0,
    prereqs: [],
    passLeft: false,
    text: [
      'When you play this card, you immediately get 1 wild boar. Your wild boar breed at the end of round 12 (if there is room for the new wild boar).'
    ],
    players: 1,
  },
]

const common: CardData = {
  expansion: 'revised',
  deck: 'A',
}

const cards: Card[] = cardData
  .map(datum => Object.assign({}, common, datum))
  .map(datum => fromObject(datum))

export default {
  minorImprovements: cards.filter(c => c.type === 'minor improvement'),
  occupations: cards.filter(c => c.type === 'occupation'),
}
