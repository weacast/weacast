import path from 'path'

export default function init () {
  let app = this

  app.createService('probes', path.join(__dirname, 'models'), path.join(__dirname, 'services'))
  app.createService('probe-results', path.join(__dirname, 'models'), path.join(__dirname, 'services'))
}
