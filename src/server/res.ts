// @dada78641/sayserver <https://github.com/msikma/sayserver>
// © MIT license

import {Response} from 'express'
import zlib from 'zlib'

export function getJSONResponse(res: Response, data: unknown) {
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Content-Encoding', 'gzip')

  const gzip = zlib.createGzip()
  gzip.pipe(res)
  gzip.end(JSON.stringify(data))
}
