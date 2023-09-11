<template>
  <div class="filter-list">
    <h5 v-if="!noHeader">filters</h5>
    <div class="filter-added" v-for="filter in filters">
      <div class="filter-display-kind">{{ filter.kind }}</div>
      <div v-if="filter.kind === 'colors' || filter.kind === 'identity'">
        <span v-if="filter.only" class="filter-display-operator">only&nbsp;</span>
        <span v-if="filter.or" class="filter-display-operator">or&nbsp;</span>
        <template v-for="color in colors">
          <span v-if="filter[color]" class="filter-display-value">
            {{ color }}
            <i v-if="allowEdit" class="bi-x-circle" @click="remove(filter)"></i>
          </span>
        </template>
      </div>
      <div v-else>
        <span class="filter-display-operator">{{ filter.operator }}&nbsp;</span>
        <span class="filter-display-value">
          {{ filter.value }}
          <i v-if="allowEdit" class="bi-x-circle" @click="remove(filter)"></i>
        </span>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: 'CardFilterList',

  props: {
    filters: {
      type: Array,
      default: [],
    },

    allowEdit: {
      type: Boolean,
      default: true,
    },

    noHeader: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      colors: ['white', 'blue', 'black', 'red', 'green'],
    }
  },

  methods: {
    remove(filter) {
      this.$emit('remove-card-filter', filter)
    },
  },
}
</script>


<style scoped>
.filter-list {
  line-height: 1em;
}

.filter-added {
  margin-top: .5em;
}

.filter-display-kind {
  font-weight: bold;
  margin-left: .5em;
}

.filter-display-operator {
  font-size: .9em;
  font-style: italic;
  margin-left: .5em;
}
</style>
