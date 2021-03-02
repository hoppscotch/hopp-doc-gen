const bannerInfo = require('node-banner')

const showBanner = () =>
  bannerInfo('Hopp Doc Gen', 'An API Doc Generator CLI', 'green', 'white')

module.exports = showBanner
