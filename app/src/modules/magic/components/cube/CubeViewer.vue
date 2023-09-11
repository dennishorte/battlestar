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
          @filters-updated="storeCardFilters"
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

import { mag } from 'battlestar-common'
import { mapState } from 'vuex'

import AchievementModal from './AchievementModal'
import AchievementViewerModal from './AchievementViewerModal'
import AchievementSearchLinkerModal from './AchievementSearchLinkerModal'
import Achievements from './Achievements'
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
    AchievementModal,
    AchievementViewerModal,
    AchievementSearchLinkerModal,
    Achievements,
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

      users: [],

      showing: 'cards',
      showSearch: false,
      filteredCards: [],
      filtersApplied: false,
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
      return this.cardFilters.length > 0 && this.filtersApplied
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

    storeCardFilters(filters) {
      this.filtersApplied = false
      this.$store.commit('magic/cube/setFilters', filters)
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
        cube: this.cube,
        updated: card,
        original,
        comment: 'Updated in the cube editor',
      })

      // And set the created card to be the managed card.
      await this.$store.commit('magic/cube/manageCard', updatedCard, { root: true })
    },

    async toggleCardEditing() {
      const { allowEdits } = await this.$post('/api/magic/cube/toggleEdits', {
        cubeId: this.id,
      })
      this.cube.allowEdits = allowEdits
    },

    async togglePublic() {
      const response = await this.$post('/api/magic/cube/togglePublic', {
        cubeId: this.id,
        value: !this.cube.public,
      })
      this.cube.public = response.public
    },
  },

  watch: {
    async $route() {
      this.id = this.$route.params.id
      await this.reload()
    },

    filteredCards() {
      this.filtersApplied = true
    },
  },

  async mounted() {
    await this.reload()
    this.bus.on('card-clicked', this.showCardModal)
    this.bus.on('card-saved', this.saveCard)
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
