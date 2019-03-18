import _ from 'lodash'

export default function (data, connection, hook) { // eslint-disable-line no-unused-vars
  // Do not raise events for tiles
  return (_.has(data, 'x') && _.has(data, 'y') && _.has(data, 'geometry') ? false : data)
}
