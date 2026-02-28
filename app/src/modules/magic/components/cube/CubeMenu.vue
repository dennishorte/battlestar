<template>
  <div class="cube-menu">
    <button class="btn" :class="buttonClassesCards" @click="navigate('cards')">
      cards ({{ cube.cards().length }})
    </button>

    <button class="btn" :class="buttonClassesDrafts" @click="navigate('drafts')">
      drafts
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
      <input type="checkbox" class="form-check-input" @click="emit('toggle-search')" />
    </button>

    <BDropdown text="menu">
      <BDropdownItem @click="emit('add-remove-cards')">add/remove cards</BDropdownItem>
      <BDropdownItem @click="emit('add-one-card')">add one card</BDropdownItem>
      <BDropdownItem v-if="cube.flags.editable" @click="emit('create-card')">create card</BDropdownItem>

      <template v-if="viewerIsOwner">
        <BDropdownDivider />
        <BDropdownItem @click="emit('open-settings')">settings</BDropdownItem>
      </template>
    </BDropdown>
  </div>
</template>

<script setup>
import { computed, inject } from 'vue'

const props = defineProps({
  cube: {
    type: Object,
    required: true
  },
  showing: {
    type: String,
    required: true
  },
})

const emit = defineEmits([
  'toggle-search',
  'navigate',
  'open-settings',
  'add-remove-cards',
  'add-one-card',
  'create-card',
])

const actor = inject('actor')

const buttonClassesCards = computed(() => props.showing === 'cards' ? 'btn-primary' : 'btn-secondary')
const buttonClassesScars = computed(() => props.showing === 'scars' ? 'btn-primary' : 'btn-secondary')
const buttonClassesAchievements = computed(() => props.showing === 'achievements' ? 'btn-primary' : 'btn-secondary')
const buttonClassesDrafts = computed(() => props.showing === 'drafts' ? 'btn-primary' : 'btn-secondary')
const viewerIsOwner = computed(() => props.cube ? actor._id === props.cube.userId : false)

function navigate(tab) {
  emit('navigate', tab)
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
