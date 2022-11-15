import DeckManager from './components/deck/DeckManager'
import Profile from'./components/Profile'


export default [
  {
    path: '/magic',
    name: 'Magic Profile',
    title: 'Magic Profile',
    component: Profile,
  },
  {
    path: '/magic/decks',
    name: 'Deck Manager',
    title: 'Deck Manager',
    component: DeckManager,
  },
]
