<template>
  <MagicWrapper>

    <div class="container" v-if="cubeLoaded">

      <div class="row">
        <div class="col-6">
          <MagicMenu :title="cube.name" />
        </div>
      </div>

      <div class="row">
        <div class="col">
          <CubeMenu
            :cube="cube"
            :showing="showing"
            @navigate="navigate"
            @toggle-search="toggleSearch"
            @open-settings="settingsVisible = true"
            @add-remove-cards="this.$modal('cube-update-modal').show()"
            @add-one-card="this.$modal('cube-add-modal').show()"
            @create-card="createCard"
          />
        </div>
      </div>

      <div v-if="showing === 'cards'">
        <CardFilters
          layout-direction="row"
          :class="showSearch ? '' : 'd-none'"
          @filters-updated="updateCardFilters"
        >
          <template #extra-actions>
            <button
              class="btn btn-info"
              @click="linkFiltersToAchievement"
              :disabled="!canLinkFilters"
            >
              link to achievement
            </button>
          </template>
        </CardFilters>
        <CubeBreakdown :cardlist="validFilteredCards" />

        <div v-if="malformedCards.length > 0" class="malformed-section">
          <h5 class="malformed-header">
            Malformed Cards ({{ malformedCards.length }})
          </h5>
          <p class="malformed-description">
            These cards have invalid data (e.g., missing faces) and need to be fixed or removed.
          </p>
          <div class="malformed-cards">
            <div
              v-for="card in malformedCards"
              :key="card._id"
              class="malformed-card"
            >
              <span class="malformed-card-id" @click="cardCloseup(card)">{{ card._id }}</span>
              <span class="malformed-card-reason">{{ getMalformedReason(card) }}</span>
              <button
                class="btn btn-sm btn-danger malformed-delete-btn"
                @click="deleteMalformedCard(card)"
              >
                delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <CubeScars
        v-if="showing === 'scars'"
        :cube="cube"
        :users="users"
      />

      <CubeAchievements
        v-if="showing === 'achievements'"
        :cube="cube"
        :users="users"
      />


      <CardSearchModal @card-selected="addOneCard" id="cube-add-modal" />
      <CubeImportModal @cube-updates="updateCube" />
      <CardEditorModal
        v-model="editorVisible"
        :card="editorCard"
        :editable="cube.flags.editable"
        :showDelete="true"
        @delete="deleteCardFromCube"
      />
      <CubeSettingsModal v-model="settingsVisible" :cube="cube" />
      <AchievementSearchLinkerModal :achievements="cube.achievements()" :filters="filters" />
    </div>
  </MagicWrapper>
</template>


<script>
import mitt from 'mitt'

import { magic } from 'battlestar-common'
import { mapGetters, mapState } from 'vuex'
import { nextTick } from 'vue'

import UICardWrapper from '@/modules/magic/util/card.wrapper.js'

import AchievementSearchLinkerModal from './AchievementSearchLinkerModal.vue'
import CubeAchievements from './CubeAchievements/CubeAchievements.vue'
import CardEditorModal from '../CardEditorModal.vue'
import CubeBreakdown from './CubeBreakdown.vue'
import CardSearchModal from '../CardSearchModal.vue'
import CardFilters from '../CardFilters.vue'
import CubeImportModal from './CubeImportModal.vue'
import CubeMenu from './CubeMenu.vue'
import CubeScars from './CubeScars.vue'
import CubeSettingsModal from './CubeSettingsModal.vue'
import MagicMenu from '../MagicMenu.vue'
import MagicWrapper from '../MagicWrapper.vue'


