<template>
  <MagicWrapper :alsoLoading="loadingCube">
    <div class="cube-viewer container">
      <div class="row">
        <div class="col">
          <MagicMenu />
          <h1>{{ cube.name }}</h1>
          <button class="btn btn-success" @click="$modal('cube-update-modal').show()">Add/Remove Cards</button>
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
    <CubeCardModal :card="managedCard" :editable="cube.allowEdits" @card-updated="saveCard" />

  </MagicWrapper>
</template>


<script>
import axios from 'axios'
import cubeUtil from '../../util/cubeUtil.js'
import { mag } from 'battlestar-common'
import { mapState } from 'vuex'

import CubeBreakdown from './CubeBreakdown'
import CubeCardModal from './CubeCardModal'
import CubeImportModal from './CubeImportModal'
import MagicMenu from '../MagicMenu'
import MagicWrapper from '../MagicWrapper'


export default {
  name: 'CubeViewer',

  components: {
    CubeBreakdown,
    CubeCardModal,
    CubeImportModal,
    MagicMenu,
    MagicWrapper,
  },

  data() {
    return {
      cube: null,
      id: this.$route.params.id,
      loadingCube: true,
    }
  },

  computed: {
    ...mapState('magic/cube', {
      managedCard: 'managedCard',
    }),

    cards() {
      const lookupFunc = this.$store.getters['magic/cards/getLookupFunc']
      mag.util.card.lookup.insertCardData(this.cube.cardlist, lookupFunc)
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

    async saveCard(card) {
      console.log('save', card)

      // Changes to a custom card
      if (card.set && card.set === 'custom') {
        const requestResult = await axios.post('/api/magic/card/save', {
          cubeId: this.cube._id,
          card,
          replace: true,
        })
      }

      // A completely new card OR changes to a scryfall card
      else {
        const requestResult = await axios.post('/api/magic/card/create', {
          cubeId: this.cube._id,
          card,
          replace: Boolean(card._id),
        })
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

      this.$store.dispatch('magic/file/save', this.cube.serialize())
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
