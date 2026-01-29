import CardViewer from './components/CardViewer.vue'
import CubeViewer from './components/cube/CubeViewer.vue'
import DeckBuilder from './components/deck/DeckBuilder.vue'
import Profile from './components/Profile.vue'


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
