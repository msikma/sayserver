// @dada78641/sayserver <https://github.com/msikma/sayserver>
// © MIT license

import {JSONSchemaType} from 'ajv'

export interface RequestBody {
  prompt: string
  service: string
  seed: string
  set: string | string[]
  voice: string | string[]
}

export const requestSchema: JSONSchemaType<RequestBody> = {
  type: 'object',
  properties: {
    prompt: {type: 'string', minLength: 1},
    service: {type: 'string', minLength: 1},
    seed: {type: 'string', minLength: 1},
    set: {
      oneOf: [
        {type: 'string', minLength: 1},
        {
          type: 'array',
          items: {type: 'string', minLength: 1},
          minItems: 0
        }
      ]
    },
    voice: {
      oneOf: [
        {type: 'string', minLength: 1},
        {
          type: 'array',
          items: {type: 'string', minLength: 1},
          minItems: 0
        }
      ]
    }
  },
  required: ['prompt', 'service', 'seed', 'set', 'voice'],
  additionalProperties: false
}
