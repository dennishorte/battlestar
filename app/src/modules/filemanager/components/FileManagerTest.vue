<template>
  <div class="container">

    <div class="row">
      <div class="col">
        <FileManager />
      </div>
      <div class="col">
        <FileManager :filelist="single" />
      </div>
    </div>


    <div class="row">
      <div class="col">
        <FileManager :filelist="empty" />
      </div>
      <div class="col">
        <FileManager :filelist="complex" @file-created="fileCreated" />
      </div>
    </div>

  </div>
</template>


<script>
import FileManager from './FileManager'


export default {
  name: 'FileManagerTest',

  data() {
    return {
      empty: [],
      single: [{
        name: 'single file',
        path: '/',
        kind: 'text'
      }],
      complex: [
        {
          name: 'bar',
          path: '/foo',
          kind: 'text',
        },
        {
          name: 'world',
          path: '/',
          kind: 'text',
        },
      ],
    }
  },

  components: {
    FileManager,
  },

  methods: {
    fileCreated(event) {
      this.complex.push(event.file)
    },
  },
}
</script>


<style>
.file-manager {
  min-height: 10em;
  background-color: lightgray;
  border: 1px solid gray;
  margin: .25em;
  padding: .25em;
}
</style>
