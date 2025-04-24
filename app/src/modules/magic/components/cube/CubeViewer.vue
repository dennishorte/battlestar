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
            :counts="counts"
            :cube="cube"
            :showing="showing"
            @navigate="navigate"
            @toggle-search="toggleSearch"
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

      <div v-if="showing === 'scars'" class="row">
        <div class="mt-2">
          <button class="btn btn-success" @click="createScar">create</button>
        </div>

        <div class="col">
          <h5>Avaiable Scars</h5>

          <div v-for="scar in scarsUnused" class="scar-container">
            <div>{{ scar.text }}</div>
            <div>
              <button class="btn btn-link" @click="editScar(scar)">edit</button>
            </div>
          </div>
        </div>

        <div class="col">
          <h5>Used Scars</h5>
          <div v-for="scar in scarsUsed" class="scar-container vertical">
            <div>{{ scar.text }}</div>
            <div class="scar-applied-info">
              <div
                @mouseover="mouseover(scar.appliedTo)"
                @mouseleave="mouseleave(scar.appliedTo)"
                @mousemove="mousemove"
                @click="goToCard(scar.appliedTo)"
              >
                card: {{ scar.appliedTo.name }}
              </div>
              <div>user: {{ getUserNameById(scar.appliedBy) }}</div>
            </div>
          </div>
        </div>
      </div>

      <Achievements
        v-if="showing === 'achievements'"
        :achievements="achievements"
        :users="users"
      />


      <CardSearchModal @card-selected="addOneCard" id="cube-add-modal" />
      <CubeImportModal @cube-updates="updateCube" />
      <CardEditorModal />
      <ScarModal />
      <AchievementModal />
      <AchievementViewerModal />
      <AchievementSearchLinkerModal :achievements="achievements" />
      <CubeSettingsModal />
    </div>
  </MagicWrapper>
</template>


<script>
import mitt from 'mitt'

import { mag, util } from 'battlestar-common'
import { mapGetters, mapState } from 'vuex'
import { nextTick } from 'vue'

import AchievementModal from './AchievementModal'
import AchievementViewerModal from './AchievementViewerModal'
import AchievementSearchLinkerModal from './AchievementSearchLinkerModal'
import Achievements from './Achievements'
import CardEditor from '../CardEditor'
import CardEditorModal from '../CardEditorModal'
import CubeBreakdown from './CubeBreakdown'
import CardSearchModal from '../CardSearchModal'
import CardFilters from '../CardFilters'
import CubeImportModal from './CubeImportModal'
import CubeMenu from './CubeMenu'
import CubeSettingsModal from './CubeSettingsModal'
import MagicMenu from '../MagicMenu'
import MagicWrapper from '../MagicWrapper'
import ScarModal from './ScarModal'


export default {
  name: 'CubeViewer',

  components: {
    AchievementModal,
    AchievementViewerModal,
    AchievementSearchLinkerModal,
    Achievements,
    CardEditor,
    CardEditorModal,
    CardFilters,
    CardSearchModal,
    CubeBreakdown,
    CubeImportModal,
    CubeMenu,
    CubeSettingsModal,
    MagicMenu,
    MagicWrapper,
    ScarModal,
  },

  data() {
    return {
      actor: this.$store.getters['auth/user'],
      bus: mitt(),
      id: this.$route.params.id,

      users: [],

      showing: this.$route.params.tab || 'cards',
      showSearch: false,

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

      achievements: 'achievements',
      scars: 'scars',

      managedAchievement: 'managedAchievement',
      managedScar: 'managedScar',
    }),

    cards() {
      return this.cube.cards()
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

    canLinkFilters() {
      return this.filters.length > 0
    },

    counts() {
      return {
        cards: this.filteredCards.length,
        scars: this.scarsUnused.length,
        achievements: this.achievements.length,
      }
    },

    filteredCards() {
      return this.cube.applyFilters(this.filters)
    },

    scarsUnused() {
      return this.scars.filter(scar => !scar.appliedTimestamp)
    },

    scarsUsed() {
      return this
        .scars
        .filter(scar => scar.appliedTimestamp)
        .sort((l, r) => r.appliedTimestamp - l.appliedTimestamp)
    },
  },

  methods: {
    ////////////////////////////////////////////////////////////////////////////////
    // Sync methods

    cardCloseup(card) {
      console.log('card clicked', card.name())
      this.bus.emit('edit-card-in-modal', card)
    },

    editScar(scar) {
      this.$store.commit('magic/cube/manageScar', scar)
      this.$modal('scar-modal').show()
    },

    getUserNameById(id) {
      const user = this.users.find(u => u._id === id)
      return user ? user.name : id
    },

    linkFiltersToAchievement(filters) {
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

    mouseover(cardIdDict) {
      /* const data = this.$store.getters['magic/cards/getLookupFunc'](cardIdDict)
       * this.$store.commit('magic/setMouseoverCard', data) */
    },

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

    openSettings() {
      this.bus.emit('open-cube-settings', this.cube)
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

.scar-container.vertical {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.scar-applied-info {
  font-size: .8em;
  color: #333;
  margin-left: .5em;
}
</style>
