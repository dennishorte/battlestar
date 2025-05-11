import CardViewer from './components/CardViewer'
import CubeViewer from './components/cube/CubeViewer'
import DeckBuilder from './components/deck/DeckBuilder'
import Profile from'./components/Profile'


export default [
  {
    path: '/magic',
    name: 'Magic Profile',
    title: 'Magic Profile',
    component: Profile,
  },
  {
    path: '/magic/card/:id',
    name: 'Card Viewer',
    title: 'Card Viewer',
    component: CardViewer,
  },
  {
    path: '/magic/cube/:id/:tab?',
    name: 'Cube Viewer',
    title: 'Cube Viewer',
    component: CubeViewer,
  },
  {
    path: '/magic/deck/:id',
    name: 'Deck Share',
    title: 'Deck Share',
    component: DeckBuilder,
  }
]
