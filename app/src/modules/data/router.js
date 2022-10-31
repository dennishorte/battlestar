import Data from './components/Data'
import InnovationCards from './components/InnovationCards'
import InnovationResults from './components/InnovationResults'

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
]
