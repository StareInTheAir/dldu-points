/* eslint-disable */
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  productionSourceMap: false
})

const { gitDescribeSync } = require('git-describe');
process.env.VUE_APP_GIT_COMMIT_HASH = gitDescribeSync().hash
process.env.VUE_APP_VERSION = process.env.npm_package_version
