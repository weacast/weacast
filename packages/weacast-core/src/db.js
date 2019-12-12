import mongodb from 'mongodb'
import _ from 'lodash'
import logger from 'winston'
import makeDebug from 'debug'
import errors from '@feathersjs/errors'

const debug = makeDebug('weacast:weacast-core:db')

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

  async disconnect () {
    // Default implementation
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
      // Primary DB
      this._dbUrl = app.get('db').url
      // Secondaries if any
      this._secondaries = app.get('db').secondaries || {}
    } catch (error) {
      throw new errors.GeneralError('Cannot find database connection URL in application')
    }
  }

  async connect () {
    try {
      // Connect to primary
      this._db = await mongodb.connect(this._dbUrl)
      debug('Connected to primary DB ' + this.adapter)
      // Then secondaries if any
      this._dbs = {}
      if (this._secondaries) {
        const dbNames = _.keys(this._secondaries)
        for (let i = 0; i < dbNames.length; i++) {
          const dbName = dbNames[i]
          const dbUrl = this._secondaries[dbName]
          this._dbs[dbName] = await mongodb.connect(dbUrl)
        }
        debug('Connected to secondaries DB ' + this.adapter)
      }
      return this._db
    } catch (error) {
      logger.error('Could not connect to ' + this.adapter + ' database(s), please check your configuration', error)
      throw error
    }
  }

  async disconnect () {
    try {
      await this._db.close()
      debug('Disconnected from primary DB ' + this.adapter)
      this._db = null
      if (this._secondaries) {
        const dbs = _.values(this._dbs)
        for (let i = 0; i < dbs.length; i++) {
          await dbs[i].close()
        }
        this._dbs = {}
        debug('Disconnected from secondaries DB ' + this.adapter)
      }
    } catch (error) {
      logger.error('Could not disconnect from ' + this.adapter + ' database(s)', error)
      throw error
    }
  }

  db (dbName) {
    return (dbName ? this._dbs[dbName] : this._db)
  }

  collection (name, dbName) {
    if (!this._collections.has(name)) {
      // Get collection from secondary or primary DB
      this._collections.set(name, this.db(dbName).collection(name))
    }
    return this._collections.get(name)
  }
}
