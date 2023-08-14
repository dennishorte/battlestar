<template>
  <MagicWrapper :alsoLoading="loadingCube">
    <div class="cube-viewer container">
      <div class="row">
        <div class="col">
          <MagicMenu />
          <h1>{{ cube.name }}</h1>
          <button class="btn btn-success" @click="this.$modal('cube-update-modal').show()">Add/Remove Cards</button>
          <button class="btn btn-info" @click="toggleCardEditing">{{ cardEditButtonText }}</button>
        </div>
      </div>

      <div class="row">
        <div class="col">
          <CubeBreakdown :cardlist="cards" />
        </div>
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
import CubeBreakdown from './CubeBreakdown'
import CubeCardModal from './CubeCardModal'
import CubeImportModal from './CubeImportModal'
import MagicMenu from '../MagicMenu'
import MagicWrapper from '../MagicWrapper'


export default {
  name: 'CubeViewer',

  components: {
    CardEditorModal,
    CubeBreakdown,
    CubeCardModal,
    CubeImportModal,
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
  },

  methods: {
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
        editor: this.actor,
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

        // In either case, update the local card database.
        await this.$store.dispatch('magic/cards/reloadDatabase')
      }
      else {
        alert('Error saving card: ' + requestResult.message)
      }
    },

    async saveCube() {
      await this.$store.dispatch('magic/file/save', this.cube.serialize())
    },

    showCardModal() {
      if (this.cube.allowEdits) {
        this.$modal('card-editor-modal').show()
      }
      else {
        this.$modal('cube-card-modal').show()
      }
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
.update-data {
  margin-top: .25em;
  font-size: .8em;
  font-color: var(--bs-gray-700);
}

.update-data-heading {
  font-weight: bold;
}
</style>
