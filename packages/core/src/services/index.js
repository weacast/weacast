import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default async function () {
  const app = this

  await app.createService('forecasts',
    path.join(__dirname, '..', 'models'),
    path.join(__dirname, '..', 'services'),
    app.getServiceOptions('forecasts'))
}
