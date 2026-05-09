<template>
  <div class="set-picker">
    <input v-model="searchPrefix" class="form-control" placeholder="search" />
    <div v-if="loading" class="loading">Loading sets...</div>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-else class="set-list">
      <div
        v-for="sett in searchedSets"
        :key="sett.name"
        @click="selectSet(sett)"
        class="set-name"
        :class="sett.name === highlightedName ? 'highlighted' : ''"
      >
        {{ sett.name }}
      </div>
    </div>
  </div>
</template>


<script>
const setSortOrder = [
  'expansion',
  'core',
  'draft_innovation',

  'masters',
  'masterpiece',

  'alchemy',
  'archenemy',
  'arsenal',
  'box',
  'commander',
  'duel_deck',
  'from_the_vault',
  'funny',
  'memorabilia',
  'minigame',
  'planechase',
  'premium_deck',
  'promo',
  'spellbook',
  'starter',
  'token',
  'treasure_chest',
  'vanguard',
]

export default {
  name: 'SetPicker',

  emits: ['selection-changed'],

  data() {
    return {
      highlighted: null,
      highlightedName: '',
      searchPrefix: '',
      sets: [],
      loading: true,
      error: '',
    }
  },

  computed: {
    searchedSets() {
      const searchText = this.searchPrefix.toLowerCase()
      const searched = this.sortedSets.filter(s => s.name.toLowerCase().includes(searchText))
      return searched
    },

    sortedSets() {
      return [...this.sets].sort((l, r) => {
        if (l.set_type === r.set_type) {
          return this.dateSort(l.released_at, r.released_at)
        }
        else {
          return setSortOrder.indexOf(l.set_type) - setSortOrder.indexOf(r.set_type)
        }
      })
    },
  },

  async created() {
    try {
      const response = await this.$post('/api/magic/sets/all', {})
      this.sets = response.sets || []
    }
    catch (e) {
      this.error = 'Failed to load sets'
      throw e
    }
    finally {
      this.loading = false
    }
  },

  methods: {
    dateSort(l, r) {
      if (l < r) {
        return 1
      }
      else if (l > r) {
        return -1
      }
      else {
        return 0
      }
    },

    selectSet(sett) {
      if (this.highlightedName === sett.name) {
        this.highlighted = null
        this.highlightedName = ''
      }
      else {
        this.highlighted = sett
        this.highlightedName = sett.name
      }

      this.$emit('selection-changed', this.highlighted)
    }
  },
}
</script>


<style scoped>
.highlighted {
  background-color: #B0C4DE;
}

.set-picker {
  font-size: .8em;
}

.set-name {
  overflow-x: hidden;
  white-space: nowrap;
}

.loading {
  color: #888;
  padding: .5em 0;
}
</style>
