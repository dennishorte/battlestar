import CardViewer from './components/CardViewer.vue'
import CubeViewer from './components/cube/CubeViewer.vue'
import DeckBuilder from './components/deck/DeckBuilder.vue'
import Profile from './components/Profile.vue'


export default [
  {
    path: '/magic',
    name: 'Magic Profile',
    meta: { title: 'Magic Profile' },
    component: Profile,
  },
  {
    path: '/magic/card/:id',
    name: 'Card Viewer',
    meta: { title: 'Card Viewer' },
    component: CardViewer,
  },
  {
    path: '/magic/cube/:id/:tab?',
    name: 'Cube Viewer',
    meta: { title: 'Cube Viewer' },
    component: CubeViewer,
  },
  {
    path: '/magic/deck/:id',
    name: 'Deck Share',
    meta: { title: 'Deck Share' },
    component: DeckBuilder,
  }
]
