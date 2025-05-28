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

    <BDropdown text="menu">
      <BDropdownItem @click="$emit('add-remove-cards')">add/remove cards</BDropdownItem>
      <BDropdownItem @click="$emit('add-one-card')">add one card</BDropdownItem>

      <template v-if="viewerIsOwner">
        <DropdownDivider />
        <BDropdownItem @click="$emit('open-settings')">settings</BDropdownItem>
      </template>
    </BDropdown>
  </div>
</template>

<script>
export default {
  name: 'CubeMenu',

  emits: [
    'toggle-search',
    'navigate',
    'open-settings',
    'add-remove-cards',
    'add-one-card',
  ],

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
