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
        <CubeBreakdown :cardlist="filteredCards" />
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
      <CardEditorModal v-model="editorVisible" :card="editorCard" :editable="cube.flags.editable" />
      <CubeSettingsModal v-model="settingsVisible" :cube="cube" />
    </div>
  </MagicWrapper>
</template>


<script>
import mitt from 'mitt'

import { util } from 'battlestar-common'
import { mapGetters, mapState } from 'vuex'
import { nextTick } from 'vue'

import CubeAchievements from './CubeAchievements/CubeAchievements.vue'
import CardEditorModal from '../CardEditorModal'
import CubeBreakdown from './CubeBreakdown'
import CardSearchModal from '../CardSearchModal'
import CardFilters from '../CardFilters'
import CubeImportModal from './CubeImportModal'
import CubeMenu from './CubeMenu'
import CubeScars from './CubeScars'
import CubeSettingsModal from './CubeSettingsModal'
import MagicMenu from '../MagicMenu'
import MagicWrapper from '../MagicWrapper'


export default {
  name: 'CubeViewer',

  components: {
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
  },

  methods: {
    ////////////////////////////////////////////////////////////////////////////////
    // Sync methods

    cardCloseup(card) {
      this.editorCard = card
      this.editorVisible = true
    },

    editScar(scar) {
      this.$store.commit('magic/cube/manageScar', scar)
      this.$modal('scar-modal').show()
    },

    linkFiltersToAchievement() {
      this.$modal('achievement-search-linker-modal').show()
    },

    navigate(target) {
      this.$router.push(`/magic/cube/${this.id}/${target}`)
      this.showing = target
    },

    randomCard() {
      const card = util.array.select(this.cube.cards())
      const link = this.$store.getters['magic/cards/cardLink'](card._id)
      this.$router.push(link)
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
</style>
