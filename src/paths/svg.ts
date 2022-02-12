import svgTopString from './top.svg?raw'
import svgEndString from './end.svg?raw'
import svgSeparatorString from './separator.svg?raw'

interface PathWithViewBox {
  path: Path2D
  viewBox: DOMRect
}

const PARSER = new DOMParser()

function parseSvg (svgContent: string): PathWithViewBox {
  const xmlDocument = PARSER.parseFromString(svgContent, 'image/svg+xml')
  const svgDocument = xmlDocument.firstChild as SVGSVGElement
  const svgPath = svgDocument.firstChild as SVGPathElement
  return {
    path: new Path2D(svgPath.attributes.getNamedItem('d')?.value),
    viewBox: svgDocument.viewBox.baseVal
  }
}

export const SVG_TOP = parseSvg(svgTopString)
export const SVG_END = parseSvg(svgEndString)
export const SVG_SEPARATOR = parseSvg(svgSeparatorString)
