import { generateCodeFromBlocklyRequest, GenerateCodeFromBlocklyRequestAction } from 'modules/blockly/actions'
import { Scene } from 'modules/scene/types'
import { Dispatch } from 'redux'

export type Props = {
  scene: Scene | null
  onGenerateCodeFromBlockly: typeof generateCodeFromBlocklyRequest
}

export type MapStateProps = Pick<Props, 'scene'>

export type MapDispatchProps = Pick<Props, 'onGenerateCodeFromBlockly'>

export type MapDispatch = Dispatch<GenerateCodeFromBlocklyRequestAction>
