<template>
  <div class="card-filters">
    <SectionHeader>Card Filters</SectionHeader>

    <div class="filter-inputs">

      <div class="filter-group">
        <label class="col-form-label">name</label>
        <select class="form-select operator-select" ref="nameop">
          <option>and</option>
          <option>not</option>
        </select>
        <input class="form-control" ref="name" />
        <button class="btn btn-secondary" value="name" @click="add">add</button>
      </div>

      <div class="filter-group">
        <label class="col-form-label">text</label>
        <select class="form-select operator-select" ref="textop">
          <option>and</option>
          <option>not</option>
        </select>
        <input class="form-control" ref="text" />
        <button class="btn btn-secondary" value="text" @click="add">add</button>
      </div>

      <div class="filter-group">
        <label class="col-form-label">type</label>
        <select class="form-select operator-select" ref="typeop">
          <option>and</option>
          <option>not</option>
        </select>
        <input class="form-control" ref="type" />
        <button class="btn btn-secondary" value="type" @click="add">add</button>
      </div>

      <div class="filter-group">
        <label class="col-form-label">flavor</label>
        <select class="form-select operator-select" ref="flavorop">
          <option>and</option>
          <option>not</option>
        </select>
        <input class="form-control" ref="flavor" />
        <button class="btn btn-secondary" value="flavor" @click="add">add</button>
      </div>

      <div class="filter-group">
        <label class="col-form-label">cmc</label>
        <select class="form-select operator-select" ref="cmcop">
          <option>=</option>
          <option>&lt=</option>
          <option>&gt=</option>
        </select>
        <input class="form-control" ref="cmc" />
        <button class="btn btn-secondary" value="cmc" @click="add">add</button>
      </div>

      <div class="filter-group">
        <label class="col-form-label">power</label>
        <select class="form-select operator-select" ref="powerop">
          <option>=</option>
          <option>&lt=</option>
          <option>&gt=</option>
        </select>
        <input class="form-control" ref="power" />
        <button class="btn btn-secondary" value="power" @click="add">add</button>
      </div>

      <div class="filter-group">
        <label class="col-form-label">toughness</label>
        <select class="form-select operator-select" ref="toughnessop">
          <option>=</option>
          <option>&lt=</option>
          <option>&gt=</option>
        </select>
        <input class="form-control" ref="toughness" />
        <button class="btn btn-secondary" value="toughness" @click="add">add</button>
      </div>

      <div class="filter-group">
        <label class="col-form-label">legality</label>
        <select class="form-select" ref="legality">
          <option value="commander">commander</option>
          <option value="modern">modern</option>
          <option value="standard">standard</option>
          <option value="---">---</option>

          <option value="alchemy">alchemy</option>
          <option value="brawl">brawl</option>
          <option value="duel">duel</option>
          <option value="explorer">explorer</option>
          <option value="future">future</option>
          <option value="gladiator">gladiator</option>
          <option value="historic">historic</option>
          <option value="historicbrawl">historicbrawl</option>
          <option value="legacy">legacy</option>
          <option value="oldschool">oldschool</option>
          <option value="pauper">pauper</option>
          <option value="paupercommander">paupercommander</option>
          <option value="penny">penny</option>
          <option value="pioneer">pioneer</option>
          <option value="premodern">premodern</option>
          <option value="vintage">vintage</option>
        </select>
        <button class="btn btn-secondary" value="legality" @click="add">add</button>
      </div>

      <div class="filter-group">
        <label class="col-form-label">set</label>
        <select class="form-select" ref="set">
          <option
            v-for="[key, value] in sets"
            :value="key"
          >
            {{ value }}
          </option>
        </select>
        <button class="btn btn-secondary" value="set" @click="add">add</button>
      </div>

      <div class="colors-group">
        <div class="color-buttons">
          <div class="form-check form-check-inline">
            <input class="btn-check" type="checkbox" id="colorwhite" ref="colorwhite" />
            <label class="btn btn-outline-warning" for="colorwhite">white</label>
          </div>
          <div class="form-check form-check-inline">
            <input class="btn-check" type="checkbox" id="colorblue" ref="colorblue" />
            <label class="btn btn-outline-primary" for="colorblue">blue</label>
          </div>
          <div class="form-check form-check-inline">
            <input class="btn-check" type="checkbox" id="colorblack" ref="colorblack" />
            <label class="btn btn-outline-dark" for="colorblack">black</label>
          </div>
          <div class="form-check form-check-inline">
            <input class="btn-check" type="checkbox" id="colorred" ref="colorred" />
            <label class="btn btn-outline-danger" for="colorred">red</label>
          </div>
          <div class="form-check form-check-inline">
            <input class="btn-check" type="checkbox" id="colorgreen" ref="colorgreen" />
            <label class="btn btn-outline-success" for="colorgreen">green</label>
          </div>
        </div>

        <div class="colors-row-two">
          <div class="color-options">
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="checkbox" ref="coloronly" />
              <label class="form-check-label">only</label>
            </div>
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="checkbox" ref="coloror" />
              <label class="form-check-label">or</label>
            </div>
          </div>

          <div>
            <button class="btn btn-secondary" value="identity" @click="add">identity</button>
            <button class="btn btn-secondary" value="colors" @click="add">color</button>
          </div>
        </div>
      </div>
    </div>

    <div>
      <button class="btn btn-warning" @click="clear">clear</button>
      <button class="btn btn-primary" @click="apply">apply</button>
    </div>

    <div class="filter-list">
      <h5>filters</h5>
      <div class="filter-added" v-for="filter in filters">
        <div class="filter-display-kind">{{ filter.kind }}</div>
        <div v-if="filter.kind === 'colors' || filter.kind === 'identity'">
          <span v-if="filter.only" class="filter-display-operator">only&nbsp;</span>
          <span v-if="filter.or" class="filter-display-operator">or&nbsp;</span>
          <template v-for="color in colors">
            <span v-if="filter[color]" class="filter-display-value">
              {{ color }}
              <i class="bi-x-circle" @click="remove(filter)"></i>
            </span>
          </template>
        </div>
        <div v-else>
          <span class="filter-display-operator">{{ filter.operator }}&nbsp;</span>
          <span class="filter-display-value">
            {{ filter.value }}
            <i class="bi-x-circle" @click="remove(filter)"></i>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { mapState} from 'vuex'
