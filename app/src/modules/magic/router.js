import CubeViewer from './components/cube/CubeViewer'
import DeckManager from './components/deck/DeckManager'
import DeckShare from './components/deck/DeckShare'
import Profile from'./components/Profile'


export default [
  {
    path: '/magic',
    name: 'Magic Profile',
    title: 'Magic Profile',
    component: Profile,
  },
  {
    path: '/magic/cube/:id',
    name: 'Cube Viewer',
    title: 'Cube Viewer',
    component: CubeViewer,
  },
  {
    path: '/magic/deck/:id',
    name: 'Deck Share',
    title: 'Deck Share',
    component: DeckShare,
  },
  {
    path: '/magic/decks',
    name: 'Deck Manager',
    title: 'Deck Manager',
    component: DeckManager,
  },
]
