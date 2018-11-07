import { ForecastLayer, FlowLayer, HeatLayer, ColorLayer, WindBarbIcon } from './layers'
// A shorter version of all of this should be the following
/*
export * as hooks from './hooks'
*/
// However for now we face a bug in babel so that transform-runtime with export * from 'x' generates import statements in transpiled code
// Tracked here : https://github.com/babel/babel/issues/2877
export { ForecastLayer, FlowLayer, HeatLayer, ColorLayer, WindBarbIcon }

