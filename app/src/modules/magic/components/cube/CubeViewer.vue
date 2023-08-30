<template>
  <MagicWrapper :also-loading="loadingCube" :after-loaded="insertCardData">
    <div class="container" v-if="!!cube">

      <div class="row">
        <div class="col-6">
          <MagicMenu :title="cube.name" />
        </div>
      </div>

      <div class="row">
        <div class="col">
          <div class="cube-menu">
            <button class="btn" :class="buttonClassesCards" @click="navigate('cards')">
              cards ({{ filteredCards.length }})
            </button>

            <template v-if="!!cube.allowEdits">
              <button class="btn" :class="buttonClassesScars" @click="navigate('scars')">
                scars ({{ scars.length }})
              </button>
              <button class="btn" :class="buttonClassesAchievements" @click="navigate('achievements')">
                achievements ({{ achievements.length }})
              </button>
            </template>

            <button class="btn btn-secondary" @click="toggleSearch">
              search
              <input type="checkbox" class="form-check-input" v-model="showSearch" />
            </button>

            <Dropdown text="menu">
              <DropdownButton @click="this.$modal('cube-update-modal').show()">add/remove cards</DropdownButton>
              <DropdownDivider />
              <DropdownButton @click="createCard">create card</DropdownButton>
              <DropdownButton @click="createScar">create scar</DropdownButton>

              <template v-if="viewerIsOwner">
                <DropdownDivider />
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
              </template>
            </Dropdown>
          </div>
        </div>
      </div>

      <div v-if="showing === 'cards'">
        <CardFilters
          layout-direction="row"
          :cardlist="cube.cardlist"
          :class="showSearch ? '' : 'd-none'"
          v-model="filteredCards"
        />
        <CubeBreakdown :cardlist="filteredCards" />
      </div>

      <div v-if="showing === 'scars'">
        <div v-for="scar in scars" class="scar-container">
          <div>{{ scar.text }}</div>
          <div>
            <button class="btn btn-link" @click="editScar(scar)">edit</button>
          </div>
        </div>
      </div>

      <div v-if="showing === 'achievements'">
        Cube Achievements
      </div>

    </div>

    <CubeImportModal @cube-updates="updateCube" />
    <CubeCardModal :card="managedCard" :editable="cube.allowEdits" />
    <CardEditorModal :original="managedCard" />
    <ScarModal />
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
import CardFilters from '../CardFilters'
import CubeCardModal from './CubeCardModal'
import CubeImportModal from './CubeImportModal'
import Dropdown from '@/components/Dropdown'
import DropdownButton from '@/components/DropdownButton'
import DropdownDivider from '@/components/DropdownDivider'
import MagicMenu from '../MagicMenu'
import MagicWrapper from '../MagicWrapper'
import ScarModal from './ScarModal'


export default {
  name: 'CubeViewer',

  components: {
    CardEditorModal,
    CardFilters,
    CubeBreakdown,
    CubeCardModal,
    CubeImportModal,
    Dropdown,
    DropdownButton,
    DropdownDivider,
    MagicMenu,
    MagicWrapper,
    ScarModal,
  },

  data() {
    return {
      actor: this.$store.getters['auth/user'],
      bus: mitt(),
      id: this.$route.params.id,
      loadingCube: true,

      cube: null,
      achievements: [],
      scars: [],

      showing: 'cards',
      showSearch: false,
      filteredCards: [],
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
      managedScar: 'managedScar',
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
      this.$store.commit('magic/cube/manageCard', mag.util.card.blank())
      this.$modal('card-editor-modal').show()
    },

    createScar() {
      const blank = {
        _id: null,
        cubeId: this.cube._id,
        text: '',
        description: '',
        appliedTo: null,
        appliedTimestamp: null,
      }
      this.$store.commit('magic/cube/manageScar', blank)
      this.$modal('scar-modal').show()
    },

    editScar(scar) {
      this.$store.commit('magic/cube/manageScar', scar)
      this.$modal('scar-modal').show()
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

    toggleSearch() {
      this.showSearch = !this.showSearch
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

    async insertCardData() {
      await this.$store.dispatch('magic/cards/insertCardData', this.cube.cardlist)
    },

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

    async loadScars() {
      const requestResult = await axios.post('/api/magic/scar/byCube', {
        cubeId: this.id,
      })

      if (requestResult.data.status === 'success') {
        this.scars = requestResult.data.scars
      }
      else {
        alert('Error loading cube: ' + this.id)
      }
    },

    // If original is passed in, the new card will replace the original.
    // Otherwise, the new card will be added to the cube with nothing removed.
    async saveCard({ card, original }) {
      const updatedCard = await this.$store.dispatch('magic/cards/save', {
        actor: this.actor,
        cube: this.cube,
        updated: card,
        original,
        comment: 'Updated in the cube editor',
      })

      // And set the created card to be the managed card.
      await this.$store.commit('magic/cube/manageCard', updatedCard, { root: true })
    },

    async saveCube() {
      await this.$store.dispatch('magic/cube/save', this.cube)
    },

    async saveScar() {
      const requestResult = await axios.post('/api/magic/scar/save', {
        scar: this.managedScar,
      })

      if (requestResult.data.status === 'success') {
        await this.loadScars()
      }
      else {
        alert('Error save scar.\n' + requestResult.data.message)
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
    this.loadCube()
    this.loadScars()
    this.bus.on('card-clicked', this.showCardModal)
    this.bus.on('card-saved', this.saveCard)
    this.bus.on('scar-saved', this.saveScar)
  },
}
</script>


<style scoped>
.container {
  margin-bottom: 2em;
}

.cube-menu {
  display: flex;
  flex-direction: row;
}

.cube-menu > .btn {
  margin-right: .25em;
}

.scar-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  max-width: 400px;
  border: 1px solid #ddd;
  padding-left: .5em;
  margin-top: .25em;
}
</style>
