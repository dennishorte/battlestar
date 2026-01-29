import GameData from './components/GameData.vue'
import InnovationCards from './components/InnovationCards.vue'
import InnovationResults from './components/InnovationResults.vue'
import TyrantsCards from './components/TyrantsCards.vue'

export default [
  {
    path: '/data',
    name: 'GameData',
    title: 'GameData',
    component: GameData,
  },
  {
    path: '/data/innovation/cards',
    name: 'Innovation Cards',
    title: 'Innovation Cards',
    component: InnovationCards,
  },
  {
    path: '/data/innovation/results',
    name: 'Innovation Results',
    title: 'Innovation Results',
    component: InnovationResults,
  },
  {
    path: '/data/tyrants/cards',
    name: 'Tyrants Cards',
    title: 'Tyrants Cards',
    component: TyrantsCards,
  },
]