export default {
  name: 'CubeViewer',

  components: {
    AchievementSearchLinkerModal,
    CubeAchievements,
    CardEditorModal,
    CardFilters,
    CardSearchModal,
    CubeBreakdown,
    CubeImportModal,
    CubeMenu,
    CubeScars,
    CubeSettingsModal,
    MagicMenu,
    MagicWrapper,
  },

  data() {
    return {
      actor: this.$store.getters['auth/user'],
      bus: mitt(),
      id: this.$route.params.id,

      users: [],

      showing: this.$route.params.tab || 'cards',
      showSearch: false,

      editorCard: null,
      editorVisible: false,

      settingsVisible: false,

      filters: [],
    }
  },

  provide() {
    return {
      actor: this.actor,
      bus: this.bus,

      cubeId: this.id,
      users: this.users,
    }
  },

  computed: {
    ...mapGetters('magic', {
      rootReady: 'ready',
    }),

    ...mapState('magic/cube', {
      cube: 'cube',
      cubeLoaded: 'cubeLoaded',
    }),

    cards() {
      return this.cube.cards()
    },

    canLinkFilters() {
      return this.filters.length > 0
    },

    filteredCards() {
      return this.cube.applyFilters(this.filters)
    },

    malformedCards() {
      return this.cards.filter(card => this.isCardMalformed(card))
    },

    validCards() {
      return this.cards.filter(card => !this.isCardMalformed(card))
    },

    validFilteredCards() {
      return this.filteredCards.filter(card => !this.isCardMalformed(card))
    },
  },

  methods: {
    ////////////////////////////////////////////////////////////////////////////////
    // Sync methods

    cardCloseup(card) {
      this.editorCard = card
      this.editorVisible = true
    },

    createCard() {
      const data = magic.MagicCard.blankCard()
      this.editorCard = new UICardWrapper(data)
      this.editorVisible = true
    },

    linkFiltersToAchievement() {
      this.$modal('achievement-search-linker-modal').show()
    },

    navigate(target) {
      this.$router.push(`/magic/cube/${this.id}/${target}`)
      this.showing = target
    },

    updateCardFilters(filters) {
      this.filters = filters
    },

    async showAchievementFilters(filters) {
      this.showing = 'cards'
      this.showSearch = true
      await nextTick()
      this.updateCardFilters(filters)
      this.bus.emit('card-filters-set', filters)
    },

    toggleSearch() {
      this.showSearch = !this.showSearch
    },


    ////////////////////////////////////////////////////////////////////////////////
    // Card pop-up methods

    // eslint-disable-next-line
    mouseover(cardIdDict) {
      /* const data = this.$store.getters['magic/cards/getLookupFunc'](cardIdDict)
       * this.$store.commit('magic/setMouseoverCard', data) */
    },

    // eslint-disable-next-line
    mouseleave(cardIdDict) {
      /* const data = this.$store.getters['magic/cards/getLookupFunc'](cardIdDict)
       * this.$store.commit('magic/unsetMouseoverCard', data) */
    },

    mousemove(event) {
      this.$store.commit('magic/setMouseoverPosition', {
        x: event.clientX,
        y: event.clientY,
      })
    },


    ////////////////////////////////////////////////////////////////////////////////
    // Async Methods

    async addOneCard(card, comment) {
      await this.$store.dispatch('magic/cube/addCard', { card, comment })
    },

    async loadUsers() {
      const { users } = await this.$post('/api/user/all')
      this.users = users
    },

    async reload() {
      await this.$store.dispatch('magic/cube/loadCube', { cubeId: this.id })
      await this.loadUsers()
    },

    async updateCube(update) {
      await this.$store.dispatch('magic/cube/addRemoveCards', {
        addIds: update.insert.map(item => item.card._id),
        removeIds: update.remove.map(item => item.card._id),
      })
    },

    isCardMalformed(card) {
      try {
        // Use the card's isMalformed method if available
        if (typeof card.isMalformed === 'function') {
          return card.isMalformed()
        }

        // Fallback check if card has data
        if (!card.data) {
          return true
        }

        // Check if card has faces
        const faces = card.data.card_faces
        if (!faces || !Array.isArray(faces) || faces.length === 0) {
          return true
        }

        // Check if any face is null/undefined or has no name
        if (faces.some(face => !face || !face.name || !face.name.trim())) {
          return true
        }

        return false
      }
      catch {
        return true
      }
    },

    getMalformedReason(card) {
      if (!card.data) {
        return 'Missing card data'
      }

      const faces = card.data.card_faces
      if (!faces) {
        return 'Missing card_faces'
      }
      if (!Array.isArray(faces)) {
        return 'card_faces is not an array'
      }
      if (faces.length === 0) {
        return 'No faces defined'
      }

      // Check for null/undefined faces
      const nullFaceIndex = faces.findIndex(face => !face)
      if (nullFaceIndex !== -1) {
        return `Face ${nullFaceIndex} is null/undefined`
      }

      // Check for faces without names
      const emptyNameIndex = faces.findIndex(face => !face.name || !face.name.trim())
      if (emptyNameIndex !== -1) {
        return `Face ${emptyNameIndex} has no name`
      }

      return 'Unknown issue'
    },

    async deleteMalformedCard(card) {
      if (!confirm(`Delete malformed card ${card._id}?`)) {
        return
      }

      await this.$store.dispatch('magic/cube/addRemoveCards', {
        addIds: [],
        removeIds: [card._id],
        comment: 'Removed malformed card',
      })
    },

    async deleteCardFromCube(card) {
      await this.$store.dispatch('magic/cube/addRemoveCards', {
        addIds: [],
        removeIds: [card._id],
        comment: `Removed card: ${card.name()}`,
      })
    },
  },

  watch: {
    async $route() {
      this.id = this.$route.params.id
      await this.reload()
    },

    rootReady(newValue) {
      if (newValue) {
        this.reload()
      }
    },
  },

  async mounted() {
    this.bus.on('card-clicked', this.cardCloseup)
    this.bus.on('achievement-show-filters', this.showAchievementFilters)
  },
}
</script>


<style scoped>
.container {
  margin-bottom: 2em;
}

.malformed-section {
  margin-top: 2em;
  padding: 1em;
  background-color: #2a1a1a;
  border: 1px solid #dc3545;
  border-radius: 4px;
}

.malformed-header {
  color: #dc3545;
  margin-bottom: 0.5em;
}

.malformed-description {
  color: #999;
  font-size: 0.9em;
  margin-bottom: 1em;
}

.malformed-cards {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

.malformed-card {
  display: flex;
  justify-content: space-between;
  padding: 0.5em 1em;
  background-color: #1a1a1a;
  border: 1px solid #444;
  border-radius: 3px;
  cursor: pointer;
}

.malformed-card:hover {
  background-color: #2a2a2a;
  border-color: #666;
}

.malformed-card-id {
  font-family: monospace;
  color: #aaa;
}

.malformed-card-reason {
  color: #dc3545;
  font-size: 0.9em;
  flex: 1;
}

.malformed-card-id {
  cursor: pointer;
}

.malformed-card-id:hover {
  text-decoration: underline;
}

.malformed-delete-btn {
  margin-left: 1em;
}
</style>
