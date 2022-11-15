<template>
  <div class="container">

    <div class="row">
      <div class="col">
        <FileManager :filelist="single" class="file-manager" />
      </div>
      <div class="col">
        <FileManager :filelist="empty" class="file-manager" />
      </div>
    </div>


    <div class="row">
      <div class="col">
        <FileManager :filelist="complex" :hide-files="true" class="file-manager" />
      </div>
      <div class="col">
        <FileManager
          class="file-manager"
          :filelist="complex"
          :file-types="['foo', 'bar']"
          @file-creating="createFile"
          @file-deleting="deleteFile"
          @file-duplicating="duplicateFile"
          @file-opening="openFile"
          @file-updating="updateFile"
        />
      </div>
    </div>

  </div>
</template>


<script>
import { util } from 'battlestar-common'

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
          name: 'abar',
          path: '/foo',
          kind: 'text',
        },
        {
          name: 'bar',
          path: '/foo',
          kind: 'text',
        },
        {
          name: 'bar',
          path: '/foo',
          kind: 'text',
        },
        {
          name: 'zbar',
          path: '/foo',
          kind: 'text',
        },
        {
          name: 'xbar',
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
    createFile(event) {
      this.complex.push(event)
    },

    deleteFile(event) {
      util.array.remove(this.complex, event.file)
    },

    duplicateFile(event) {
      const newFile = util.deepcopy(event.file)
      this.complex.push(newFile)
    },

    openFile(event) {
      console.log('open', event.file)
    },

    updateFile(event) {
      event.file.name = event.newName
      event.file.path = event.newPath
    },
  },
}
</script>


<style scoped>
.file-manager {
  min-height: 17rem;
  max-height: 17rem;
  background-color: lightgray;
  border: 1px solid gray;
  margin: .25em;
  padding: .25em;
}
</style>
