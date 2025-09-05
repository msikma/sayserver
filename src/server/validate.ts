// @dada78641/sayserver <https://github.com/msikma/sayserver>
// © MIT license

import Ajv from 'ajv'
import {requestSchema, RequestBody} from './schema.ts'

const ajv = new Ajv.default({allErrors: true})
export const validateRequest = ajv.compile(requestSchema)
