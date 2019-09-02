import { action } from 'typesafe-actions'

// Generate and Export Code from Blockly

export const GENERATE_CODE_FROM_BLOCKLY_REQUEST = '[Request] Generate Code from Blockly'
export const GENERATE_CODE_FROM_BLOCKLY_SUCCESS = '[Success] Generate Code from Blockly'
export const GENERATE_CODE_FROM_BLOCKLY_FAILURE = '[Failure] Generate Code from Blockly'

export const generateCodeFromBlocklyRequest = () => action(GENERATE_CODE_FROM_BLOCKLY_REQUEST)
export const generateCodeFromBlocklySuccess = () => action(GENERATE_CODE_FROM_BLOCKLY_SUCCESS)
export const generateCodeFromBlocklyFailure = (error: string) => action(GENERATE_CODE_FROM_BLOCKLY_FAILURE, { error })

export type GenerateCodeFromBlocklyRequestAction = ReturnType<typeof generateCodeFromBlocklyRequest>
export type GenerateCodeFromBlocklySuccessAction = ReturnType<typeof generateCodeFromBlocklySuccess>
export type GenerateCodeFromBlocklyFailureAction = ReturnType<typeof generateCodeFromBlocklyFailure>
