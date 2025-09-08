// @dada78641/sayserver <https://github.com/msikma/sayserver>
// © MIT license

import fs from 'node:fs/promises'
import path from 'node:path'
import zlib from 'node:zlib'
import express, {Request, Response} from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import {Controller} from '../tts/index.ts'
import {getProviderInfo} from '../tts/providers/index.ts'
import {getJSONResponse} from './res.ts'
import {transformUtterance} from './transform.ts'
import {validateRequest} from './validate.ts'

dotenv.config({quiet: true})

const app = express()
const port = process.env.PORT ?? '8227'

app.use(cors())
app.use(express.json())

if (process.argv.includes('--serve-test-endpoint')) {
  app.get('/test', async (req: Request, res: Response) => {
    const docs = await fs.readFile(path.join(import.meta.dirname, '..', 'docs', 'index.html'), 'utf8')
    res.send(docs)
  })
}

app.get('/api/voices', (req: Request, res: Response) => {
  const data = getProviderInfo()
  return getJSONResponse(res, data)
})

app.post('/api/generate', async (req: Request, res: Response) => {
  const data = {...req.body}
  const valid = validateRequest(data)
  if (!valid) {
    return getJSONResponse(res.status(400), {
      error: 'Invalid request',
      details: validateRequest.errors
    })
  }

  const {seed, service, set, voice, prompt} = data
  
  const controller = new Controller()
  const utterance = await controller.generateUtterance(prompt, seed, {set, voice, service})
  if (utterance == null) {
    return getJSONResponse(res.status(500), {
      error: 'Internal server error',
      details: 'Failed to generate utterance'
    })
  }

  const responseData = {
    output: transformUtterance(utterance),
    time: new Date().toISOString()
  }

  return getJSONResponse(res, responseData)
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
