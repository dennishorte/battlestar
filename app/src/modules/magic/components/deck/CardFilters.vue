<template>
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

    <div>
      <label class="form-label">power</label>
      <input class="form-control" ref="power" />
    </div>

    <div>
      <label class="form-label">toughness</label>
      <input class="form-control" ref="toughness" />
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
  </div>

  <div>
    <button class="btn btn-primary" @click="apply()">apply</button>
  </div>

  <div class="filter-list">
    <h5>filters</h5>
    <div class="filter-added" v-for="filter in filters">
      {{ filter.kind }} {{ filter.operator }} {{ filter.value }}
    </div>
  </div>
</template>


<script>
export default {
  name: 'CardFilters',

  inject: ['bus'],

  data() {
    return {
      filters: [],
    }
  },

  methods: {
    add(event) {
      const kind = event.target.value
      const value = this.$refs[kind].value
      const operator = this.$refs[`${kind}op`].value

      console.log(value, operator)
      this.filters.push({
        kind,
        value,
        operator: operator || '='
      })

      this.$refs[kind].value = ''
    },

    apply() {
      this.bus.emit('card-filter', [...this.filters])
    },
  },
}
</script>


<style scoped>
label {
  min-width: 4em;
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
