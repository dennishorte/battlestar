import AgricolaCards from './components/AgricolaCards.vue'
import AgricolaResults from './components/AgricolaResults.vue'
import GameData from './components/GameData.vue'
import HexTileDetail from './components/HexTileDetail.vue'
import HexTilesViewer from './components/HexTilesViewer.vue'
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
    path: '/data/agricola/cards',
    name: 'Agricola Cards',
    title: 'Agricola Cards',
    component: AgricolaCards,
  },
  {
    path: '/data/agricola/results',
    name: 'Agricola Results',
    title: 'Agricola Results',
    component: AgricolaResults,
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
  {
    path: '/data/tyrants/hexTiles',
    name: 'Hex Tiles',
    title: 'Hex Tiles',
    component: HexTilesViewer,
  },
  {
    path: '/data/tyrants/hexTiles/:tileId',
    name: 'Hex Tile Detail',
    title: 'Hex Tile Detail',
    component: HexTileDetail,
    props: true,
  },
]
