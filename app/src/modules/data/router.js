import Data from './components/Data'
import InnovationCards from './components/InnovationCards'
import InnovationResults from './components/InnovationResults'
import TyrantsCards from './components/TyrantsCards'

export default [
  {
    path: '/data',
    name: 'Data',
    title: 'Data',
    component: Data,
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
