<template>
  <div class="settings-dune">
    Modules

    <div class="form-check">
      <input
        class="form-check-input"
        type="checkbox"
        v-model="models.useRiseOfIx"
        @change="optionsChanged"
        disabled
      />
      <label class="form-check-label text-muted">Rise of Ix (not yet implemented)</label>
    </div>

    <div class="form-check">
      <input
        class="form-check-input"
        type="checkbox"
        v-model="models.useImmortality"
        @change="optionsChanged"
        disabled
      />
      <label class="form-check-label text-muted">Immortality (not yet implemented)</label>
    </div>

    <div class="form-check">
      <input
        class="form-check-input"
        type="checkbox"
        v-model="models.useBloodlines"
        @change="optionsChanged"
        disabled
      />
      <label class="form-check-label text-muted">Bloodlines (not yet implemented)</label>
    </div>
  </div>
</template>


<script>
export default {
  name: 'SettingsDune',

  inject: ['lobby', 'save'],

  data() {
    return {
      models: {
        useRiseOfIx: false,
        useImmortality: false,
        useBloodlines: false,
      },
    }
  },

  computed: {
    playerCount() {
      return this.lobby.users?.length || 0
    },
  },

  watch: {
    'lobby.users': {
      handler() {
        this.updateValid()
      },
      deep: true,
    },
  },

  methods: {
    updateValid() {
      this.lobby.valid = this.playerCount >= 3 && this.playerCount <= 4
      this.save()
    },

    optionsChanged() {
      this.lobby.options = {
        useRiseOfIx: this.models.useRiseOfIx,
        useImmortality: this.models.useImmortality,
        useBloodlines: this.models.useBloodlines,
      }
      this.updateValid()
    },
  },

  created() {
    if (this.lobby.options) {
      this.models.useRiseOfIx = Boolean(this.lobby.options.useRiseOfIx)
      this.models.useImmortality = Boolean(this.lobby.options.useImmortality)
      this.models.useBloodlines = Boolean(this.lobby.options.useBloodlines)
    }
    else {
      this.lobby.options = {}
    }
    this.updateValid()
  },
}
</script>
