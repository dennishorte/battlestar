<template>
  <MagicWrapper :also-loading="!cubeLoaded" :after-loaded="insertCardData">
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
                scars ({{ scarsUnused.length }})
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
              <DropdownButton @click="this.$modal('cube-add-modal').show()">add one card</DropdownButton>

              <DropdownDivider />

              <DropdownButton @click="createCard">create card</DropdownButton>
              <DropdownButton @click="createScar">create scar</DropdownButton>

              <DropdownDivider />

              <DropdownButton @click="randomCard">random card</DropdownButton>

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

    </div>

    <CubeAddModal @cube-updates="updateCube" />
    <CubeImportModal @cube-updates="updateCube" />
    <CubeCardModal :card="managedCard" :editable="cube.allowEdits" />
    <CardEditorModal :original="managedCard" />
    <ScarModal />
    <AchievementModal />
    <AchievementViewerModal />
    <AchievementSearchLinkerModal :achievements="achievements" />
  </MagicWrapper>
</template>


<script>
import cubeUtil from '../../util/cubeUtil.js'
import mitt from 'mitt'

import { mag, util } from 'battlestar-common'
import { mapState } from 'vuex'
import { nextTick } from 'vue'

import AchievementModal from './AchievementModal'
import AchievementViewerModal from './AchievementViewerModal'
import AchievementSearchLinkerModal from './AchievementSearchLinkerModal'
import Achievements from './Achievements'
import CardEditorModal from '../CardEditorModal'
import CubeBreakdown from './CubeBreakdown'
import CubeAddModal from './CubeAddModal'
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
    AchievementModal,
    AchievementViewerModal,
    AchievementSearchLinkerModal,
    Achievements,
    CardEditorModal,
    CardFilters,
    CubeAddModal,
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

      users: [],

      showing: this.$route.params.tab || 'cards',
      showSearch: false,
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
    ...mapState('magic/cube', {
      cube: 'cube',
      cubeLoaded: 'cubeLoaded',
      filteredCards: 'filteredCards',

      achievements: 'achievements',
      scars: 'scars',

      cardFilters: 'cardFilters',

      managedAchievement: 'managedAchievement',
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

    canLinkFilters() {
      return this.cardFilters.length > 0
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
      }
      this.$store.commit('magic/cube/manageScar', blank)
      this.$modal('scar-modal').show()
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
      const card = util.array.select(this.cube.cardlist)
      this.goToCard(card)
    },

    showCardModal() {
      if (this.cube.allowEdits) {
        this.$modal('card-editor-modal').show()
      }
      else {
        this.$modal('cube-card-modal').show()
      }
    },

    updateCardFilters(filters) {
      this.$store.dispatch('magic/cube/setFilters', filters)
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

    async updateCube(update) {
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

      await this.$store.dispatch('magic/cube/save', this.cube)
    },


    ////////////////////////////////////////////////////////////////////////////////
    // Card pop-up methods

    goToCard(cardIdDict) {
      const data = this.$store.getters['magic/cards/getLookupFunc'](cardIdDict)
      const link = this.$store.getters['magic/cards/cardLink'](data._id)
      this.$router.push(link)
    },

    mouseover(cardIdDict) {
      const data = this.$store.getters['magic/cards/getLookupFunc'](cardIdDict)
      this.$store.commit('magic/setMouseoverCard', data)
    },

    mouseleave(cardIdDict) {
      const data = this.$store.getters['magic/cards/getLookupFunc'](cardIdDict)
      this.$store.commit('magic/unsetMouseoverCard', data)
    },

    mousemove(event) {
      this.$store.commit('magic/setMouseoverPosition', {
        x: event.clientX,
        y: event.clientY,
      })
    },


    ////////////////////////////////////////////////////////////////////////////////
    // Async Methods

    async insertCardData() {
      await this.$store.dispatch('magic/cards/insertCardData', this.cube.cardlist)
    },

    async loadUsers() {
      const { users } = await this.$post('/api/user/all')
      this.users = users
    },

    async reload() {
      await this.$store.dispatch('magic/cube/loadCube', { cubeId: this.id })
      await this.loadUsers()
    },

    // If original is passed in, the new card will replace the original.
    // Otherwise, the new card will be added to the cube with nothing removed.
    async saveCard({ card, original }) {
      const updatedCard = await this.$store.dispatch('magic/cards/save', {
        actor: this.actor,
        cubeId: this.cube._id,
        updated: card,
        original,
        comment: 'Updated in the cube editor',
      })

      window.location.reload()
    },

    async toggleCardEditing() {
      await this.$post('/api/magic/cube/toggle_edits', {
        cubeId: this.id,
        editFlag: !this.cube.allowEdits
      })
      this.cube.allowEdits = !this.cube.allowEdits
    },

    async togglePublic() {
      await this.$post('/api/magic/cube/toggle_public', {
        cubeId: this.id,
        publicFlag: !this.cube.public,
      })
      this.cube.public = !this.cube.public
    },
  },

  watch: {
    async $route() {
      this.id = this.$route.params.id
      await this.reload()
    },
  },

  async mounted() {
    await this.reload()
    this.bus.on('card-clicked', this.showCardModal)
    this.bus.on('card-saved', this.saveCard)
    this.bus.on('achievement-show-filters', this.showAchievementFilters)
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