import { mag, util } from 'battlestar-common'

import SectionHeader from '@/components/SectionHeader'


export default {
  name: 'CardFilters',

  components: {
    SectionHeader,
  },

  inject: ['bus'],

  props: {
    cardlist: Array,
    modelValue: Array,
  },

  data() {
    return {
      colors: ['white', 'blue', 'black', 'red', 'green'],
      filters: [],
    }
  },

  computed: {
    sets() {
      return Object
        .entries(mag.res.setCodesToNames)
        .sort((l, r) => l[1].localeCompare(r[1]))
    },
  },

  methods: {
    add(event) {
      const kind = event.target.value

      if (kind === 'colors' || kind === 'identity') {
        // Add the new color filter
        const colors = {}
        let someTrue = false
        for (const field of ['white', 'blue', 'black', 'red', 'green', 'only', 'or']) {
          const elem = this.$refs[`color${field}`]
          colors[field] = elem.checked
          elem.checked = false
          if (colors[field]) {
            someTrue = true
          }
        }

        colors.kind = kind
        this.filters.push(colors)
      }

      else if (kind === 'set') {
        const value = this.$refs[kind].value

        // See if there is an existing filter
        const existing = this.filters.find(f => f.kind === 'set')
        if (existing) {
          existing.value.push(value)
        }
        else {
          this.filters.push({
            kind,
            value: [value],
            operator: 'or',
          })
        }
      }

      else {
        const value = this.$refs[kind].value
        const operatorElem = this.$refs[`${kind}op`]
        const operator = operatorElem ? operatorElem.value : '='

        this.filters.push({
          kind,
          value,
          operator: operator
        })

        this.$refs[kind].value = ''
      }
    },

    apply() {
      this.$emit('update:modelValue', filterCards(this.cardlist, this.filters))
      this.$emit('filters-applied', util.deepcopy(this.filters))
    },

    clear() {
      this.filters = []
      this.$emit('update:modelValue', this.cardlist)
    },

    remove(filter) {
      util.array.remove(this.filters, filter)
    },

    setFilters(filters) {
      this.filters = filters
      this.apply()
    },
  },

  mounted() {
    this.$emit('update:modelValue', this.cardlist)
    this.bus.on('set-filters', this.setFilters)
  },
}

function filterCards(cards, filters) {
  if (filters.length === 0) {
    return cards
  }
  return cards
    .filter(card => filters.every(filter => mag.util.card.applyOneFilter(card, filter)))
}

</script>


<style scoped>
label {
  min-width: 4em;
}

.color-buttons .form-check {
  margin: 0;
  padding: 0;
  width: 20%;
}

.color-buttons .form-check .btn {
  width: 100%;
}

.colors-row-two {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.color-options .form-check {
  margin: 0;
  padding: 0;
}

.color-options .form-check input {
  margin-left: 0;
  height: 1.5em;
  width: 1.5em;
}

.color-options .form-check label {
  margin-top: .25em;
  margin-left: .25em;
  min-width: 3em;
}

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

.filter-group {
  display: flex;
  flex-direction: row;
}

.filter-group label {
  margin-right: .25em;
}

.filter-group .btn {
  margin-left: .25em;
}

.operator-select {
  max-width: 5em;
}
</style>
