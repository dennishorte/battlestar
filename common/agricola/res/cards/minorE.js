/**
 * Minor Improvements E Cards for Agricola (Revised Edition)
 * Cards E001-E084 - A standalone minor improvements deck
 */

const minorImprovements = [
  {
    id: 'pole-barns-e001',
    name: 'Pole Barns',
    deck: 'minorE',
    number: 1,
    type: 'minor',
    cost: { wood: 2 },
    prereqs: { fences: 15 },
    text: 'You can immediately build up to 3 stables at no cost.',
    onPlay(game, player) {
      game.actions.buildFreeStables(player, this, 3)
    },
  },
  {
    id: 'renovation-materials-e002',
    name: 'Renovation Materials',
    deck: 'minorE',
    number: 2,
    type: 'minor',
    cost: { clay: 3, reed: 1 },
    prereqs: { houseType: 'wood' },
    text: 'Immediately renovate to clay at no cost.',
    onPlay(game, player) {
      game.actions.freeRenovation(player, this, 'clay')
    },
  },
  {
    id: 'tea-time-e003',
    name: 'Tea Time',
    deck: 'minorE',
    number: 3,
    type: 'minor',
    cost: { food: 1 },
    prereqs: { personOnAction: 'grain-utilization' },
    text: 'Immediately return your person on the "Grain Utilization" action space home; you can place it again later this round.',
    onPlay(game, player) {
      game.actions.returnWorkerFromAction(player, 'grain-utilization')
    },
  },
  {
    id: 'thunderbolt-e004',
    name: 'Thunderbolt',
    deck: 'minorE',
    number: 4,
    type: 'minor',
    cost: {},
    prereqs: { grainFields: 1 },
    text: 'Immediately remove all grain from one of your fields to the general supply. Gain 2 wood for each grain you just removed.',
    onPlay(game, player) {
      game.actions.thunderboltExchange(player, this)
    },
  },
  {
    id: 'night-loot-e005',
    name: 'Night Loot',
    deck: 'minorE',
    number: 5,
    type: 'minor',
    cost: { food: 2 },
    text: 'Immediately remove exactly 2 different building resources from accumulation spaces and place them in your supply.',
    onPlay(game, player) {
      game.actions.nightLoot(player, this)
    },
  },
  {
    id: 'recount-e006',
    name: 'Recount',
    deck: 'minorE',
    number: 6,
    type: 'minor',
    cost: {},
    text: 'You immediately get 1 building resource of each type of which you have 4 or more resources in your supply already.',
    onPlay(game, player) {
      const resources = ['wood', 'clay', 'stone', 'reed']
      for (const res of resources) {
        if ((player[res] || 0) >= 4) {
          player.addResource(res, 1)
          game.log.add({
            template: '{player} gets 1 {resource} from Recount',
            args: { player, resource: res },
          })
        }
      }
    },
  },
  {
    id: 'pumpernickel-e007',
    name: 'Pumpernickel',
    deck: 'minorE',
    number: 7,
    type: 'minor',
    cost: { grain: 1 },
    text: 'You immediately get 4 food.',
    onPlay(game, player) {
      player.addResource('food', 4)
      game.log.add({
        template: '{player} gets 4 food from Pumpernickel',
        args: { player },
      })
    },
  },
  {
    id: 'farmers-market-e008',
    name: 'Farmers Market',
    deck: 'minorE',
    number: 8,
    type: 'minor',
    cost: { food: 2 },
    text: 'You immediately get 1 vegetable.',
    onPlay(game, player) {
      player.addResource('vegetables', 1)
      game.log.add({
        template: '{player} gets 1 vegetable from Farmers Market',
        args: { player },
      })
    },
  },
  {
    id: 'bartering-hut-e009',
    name: 'Bartering Hut',
    deck: 'minorE',
    number: 9,
    type: 'minor',
    cost: {},
    text: 'Up to two times: Immediately spend any 2/3/4 building resources for 1 sheep/wild boar/cattle from the general supply.',
    onPlay(game, player) {
      game.actions.barteringHut(player, this)
    },
  },
  {
    id: 'straw-hat-e010',
    name: 'Straw Hat',
    deck: 'minorE',
    number: 10,
    type: 'minor',
    cost: { reed: 1 },
    text: 'At the end of the work phases of rounds 3 and 6, you can move your person from the "Farmland" action space to an unoccupied action space and take that action, or get 1 food.',
    onWorkPhaseEnd(game, player) {
      if (game.state.round === 3 || game.state.round === 6) {
        game.actions.strawHatBonus(player, this)
      }
    },
  },
  {
    id: 'petting-zoo-e011',
    name: 'Petting Zoo',
    deck: 'minorE',
    number: 11,
    type: 'minor',
    cost: { wood: 1 },
    text: 'As long as you have a pasture orthogonally adjacent to your house, you can keep animals of any type on this card, up to the number of rooms in your house.',
    holdsAnimals: true,
    mixedAnimals: true,
    getAnimalCapacity(player) {
      if (player.hasPastureAdjacentToHouse()) {
        return player.getRoomCount()
      }
      return 0
    },
  },
  {
    id: 'animal-bedding-e012',
    name: 'Animal Bedding',
    deck: 'minorE',
    number: 12,
    type: 'minor',
    cost: {},
    vps: 1,
    prereqs: { grainFields: 1 },
    text: 'You can keep 1 additional animal (of the same type) in each of your unfenced stables, and 2 additional animals (of the same type) in each pasture with stable.',
    modifyStableCapacity(game, player, capacity, inPasture) {
      return inPasture ? capacity + 2 : capacity + 1
    },
  },
  {
    id: 'stone-house-reconstruction-e013',
    name: 'Stone House Reconstruction',
    deck: 'minorE',
    number: 13,
    type: 'minor',
    cost: { stone: 1 },
    vps: 1,
    text: 'At any time, you can renovate your clay house to a stone house without placing a person.',
    // Enables anytime renovation from clay to stone
    enablesAnytimeRenovation: 'clayToStone',
  },
  {
    id: 'wood-saw-e014',
    name: 'Wood Saw',
    deck: 'minorE',
    number: 14,
    type: 'minor',
    cost: { wood: 1 },
    text: 'Each time all other players have more people than you, you can take a "Build Rooms" action without placing a person.',
    // Complex trigger - needs game state check
    enablesFreeBuildRooms: true,
  },
  {
    id: 'nail-basket-e015',
    name: 'Nail Basket',
    deck: 'minorE',
    number: 15,
    type: 'minor',
    cost: { reed: 1 },
    vps: 1,
    text: 'Each time after you use a wood accumulation space, you can place 1 stone from your supply on that space (for the next visitor) to take a "Build Fences" action.',
    onAction(game, player, actionId) {
      const woodActions = ['forest', 'grove', 'copse']
      if (woodActions.includes(actionId) && player.stone >= 1) {
        game.actions.offerNailBasket(player, this, actionId)
      }
    },
  },
  {
    id: 'briar-hedge-e016',
    name: 'Briar Hedge',
    deck: 'minorE',
    number: 16,
    type: 'minor',
    cost: {},
    prereqs: { animalTypes: 3 },
    text: 'You do not need to pay wood for fences that you build on the edge of your farmyard board.',
    modifyFenceCost(game, player, cost, isEdge) {
      if (isEdge) {
        return { ...cost, wood: 0 }
      }
      return cost
    },
  },
  {
    id: 'skimmer-plow-e017',
    name: 'Skimmer Plow',
    deck: 'minorE',
    number: 17,
    type: 'minor',
    cost: { wood: 1 },
    prereqs: { occupations: 2 },
    text: 'Each time you use the "Farmland" or "Cultivation" action space, you can plow 2 fields instead of 1. Each time you sow, you must place 1 fewer good on each field you sow.',
    modifyPlowCount(game, player, count, actionId) {
      if (actionId === 'farmland' || actionId === 'cultivation') {
        return count + 1
      }
      return count
    },
    modifySowAmount(game, player, amount) {
      return Math.max(0, amount - 1)
    },
  },
  {
    id: 'seed-almanac-e018',
    name: 'Seed Almanac',
    deck: 'minorE',
    number: 18,
    type: 'minor',
    cost: { reed: 1 },
    prereqs: { occupations: 4 },
    text: 'Each time after you play a minor improvement after this one, you can pay 1 food to plow 1 field.',
    onPlayMinor(game, player, card) {
      if (card.id !== this.id && player.food >= 1) {
        game.actions.offerPlowForFood(player, this)
      }
    },
  },
  {
    id: 'ox-goad-e019',
    name: 'Ox Goad',
    deck: 'minorE',
    number: 19,
    type: 'minor',
    cost: { wood: 1 },
    vps: 1,
    prereqs: { occupations: 3 },
    text: 'Each time after you use the "Cattle Market" accumulation space, you can pay 2 food to plow 1 field.',
    onAction(game, player, actionId) {
      if (actionId === 'cattle-market' && player.food >= 2) {
        game.actions.offerPlowForFood(player, this, 2)
      }
    },
  },
  {
    id: 'iron-hoe-e020',
    name: 'Iron Hoe',
    deck: 'minorE',
    number: 20,
    type: 'minor',
    cost: { wood: 1 },
    text: 'At the end of each work phase, if you occupy both the "Grain Seeds" and "Vegetable Seeds" action spaces, you can plow 1 field.',
    onWorkPhaseEnd(game, player) {
      if (game.playerOccupiesAction(player, 'grain-seeds') &&
          game.playerOccupiesAction(player, 'vegetable-seeds')) {
        game.actions.offerFreePlow(player, this)
      }
    },
  },
  {
    id: 'sheep-rug-e021',
    name: 'Sheep Rug',
    deck: 'minorE',
    number: 21,
    type: 'minor',
    cost: { sheep: 1 },
    vps: 1,
    prereqs: { sheep: 4 },
    text: 'You can use any "Wish for Children" action space, even if it is occupied by another player\'s person.',
    ignoresOccupancyFor: ['family-growth', 'family-growth-urgent'],
  },
  {
    id: 'guest-room-e022',
    name: 'Guest Room',
    deck: 'minorE',
    number: 22,
    type: 'minor',
    cost: { wood: 4, reed: 1 },
    text: 'Immediately place any amount of food from your supply on this card. Once per round, you can discard 1 food from this card to place a person from your supply in that round.',
    onPlay(game, player) {
      game.actions.placeResourcesOnCard(player, this, 'food')
    },
    storedResource: 'food',
    enablesGuestWorker: true,
  },
  {
    id: 'apiary-e023',
    name: 'Apiary',
    deck: 'minorE',
    number: 23,
    type: 'minor',
    cost: {},
    prereqs: { occupations: 4 },
    text: 'At the end of each work phase, you can sow exactly 1 crop on 1 field.',
    onWorkPhaseEnd(game, player) {
      game.actions.offerSowSingleField(player, this)
    },
  },
  {
    id: 'ambition-e024',
    name: 'Ambition',
    deck: 'minorE',
    number: 24,
    type: 'minor',
    cost: {},
    prereqs: { occupations: 2 },
    text: 'Each time you get a "Minor Improvement" action on an action space, you can build a major improvement instead of playing a minor one.',
    allowsMajorOnMinorAction: true,
  },
  {
    id: 'bumper-crop-e025',
    name: 'Bumper Crop',
    deck: 'minorE',
    number: 25,
    type: 'minor',
    cost: {},
    vps: 1,
    prereqs: { grainFields: 2 },
    text: 'When you play this card, immediately play the field phase of the harvest on your farmyard only.',
    onPlay(game, player) {
      game.actions.harvestFields(player)
    },
  },
  {
    id: 'sundial-e026',
    name: 'Sundial',
    deck: 'minorE',
    number: 26,
    type: 'minor',
    cost: { wood: 1 },
    text: 'At the end of the work phases in rounds 7 and 9, you can take a "Sow" action without placing a person.',
    onWorkPhaseEnd(game, player) {
      if (game.state.round === 7 || game.state.round === 9) {
        game.actions.offerFreeSow(player, this)
      }
    },
  },
  {
    id: 'piggy-bank-e027',
    name: 'Piggy Bank',
    deck: 'minorE',
    number: 27,
    type: 'minor',
    cost: {},
    text: 'At the end of each work phase, you can place 1 food on this card, irretrievably. At any time, you can discard 6 food from this card to build a major improvement at no cost.',
    storedResource: 'food',
    onWorkPhaseEnd(game, player) {
      game.actions.offerPiggyBankDeposit(player, this)
    },
    enablesFreeMajor: { cost: 6 },
  },
  {
    id: 'bookmark-e028',
    name: 'Bookmark',
    deck: 'minorE',
    number: 28,
    type: 'minor',
    cost: { wood: 1 },
    text: 'Add 3 to the current round and mark the corresponding round space. At the start of that round, you can play 1 occupation without paying an occupation cost.',
    onPlay(game, player) {
      const targetRound = game.state.round + 3
      if (targetRound <= 14) {
        if (!game.state.scheduledFreeOccupation) {
          game.state.scheduledFreeOccupation = {}
        }
        if (!game.state.scheduledFreeOccupation[player.name]) {
          game.state.scheduledFreeOccupation[player.name] = []
        }
        game.state.scheduledFreeOccupation[player.name].push(targetRound)
        game.log.add({
          template: '{player} marks round {round} for a free occupation',
          args: { player, round: targetRound },
        })
      }
    },
  },
  {
    id: 'heirloom-e029',
    name: 'Heirloom',
    deck: 'minorE',
    number: 29,
    type: 'minor',
    cost: {},
    vps: 2,
    prereqs: { personOnAction: 'day-laborer' },
    text: '(This card has no additional effect.)',
  },
  {
    id: 'childs-toy-e030',
    name: "Child's Toy",
    deck: 'minorE',
    number: 30,
    type: 'minor',
    cost: { wood: 1 }, // or clay: 1
    vps: 2,
    prereqs: { exactlyAdults: 2 },
    text: 'During the feeding phase of each harvest, your newborns require 2 food (instead of 1).',
    modifyNewbornFoodCost(_game, _player, _cost) {
      return 2
    },
  },
  {
    id: 'upholstery-e031',
    name: 'Upholstery',
    deck: 'minorE',
    number: 31,
    type: 'minor',
    cost: {},
    text: 'Each time you build or play an improvement after this one, you can place 1 reed on this card, irretrievably, to get 1 bonus point, up to the number of rooms in your house.',
    storedResource: 'reed',
    onPlayImprovement(game, player, card) {
      if (card.id !== this.id) {
        const stored = this.stored || 0
        if (stored < player.getRoomCount() && player.reed >= 1) {
          game.actions.offerUpholstery(player, this)
        }
      }
    },
    getEndGamePoints() {
      return this.stored || 0
    },
  },
  {
    id: 'nave-e032',
    name: 'Nave',
    deck: 'minorE',
    number: 32,
    type: 'minor',
    cost: { stone: 2, reed: 1 },
    text: 'During scoring, you get 1 bonus point for each of the 5 columns of your farmyard board containing at least one room.',
    getEndGamePoints(player) {
      const columnsWithRooms = player.getColumnsWithRooms()
      return columnsWithRooms
    },
  },
  {
    id: 'beaver-colony-e033',
    name: 'Beaver Colony',
    deck: 'minorE',
    number: 33,
    type: 'minor',
    cost: {},
    vps: 1,
    prereqs: { fencedStables: 1 },
    text: 'From now on, one of your pastures with stable cannot hold animals. Each time you get reed from an action space, you get 1 bonus point.',
    disablesPastureWithStable: true,
    onAction(game, player, actionId) {
      if (game.actionGivesReed(actionId)) {
        player.bonusPoints = (player.bonusPoints || 0) + 1
        game.log.add({
          template: '{player} gets 1 bonus point from Beaver Colony',
          args: { player },
        })
      }
    },
  },
  {
    id: 'land-register-e034',
    name: 'Land Register',
    deck: 'minorE',
    number: 34,
    type: 'minor',
    cost: { wood: 1 },
    text: 'During scoring, if your farm has no unused spaces, you get 2 bonus points.',
    getEndGamePoints(player) {
      return player.getUnusedSpaces() === 0 ? 2 : 0
    },
  },
  {
    id: 'misanthropy-e035',
    name: 'Misanthropy',
    deck: 'minorE',
    number: 35,
    type: 'minor',
    cost: { wood: 1 },
    text: 'During scoring, if you have exactly 4/3/2 people, you get 2/3/5 bonus points.',
    getEndGamePoints(player) {
      const people = player.getFamilySize()
      if (people === 4) {
        return 2
      }
      if (people === 3) {
        return 3
      }
      if (people === 2) {
        return 5
      }
      return 0
    },
  },
  {
    id: 'herbal-garden-e036',
    name: 'Herbal Garden',
    deck: 'minorE',
    number: 36,
    type: 'minor',
    cost: { wood: 1 },
    vps: 2,
    prereqs: { pastures: 1 },
    text: 'From now on, at least one of your pastures must contain no animals.',
    requiresEmptyPasture: true,
  },
  {
    id: 'ox-skull-e037',
    name: 'Ox Skull',
    deck: 'minorE',
    number: 37,
    type: 'minor',
    cost: {},
    prereqs: { cattle: 1 },
    text: 'When you play this card, you immediately get 1 food. During scoring, if you have no cattle, you get 3 bonus points.',
    onPlay(game, player) {
      player.addResource('food', 1)
      game.log.add({
        template: '{player} gets 1 food from Ox Skull',
        args: { player },
      })
    },
    getEndGamePoints(player) {
      return player.getAnimalCount('cattle') === 0 ? 3 : 0
    },
  },
  {
    id: 'rod-collection-e038',
    name: 'Rod Collection',
    deck: 'minorE',
    number: 38,
    type: 'minor',
    cost: {},
    vps: 1,
    prereqs: { occupations: 3 },
    text: 'Each time you use "Fishing", you can place up to 2 wood on this card, irretrievably. During scoring, each such wood is worth 1 bonus point, except the 1st, 4th, 7th, and 10th.',
    storedResource: 'wood',
    onAction(game, player, actionId) {
      if (actionId === 'fishing') {
        game.actions.offerRodCollection(player, this)
      }
    },
    getEndGamePoints(_player) {
      const stored = this.stored || 0
      // Exclude 1st, 4th, 7th, 10th (indices 0, 3, 6, 9)
      let points = 0
      for (let i = 1; i <= stored; i++) {
        if (i !== 1 && i !== 4 && i !== 7 && i !== 10) {
          points++
        }
      }
      return points
    },
  },
  {
    id: 'paintbrush-e039',
    name: 'Paintbrush',
    deck: 'minorE',
    number: 39,
    type: 'minor',
    cost: { wood: 1 },
    prereqs: { boar: 1 },
    text: 'Each harvest, you can exchange exactly 1 clay for your choice of 2 food or 1 bonus point.',
    onHarvest(game, player) {
      if (player.clay >= 1) {
        game.actions.offerPaintbrush(player, this)
      }
    },
  },
  {
    id: 'bee-statue-e040',
    name: 'Bee Statue',
    deck: 'minorE',
    number: 40,
    type: 'minor',
    cost: { clay: 2 },
    text: 'Pile (from bottom to top) 1 vegetable, 1 stone, 1 grain, 1 stone, 1 grain on this card. Each time you use the "Day Laborer" action space, you get the top good.',
    onPlay(_game, _player) {
      // Stack: bottom [veg, stone, grain, stone, grain] top
      this.stack = ['vegetables', 'stone', 'grain', 'stone', 'grain']
    },
    onAction(game, player, actionId) {
      if (actionId === 'day-laborer' && this.stack && this.stack.length > 0) {
        const resource = this.stack.pop()
        player.addResource(resource, 1)
        game.log.add({
          template: '{player} gets 1 {resource} from Bee Statue',
          args: { player, resource },
        })
      }
    },
  },
  {
    id: 'muddy-waters-e041',
    name: 'Muddy Waters',
    deck: 'minorE',
    number: 41,
    type: 'minor',
    cost: {},
    vps: 1,
    prereqs: { cardsInPlay: 5 },
    text: 'Alternate placing 1 food and 1 clay on each remaining even-numbered round space, starting with food. At the start of these rounds, you get the respective good.',
    onPlay(game, player) {
      const currentRound = game.state.round
      let isFood = true
      for (let round = currentRound + 1; round <= 14; round++) {
        if (round % 2 === 0) {
          const key = isFood ? 'scheduledFood' : 'scheduledClay'
          if (!game.state[key]) {
            game.state[key] = {}
          }
          if (!game.state[key][player.name]) {
            game.state[key][player.name] = {}
          }
          game.state[key][player.name][round] =
            (game.state[key][player.name][round] || 0) + 1
          isFood = !isFood
        }
      }
    },
  },
  {
    id: 'water-gully-e042',
    name: 'Water Gully',
    deck: 'minorE',
    number: 42,
    type: 'minor',
    cost: { stone: 1 },
    prereqs: { majorImprovement: 'well' },
    text: 'Place 1 cattle, 1 grain, and 1 cattle on the next 3 round spaces (in that order). At the start of these rounds, you get the respective good.',
    onPlay(game, player) {
      const currentRound = game.state.round
      const schedule = [
        { round: currentRound + 1, type: 'scheduledCattle', amount: 1 },
        { round: currentRound + 2, type: 'scheduledGrain', amount: 1 },
        { round: currentRound + 3, type: 'scheduledCattle', amount: 1 },
      ]
      for (const { round, type, amount } of schedule) {
        if (round <= 14) {
          if (!game.state[type]) {
            game.state[type] = {}
          }
          if (!game.state[type][player.name]) {
            game.state[type][player.name] = {}
          }
          game.state[type][player.name][round] =
            (game.state[type][player.name][round] || 0) + amount
        }
      }
    },
  },
  {
    id: 'barn-cats-e043',
    name: 'Barn Cats',
    deck: 'minorE',
    number: 43,
    type: 'minor',
    cost: {},
    vps: 1,
    prereqs: { stables: 1 },
    text: 'If you have 1/2/3/4 stables, place 1 food on each of the next 2/3/4/5 round spaces. At the start of these rounds, you get the food.',
    onPlay(game, player) {
      const stables = player.getStableCount()
      const rounds = Math.min(stables + 1, 5)
      const currentRound = game.state.round
      for (let i = 1; i <= rounds; i++) {
        const round = currentRound + i
        if (round <= 14) {
          if (!game.state.scheduledFood) {
            game.state.scheduledFood = {}
          }
          if (!game.state.scheduledFood[player.name]) {
            game.state.scheduledFood[player.name] = {}
          }
          game.state.scheduledFood[player.name][round] =
            (game.state.scheduledFood[player.name][round] || 0) + 1
        }
      }
    },
  },
  {
    id: 'fodder-beets-e044',
    name: 'Fodder Beets',
    deck: 'minorE',
    number: 44,
    type: 'minor',
    cost: {},
    vps: 1,
    prereqs: { fields: 3 },
    text: 'Place 1 food on each remaining odd-numbered round space. At the start of these rounds, you get the food.',
    onPlay(game, player) {
      const currentRound = game.state.round
      for (let round = currentRound + 1; round <= 14; round++) {
        if (round % 2 === 1) {
          if (!game.state.scheduledFood) {
            game.state.scheduledFood = {}
          }
          if (!game.state.scheduledFood[player.name]) {
            game.state.scheduledFood[player.name] = {}
          }
          game.state.scheduledFood[player.name][round] =
            (game.state.scheduledFood[player.name][round] || 0) + 1
        }
      }
    },
  },
  {
    id: 'fruit-ladder-e045',
    name: 'Fruit Ladder',
    deck: 'minorE',
    number: 45,
    type: 'minor',
    cost: { wood: 2 },
    vps: 1,
    text: 'Place 1 food on each remaining even-numbered round space. At the start of these rounds, you get the food.',
    onPlay(game, player) {
      const currentRound = game.state.round
      for (let round = currentRound + 1; round <= 14; round++) {
        if (round % 2 === 0) {
          if (!game.state.scheduledFood) {
            game.state.scheduledFood = {}
          }
          if (!game.state.scheduledFood[player.name]) {
            game.state.scheduledFood[player.name] = {}
          }
          game.state.scheduledFood[player.name][round] =
            (game.state.scheduledFood[player.name][round] || 0) + 1
        }
      }
    },
  },
  {
    id: 'waterlily-pond-e046',
    name: 'Waterlily Pond',
    deck: 'minorE',
    number: 46,
    type: 'minor',
    cost: {},
    vps: 1,
    prereqs: { exactlyOccupations: 2 },
    text: 'Place 1 food on each of the next 2 round spaces. At the start of these rounds, you get the food.',
    onPlay(game, player) {
      const currentRound = game.state.round
      for (let i = 1; i <= 2; i++) {
        const round = currentRound + i
        if (round <= 14) {
          if (!game.state.scheduledFood) {
            game.state.scheduledFood = {}
          }
          if (!game.state.scheduledFood[player.name]) {
            game.state.scheduledFood[player.name] = {}
          }
          game.state.scheduledFood[player.name][round] =
            (game.state.scheduledFood[player.name][round] || 0) + 1
        }
      }
    },
  },
  {
    id: 'syrup-tap-e047',
    name: 'Syrup Tap',
    deck: 'minorE',
    number: 47,
    type: 'minor',
    cost: { wood: 1, stone: 1 },
    vps: 1,
    text: 'Each time you get at least 1 wood from an action space, place 1 food on the next round space. At the start of that round, you get the food.',
    onAction(game, player, actionId, resources) {
      if (resources && resources.wood > 0) {
        const nextRound = game.state.round + 1
        if (nextRound <= 14) {
          if (!game.state.scheduledFood) {
            game.state.scheduledFood = {}
          }
          if (!game.state.scheduledFood[player.name]) {
            game.state.scheduledFood[player.name] = {}
          }
          game.state.scheduledFood[player.name][nextRound] =
            (game.state.scheduledFood[player.name][nextRound] || 0) + 1
        }
      }
    },
  },
  {
    id: 'town-hall-e048',
    name: 'Town Hall',
    deck: 'minorE',
    number: 48,
    type: 'minor',
    cost: { wood: 2, clay: 2 },
    vps: 2,
    text: 'In the feeding phase of each harvest, if you live in a clay or stone house, you get 1 or 2 food, respectively.',
    onFeedingPhase(game, player) {
      if (player.roomType === 'clay') {
        player.addResource('food', 1)
        game.log.add({
          template: '{player} gets 1 food from Town Hall',
          args: { player },
        })
      }
      else if (player.roomType === 'stone') {
        player.addResource('food', 2)
        game.log.add({
          template: '{player} gets 2 food from Town Hall',
          args: { player },
        })
      }
    },
  },
  {
    id: 'twibil-e049',
    name: 'Twibil',
    deck: 'minorE',
    number: 49,
    type: 'minor',
    cost: { stone: 1 },
    vps: 1,
    text: 'Each time after any player (including you) builds at least 1 wood room, you get 1 food.',
    onAnyBuildRoom(game, player, buildingPlayer, roomType) {
      if (roomType === 'wood') {
        player.addResource('food', 1)
        game.log.add({
          template: '{player} gets 1 food from Twibil',
          args: { player },
        })
      }
    },
  },
  {
    id: 'wild-greens-e050',
    name: 'Wild Greens',
    deck: 'minorE',
    number: 50,
    type: 'minor',
    cost: {},
    text: 'Each time you sow, you get 1 food for every different type of good that you sow.',
    onSow(game, player, types) {
      const uniqueTypes = new Set(types).size
      if (uniqueTypes > 0) {
        player.addResource('food', uniqueTypes)
        game.log.add({
          template: '{player} gets {amount} food from Wild Greens',
          args: { player, amount: uniqueTypes },
        })
      }
    },
  },
  {
    id: 'whale-oil-e051',
    name: 'Whale Oil',
    deck: 'minorE',
    number: 51,
    type: 'minor',
    cost: { wood: 1 },
    text: 'Each time you use "Fishing", place 1 food from the general supply on this card. Each time before you play an occupation, you get food equal to the amount on this card.',
    storedResource: 'food',
    onAction(game, player, actionId) {
      if (actionId === 'fishing') {
        this.stored = (this.stored || 0) + 1
      }
    },
    onBeforePlayOccupation(game, player) {
      const stored = this.stored || 0
      if (stored > 0) {
        player.addResource('food', stored)
        game.log.add({
          template: '{player} gets {amount} food from Whale Oil',
          args: { player, amount: stored },
        })
      }
    },
  },
  {
    id: 'cubbyhole-e052',
    name: 'Cubbyhole',
    deck: 'minorE',
    number: 52,
    type: 'minor',
    cost: { reed: 1, wood: 1 }, // or clay: 1
    vps: 1,
    text: 'For each room that you add to your house, place 1 food from the general supply on this card. At the start of each feeding phase, you get food equal to the amount on this card.',
    storedResource: 'food',
    onBuildRoom(game, player, count) {
      this.stored = (this.stored || 0) + count
    },
    onFeedingPhase(game, player) {
      const stored = this.stored || 0
      if (stored > 0) {
        player.addResource('food', stored)
        game.log.add({
          template: '{player} gets {amount} food from Cubbyhole',
          args: { player, amount: stored },
        })
      }
    },
  },
  {
    id: 'boar-spear-e053',
    name: 'Boar Spear',
    deck: 'minorE',
    number: 53,
    type: 'minor',
    cost: { wood: 1, stone: 1 },
    vps: 1,
    text: 'Each time you get at least 1 wild boar outside of the breeding phase of a harvest, you can immediately turn them into 4 food each.',
    onGetBoar(game, player, count, isBreeding) {
      if (!isBreeding && count > 0) {
        game.actions.offerBoarSpear(player, this, count)
      }
    },
  },
  {
    id: 'contraband-e054',
    name: 'Contraband',
    deck: 'minorE',
    number: 54,
    type: 'minor',
    cost: { food: 1 },
    text: 'Each time you play or build an improvement after this, you can pay 1 additional building resource of a type in the printed cost to get 3 food.',
    onPlayImprovement(game, player, card) {
      if (card.id !== this.id && card.cost) {
        game.actions.offerContraband(player, this, card)
      }
    },
  },
  {
    id: 'stone-weir-e055',
    name: 'Stone Weir',
    deck: 'minorE',
    number: 55,
    type: 'minor',
    cost: { stone: 1 },
    vps: 1,
    prereqs: { occupations: 2 },
    text: 'Each time you use the "Fishing" accumulation space, if there are 0/1/2/3 food on the space, you get an additional 4/3/2/1 food from the general supply.',
    onAction(game, player, actionId) {
      if (actionId === 'fishing') {
        const foodOnSpace = game.getAccumulatedResources('fishing').food || 0
        const bonus = Math.max(0, 4 - foodOnSpace)
        if (bonus > 0) {
          player.addResource('food', bonus)
          game.log.add({
            template: '{player} gets {amount} bonus food from Stone Weir',
            args: { player, amount: bonus },
          })
        }
      }
    },
  },
  {
    id: 'roman-pot-e056',
    name: 'Roman Pot',
    deck: 'minorE',
    number: 56,
    type: 'minor',
    cost: { clay: 1 },
    vps: 1,
    text: 'Place 4 food from the general supply on this card. At the start of each work phase, if you are the last player in turn order, move 1 food from this card to your supply.',
    storedResource: 'food',
    onPlay(_game, _player) {
      this.stored = 4
    },
    onWorkPhaseStart(game, player) {
      if (game.isLastInTurnOrder(player) && (this.stored || 0) > 0) {
        this.stored--
        player.addResource('food', 1)
        game.log.add({
          template: '{player} gets 1 food from Roman Pot',
          args: { player },
        })
      }
    },
  },
  {
    id: 'cheese-fondue-e057',
    name: 'Cheese Fondue',
    deck: 'minorE',
    number: 57,
    type: 'minor',
    cost: { clay: 1 },
    vps: 1,
    text: 'Each time you bake at least 1 grain into bread, you get 1 additional food if you have at least 1 sheep and (another) 1 additional food if you have at least 1 cattle.',
    onBake(game, player, grainBaked) {
      if (grainBaked > 0) {
        let bonus = 0
        if (player.getAnimalCount('sheep') >= 1) {
          bonus++
        }
        if (player.getAnimalCount('cattle') >= 1) {
          bonus++
        }
        if (bonus > 0) {
          player.addResource('food', bonus)
          game.log.add({
            template: '{player} gets {amount} bonus food from Cheese Fondue',
            args: { player, amount: bonus },
          })
        }
      }
    },
  },
  {
    id: 'lunchtime-beer-e058',
    name: 'Lunchtime Beer',
    deck: 'minorE',
    number: 58,
    type: 'minor',
    cost: {},
    text: 'At the start of each harvest, you can choose to skip the field and breeding phase of that harvest and get exactly 1 food instead.',
    onHarvestStart(game, player) {
      game.actions.offerLunchtimeBeer(player, this)
    },
  },
  {
    id: 'comb-and-cutter-e059',
    name: 'Comb and Cutter',
    deck: 'minorE',
    number: 59,
    type: 'minor',
    cost: { wood: 1 },
    text: 'Each time you use the "Day Laborer" action space, you get 1 additional food for each sheep on the "Sheep Market" accumulation space, up to a maximum of 4 additional food.',
    onAction(game, player, actionId) {
      if (actionId === 'day-laborer') {
        const sheepOnMarket = game.getAccumulatedResources('sheep-market').sheep || 0
        const bonus = Math.min(sheepOnMarket, 4)
        if (bonus > 0) {
          player.addResource('food', bonus)
          game.log.add({
            template: '{player} gets {amount} bonus food from Comb and Cutter',
            args: { player, amount: bonus },
          })
        }
      }
    },
  },
  {
    id: 'working-gloves-e060',
    name: 'Working Gloves',
    deck: 'minorE',
    number: 60,
    type: 'minor',
    cost: {},
    text: 'When you play this card, you get 1 food. Each time you pay an occupation cost, you can pay 1 building resource of your choice in place of (up to) 2 food.',
    onPlay(game, player) {
      player.addResource('food', 1)
      game.log.add({
        template: '{player} gets 1 food from Working Gloves',
        args: { player },
      })
    },
    modifyOccupationCost(game, player, cost) {
      // Allows substitution of 1 building resource for up to 2 food
      return { ...cost, allowResourceSubstitution: { resource: 'building', replaces: 2 } }
    },
  },
  {
    id: 'raised-bed-e061',
    name: 'Raised Bed',
    deck: 'minorE',
    number: 61,
    type: 'minor',
    cost: { clay: 2, stone: 2 },
    vps: 1,
    prereqs: { grainFields: 2 },
    text: 'At the start of each harvest, you get 4 food.',
    onHarvestStart(game, player) {
      player.addResource('food', 4)
      game.log.add({
        template: '{player} gets 4 food from Raised Bed',
        args: { player },
      })
    },
  },
  {
    id: 'sour-dough-e062',
    name: 'Sour Dough',
    deck: 'minorE',
    number: 62,
    type: 'minor',
    cost: {},
    vps: 1,
    prereqs: { occupations: 3, bakingImprovement: true },
    text: 'Once per round, if all players have at least 1 person left to place, you can skip placing a person and take a "Bake Bread" action instead.',
    enablesSkipPlacementForBake: true,
  },
  {
    id: 'iron-oven-e063',
    name: 'Iron Oven',
    deck: 'minorE',
    number: 63,
    type: 'minor',
    cost: { stone: 3 },
    vps: 2,
    text: 'For any "Bake Bread" action, you can convert exactly 1 grain into 6 food. When you build this improvement, you can immediately take a "Bake Bread" action.',
    bakingRate: 6,
    maxBakePerAction: 1,
    onPlay(game, player) {
      game.actions.offerBakeBread(player, this)
    },
  },
  {
    id: 'simple-oven-e064',
    name: 'Simple Oven',
    deck: 'minorE',
    number: 64,
    type: 'minor',
    cost: { clay: 2 },
    vps: 1,
    text: 'For any "Bake Bread" action, you can convert exactly 1 grain into 3 food. When you build this improvement, you can immediately take a "Bake Bread" action.',
    bakingRate: 3,
    maxBakePerAction: 1,
    onPlay(game, player) {
      game.actions.offerBakeBread(player, this)
    },
  },
  {
    id: 'almsbag-e065',
    name: 'Almsbag',
    deck: 'minorE',
    number: 65,
    type: 'minor',
    cost: {},
    prereqs: { noOccupations: true },
    text: 'When you play this card, you immediately get 1 grain for every 2 completed rounds.',
    onPlay(game, player) {
      const completedRounds = game.state.round - 1
      const grain = Math.floor(completedRounds / 2)
      if (grain > 0) {
        player.addResource('grain', grain)
        game.log.add({
          template: '{player} gets {amount} grain from Almsbag',
          args: { player, amount: grain },
        })
      }
    },
  },
  {
    id: 'barn-shed-e066',
    name: 'Barn Shed',
    deck: 'minorE',
    number: 66,
    type: 'minor',
    cost: { wood: 2 },
    prereqs: { occupations: 3 },
    text: 'Each time another player uses the "Forest" accumulation space, you get 1 grain.',
    onAnyAction(game, player, actingPlayer, actionId) {
      if (actionId === 'forest' && actingPlayer.name !== player.name) {
        player.addResource('grain', 1)
        game.log.add({
          template: '{player} gets 1 grain from Barn Shed',
          args: { player },
        })
      }
    },
  },
  {
    id: 'grain-bag-e067',
    name: 'Grain Bag',
    deck: 'minorE',
    number: 67,
    type: 'minor',
    cost: { reed: 1 },
    vps: 1,
    text: 'Each time you use the "Grain Seeds" action space, you get 1 additional grain for each baking improvement you have.',
    onAction(game, player, actionId) {
      if (actionId === 'grain-seeds') {
        const bakingImprovements = player.getBakingImprovementCount()
        if (bakingImprovements > 0) {
          player.addResource('grain', bakingImprovements)
          game.log.add({
            template: '{player} gets {amount} bonus grain from Grain Bag',
            args: { player, amount: bakingImprovements },
          })
        }
      }
    },
  },
  {
    id: 'cherry-orchard-e068',
    name: 'Cherry Orchard',
    deck: 'minorE',
    number: 68,
    type: 'minor',
    cost: {},
    text: 'This card is a field on which you can only sow and harvest wood as you would grain. Each time you harvest the last wood from this card, you also get 1 vegetable.',
    isField: true,
    fieldCrop: 'wood',
    onHarvestLast(game, player) {
      player.addResource('vegetables', 1)
      game.log.add({
        template: '{player} gets 1 vegetable from Cherry Orchard',
        args: { player },
      })
    },
  },
  {
    id: 'melon-patch-e069',
    name: 'Melon Patch',
    deck: 'minorE',
    number: 69,
    type: 'minor',
    cost: {},
    prereqs: { occupations: 2 },
    text: 'This card is a field that can only grow vegetables. Each time you harvest the last vegetable from this card, you can plow 1 field.',
    isField: true,
    fieldCrop: 'vegetables',
    onHarvestLast(game, player) {
      game.actions.offerFreePlow(player, this)
    },
  },
  {
    id: 'crop-rotation-field-e070',
    name: 'Crop Rotation Field',
    deck: 'minorE',
    number: 70,
    type: 'minor',
    cost: {},
    prereqs: { occupations: 1 },
    text: 'This card is a field. Each time you remove the last grain or vegetable from this card, you can immediately sow vegetable or grain on this card, respectively.',
    isField: true,
    onHarvestLast(game, player, cropType) {
      const nextCrop = cropType === 'grain' ? 'vegetables' : 'grain'
      game.actions.offerSowOnCard(player, this, nextCrop)
    },
  },
  {
    id: 'cow-patty-e071',
    name: 'Cow Patty',
    deck: 'minorE',
    number: 71,
    type: 'minor',
    cost: {},
    vps: 1,
    prereqs: { cattle: 1 },
    text: 'Each time you sow in a field that is orthogonally adjacent to a pasture, you can place 1 additional good of the planted type in it.',
    modifySowAmount(game, player, amount, field) {
      if (player.isFieldAdjacentToPasture(field)) {
        return amount + 1
      }
      return amount
    },
  },
  {
    id: 'artichoke-field-e072',
    name: 'Artichoke Field',
    deck: 'minorE',
    number: 72,
    type: 'minor',
    cost: { wood: 1 },
    vps: 1,
    prereqs: { occupations: 2 },
    text: 'This card is a field. During the field phase of each harvest, if you harvest at least 1 good from this card, you also get 1 food.',
    isField: true,
    onHarvest(game, player, amountHarvested) {
      if (amountHarvested > 0) {
        player.addResource('food', 1)
        game.log.add({
          template: '{player} gets 1 food from Artichoke Field',
          args: { player },
        })
      }
    },
  },
  {
    id: 'scythe-e073',
    name: 'Scythe',
    deck: 'minorE',
    number: 73,
    type: 'minor',
    cost: { wood: 1 },
    text: 'During the field phase of each harvest, you can select exactly one of your fields and harvest all the crops planted in it.',
    onFieldPhase(game, player) {
      game.actions.offerScytheHarvest(player, this)
    },
  },
  {
    id: 'ash-trees-e074',
    name: 'Ash Trees',
    deck: 'minorE',
    number: 74,
    type: 'minor',
    cost: {},
    prereqs: { plantedFields: 2 },
    text: 'When you play this card, immediately place (up to) 5 fences from your supply on it. When you build fences, fences taken from this card cost you nothing.',
    onPlay(game, player) {
      const fencesToPlace = Math.min(5, player.fencesRemaining || 0)
      this.storedFences = fencesToPlace
      if (fencesToPlace > 0) {
        player.fencesRemaining -= fencesToPlace
        game.log.add({
          template: '{player} places {amount} fences on Ash Trees',
          args: { player, amount: fencesToPlace },
        })
      }
    },
    getFreeFences() {
      return this.storedFences || 0
    },
  },
  {
    id: 'stone-axe-e075',
    name: 'Stone Axe',
    deck: 'minorE',
    number: 75,
    type: 'minor',
    cost: { wood: 1, clay: 1 },
    vps: 1,
    prereqs: { occupations: 2 },
    text: 'Each time you use a wood accumulation space, you can return 1 stone to the general supply to get an additional 3 wood.',
    onAction(game, player, actionId) {
      const woodActions = ['forest', 'grove', 'copse']
      if (woodActions.includes(actionId) && player.stone >= 1) {
        game.actions.offerStoneAxe(player, this)
      }
    },
  },
  {
    id: 'lumber-pile-e076',
    name: 'Lumber Pile',
    deck: 'minorE',
    number: 76,
    type: 'minor',
    cost: {},
    text: 'When you play this card, you can immediately return up to 3 stables from your farmyard board to your supply and get 3 wood for each.',
    onPlay(game, player) {
      game.actions.lumberPileExchange(player, this)
    },
  },
  {
    id: 'mattock-e077',
    name: 'Mattock',
    deck: 'minorE',
    number: 77,
    type: 'minor',
    cost: { wood: 1 },
    text: 'Each time you get reed and/or stone from an action space, you get 1 additional clay.',
    onAction(game, player, actionId, resources) {
      if (resources && (resources.reed > 0 || resources.stone > 0)) {
        player.addResource('clay', 1)
        game.log.add({
          template: '{player} gets 1 clay from Mattock',
          args: { player },
        })
      }
    },
  },
  {
    id: 'sleight-of-hand-e078',
    name: 'Sleight of Hand',
    deck: 'minorE',
    number: 78,
    type: 'minor',
    cost: {},
    prereqs: { occupations: 3 },
    text: 'When you play this card, you can immediately exchange up to 4 building resources for an equal number of other building resources.',
    onPlay(game, player) {
      game.actions.sleightOfHand(player, this)
    },
  },
  {
    id: 'field-spade-e079',
    name: 'Field Spade',
    deck: 'minorE',
    number: 79,
    type: 'minor',
    cost: { wood: 1 },
    text: 'Each time after you sow in at least 1 field, you get 1 stone.',
    onSow(game, player, types) {
      if (types && types.length > 0) {
        player.addResource('stone', 1)
        game.log.add({
          template: '{player} gets 1 stone from Field Spade',
          args: { player },
        })
      }
    },
  },
  {
    id: 'rock-garden-e080',
    name: 'Rock Garden',
    deck: 'minorE',
    number: 80,
    type: 'minor',
    cost: {},
    text: 'You can only plant stone on this card. Plant as though it were 3 fields, but it is considered 1 field. Sow and harvest stone on this card as you would vegetables.',
    isField: true,
    fieldCrop: 'stone',
    fieldSize: 3,
  },
  {
    id: 'alchemists-lab-e081',
    name: "Alchemist's Lab",
    deck: 'minorE',
    number: 81,
    type: 'minor',
    cost: {},
    vps: 1,
    prereqs: { occupations: 3 },
    text: "This card is an action space for all. A player who uses it gets 1 building resource of each type they already have. If another player uses it, they must first pay you 1 food.",
    isActionSpace: true,
    actionSpaceEffect(game, player, owner) {
      if (player.name !== owner.name) {
        player.addResource('food', -1)
        owner.addResource('food', 1)
      }
      const resources = ['wood', 'clay', 'stone', 'reed']
      for (const res of resources) {
        if ((player[res] || 0) > 0) {
          player.addResource(res, 1)
        }
      }
    },
  },
  {
    id: 'profiteering-e082',
    name: 'Profiteering',
    deck: 'minorE',
    number: 82,
    type: 'minor',
    cost: {},
    text: 'When you play this card, you immediately get 1 food. Each time after you use the "Day Laborer" action space, you can exchange 1 building resource for another building resource.',
    onPlay(game, player) {
      player.addResource('food', 1)
      game.log.add({
        template: '{player} gets 1 food from Profiteering',
        args: { player },
      })
    },
    onAction(game, player, actionId) {
      if (actionId === 'day-laborer') {
        game.actions.offerResourceExchange(player, this, 'building', 'building', 1)
      }
    },
  },
  {
    id: 'shepherds-whistle-e083',
    name: "Shepherd's Whistle",
    deck: 'minorE',
    number: 83,
    type: 'minor',
    cost: { wood: 1 },
    text: 'At the start of the breeding phase of each harvest, if you have at least 1 unfenced stable without an animal, you get 1 sheep.',
    onBreedingPhaseStart(game, player) {
      if (player.hasEmptyUnfencedStable()) {
        player.addAnimal('sheep', 1)
        game.log.add({
          template: "{player} gets 1 sheep from Shepherd's Whistle",
          args: { player },
        })
      }
    },
  },
  {
    id: 'dollys-mother-e084',
    name: "Dolly's Mother",
    deck: 'minorE',
    number: 84,
    type: 'minor',
    cost: {},
    vps: 1,
    prereqs: { sheep: 1 },
    text: 'You only require 1 sheep to breed sheep during the breeding phase of a harvest. This card can hold 1 sheep.',
    holdsAnimals: { sheep: 1 },
    modifySheepBreedingRequirement(_game, _player) {
      return 1
    },
  },
]

// Card lookup functions
function getCardById(id) {
  return minorImprovements.find(c => c.id === id)
}

function getCardByName(name) {
  return minorImprovements.find(c => c.name === name)
}

function getMinorImprovements() {
  return minorImprovements
}

function getOccupations() {
  return []
}

function getAllCards() {
  return [...minorImprovements]
}

function getCardsByPlayerCount(_playerCount) {
  // All cards available for all player counts
  return getAllCards()
}

module.exports = {
  getCardById,
  getCardByName,
  getMinorImprovements,
  getOccupations,
  getAllCards,
  getCardsByPlayerCount,
}
