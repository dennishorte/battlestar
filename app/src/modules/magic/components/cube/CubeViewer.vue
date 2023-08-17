<template>
  <MagicWrapper :alsoLoading="loadingCube">
    <div class="container">

      <div class="row">
        <div class="col-6">
          <MagicMenu :title="cube.name" />
        </div>
      </div>

      <div class="row">
        <div class="col">
          <div class="cube-menu">
            <button class="btn" :class="buttonClassesCards" @click="navigate('cards')">cards</button>

            <template v-if="!!cube.allowEdits">
              <button class="btn" :class="buttonClassesScars" @click="navigate('scars')">scars</button>
              <button class="btn" :class="buttonClassesAchievements" @click="navigate('achievements')">achievements</button>
            </template>

            <Dropdown text="menu">
              <DropdownButton @click="this.$modal('cube-update-modal').show()">add/remove cards</DropdownButton>
              <DropdownButton @click="createCard">create card</DropdownButton>
              <DropdownButton @click="toggleCardEditing">
                toggle edits
                <i v-if="cube.allowEdits" class="bi-toggle-on" />
                <i v-else class="bi-toggle-off" />
              </DropdownButton>
              <DropdownButton @click="togglePublic">
                toggle public
                <i v-if="cube.public" class="bi-toggle-on" />
                <i v-else class="bi-toggle-off" />
              </DropdownButton>
            </Dropdown>
          </div>
        </div>
      </div>

      <div v-if="showing === 'cards'">
        <CubeViewerCards v-if="!!cube" :cube="cube" />
      </div>

      <div v-if="showing === 'scars'">
        Cube Scars
      </div>

      <div v-if="showing === 'achievements'">
        Cube Achievements
      </div>

    </div>

    <CubeImportModal @cube-updates="updateCube" />
    <CubeCardModal :card="managedCard" :editable="cube.allowEdits" />
    <CardEditorModal :original="managedCard" />
  </MagicWrapper>
</template>


<script>
import axios from 'axios'
import cubeUtil from '../../util/cubeUtil.js'
import mitt from 'mitt'

import { mag } from 'battlestar-common'
import { mapState } from 'vuex'

import CardEditorModal from '../CardEditorModal'
import CubeCardModal from './CubeCardModal'
import CubeViewerCards from './CubeViewerCards'
import CubeImportModal from './CubeImportModal'
import Dropdown from '@/components/Dropdown'
import DropdownButton from '@/components/DropdownButton'
import MagicMenu from '../MagicMenu'
import MagicWrapper from '../MagicWrapper'


