module.exports = {
  'weacast-core': {
    organization: 'weacast',
    dependencies: [],
    branch: 'master'
  },
  'weacast-grib2json': {
    organization: 'weacast',
    dependencies: [],
    branch: 'master'
  },
  'weacast-gtiff2json': {
    organization: 'weacast',
    dependencies: [],
    branch: 'master'
  },
  'weacast-probe': {
    organization: 'weacast',
    dependencies: [
      'weacast-core'
    ],
    branch: 'master'
  },
  'weacast-alert': {
    organization: 'weacast',
    dependencies: [
      'weacast-core',
      'weacast-probe',
    ],
    branch: 'master'
  },
  'weacast-gfs': {
    organization: 'weacast',
    dependencies: [
      'weacast-core',
      'weacast-grib2json',
    ],
    branch: 'master'
  },
  'weacast-arpege': {
    organization: 'weacast',
    dependencies: [
      'weacast-core',
      'weacast-gtiff2json',
    ],
    branch: 'master'
  },
  'weacast-arome': {
    organization: 'weacast',
    dependencies: [
      'weacast-core',
      'weacast-arpege',
    ],
    branch: 'master'
  },
  'weacast-api': {
    organization: 'weacast',
    dependencies: [
      'weacast-core',
      'weacast-probe',
      'weacast-alert',
      'weacast-gfs',
      'weacast-arpege',
      'weacast-arome',
    ],
    branch: 'master'
  },
}
