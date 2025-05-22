<template>
  <div class="cube-menu">
    <button class="btn" :class="buttonClassesCards" @click="navigate('cards')">
      cards ({{ cube.cards().length }})
    </button>

    <template v-if="cube.flags.legacy">
      <button class="btn" :class="buttonClassesScars" @click="navigate('scars')">
        scars ({{ cube.scarsUnused().length }})
      </button>
      <button class="btn" :class="buttonClassesAchievements" @click="navigate('achievements')">
        achievements ({{ cube.achievementsUnclaimed().length }})
      </button>
    </template>

    <button class="btn btn-secondary" @click="toggleSearch">
      search
      <input type="checkbox" class="form-check-input" @click="$emit('toggle-search')" />
    </button>

    <DropdownMenu text="menu">
      <DropdownButton @click="this.$modal('cube-update-modal').show()">add/remove cards</DropdownButton>
      <DropdownButton @click="this.$modal('cube-add-modal').show()">add one card</DropdownButton>
      <DropdownButton @click="createCard">create card</DropdownButton>

      <DropdownDivider />

      <DropdownButton @click="randomCard">random card</DropdownButton>

      <template v-if="viewerIsOwner">
        <DropdownDivider />
        <DropdownButton @click="openSettings">settings</DropdownButton>
      </template>
    </DropdownMenu>
  </div>
</template>

<script>
import DropdownMenu from '@/components/DropdownMenu'
import DropdownButton from '@/components/DropdownButton'
import DropdownDivider from '@/components/DropdownDivider'
import { mag } from 'battlestar-common'

export default {
  name: 'CubeMenu',

  components: {
    DropdownMenu,
    DropdownButton,
    DropdownDivider,
  },

  inject: ['bus'],

  emits: ['toggle-search', 'navigate'],

  props: {
    cube: {
      type: Object,
      required: true
    },
    showing: {
      type: String,
      required: true
    },
  },

  computed: {
    buttonClassesCards() {
      return this.showing === 'cards' ? 'btn-primary' : 'btn-secondary'
    },
    buttonClassesScars() {
      return this.showing === 'scars' ? 'btn-primary' : 'btn-secondary'
    },
    buttonClassesAchievements() {
      return this.showing === 'achievements' ? 'btn-primary' : 'btn-secondary'
    },
  },

  methods: {
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

    openSettings() {
      this.bus.emit('open-cube-settings', this.cube)
    },

    randomCard(card) {
      const link = this.$store.getters['magic/cards/cardLink'](card._id)
      this.$router.push(link)
    },

    navigate(tab) {
      this.$emit('navigate', tab)
    },

    viewerIsOwner() {
      return this.cube ? this.actor._id === this.cube.userId : false
    },
  },
}
</script>

<style scoped>
.cube-menu {
  display: flex;
  flex-direction: row;
}

.cube-menu > .btn {
  margin-right: .25em;
}
</style>
