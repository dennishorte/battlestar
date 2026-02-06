<template>
  <div class="location-form">
    <h4>{{ isNew ? 'New Location' : 'Edit Location' }}</h4>

    <div class="form-row">
      <div class="form-group">
        <label>Short Name (ID)</label>
        <input type="text" v-model="form.short" class="form-control" />
      </div>
      <div class="form-group">
        <label>Display Name</label>
        <input type="text" v-model="form.name" class="form-control" />
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label>Type</label>
        <select v-model="locationType" class="form-control">
          <option value="tunnel">Tunnel</option>
          <option value="site">Site</option>
          <option value="majorSite">Major Site</option>
        </select>
      </div>
      <div class="form-group" v-if="locationType !== 'tunnel'">
        <label>Size</label>
        <input
          type="number"
          v-model.number="form.size"
          class="form-control"
          min="1"
          max="12"
        />
      </div>
    </div>

    <div class="form-row" v-if="locationType !== 'tunnel'">
      <div class="form-group">
        <label>Neutrals</label>
        <input
          type="number"
          v-model.number="form.neutrals"
          class="form-control"
          min="0"
        />
      </div>
      <div class="form-group">
        <label>Points</label>
        <input
          type="number"
          v-model.number="form.points"
          class="form-control"
          min="0"
        />
      </div>
    </div>

    <div class="form-row" v-if="locationType === 'majorSite'">
      <div class="form-group">
        <label>Control Influence</label>
        <input
          type="number"
          v-model.number="form.control.influence"
          class="form-control"
          min="0"
        />
      </div>
      <div class="form-group">
        <label>Control Points</label>
        <input
          type="number"
          v-model.number="form.control.points"
          class="form-control"
          min="0"
        />
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label>Position X (0-1)</label>
        <input
          type="number"
          v-model.number="form.position.x"
          class="form-control"
          min="0"
          max="1"
          step="0.01"
        />
      </div>
      <div class="form-group">
        <label>Position Y (0-1)</label>
        <input
          type="number"
          v-model.number="form.position.y"
          class="form-control"
          min="0"
          max="1"
          step="0.01"
        />
      </div>
    </div>

    <div class="form-row" v-if="locationType !== 'tunnel'">
      <div class="form-group checkbox-group">
        <label>
          <input type="checkbox" v-model="form.start" />
          Starting Location
        </label>
      </div>
    </div>

    <div class="form-actions">
      <button v-if="isNew" class="btn btn-success" @click="create">Create</button>
      <button v-else class="btn btn-primary" @click="update">Update</button>
      <button v-if="!isNew" class="btn btn-danger" @click="confirmDelete">Delete</button>
      <button class="btn btn-secondary" @click="cancel">Cancel</button>
    </div>
  </div>
</template>


<script>
export default {
  name: 'LocationForm',

  props: {
    location: {
      type: Object,
      required: true,
    },
    isNew: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['update', 'create', 'delete', 'cancel'],

  data() {
    return {
      form: this.cloneLocation(this.location),
    }
  },

  computed: {
    locationType: {
      get() {
        if (this.form.points === 0) {
          return 'tunnel'
        }
        if (this.form.control && this.form.control.influence > 0) {
          return 'majorSite'
        }
        return 'site'
      },
      set(type) {
        if (type === 'tunnel') {
          this.form.points = 0
          this.form.size = 1
          this.form.neutrals = 0
          this.form.start = false
          this.form.control = { influence: 0, points: 0 }
          this.form.totalControl = { influence: 0, points: 0 }
        }
        else if (type === 'site') {
          this.form.points = this.form.points || 2
          this.form.size = this.form.size || 2
          this.form.control = { influence: 0, points: 0 }
          this.form.totalControl = { influence: 0, points: 0 }
        }
        else if (type === 'majorSite') {
          this.form.points = this.form.points || 4
          this.form.size = this.form.size || 4
          this.form.control = this.form.control.influence > 0
            ? this.form.control
            : { influence: 1, points: 0 }
          this.updateTotalControl()
        }
      },
    },
  },

  watch: {
    location: {
      handler(newLoc) {
        this.form = this.cloneLocation(newLoc)
      },
      deep: true,
    },
    'form.control': {
      handler() {
        if (this.locationType === 'majorSite') {
          this.updateTotalControl()
        }
      },
      deep: true,
    },
  },

  methods: {
    cloneLocation(loc) {
      return {
        short: loc.short || '',
        name: loc.name || '',
        size: loc.size || 1,
        neutrals: loc.neutrals || 0,
        points: loc.points || 0,
        start: loc.start || false,
        control: loc.control ? { ...loc.control } : { influence: 0, points: 0 },
        totalControl: loc.totalControl ? { ...loc.totalControl } : { influence: 0, points: 0 },
        position: loc.position ? { ...loc.position } : { x: 0.5, y: 0.5 },
      }
    },

    updateTotalControl() {
      this.form.totalControl = {
        influence: this.form.control.influence + 1,
        points: this.form.control.points + 2,
      }
    },

    update() {
      this.$emit('update', { ...this.form })
    },

    create() {
      if (!this.form.short) {
        alert('Short name is required')
        return
      }
      this.$emit('create', { ...this.form })
    },

    confirmDelete() {
      if (confirm(`Delete location "${this.form.short}"?`)) {
        this.$emit('delete', this.form.short)
      }
    },

    cancel() {
      this.$emit('cancel')
    },
  },
}
</script>


<style scoped>
.location-form {
  background: #252525;
  padding: 1em;
  border-radius: 8px;
}

.location-form h4 {
  margin: 0 0 0.75em 0;
  color: #d4a574;
}

.form-row {
  display: flex;
  gap: 0.75em;
  margin-bottom: 0.75em;
}

.form-group {
  flex: 1;
}

.form-group label {
  display: block;
  margin-bottom: 0.25em;
  font-size: 0.85em;
  color: #888;
}

.form-control {
  width: 100%;
  padding: 0.4em 0.6em;
  background: #333;
  border: 1px solid #444;
  border-radius: 4px;
  color: #eee;
  box-sizing: border-box;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 0.5em;
  cursor: pointer;
  color: #ccc;
}

.checkbox-group input[type="checkbox"] {
  width: auto;
}

.form-actions {
  display: flex;
  gap: 0.5em;
  margin-top: 1em;
  padding-top: 0.75em;
  border-top: 1px solid #333;
}

.btn {
  padding: 0.4em 0.8em;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
}

.btn-primary {
  background: #4a90d9;
  color: white;
}

.btn-success {
  background: #3a6b35;
  color: white;
}

.btn-danger {
  background: #a33;
  color: white;
}

.btn-secondary {
  background: #555;
  color: #ccc;
}

.btn:hover {
  opacity: 0.9;
}
</style>
