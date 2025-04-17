<template>
  <div class="cube-menu">
    <button class="btn" :class="buttonClassesCards" @click="navigate('cards')">
      cards ({{ counts.cards }})
    </button>

    <template v-if="!!cube.allowEdits">
      <button class="btn" :class="buttonClassesScars" @click="navigate('scars')">
        scars ({{ counts.scars }})
      </button>
      <button class="btn" :class="buttonClassesAchievements" @click="navigate('achievements')">
        achievements ({{ counts.achievements }})
      </button>
    </template>

    <button class="btn btn-secondary" @click="toggleSearch">
      search
      <input type="checkbox" class="form-check-input" @click="$emit('toggle-search')" />
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
</template>

<script>
import Dropdown from '@/components/Dropdown'
import DropdownButton from '@/components/DropdownButton'
import DropdownDivider from '@/components/DropdownDivider'
import { mag } from 'battlestar-common'

export default {
  name: 'CubeMenu',

  components: {
    Dropdown,
    DropdownButton,
    DropdownDivider,
  },

  props: {
    counts: Object,
    cube: Object,
    showing: String,
  },

  computed: {
    buttonClassesCards() { return this.showing === 'cards' ? 'btn-primary' : 'btn-secondary' },
    buttonClassesScars() { return this.showing === 'scars' ? 'btn-primary' : 'btn-secondary' },
    buttonClassesAchievements() { return this.showing === 'achievements' ? 'btn-primary' : 'btn-secondary' },
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

    randomCard(card) {
      const link = this.$store.getters['magic/cards/cardLink'](card._id)
      this.$router.push(link)
    },

    navigate(tab) {
      this.$emit('navigate', tab)
    },

    async toggleCardEditing() {
      const result = await this.$post('/api/magic/cube/toggle_edits', {
        cubeId: this.id,
        editFlag: !this.cube.allowEdits
      })
      this.cube.allowEdits = result.newValue
    },

    async togglePublic() {
      const result = await this.$post('/api/magic/cube/toggle_public', {
        cubeId: this.id,
        publicFlag: !this.cube.public,
      })
      this.cube.public = result.newValue
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
