const { src, dest, series, parallel } = require('gulp')
const del = require('del')
const fs   = require('fs')
const zip = require('gulp-zip')
const log = require('fancy-log')
const webpack_stream = require('webpack-stream')
const webpack_config = require('./webpack.config.js')
const exec = require('child_process').exec

const paths = {
  prod_build: '../prod-build',
  server_file_name: 'server.bundle.js',
  vue_src: '../app/build/**/*',
  vue_dist: '../prod-build/app/build',
  zipped_file_name: 'vue-nodejs.zip'
}

function clean()  {
  log('removing the old files in the directory')
  return del('../prod-build/**', {force:true})
}

function createProdBuildFolder() {

  const dir = paths.prod_build
  log(`Creating the folder if not exist  ${dir}`)
  if(!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
    log('📁  folder created:', dir)
  }

  return Promise.resolve('the value is ignored')
}

function buildVueCodeTask(cb) {
  log('building Vue code into the directory')
  return exec('cd ../app && npm run build', function (err, stdout, stderr) {
    log(stdout)
    log(stderr)
    cb(err)
  })
}

function copyVueCodeTask() {
  log('copying Vue code into the directory')
  return src(`${paths.vue_src}`)
    .pipe(dest(`${paths.vue_dist}`))
}

function copyNodeJSCodeTask() {
  log('building and copying server code into the directory')
  return webpack_stream(webpack_config)
    .pipe(dest(`${paths.prod_build}`))
}

function zippingTask() {
  log('zipping the code ')
  return src(`${paths.prod_build}/**`)
    .pipe(zip(`${paths.zipped_file_name}`))
    .pipe(dest(`${paths.prod_build}`))
}

exports.default = series(
  clean,
  createProdBuildFolder,
  buildVueCodeTask,
  parallel(copyVueCodeTask, copyNodeJSCodeTask),
  zippingTask
)
