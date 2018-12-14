import chroma from 'chroma-js'
window.chroma = chroma

/*
 Create a chromajs object from options
 */
export function createColorMap(options, domain) {
  let colorMap = chroma.scale(options.scale)
  if (options.domain) colorMap.domain(options.domain)
  else if (domain) colorMap.domain(domain)
  if (options.classes) colorMap.classes(options.classes)
  return colorMap
}
