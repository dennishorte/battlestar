/**
 * Occupations C Cards for Agricola (Revised Edition)
 * Cards C085-C168 - A standalone occupations deck
 */

const occupations = [
  {
    id: 'den-builder-c085',
    name: 'Den Builder',
    deck: 'occupationC',
    number: 85,
    type: 'occupation',
    players: '1+',
    text: 'When you live in a clay or stone house, you can pay 1 grain and 2 food. If you do, for the rest of the game, this card provides room for exactly one person.',
    providesRoom: false,
    canActivateRoom(player) {
      return (player.roomType === 'clay' || player.roomType === 'stone') &&
             player.grain >= 1 && player.food >= 2
    },
    activateRoom(game, player) {
      player.removeResource('grain', 1)
      player.removeResource('food', 2)
      this.providesRoom = true
      game.log.add({
        template: '{player} activates Den Builder room for 1 grain and 2 food',
        args: { player },
      })
    },
  },
  {
    id: 'livestock-feeder-c086',
    name: 'Livestock Feeder',
    deck: 'occupationC',
    number: 86,
    type: 'occupation',
    players: '1+',
    text: 'When you play this card, you immediately get 1 grain. Each grain in your supply can hold 1 animal of any type.',
    onPlay(game, player) {
      player.addResource('grain', 1)
      game.log.add({
        template: '{player} gets 1 grain from Livestock Feeder',
        args: { player },
      })
    },
    holdsAnimals: { any: true },
    mixedAnimals: true,
    getAnimalCapacity(player) {
      return player.grain
    },
  },
  {
    id: 'mason-c087',
    name: 'Mason',
    deck: 'occupationC',
    number: 87,
    type: 'occupation',
    players: '1+',
    text: 'Place a stone room on this card. Once you have a stone house with at least 4 rooms, at any time, you can add that room without paying any building resources.',
    onPlay(_game, _player) {
      this.hasRoom = true
    },
    canAddFreeRoom(player) {
      return this.hasRoom && player.roomType === 'stone' && player.getRoomCount() >= 4
    },
    addFreeRoom(game, player) {
      this.hasRoom = false
      game.actions.buildFreeRoom(player, this)
    },
  },
  {
    id: 'carpenters-apprentice-c088',
    name: "Carpenter's Apprentice",
    deck: 'occupationC',
    number: 88,
    type: 'occupation',
    players: '1+',
    text: "Wood rooms cost you 2 woods less. Your 3rd and 4th stable each cost you 1 wood less. Your 13th to 15th fence each cost you nothing.",
    modifyRoomCost(player, cost) {
      if (player.roomType === 'wood' && cost.wood) {
        return { ...cost, wood: Math.max(0, cost.wood - 2) }
      }
      return cost
    },
    modifyStableCost(player, stableNumber) {
      if (stableNumber === 3 || stableNumber === 4) {
        return { wood: 1 }
      }
      return { wood: 2 }
    },
    modifyFenceCost(player, fenceNumber) {
      if (fenceNumber >= 13 && fenceNumber <= 15) {
        return 0
      }
      return 1
    },
  },
  {
    id: 'stable-master-c089',
    name: 'Stable Master',
    deck: 'occupationC',
    number: 89,
    type: 'occupation',
    players: '1+',
    text: 'When you play this card, you can immediately build exactly 1 stable for 1 wood. Exactly one of your unfenced stables can hold up to 3 animals of one type.',
    onPlay(game, player) {
      if (player.wood >= 1) {
        game.actions.offerBuildStable(player, this, { cost: { wood: 1 } })
      }
    },
    modifyUnfencedStableCapacity(player, stableIndex) {
      if (stableIndex === 0) {
        return 3
      }
      return 1
    },
  },
  {
    id: 'field-watchman-c090',
    name: 'Field Watchman',
    deck: 'occupationC',
    number: 90,
    type: 'occupation',
    players: '1+',
    text: 'Each time you use the "Grain Seeds" action space, you can also plow 1 field.',
    onAction(game, player, actionId) {
      if (actionId === 'take-grain') {
        game.actions.offerPlow(player, this)
      }
    },
  },
  {
    id: 'plow-hero-c091',
    name: 'Plow Hero',
    deck: 'occupationC',
    number: 91,
    type: 'occupation',
    players: '1+',
    text: 'Each time you use the "Farmland" or "Cultivation" action space with the first person you place in a round, you can plow 1 additional field for 1 food.',
    onAction(game, player, actionId) {
      if ((actionId === 'plow-field' || actionId === 'plow-sow') && player.getPersonPlacedThisRound() === 1) {
        if (player.food >= 1) {
          game.offerPlowForFood(player, this)
        }
      }
    },
  },
  {
    id: 'autumn-mother-c092',
    name: 'Autumn Mother',
    deck: 'occupationC',
    number: 92,
    type: 'occupation',
    players: '1+',
    text: 'Immediately before each harvest, if you have room in your house, you can take a "Family Growth" action for 3 food.',
    onBeforeHarvest(game, player) {
      if (player.hasRoomForFamilyGrowth() && player.food >= 3) {
        game.actions.offerFamilyGrowthForFood(player, this, 3)
      }
    },
  },
  {
    id: 'inner-districts-director-c093',
    name: 'Inner Districts Director',
    deck: 'occupationC',
    number: 93,
    type: 'occupation',
    players: '1+',
    text: 'Each time you use the "Forest" or "Clay Pit" accumulation space, you can place 1 stone from the general supply on the other space. If you do, you can immediately place another person.',
    onAction(game, player, actionId) {
      if (actionId === 'take-wood') {
        game.actions.offerInnerDistrictsDirectorBonus(player, this, 'take-clay')
      }
      else if (actionId === 'take-clay') {
        game.actions.offerInnerDistrictsDirectorBonus(player, this, 'take-wood')
      }
    },
  },
  {
    id: 'stable-cleaner-c094',
    name: 'Stable Cleaner',
    deck: 'occupationC',
    number: 94,
    type: 'occupation',
    players: '1+',
    text: 'At any time, you can take the "Build Stables" action without placing a person. If you do, each stable costs you 1 wood and 1 food.',
    allowsAnytimeAction: true,
    anytimeActionType: 'build-stables',
    modifyStableCostForAnytime() {
      return { wood: 1, food: 1 }
    },
  },
  {
    id: 'basket-weaver-c095',
    name: 'Basket Weaver',
    deck: 'occupationC',
    number: 95,
    type: 'occupation',
    players: '1+',
    text: 'When you play this card, immediately build the "Basketmaker\'s Workshop" major improvement for 1 stone and 1 reed.',
    onPlay(game, player) {
      if (player.stone >= 1 && player.reed >= 1) {
        game.actions.buildMajorImprovement(player, 'basketmakers-workshop', { stone: 1, reed: 1 })
      }
    },
  },
  {
    id: 'merchant-c096',
    name: 'Merchant',
    deck: 'occupationC',
    number: 96,
    type: 'occupation',
    players: '1+',
    text: 'Immediately after each time you take a "Major or Minor Improvement" or "Minor Improvement" action, you can pay 1 food to take the action a second time.',
    onAction(game, player, actionId) {
      if ((actionId === 'major-improvement' || actionId === 'minor-improvement') && player.food >= 1) {
        game.actions.offerMerchantRepeat(player, this, actionId)
      }
    },
  },
  {
    id: 'seed-researcher-c097',
    name: 'Seed Researcher',
    deck: 'occupationC',
    number: 97,
    type: 'occupation',
    players: '1+',
    text: 'Each time any people return from both the "Grain Seeds" and "Vegetable Seeds" action spaces, you get 2 food and you can play 1 occupation, without paying an occupation cost.',
    onReturnHome(game, player) {
      if (game.workersReturnedFrom('take-grain') && game.workersReturnedFrom('take-vegetables')) {
        player.addResource('food', 2)
        game.log.add({
          template: '{player} gets 2 food from Seed Researcher',
          args: { player },
        })
        game.actions.offerFreeOccupation(player, this)
      }
    },
  },
  {
    id: 'cube-cutter-c098',
    name: 'Cube Cutter',
    deck: 'occupationC',
    number: 98,
    type: 'occupation',
    players: '1+',
    text: 'When you play this card, you immediately get 1 wood. In the field phase of each harvest, you can use this card to exchange exactly 1 wood and 1 food for 1 bonus point.',
    onPlay(game, player) {
      player.addResource('wood', 1)
      game.log.add({
        template: '{player} gets 1 wood from Cube Cutter',
        args: { player },
      })
    },
    onFieldPhase(game, player) {
      if (player.wood >= 1 && player.food >= 1) {
        game.actions.offerCubeCutterExchange(player, this)
      }
    },
  },
  {
    id: 'garden-designer-c099',
    name: 'Garden Designer',
    deck: 'occupationC',
    number: 99,
    type: 'occupation',
    players: '1+',
    text: 'At the start of scoring, you can place food in empty fields. You get 1/2/3 bonus points for each field in which you place 1/4/7 food.',
    onScoring(game, player) {
      game.actions.offerGardenDesignerPlacement(player, this)
    },
  },
  {
    id: 'butler-c100',
    name: 'Butler',
    deck: 'occupationC',
    number: 100,
    type: 'occupation',
    players: '1+',
    text: 'If you play this card in round 11 or before, during scoring, you get 4 bonus points if you then have more rooms than people.',
    onPlay(game, _player) {
      this.playedEarly = game.state.round <= 11
    },
    getEndGamePoints(player) {
      if (this.playedEarly && player.getRoomCount() > player.getFamilySize()) {
        return 4
      }
      return 0
    },
  },
  {
    id: 'stall-holder-c101',
    name: 'Stall Holder',
    deck: 'occupationC',
    number: 101,
    type: 'occupation',
    players: '1+',
    text: 'Once per round, if you have 0/1/2/3/4 unfenced stables on your farm, you can exchange 2 grain for 1 bonus point and 1/2/3/4/5 food.',
    oncePerRound: true,
    canExchange(player) {
      return player.grain >= 2
    },
    doExchange(game, player) {
      const unfencedStables = player.getUnfencedStableCount()
      const food = Math.min(5, unfencedStables + 1)
      player.removeResource('grain', 2)
      player.addResource('food', food)
      player.bonusPoints = (player.bonusPoints || 0) + 1
      game.log.add({
        template: '{player} exchanges 2 grain for 1 bonus point and {food} food via Stall Holder',
        args: { player, food },
      })
    },
  },
  {
    id: 'tree-guard-c102',
    name: 'Tree Guard',
    deck: 'occupationC',
    number: 102,
    type: 'occupation',
    players: '1+',
    text: 'Each time after you use a wood accumulation space, you can place 4 wood from your supply on that space to get 2 stone, 1 clay, 1 reed, and 1 grain.',
    onAction(game, player, actionId) {
      const woodActions = ['take-wood', 'copse', 'take-3-wood', 'take-2-wood']
      if (woodActions.includes(actionId) && player.wood >= 4) {
        game.actions.offerTreeGuardExchange(player, this, actionId)
      }
    },
  },
  {
    id: 'green-grocer-c103',
    name: 'Green Grocer',
    deck: 'occupationC',
    number: 103,
    type: 'occupation',
    players: '1+',
    text: 'At the start of each round, you can make exactly one exchange: 1 Cattle/Vegetable for 1 Vegetable/Cattle; 2 Sheep for 1 Vegetable; 1 Vegetable for 2 Sheep; 2 Food for 1 Grain; 1 Grain for 2 Food.',
    onRoundStart(game, player) {
      game.actions.offerGreenGrocerExchange(player, this)
    },
  },
  {
    id: 'collector-c104',
    name: 'Collector',
    deck: 'occupationC',
    number: 104,
    type: 'occupation',
    players: '1+',
    text: 'This card is an action space for you only. When you use it for the 1st/2nd/3rd/4th time, you get 1 begging marker and 6/7/8/9 different goods of your choice.',
    isActionSpace: true,
    actionSpaceForOwnerOnly: true,
    onPlay(_game, _player) {
      this.useCount = 0
    },
    actionSpaceEffect(game, player) {
      this.useCount++
      const goodsCount = 5 + this.useCount
      player.beggingMarkers = (player.beggingMarkers || 0) + 1
      game.actions.offerChooseGoods(player, this, goodsCount)
    },
  },
  {
    id: 'basket-carrier-c105',
    name: 'Basket Carrier',
    deck: 'occupationC',
    number: 105,
    type: 'occupation',
    players: '1+',
    text: 'Once each harvest, you can buy 1 wood, 1 reed, and 1 grain for 2 food total.',
    onHarvest(game, player) {
      if (player.food >= 2) {
        game.actions.offerBasketCarrierPurchase(player, this)
      }
    },
  },
  {
    id: 'potato-harvester-c106',
    name: 'Potato Harvester',
    deck: 'occupationC',
    number: 106,
    type: 'occupation',
    players: '1+',
    text: 'When you play this card, you immediately get 3 food. For each vegetable you get from your fields during the field phase of the harvest, you get 1 additional food.',
    onPlay(game, player) {
      player.addResource('food', 3)
      game.log.add({
        template: '{player} gets 3 food from Potato Harvester',
        args: { player },
      })
    },
    onHarvestVegetable(game, player, count) {
      player.addResource('food', count)
      game.log.add({
        template: '{player} gets {count} food from Potato Harvester',
        args: { player, count },
      })
    },
  },
  {
    id: 'baker-c107',
    name: 'Baker',
    deck: 'occupationC',
    number: 107,
    type: 'occupation',
    players: '1+',
    text: 'When you play this card and at the start of each feeding phase, you can take a "Bake Bread" action.',
    onPlay(game, player) {
      game.actions.offerBakeBread(player, this)
    },
    onFeedingPhaseStart(game, player) {
      game.actions.offerBakeBread(player, this)
    },
  },
  {
    id: 'layabout-c108',
    name: 'Layabout',
    deck: 'occupationC',
    number: 108,
    type: 'occupation',
    players: '1+',
    text: 'When you play this card, you must skip the next harvest. (You also do not have to feed your family that harvest.)',
    onPlay(game, player) {
      player.skipNextHarvest = true
      game.log.add({
        template: '{player} will skip the next harvest from Layabout',
        args: { player },
      })
    },
  },
  {
    id: 'schnapps-distiller-c109',
    name: 'Schnapps Distiller',
    deck: 'occupationC',
    number: 109,
    type: 'occupation',
    players: '1+',
    text: 'In the feeding phase of each harvest, you can use this card to turn exactly 1 vegetable into 5 food.',
    onFeedingPhase(game, player) {
      if (player.vegetables >= 1) {
        game.actions.offerSchnappsDistillerConversion(player, this)
      }
    },
  },
  {
    id: 'home-brewer-c110',
    name: 'Home Brewer',
    deck: 'occupationC',
    number: 110,
    type: 'occupation',
    players: '1+',
    text: 'After the field phase of each harvest, you can use this card to turn exactly 1 grain into your choice of 3 food or 1 bonus point.',
    onFieldPhaseEnd(game, player) {
      if (player.grain >= 1) {
        game.actions.offerHomeBrewerConversion(player, this)
      }
    },
  },
  {
    id: 'small-animal-breeder-c111',
    name: 'Small Animal Breeder',
    deck: 'occupationC',
    number: 111,
    type: 'occupation',
    players: '1+',
    text: 'Before the start of each round, if you have food equal to or higher than the current round number, you get 1 food.',
    onBeforeRoundStart(game, player) {
      if (player.food >= game.state.round) {
        player.addResource('food', 1)
        game.log.add({
          template: '{player} gets 1 food from Small Animal Breeder',
          args: { player },
        })
      }
    },
  },
  {
    id: 'thresher-c112',
    name: 'Thresher',
    deck: 'occupationC',
    number: 112,
    type: 'occupation',
    players: '1+',
    text: 'Immediately before each time you use the "Grain Utilization", "Farmland", or "Cultivation" action space, you can buy 1 grain for 1 food.',
    onBeforeAction(game, player, actionId) {
      if ((actionId === 'sow-bake' || actionId === 'plow-field' || actionId === 'plow-sow') && player.food >= 1) {
        game.actions.offerBuyGrain(player, this)
      }
    },
  },
  {
    id: 'winter-caretaker-c113',
    name: 'Winter Caretaker',
    deck: 'occupationC',
    number: 113,
    type: 'occupation',
    players: '1+',
    text: 'When you play this card, you immediately get 1 grain. At the end of each harvest, you can buy exactly 1 vegetable for 2 food.',
    onPlay(game, player) {
      player.addResource('grain', 1)
      game.log.add({
        template: '{player} gets 1 grain from Winter Caretaker',
        args: { player },
      })
    },
    onHarvestEnd(game, player) {
      if (player.food >= 2) {
        game.actions.offerBuyVegetable(player, this, 2)
      }
    },
  },
  {
    id: 'soil-scientist-c114',
    name: 'Soil Scientist',
    deck: 'occupationC',
    number: 114,
    type: 'occupation',
    players: '1+',
    text: 'Each time after you use a clay/stone accumulation space, you can place 1 stone/2 clay from your supply on the space to get 2 grain/1 vegetable, respectively.',
    onAction(game, player, actionId) {
      if ((actionId === 'take-clay' || actionId === 'take-clay-2') && player.stone >= 1) {
        game.actions.offerSoilScientistExchange(player, this, 'stone', 1, 'grain', 2, actionId)
      }
      else if ((actionId === 'take-stone-1' || actionId === 'take-stone-2') && player.clay >= 2) {
        game.actions.offerSoilScientistExchange(player, this, 'clay', 2, 'vegetables', 1, actionId)
      }
    },
  },
  {
    id: 'sower-c115',
    name: 'Sower',
    deck: 'occupationC',
    number: 115,
    type: 'occupation',
    players: '1+',
    text: 'Each time you build a major improvement, place 1 reed from the general supply on that card. At any time, you can move the reed to your supply or exchange it for a "Sow" action.',
    onBuildMajor(game, player, majorId) {
      if (!game.state.sowerReed) {
        game.state.sowerReed = {}
      }
      game.state.sowerReed[majorId] = (game.state.sowerReed[majorId] || 0) + 1
    },
    allowsAnytimeAction: true,
  },
  {
    id: 'furniture-maker-c116',
    name: 'Furniture Maker',
    deck: 'occupationC',
    number: 116,
    type: 'occupation',
    players: '1+',
    text: 'When you play this card, you immediately get 1 wood. Each time you play an occupation after this one, you get 1 wood for each food paid as occupation cost.',
    onPlay(game, player) {
      player.addResource('wood', 1)
      game.log.add({
        template: '{player} gets 1 wood from Furniture Maker',
        args: { player },
      })
    },
    onPlayOccupation(game, player, foodPaid) {
      if (foodPaid > 0) {
        player.addResource('wood', foodPaid)
        game.log.add({
          template: '{player} gets {amount} wood from Furniture Maker',
          args: { player, amount: foodPaid },
        })
      }
    },
  },
  {
    id: 'legworker-c117',
    name: 'Legworker',
    deck: 'occupationC',
    number: 117,
    type: 'occupation',
    players: '1+',
    text: 'Each time you use an action space that is orthogonally adjacent to another action space occupied by one of your people, you get 1 wood.',
    onAction(game, player, actionId) {
      if (game.isAdjacentToOwnWorker(player, actionId)) {
        player.addResource('wood', 1)
        game.log.add({
          template: '{player} gets 1 wood from Legworker',
          args: { player },
        })
      }
    },
  },
  {
    id: 'wood-collector-c118',
    name: 'Wood Collector',
    deck: 'occupationC',
    number: 118,
    type: 'occupation',
    players: '1+',
    text: 'Place 1 wood on each of the next 5 round spaces. At the start of these rounds, you get the wood.',
    onPlay(game, player) {
      const currentRound = game.state.round
      for (let i = 1; i <= 5; i++) {
        const round = currentRound + i
        if (round <= 14) {
          if (!game.state.scheduledWood) {
            game.state.scheduledWood = {}
          }
          if (!game.state.scheduledWood[player.name]) {
            game.state.scheduledWood[player.name] = {}
          }
          game.state.scheduledWood[player.name][round] =
            (game.state.scheduledWood[player.name][round] || 0) + 1
        }
      }
      game.log.add({
        template: '{player} schedules 1 wood for next 5 rounds from Wood Collector',
        args: { player },
      })
    },
  },
  {
    id: 'skillful-renovator-c119',
    name: 'Skillful Renovator',
    deck: 'occupationC',
    number: 119,
    type: 'occupation',
    players: '1+',
    text: 'When you play this card, you immediately get 1 wood and 1 clay. Each time after you renovate, you get a number of wood equal to the number of people you placed that round.',
    onPlay(game, player) {
      player.addResource('wood', 1)
      player.addResource('clay', 1)
      game.log.add({
        template: '{player} gets 1 wood and 1 clay from Skillful Renovator',
        args: { player },
      })
    },
    onRenovate(game, player) {
      const peoplePlaced = player.getPersonPlacedThisRound()
      if (peoplePlaced > 0) {
        player.addResource('wood', peoplePlaced)
        game.log.add({
          template: '{player} gets {amount} wood from Skillful Renovator',
          args: { player, amount: peoplePlaced },
        })
      }
    },
  },
  {
    id: 'agricultural-labourer-c120',
    name: 'Agricultural Labourer',
    deck: 'occupationC',
    number: 120,
    type: 'occupation',
    players: '1+',
    text: 'Place 8 clay on this card. For each grain you obtain, you also get 1 clay from this card.',
    onPlay(_game, _player) {
      this.clay = 8
    },
    onObtainGrain(game, player, amount) {
      const clayToGive = Math.min(amount, this.clay || 0)
      if (clayToGive > 0) {
        this.clay -= clayToGive
        player.addResource('clay', clayToGive)
        game.log.add({
          template: '{player} gets {amount} clay from Agricultural Labourer',
          args: { player, amount: clayToGive },
        })
      }
    },
  },
  {
    id: 'clay-kneader-c121',
    name: 'Clay Kneader',
    deck: 'occupationC',
    number: 121,
    type: 'occupation',
    players: '1+',
    text: 'When you play this card, you immediately get 1 wood and 2 clay. Each time after you use a "Grain Seeds" or "Vegetable Seeds" action space, you get 1 clay.',
    onPlay(game, player) {
      player.addResource('wood', 1)
      player.addResource('clay', 2)
      game.log.add({
        template: '{player} gets 1 wood and 2 clay from Clay Kneader',
        args: { player },
      })
    },
    onAction(game, player, actionId) {
      if (actionId === 'take-grain' || actionId === 'take-vegetables') {
        player.addResource('clay', 1)
        game.log.add({
          template: '{player} gets 1 clay from Clay Kneader',
          args: { player },
        })
      }
    },
  },
  {
    id: 'bricklayer-c122',
    name: 'Bricklayer',
    deck: 'occupationC',
    number: 122,
    type: 'occupation',
    players: '1+',
    text: 'Each improvement and each renovation costs you 1 clay less. Each room costs you 2 clay less.',
    modifyImprovementCost(player, cost) {
      if (cost.clay && cost.clay > 0) {
        return { ...cost, clay: cost.clay - 1 }
      }
      return cost
    },
    modifyRenovationCost(player, cost) {
      if (cost.clay && cost.clay > 0) {
        return { ...cost, clay: cost.clay - 1 }
      }
      return cost
    },
    modifyRoomCost(player, cost) {
      if (cost.clay && cost.clay > 0) {
        return { ...cost, clay: Math.max(0, cost.clay - 2) }
      }
      return cost
    },
  },
  {
    id: 'freemason-c123',
    name: 'Freemason',
    deck: 'occupationC',
    number: 123,
    type: 'occupation',
    players: '1+',
    text: 'As long as you live in a clay/stone house with exactly 2 rooms, at the start of each work phase, you get 2 clay/stone.',
    onWorkPhaseStart(game, player) {
      if (player.getRoomCount() === 2) {
        if (player.roomType === 'clay') {
          player.addResource('clay', 2)
          game.log.add({
            template: '{player} gets 2 clay from Freemason',
            args: { player },
          })
        }
        else if (player.roomType === 'stone') {
          player.addResource('stone', 2)
          game.log.add({
            template: '{player} gets 2 stone from Freemason',
            args: { player },
          })
        }
      }
    },
  },
  {
    id: 'stone-importer-c124',
    name: 'Stone Importer',
    deck: 'occupationC',
    number: 124,
    type: 'occupation',
    players: '1+',
    text: 'In the breeding phase of the 1st/2nd/3rd/4th/5th/6th harvest, you can use this card to buy exactly 2 stone for 2/2/3/3/4/1 food.',
    onBreedingPhase(game, player) {
      const harvestNumber = game.getHarvestNumber()
      const costs = { 1: 2, 2: 2, 3: 3, 4: 3, 5: 4, 6: 1 }
      const cost = costs[harvestNumber]
      if (cost && player.food >= cost) {
        game.actions.offerBuyStone(player, this, 2, cost)
      }
    },
  },
  {
    id: 'nightworker-c125',
    name: 'Nightworker',
    deck: 'occupationC',
    number: 125,
    type: 'occupation',
    players: '1+',
    text: 'Before the start of each work phase, you can place a person on an accumulation space of a building resource not in your supply. (Then proceed with the start player.)',
    onBeforeWorkPhase(game, player) {
      const missingResources = []
      if (player.wood === 0) {
        missingResources.push('wood')
      }
      if (player.clay === 0) {
        missingResources.push('clay')
      }
      if (player.reed === 0) {
        missingResources.push('reed')
      }
      if (player.stone === 0) {
        missingResources.push('stone')
      }
      if (missingResources.length > 0) {
        game.actions.offerNightworkerPlacement(player, this, missingResources)
      }
    },
  },
  {
    id: 'excavator-c126',
    name: 'Excavator',
    deck: 'occupationC',
    number: 126,
    type: 'occupation',
    players: '1+',
    text: 'Each time after you use the "Day Laborer" action space, you get 1 additional wood and clay, and you can buy 1 stone for 1 food.',
    onAction(game, player, actionId) {
      if (actionId === 'day-laborer') {
        player.addResource('wood', 1)
        player.addResource('clay', 1)
        game.log.add({
          template: '{player} gets 1 wood and 1 clay from Excavator',
          args: { player },
        })
        if (player.food >= 1) {
          game.actions.offerBuyStone(player, this, 1, 1)
        }
      }
    },
  },
  {
    id: 'lover-c127',
    name: 'Lover',
    deck: 'occupationC',
    number: 127,
    type: 'occupation',
    players: '1+',
    text: 'When you play this card, immediately pay an amount of food equal to the number of complete rounds left to play to take a "Family Growth Even without Room" action.',
    onPlay(game, player) {
      const roundsLeft = 14 - game.state.round
      if (player.food >= roundsLeft) {
        player.removeResource('food', roundsLeft)
        game.actions.familyGrowthWithoutRoom(player)
        game.log.add({
          template: '{player} pays {amount} food for Family Growth via Lover',
          args: { player, amount: roundsLeft },
        })
      }
    },
  },
  {
    id: 'wooden-hut-extender-c128',
    name: 'Wooden Hut Extender',
    deck: 'occupationC',
    number: 128,
    type: 'occupation',
    players: '1+',
    text: 'Wood rooms now cost you 1 reed, and additionally 5 wood through round 5, 4 wood in rounds 6 and 7, and 3 wood in round 8 and later.',
    modifyRoomCost(player, cost, round) {
      if (player.roomType === 'wood') {
        let woodCost = 5
        if (round >= 8) {
          woodCost = 3
        }
        else if (round >= 6) {
          woodCost = 4
        }
        return { wood: woodCost, reed: 1 }
      }
      return cost
    },
  },
  {
    id: 'second-spouse-c129',
    name: 'Second Spouse',
    deck: 'occupationC',
    number: 129,
    type: 'occupation',
    players: '1+',
    text: 'You can use the "Urgent Wish for Children" action space (from round 12-13) even if it is occupied by the first person another player placed.',
    allowsUrgentFamilyGrowthIfFirstPerson: true,
  },
  {
    id: 'outskirts-director-c130',
    name: 'Outskirts Director',
    deck: 'occupationC',
    number: 130,
    type: 'occupation',
    players: '1+',
    text: 'Each time you use the "Grove" or "Hollow" accumulation space, you can place 2 reed from the general supply on the other space. If you do, you can immediately place another person.',
    onAction(game, player, actionId) {
      if (actionId === 'copse') {
        game.actions.offerOutskirtsDirectorBonus(player, this, 'take-clay-2')
      }
      else if (actionId === 'take-clay-2') {
        game.actions.offerOutskirtsDirectorBonus(player, this, 'copse')
      }
    },
  },
  {
    id: 'private-teacher-c131',
    name: 'Private Teacher',
    deck: 'occupationC',
    number: 131,
    type: 'occupation',
    players: '1+',
    text: 'Each time you use the "Grain Seeds" action space when any "Lessons" action space is occupied, you can also play an occupation for an occupation cost of 1 food.',
    onAction(game, player, actionId) {
      if (actionId === 'take-grain' && (game.isActionOccupied('lessons-1') || game.isActionOccupied('lessons-2'))) {
        game.actions.offerPlayOccupation(player, this, { cost: { food: 1 } })
      }
    },
  },
  {
    id: 'timber-shingle-maker-c132',
    name: 'Timber Shingle Maker',
    deck: 'occupationC',
    number: 132,
    type: 'occupation',
    players: '1+',
    text: 'When you renovate to stone, you can place up to 1 wood from your supply in each of your rooms. During scoring, each such wood is worth 1 bonus point.',
    onRenovate(game, player, fromType, toType) {
      if (toType === 'stone' && player.wood > 0) {
        game.actions.offerTimberShingleMakerPlacement(player, this)
      }
    },
    getEndGamePoints(player) {
      return player.timberShingleMakerWood || 0
    },
  },
  {
    id: 'soldier-c133',
    name: 'Soldier',
    deck: 'occupationC',
    number: 133,
    type: 'occupation',
    players: '1+',
    text: 'During scoring, you get 1 bonus point for each stone-wood pair in your supply. You cannot score additional points for the resources scored with this card.',
    getEndGamePoints(player) {
      return Math.min(player.stone, player.wood)
    },
    resourcesUsedForScoring: ['stone', 'wood'],
  },
  {
    id: 'cow-prince-c134',
    name: 'Cow Prince',
    deck: 'occupationC',
    number: 134,
    type: 'occupation',
    players: '1+',
    text: 'During scoring, you get 1 bonus point for each space in your farmyard (including rooms) holding at least 1 cattle.',
    getEndGamePoints(player) {
      return player.getSpacesWithCattle()
    },
  },
  {
    id: 'constable-c135',
    name: 'Constable',
    deck: 'occupationC',
    number: 135,
    type: 'occupation',
    players: '3+',
    text: 'If there are still 1/3/6/9 complete rounds left to play, you immediately get 1/2/3/4 wood. During scoring, each player with no negative points gets 3 bonus points.',
    onPlay(game, player) {
      const roundsLeft = 14 - game.state.round
      let wood = 0
      if (roundsLeft >= 9) {
        wood = 4
      }
      else if (roundsLeft >= 6) {
        wood = 3
      }
      else if (roundsLeft >= 3) {
        wood = 2
      }
      else if (roundsLeft >= 1) {
        wood = 1
      }
      if (wood > 0) {
        player.addResource('wood', wood)
        game.log.add({
          template: '{player} gets {amount} wood from Constable',
          args: { player, amount: wood },
        })
      }
    },
    getEndGamePointsAllPlayers(game) {
      const bonuses = {}
      for (const player of game.players.all()) {
        if (!player.hasNegativePoints()) {
          bonuses[player.name] = 3
        }
      }
      return bonuses
    },
  },
  {
    id: 'ranch-provost-c136',
    name: 'Ranch Provost',
    deck: 'occupationC',
    number: 136,
    type: 'occupation',
    players: '3+',
    text: 'If there are still 3/6/9 complete rounds left to play, you immediately get 2/3/4 wood. During scoring, each player with a pasture of highest capacity gets 3 bonus points.',
    onPlay(game, player) {
      const roundsLeft = 14 - game.state.round
      let wood = 0
      if (roundsLeft >= 9) {
        wood = 4
      }
      else if (roundsLeft >= 6) {
        wood = 3
      }
      else if (roundsLeft >= 3) {
        wood = 2
      }
      if (wood > 0) {
        player.addResource('wood', wood)
        game.log.add({
          template: '{player} gets {amount} wood from Ranch Provost',
          args: { player, amount: wood },
        })
      }
    },
    getEndGamePointsAllPlayers(game) {
      const bonuses = {}
      let maxCapacity = 0
      for (const player of game.players.all()) {
        maxCapacity = Math.max(maxCapacity, player.getHighestPastureCapacity())
      }
      for (const player of game.players.all()) {
        if (player.getHighestPastureCapacity() === maxCapacity) {
          bonuses[player.name] = 3
        }
      }
      return bonuses
    },
  },
  {
    id: 'charcoal-burner-c137',
    name: 'Charcoal Burner',
    deck: 'occupationC',
    number: 137,
    type: 'occupation',
    players: '3+',
    text: 'Each time any player (including you) plays or builds a baking improvement, you get 1 wood and 1 food.',
    onAnyBuildBakingImprovement(game, actingPlayer, cardOwner) {
      cardOwner.addResource('wood', 1)
      cardOwner.addResource('food', 1)
      game.log.add({
        template: '{player} gets 1 wood and 1 food from Charcoal Burner',
        args: { player: cardOwner },
      })
    },
  },
  {
    id: 'animal-feeder-c138',
    name: 'Animal Feeder',
    deck: 'occupationC',
    number: 138,
    type: 'occupation',
    players: '3+',
    text: 'On the "Day Laborer" action space, you also get your choice of 1 sheep or 1 grain. Instead of that good, you can buy 1 wild boar for 1 food or 1 cattle for 2 food.',
    onAction(game, player, actionId) {
      if (actionId === 'day-laborer') {
        game.actions.offerAnimalFeederChoice(player, this)
      }
    },
  },
  {
    id: 'basketmakers-wife-c139',
    name: "Basketmaker's Wife",
    deck: 'occupationC',
    number: 139,
    type: 'occupation',
    players: '3+',
    text: 'When you play this card, you immediately get 1 reed and 1 food. At any time, you can turn 1 reed into 2 food.',
    onPlay(game, player) {
      player.addResource('reed', 1)
      player.addResource('food', 1)
      game.log.add({
        template: "{player} gets 1 reed and 1 food from Basketmaker's Wife",
        args: { player },
      })
    },
    allowsAnytimeConversion: { from: { reed: 1 }, to: { food: 2 } },
  },
  {
    id: 'packaging-artist-c140',
    name: 'Packaging Artist',
    deck: 'occupationC',
    number: 140,
    type: 'occupation',
    players: '3+',
    text: 'When you play this card, you immediately get 1 grain. Each time you get a "Minor Improvement" action, you can take a "Bake Bread" action instead.',
    onPlay(game, player) {
      player.addResource('grain', 1)
      game.log.add({
        template: '{player} gets 1 grain from Packaging Artist',
        args: { player },
      })
    },
    onMinorImprovementAction(game, player) {
      game.actions.offerPackagingArtistChoice(player, this)
    },
  },
  {
    id: 'sheep-provider-c141',
    name: 'Sheep Provider',
    deck: 'occupationC',
    number: 141,
    type: 'occupation',
    players: '3+',
    text: 'Each time any player (including you) uses the "Sheep Market" accumulation space, you get 1 grain.',
    onAnyAction(game, actingPlayer, actionId, cardOwner) {
      if (actionId === 'take-sheep') {
        cardOwner.addResource('grain', 1)
        game.log.add({
          template: '{player} gets 1 grain from Sheep Provider',
          args: { player: cardOwner },
        })
      }
    },
  },
  {
    id: 'market-crier-c142',
    name: 'Market Crier',
    deck: 'occupationC',
    number: 142,
    type: 'occupation',
    players: '3+',
    text: 'Each time you use the "Grain Seeds" action space, you can get an additional 1 grain and 1 vegetable. If you do, each other player gets 1 grain from the general supply.',
    onAction(game, player, actionId) {
      if (actionId === 'take-grain') {
        game.actions.offerMarketCrierBonus(player, this)
      }
    },
  },
  {
    id: 'stone-buyer-c143',
    name: 'Stone Buyer',
    deck: 'occupationC',
    number: 143,
    type: 'occupation',
    players: '3+',
    text: 'When you play this card, you can immediately buy exactly 2 stone for 1 food. From the next round on, one per round, you can buy 1 stone for 2 food.',
    onPlay(game, player) {
      if (player.food >= 1) {
        game.actions.offerBuyStone(player, this, 2, 1)
      }
    },
    onRoundStart(game, player) {
      if (player.food >= 2) {
        game.actions.offerBuyStone(player, this, 1, 2)
      }
    },
  },
  {
    id: 'reed-roof-renovator-c144',
    name: 'Reed Roof Renovator',
    deck: 'occupationC',
    number: 144,
    type: 'occupation',
    players: '3+',
    text: 'Each time another player renovates, you immediately get 1 reed from the general supply. When you play this card in a 3-player game, you immediately get 1 reed.',
    onPlay(game, player) {
      if (game.players.count() === 3) {
        player.addResource('reed', 1)
        game.log.add({
          template: '{player} gets 1 reed from Reed Roof Renovator',
          args: { player },
        })
      }
    },
    onAnyRenovate(game, actingPlayer, cardOwner) {
      if (actingPlayer.name !== cardOwner.name) {
        cardOwner.addResource('reed', 1)
        game.log.add({
          template: '{player} gets 1 reed from Reed Roof Renovator',
          args: { player: cardOwner },
        })
      }
    },
  },
  {
    id: 'forest-reviewer-c145',
    name: 'Forest Reviewer',
    deck: 'occupationC',
    number: 145,
    type: 'occupation',
    players: '3+',
    text: 'Each time after any player (including you) uses the unoccupied "Grove" or "Forest" accumulation space while the other of the two is occupied, you get 1 reed.',
    onAnyAction(game, actingPlayer, actionId, cardOwner) {
      if (actionId === 'copse' && game.isActionOccupied('take-wood')) {
        cardOwner.addResource('reed', 1)
        game.log.add({
          template: '{player} gets 1 reed from Forest Reviewer',
          args: { player: cardOwner },
        })
      }
      else if (actionId === 'take-wood' && game.isActionOccupied('copse')) {
        cardOwner.addResource('reed', 1)
        game.log.add({
          template: '{player} gets 1 reed from Forest Reviewer',
          args: { player: cardOwner },
        })
      }
    },
  },
  {
    id: 'workshop-assistant-c146',
    name: 'Workshop Assistant',
    deck: 'occupationC',
    number: 146,
    type: 'occupation',
    players: '3+',
    text: 'Place a unique pair of different building resources on each of your improvements. Each time another player renovates, you may move one such pair to your supply.',
    onPlay(game, player) {
      this.resourcePairs = []
      const improvements = player.getAllImprovements()
      for (const imp of improvements) {
        this.resourcePairs.push({ improvement: imp.id, resources: game.actions.chooseBuildingResourcePair(player) })
      }
    },
    onAnyRenovate(game, actingPlayer, cardOwner) {
      if (actingPlayer.name !== cardOwner.name && this.resourcePairs && this.resourcePairs.length > 0) {
        game.actions.offerWorkshopAssistantClaim(cardOwner, this)
      }
    },
  },
  {
    id: 'cowherd-c147',
    name: 'Cowherd',
    deck: 'occupationC',
    number: 147,
    type: 'occupation',
    players: '3+',
    text: 'Each time you use the "Cattle Market" accumulation space (introduced in round 10 or 11), you get 1 additional cattle.',
    onAction(game, player, actionId) {
      if (actionId === 'take-cattle' && player.canPlaceAnimals('cattle', 1)) {
        player.addAnimals('cattle', 1)
        game.log.add({
          template: '{player} gets 1 additional cattle from Cowherd',
          args: { player },
        })
      }
    },
  },
  {
    id: 'mud-wallower-c148',
    name: 'Mud Wallower',
    deck: 'occupationC',
    number: 148,
    type: 'occupation',
    players: '3+',
    text: 'Each time you use an accumulation space, place 1 clay from the general supply on this card. You must immediately exchange 4 clay on this card for 1 wild boar, held by this card.',
    onPlay(_game, _player) {
      this.clay = 0
      this.boar = 0
    },
    holdsAnimals: { boar: true },
    onAction(game, player, actionId) {
      if (game.isAccumulationSpace(actionId)) {
        this.clay = (this.clay || 0) + 1
        while (this.clay >= 4) {
          this.clay -= 4
          this.boar = (this.boar || 0) + 1
          game.log.add({
            template: '{player} gets 1 wild boar on Mud Wallower',
            args: { player },
          })
        }
      }
    },
    getAnimalCapacity() {
      return this.boar || 0
    },
  },
  {
    id: 'resource-recycler-c149',
    name: 'Resource Recycler',
    deck: 'occupationC',
    number: 149,
    type: 'occupation',
    players: '3+',
    text: 'Each time another player renovates to stone, if you live in a clay house, you can pay 2 food to build a clay room at no additional cost.',
    onAnyRenovate(game, actingPlayer, cardOwner, toType) {
      if (toType === 'stone' && actingPlayer.name !== cardOwner.name && cardOwner.roomType === 'clay' && cardOwner.food >= 2) {
        game.actions.offerResourceRecyclerRoom(cardOwner, this)
      }
    },
  },
  {
    id: 'parrot-breeder-c150',
    name: 'Parrot Breeder',
    deck: 'occupationC',
    number: 150,
    type: 'occupation',
    players: '3+',
    text: 'On your turn, if you pay 1 grain to the general supply, you can use the same action space that the player to your right has just used on their turn.',
    onTurnStart(game, player) {
      const rightPlayer = game.getPlayerToRight(player)
      const lastAction = rightPlayer.lastActionThisTurn
      if (lastAction && player.grain >= 1 && !game.isEmptyAccumulationSpace(lastAction)) {
        game.actions.offerParrotBreederCopy(player, this, lastAction)
      }
    },
  },
  {
    id: 'sowing-director-c151',
    name: 'Sowing Director',
    deck: 'occupationC',
    number: 151,
    type: 'occupation',
    players: '3+',
    text: 'Each time after another player uses the "Grain Utilization" action space, you get a "Sow" action.',
    onAnyAction(game, actingPlayer, actionId, cardOwner) {
      if (actionId === 'sow-bake' && actingPlayer.name !== cardOwner.name) {
        game.actions.offerSow(cardOwner, this)
      }
    },
  },
  {
    id: 'puppeteer-c152',
    name: 'Puppeteer',
    deck: 'occupationC',
    number: 152,
    type: 'occupation',
    players: '3+',
    text: 'Each time another player uses the "Traveling Players" accumulation space, you can pay them 1 food to immediately play an occupation without paying an occupation cost.',
    onAnyAction(game, actingPlayer, actionId, cardOwner) {
      if (actionId === 'traveling-players' && actingPlayer.name !== cardOwner.name && cardOwner.food >= 1) {
        game.actions.offerPuppeteerOccupation(cardOwner, actingPlayer, this)
      }
    },
  },
  {
    id: 'pattern-maker-c153',
    name: 'Pattern Maker',
    deck: 'occupationC',
    number: 153,
    type: 'occupation',
    players: '3+',
    text: 'Each time another player renovates, you can exchange exactly 2 wood for 1 grain, 1 food, and 1 bonus point.',
    onAnyRenovate(game, actingPlayer, cardOwner) {
      if (actingPlayer.name !== cardOwner.name && cardOwner.wood >= 2) {
        game.actions.offerPatternMakerExchange(cardOwner, this)
      }
    },
  },
  {
    id: 'twin-researcher-c154',
    name: 'Twin Researcher',
    deck: 'occupationC',
    number: 154,
    type: 'occupation',
    players: '3+',
    text: 'Each time you use one of the two accumulation spaces for the same type of good containing exactly the same number of goods, you can also buy 1 bonus point for 1 food.',
    onAction(game, player, actionId) {
      const otherSpace = game.getMatchingAccumulationSpace(actionId)
      if (otherSpace) {
        const thisCount = game.getAccumulatedCount(actionId)
        const otherCount = game.getAccumulatedCount(otherSpace)
        if (thisCount === otherCount && player.food >= 1) {
          game.actions.offerBuyBonusPoint(player, this, 1)
        }
      }
    },
  },
  {
    id: 'food-distributor-c155',
    name: 'Food Distributor',
    deck: 'occupationC',
    number: 155,
    type: 'occupation',
    players: '4+',
    text: 'When you play this card, you immediately get 1 grain and, at the start of this returning home phase, an amount of food equal to the number of occupied action space cards.',
    onPlay(game, player) {
      player.addResource('grain', 1)
      game.log.add({
        template: '{player} gets 1 grain from Food Distributor',
        args: { player },
      })
      player.foodDistributorPending = true
    },
    onReturnHomeStart(game, player) {
      if (player.foodDistributorPending) {
        const occupiedCount = game.getOccupiedActionSpaceCardCount()
        player.addResource('food', occupiedCount)
        game.log.add({
          template: '{player} gets {amount} food from Food Distributor',
          args: { player, amount: occupiedCount },
        })
        player.foodDistributorPending = false
      }
    },
  },
  {
    id: 'hoof-caregiver-c156',
    name: 'Hoof Caregiver',
    deck: 'occupationC',
    number: 156,
    type: 'occupation',
    players: '4+',
    text: 'Immediately add 1 cattle from the general supply to the "Cattle Market" accumulation space. Afterward, you get 1 grain plus 1 food for each cattle on "Cattle Market".',
    onPlay(game, player) {
      game.addToAccumulationSpace('take-cattle', 'cattle', 1)
      const cattleOnMarket = game.getAccumulatedResources('take-cattle').cattle || 0
      player.addResource('grain', 1)
      player.addResource('food', cattleOnMarket)
      game.log.add({
        template: '{player} gets 1 grain and {food} food from Hoof Caregiver',
        args: { player, food: cattleOnMarket },
      })
    },
  },
  {
    id: 'resource-analyzer-c157',
    name: 'Resource Analyzer',
    deck: 'occupationC',
    number: 157,
    type: 'occupation',
    players: '4+',
    text: 'Before the start of each round, if you have more building resources than all other players of at least two types, you get 1 food.',
    onBeforeRoundStart(game, player) {
      const typesLeading = game.getBuildingResourceTypesPlayerLeads(player)
      if (typesLeading >= 2) {
        player.addResource('food', 1)
        game.log.add({
          template: '{player} gets 1 food from Resource Analyzer',
          args: { player },
        })
      }
    },
  },
  {
    id: 'forest-campaigner-c158',
    name: 'Forest Campaigner',
    deck: 'occupationC',
    number: 158,
    type: 'occupation',
    players: '4+',
    text: 'Each time before you place a person, if there are at least 8 wood total on accumulation spaces, you get 1 food.',
    onBeforePlacePerson(game, player) {
      if (game.getTotalWoodOnAccumulationSpaces() >= 8) {
        player.addResource('food', 1)
        game.log.add({
          template: '{player} gets 1 food from Forest Campaigner',
          args: { player },
        })
      }
    },
  },
  {
    id: 'fishermans-friend-c159',
    name: "Fisherman's Friend",
    deck: 'occupationC',
    number: 159,
    type: 'occupation',
    players: '4+',
    text: 'At the start of each round, if there is more food on the "Traveling Players" than on the "Fishing" accumulation space, you get the difference from the general supply.',
    onRoundStart(game, player) {
      const travelingFood = game.getAccumulatedResources('traveling-players').food || 0
      const fishingFood = game.getAccumulatedResources('fishing').food || 0
      const diff = travelingFood - fishingFood
      if (diff > 0) {
        player.addResource('food', diff)
        game.log.add({
          template: "{player} gets {amount} food from Fisherman's Friend",
          args: { player, amount: diff },
        })
      }
    },
  },
  {
    id: 'outrider-c160',
    name: 'Outrider',
    deck: 'occupationC',
    number: 160,
    type: 'occupation',
    players: '4+',
    text: 'Each time before you use the action space on the most recently revealed action space card, you get 1 grain.',
    onBeforeAction(game, player, actionId) {
      if (game.getActionSpaceRound(actionId) === game.getMostRecentlyRevealedRound()) {
        player.addResource('grain', 1)
        game.log.add({
          template: '{player} gets 1 grain from Outrider',
          args: { player },
        })
      }
    },
  },
  {
    id: 'potato-digger-c161',
    name: 'Potato Digger',
    deck: 'occupationC',
    number: 161,
    type: 'occupation',
    players: '4+',
    text: 'When you play this card, if you have at least 2/4/5 unplanted field tiles, you immediately get 1/2/3 vegetables.',
    onPlay(game, player) {
      const unplantedFields = player.getUnplantedFieldCount()
      let vegetables = 0
      if (unplantedFields >= 5) {
        vegetables = 3
      }
      else if (unplantedFields >= 4) {
        vegetables = 2
      }
      else if (unplantedFields >= 2) {
        vegetables = 1
      }
      if (vegetables > 0) {
        player.addResource('vegetables', vegetables)
        game.log.add({
          template: '{player} gets {amount} vegetables from Potato Digger',
          args: { player, amount: vegetables },
        })
      }
    },
  },
  {
    id: 'forest-owner-c162',
    name: 'Forest Owner',
    deck: 'occupationC',
    number: 162,
    type: 'occupation',
    players: '4+',
    text: 'This card is an action space for all. If another player uses it, they get 3 wood and must give you 1 wood from the general supply. If you use it, you get 4 wood.',
    isActionSpace: true,
    actionSpaceForAll: true,
    actionSpaceEffect(game, player, owner) {
      if (player.name === owner.name) {
        player.addResource('wood', 4)
        game.log.add({
          template: '{player} gets 4 wood from Forest Owner',
          args: { player },
        })
      }
      else {
        player.addResource('wood', 3)
        owner.addResource('wood', 1)
        game.log.add({
          template: '{player} gets 3 wood, {owner} gets 1 wood from Forest Owner',
          args: { player, owner },
        })
      }
    },
  },
  {
    id: 'material-deliveryman-c163',
    name: 'Material Deliveryman',
    deck: 'occupationC',
    number: 163,
    type: 'occupation',
    players: '4+',
    text: 'Each time any player (including you) takes 5/6/7/8+ goods from an accumulation space, you get 1 wood/clay/reed/stone from the general supply.',
    onAnyAction(game, actingPlayer, actionId, cardOwner, resources) {
      if (game.isAccumulationSpace(actionId)) {
        const totalGoods = Object.values(resources || {}).reduce((a, b) => a + b, 0)
        let bonus = null
        if (totalGoods >= 8) {
          bonus = 'stone'
        }
        else if (totalGoods >= 7) {
          bonus = 'reed'
        }
        else if (totalGoods >= 6) {
          bonus = 'clay'
        }
        else if (totalGoods >= 5) {
          bonus = 'wood'
        }
        if (bonus) {
          cardOwner.addResource(bonus, 1)
          game.log.add({
            template: '{player} gets 1 {resource} from Material Deliveryman',
            args: { player: cardOwner, resource: bonus },
          })
        }
      }
    },
  },
  {
    id: 'german-heath-keeper-c164',
    name: 'German Heath Keeper',
    deck: 'occupationC',
    number: 164,
    type: 'occupation',
    players: '4+',
    text: 'Each time any player (including you) uses the "Pig Market" accumulation space, you get 1 sheep from the general supply.',
    onAnyAction(game, actingPlayer, actionId, cardOwner) {
      if (actionId === 'take-boar' && cardOwner.canPlaceAnimals('sheep', 1)) {
        cardOwner.addAnimals('sheep', 1)
        game.log.add({
          template: '{player} gets 1 sheep from German Heath Keeper',
          args: { player: cardOwner },
        })
      }
    },
  },
  {
    id: 'game-catcher-c165',
    name: 'Game Catcher',
    deck: 'occupationC',
    number: 165,
    type: 'occupation',
    players: '4+',
    text: 'When you play this card, pay 1 food for each remaining harvest to immediately get 1 cattle and 1 wild boar.',
    onPlay(game, player) {
      const harvestsLeft = game.getRemainingHarvestCount()
      if (player.food >= harvestsLeft && player.canPlaceAnimals('cattle', 1) && player.canPlaceAnimals('boar', 1)) {
        player.removeResource('food', harvestsLeft)
        player.addAnimals('cattle', 1)
        player.addAnimals('boar', 1)
        game.log.add({
          template: '{player} pays {food} food for 1 cattle and 1 wild boar from Game Catcher',
          args: { player, food: harvestsLeft },
        })
      }
    },
  },
  {
    id: 'cattle-whisperer-c166',
    name: 'Cattle Whisperer',
    deck: 'occupationC',
    number: 166,
    type: 'occupation',
    players: '4+',
    text: 'Add 5 and 8 to the current round and place 1 cattle on each corresponding round space. At the start of these rounds, you get the cattle.',
    onPlay(game, player) {
      const currentRound = game.state.round
      for (const offset of [5, 8]) {
        const round = currentRound + offset
        if (round <= 14) {
          if (!game.state.scheduledCattle) {
            game.state.scheduledCattle = {}
          }
          if (!game.state.scheduledCattle[player.name]) {
            game.state.scheduledCattle[player.name] = {}
          }
          game.state.scheduledCattle[player.name][round] =
            (game.state.scheduledCattle[player.name][round] || 0) + 1
        }
      }
      game.log.add({
        template: '{player} schedules cattle from Cattle Whisperer',
        args: { player },
      })
    },
  },
  {
    id: 'cattle-buyer-c167',
    name: 'Cattle Buyer',
    deck: 'occupationC',
    number: 167,
    type: 'occupation',
    players: '4+',
    text: 'Each time another player uses the "Fencing" action space, you can buy exactly 1 sheep/wild boar/cattle from the general supply for 1/2/2 food.',
    onAnyAction(game, actingPlayer, actionId, cardOwner) {
      if (actionId === 'fencing' && actingPlayer.name !== cardOwner.name) {
        game.actions.offerCattleBuyerPurchase(cardOwner, this)
      }
    },
  },
  {
    id: 'animal-catcher-c168',
    name: 'Animal Catcher',
    deck: 'occupationC',
    number: 168,
    type: 'occupation',
    players: '4+',
    text: 'Each time you use the "Day Laborer" action space, instead of 2 food, you can get 3 different animals from the general supply. If you do, you must pay 1 food each harvest left to play.',
    onAction(game, player, actionId) {
      if (actionId === 'day-laborer') {
        game.actions.offerAnimalCatcherChoice(player, this)
      }
    },
  },
]

// Card lookup functions
function getCardById(id) {
  return occupations.find(c => c.id === id)
}

function getCardByName(name) {
  return occupations.find(c => c.name === name)
}

function getMinorImprovements() {
  return []
}

function getOccupations() {
  return occupations
}

function getAllCards() {
  return [...occupations]
}

function getCardsByPlayerCount(playerCount) {
  return getAllCards().filter(card => {
    if (!card.players) {
      return true
    }
    const minPlayers = parseInt(card.players)
    return playerCount >= minPlayers
  })
}

module.exports = {
  getCardById,
  getCardByName,
  getMinorImprovements,
  getOccupations,
  getAllCards,
  getCardsByPlayerCount,
}
