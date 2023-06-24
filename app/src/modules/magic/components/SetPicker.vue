<template>
  <div class="set-picker">
    <input v-model="searchPrefix" class="form-control" placeholder="search" />
    <div class="set-list">
      <div
        v-for="sett in searchedSets"
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
import { mag } from 'battlestar-common'

export default {
  name: 'SetPicker',

  data() {
    return {
      highlighted: null,
      highlightedName: '',
      searchPrefix: '',
    }
  },

  computed: {
    searchedSets() {
      const searchText = this.searchPrefix.toLowerCase()
      const searched = this.sortedSets.filter(s => s.name.toLowerCase().includes(searchText))
      return searched
    },

    sortedSets() {
      return mag.res.setData.sort((l, r) => {
        return l.name.localeCompare(r.name)
      })
    },
  },

  methods: {
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
</style>
