require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  ignorePatterns: ['dist'],
  extends: [
    'plugin:vue/vue3-recommended',
    '@vue/eslint-config-standard-with-typescript'
  ]
}