export default {
  name: 'CubeViewer',

  components: {
    CardEditorModal,
    CubeViewerCards,
    CubeCardModal,
    CubeImportModal,
    Dropdown,
    DropdownButton,
    MagicMenu,
    MagicWrapper,
  },

  data() {
    return {
      actor: this.$store.getters['auth/user'],
      bus: mitt(),
      cube: null,
      id: this.$route.params.id,
      loadingCube: true,

      showing: 'cards',
    }
  },

  provide() {
    return {
      actor: this.actor,
      bus: this.bus,
    }
  },

  computed: {
    ...mapState('magic/cube', {
      managedCard: 'managedCard',
    }),

    buttonClassesCards() {
      return this.showing === 'cards' ? 'btn-primary' : 'btn-secondary'
    },

    buttonClassesScars() {
      return this.showing === 'scars' ? 'btn-primary' : 'btn-secondary'
    },

    buttonClassesAchievements() {
      return this.showing === 'achievements' ? 'btn-primary' : 'btn-secondary'
    },

    cards() {
      const lookupFunc = this.$store.getters['magic/cards/getLookupFunc']
      mag.util.card.lookup.insertCardData(this.cube.cardlist, lookupFunc)

      for (const card of this.cube.cardlist) {
        if (!card.data) {
          console.log(card)
          throw new Error(`Unable to fetch data for some cards`)
        }
      }

      return this.cube.cardlist
    },

    cardEditButtonText() {
      if (this.cube.allowEdits) {
        return 'Disable Card Editing'
      }
      else {
        return 'Enable Card Editing'
      }
    },

    cardPublicButtonText() {
      return this.cube.public ? 'Remove from Public' : 'Set as Public'
    },

    viewerIsOwner() {
      return this.cube ? this.actor._id === this.cube.userId : false
    },
  },

  methods: {
    ////////////////////////////////////////////////////////////////////////////////
    // Sync methods

    createCard() {
      this.$store.dispatch('magic/cube/manageCard', mag.util.card.blank())
      this.$modal('card-editor-modal').show()
    },

    navigate(target) {
      this.showing = target
    },

    showCardModal() {
      if (this.cube.allowEdits) {
        this.$modal('card-editor-modal').show()
      }
      else {
        this.$modal('cube-card-modal').show()
      }
    },

    updateCube(update) {
      for (const card of update.remove) {
        this.cube.removeCard(card)
      }

      for (const card of update.insert) {
        this.cube.addCard(card)
      }

      if (update.unknown.length) {
        const lines = ['Unable to add unknown cards:']
        for (const card of update.unknown) {
          lines.push(card.name)
        }
        alert(lines.join('\n'))
      }

      this.saveCube()
    },


    ////////////////////////////////////////////////////////////////////////////////
    // Async Methods

    async loadCube() {
      this.loading = true

      const requestResult = await axios.post('/api/magic/cube/fetch', {
        cubeId: this.id
      })

      if (requestResult.data.status === 'success') {
        this.cube = cubeUtil.deserialize(requestResult.data.cube)
        this.loadingCube = false
      }
      else {
        alert('Error loading cube: ' + this.id)
      }
    },

    // If original is passed in, the new card will replace the original.
    // Otherwise, the new card will be added to the cube with nothing removed.
    async saveCard({ card, original }) {
      const requestResult = await axios.post('/api/magic/card/save', {
        card,
        original,
        editor: {
          _id: this.actor._id,
          name: this.actor.name,
        },
        comment: 'Comments not implemented',
      })

      if (requestResult.data.status === 'success') {
        // Need to update the cube, if the edited card was a scryfall card that was replaced
        // with a custom card.
        if (requestResult.data.cardReplaced) {
          this.cube.removeCard(original)
          this.cube.addCard(requestResult.data.finalizedCard)
          await this.saveCube()
        }

        else if (requestResult.data.cardCreated) {
          this.cube.addCard(requestResult.data.finalizedCard)
          await this.saveCube()
        }

        // In either case, update the local card database.
        await this.$store.dispatch('magic/cards/reloadDatabase')

        // And set the created card to be the managed card.
        this.$store.dispatch('magic/cube/manageCard', requestResult.data.finalizedCard)

        // Update the card data for the edited card, if applicable
        this.cube.removeCard(requestResult.data.finalizedCard)
        this.cube.addCard(requestResult.data.finalizedCard)
      }
      else {
        alert('Error saving card: ' + requestResult.message)
      }
    },

    async saveCube() {
      await this.$store.dispatch('magic/file/save', this.cube.serialize())
    },

    async toggleCardEditing() {
      const requestResult = await axios.post('/api/magic/cube/toggleEdits', {
        cubeId: this.id,
      })

      if (requestResult.data.status === 'success') {
        this.cube.allowEdits = requestResult.data.allowEdits
      }
      else {
        alert('Error toggling card edit status.\n' + requestResult.data.message)
      }
    },

    async togglePublic() {
      const requestResult = await axios.post('/api/magic/cube/togglePublic', {
        cubeId: this.id,
        value: !this.cube.public,
      })

      if (requestResult.data.status === 'success') {
        this.cube.public = requestResult.data.public
      }
      else {
        alert('Error toggling public status.\n' + requestResult.data.message)
      }
    },
  },

  watch: {
    async $route() {
      this.id = this.$route.params.id
      await this.loadCube()
    },
  },

  async mounted() {
    await this.loadCube()
    this.bus.on('card-clicked', this.showCardModal)
    this.bus.on('card-saved', this.saveCard)
  },
}
</script>


<style scoped>
.cube-menu {
  display: flex;
  flex-direction: row;
}
</style>
