#!/usr/bin/env node

import fs from 'fs-extra'
import logger from 'winston'
import _ from 'lodash'
import { Server } from './server'

async function main () {
	let server = new Server()

	const config = server.app.get('logs')
	const logPath = _.get(config, 'DailyRotateFile.dirname')
	if (logPath) {
	  // This will ensure the log directory does exist
	  fs.ensureDirSync(logPath)
	}

	process.on('unhandledRejection', (reason, p) =>
	  logger.error('Unhandled Rejection at: Promise ', p, reason)
	)

	await server.run()
	logger.info('Server started listening')
}

if (process.env.LAUNCH_DELAY) {
	logger.info(`Waiting ${process.env.LAUNCH_DELAY/1000}s for server to start...`)
	setTimeout(main, process.env.LAUNCH_DELAY)
} else {
	main()
}