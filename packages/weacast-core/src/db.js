import mongodb from 'mongodb'
import logger from 'winston'
import errors from '@feathersjs/errors'

export class Database {
  constructor (app) {
    try {
      this.app = app
      this._adapter = app.get('db').adapter
    } catch (error) {
      throw new errors.GeneralError('Cannot find database adapter configuration in application')
    }
    this._collections = new Map()
  }

  get adapter () {
    return this._adapter
  }

  async connect () {
    // Default implementation
    return null
  }

  static create (app) {
    switch (app.get('db').adapter) {
      case 'mongodb':
      default:
        return new MongoDatabase(app)
    }
  }
}

export class MongoDatabase extends Database {
  constructor (app) {
    super(app)
    try {
      this._dbUrl = app.get('db').url
    } catch (error) {
      throw new errors.GeneralError('Cannot find database connection URL in application')
    }
  }

  async connect () {
    try {
      this._db = await mongodb.connect(this._dbUrl)
    } catch (error) {
      logger.error('Could not connect to ' + this.app.get('db').adapter + ' database, please check your configuration')
    }
  }

  collection (name) {
    // Initializes the `collection` on sublevel `collection`
    if (!this._collections.has(name)) {
      this._collections.set(name, this._db.collection(name))
    }
    return this._collections.get(name)
  }
}
