<template>
  <div class="settings-dune">
    Modules

    <div class="form-check">
      <input
        class="form-check-input"
        type="checkbox"
        v-model="models.useCHOAM"
        @change="optionsChanged"
      />
      <label class="form-check-label">CHOAM Contracts</label>
    </div>

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
        useCHOAM: false,
        useRiseOfIx: false,
        useImmortality: false,
        useBloodlines: false,
      },
    }
  },

  methods: {
    optionsChanged() {
      this.lobby.options = {
        useCHOAM: this.models.useCHOAM,
        useRiseOfIx: this.models.useRiseOfIx,
        useImmortality: this.models.useImmortality,
        useBloodlines: this.models.useBloodlines,
      }
      this.lobby.valid = true
      this.save()
    },
  },

  created() {
    if (this.lobby.options) {
      this.models.useCHOAM = Boolean(this.lobby.options.useCHOAM)
      this.models.useRiseOfIx = Boolean(this.lobby.options.useRiseOfIx)
      this.models.useImmortality = Boolean(this.lobby.options.useImmortality)
      this.models.useBloodlines = Boolean(this.lobby.options.useBloodlines)
    }
    else {
      this.lobby.options = {}
    }
    this.lobby.valid = true
  },
}
</script>
