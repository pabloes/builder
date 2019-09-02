import { connect } from 'react-redux'

import { RootState } from 'modules/common/types'
import { generateCodeFromBlocklyRequest } from 'modules/blockly/actions'
import { MapStateProps, MapDispatchProps, MapDispatch } from './Blockly.types'
import { getCurrentScene } from 'modules/scene/selectors'
import { default as Blockly } from './Blockly'

const mapState = (state: RootState): MapStateProps => ({
  scene: getCurrentScene(state),
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onGenerateCodeFromBlockly: () => dispatch(generateCodeFromBlocklyRequest())
})

export default connect(
  mapState,
  mapDispatch
)(Blockly)
