<template>
  <Modal id="achievement-editor" @ok="save">
    <template #header>Achievement Editor</template>

    <div class="mb-3">
      <label class="form-label">Achievement Name</label>
      <input class="form-control" v-model="achievement.name" />

      <label class="form-label">Unlock Conditions</label>
      <textarea class="form-control" v-model="achievement.unlock" />

      <label class="form-label">Tags (separated by spaces)</label>
      <input class="form-control" v-model="computedTags" />
    </div>

    <div v-for="(h, index) in achievement.hidden" :key="index" v-if="showAll">
      <div class="hidden-header">
        <div>Hidden Tab {{ index }}</div>
        <div>
          <button class="btn btn-outline-danger" @click="removeHidden(index)">delete me</button>
        </div>
      </div>

      <div class="alert alert-info">
        <label class="form-label">visible text</label>
        <input class="form-control" v-model="h.name" />

        <label class="form-label">hidden details</label>
        <textarea class="form-control" rows="8" v-model="h.text" />
      </div>
    </div>

    <div v-if="!showAll" class="alert alert-danger">
      Hidden info is hidden
    </div>

    <button class="btn btn-primary" @click="addHidden" v-if="showAll">add hidden tab</button>
  </Modal>
</template>


<script>
export default {
  name: 'AchievementEditorModal',

  props: {
    achievement: Object,
  },

  methods: {
    addHidden() {
      this.achievement.hidden.push({
        name: '',
        text: '',
      })
    },

    removeHidden(index) {
      this.achievement.hidden.splice(index, 1)
    },

    async save() {
      await this.$post('/api/magic/achievement/save', {
        achievement: this.achievement,
      })
      this.$emit('achievements-updated')
    },
  },
}
</script>
