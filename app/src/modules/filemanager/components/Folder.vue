<template>
  <div class="folder">
    <div class="folder-name">
      <i class="bi-folder"></i>
      {{ content.name || 'root' }}
    </div>

    <div v-for="file in content.files" class="nested">
      <i class="bi-box"></i> {{ file.name }}
    </div>

    <Folder v-for="folder in content.folders" class="nested" :content="folder" />
  </div>
</template>


<script>
import { mapState } from 'vuex'


export default {
  name: 'Folder',

  props: {
    content: Object,
  },

  computed: {
  },

  methods: {
  },
}
</script>


<style scoped>
.nested {
  margin-left: 1em;
}

.selected {
  background-color: lightblue;
  border-radius: .25em;
}
</style>
