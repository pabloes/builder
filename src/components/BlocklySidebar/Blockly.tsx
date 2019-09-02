import * as React from 'react'
import './Blockly.css'

import Blockly, { WorkspaceSvg } from 'blockly'
import { Props } from './Blockly.types'
import { Button } from 'decentraland-ui'

import { setupBlockly } from './External/DCLGenerators'

const BOTTOM_TOOLBAR_HEIGHT = 60
const toolbox = setupBlockly(Blockly)

/**
 * I'm sorry, but Google doesn't do React and this was the best way to deal with Blockly in a React context.
 */
export default class BlocklyBuilder extends React.PureComponent<Props, { workspaceReference: Blockly.Workspace | null }> {
  state: { workspaceReference: Blockly.Workspace | null } = { workspaceReference: null }
  componentDidMount() {
    const workspace = Blockly.inject('blocklyDiv', { toolbox: toolbox })
    this.setState({ workspaceReference: workspace })
    window.addEventListener('resize', this.resizeHandler, false)
    this.resizeHandler()
  }
  componentWillUnmount() {
    const workspace = this.state.workspaceReference
    if (workspace) {
      window.removeEventListener('resize', this.resizeHandler)
      workspace.dispose()
    }
  }
  resizeHandler = () => {
    this.adjustBlocklySize()
  }
  adjustBlocklySize() {
    const blocklyArea = document.getElementById('blocklyArea') // Replace for a React Reference
    const blocklyDiv = document.getElementById('blocklyDiv') // Ditto
    const { workspaceReference } = this.state
    if (!workspaceReference || !blocklyArea || !blocklyDiv) {
      return
    }
    let x = 0
    let y = 0
    let element: HTMLElement | null = blocklyArea
    while (element) {
      x += blocklyArea.offsetLeft
      y += blocklyArea.offsetTop
      element = element.offsetParent as HTMLElement
    }
    // Position blocklyDiv over blocklyArea.
    blocklyDiv.style.left = x + 'px'
    blocklyDiv.style.top = y + 'px'
    blocklyDiv.style.width = 1025 + 'px'
    blocklyDiv.style.height = blocklyArea.offsetHeight - BOTTOM_TOOLBAR_HEIGHT + 'px'
    Blockly.svgResize(workspaceReference as WorkspaceSvg)
  }
  testGen = () => {
    const code = (Blockly as any).JavaScript.workspaceToCode(this.state.workspaceReference!)
    window.alert(code)
    console.log(code)
  }
  render() {
    return (
      <div className={'BlocklyBuilder open'}>
        <div>
      <Button onClick={this.testGen/* this.props.onGenerateCodeFromBlockly */}>Generate Code</Button>
        </div>
        <div id="blocklyArea" />
        <div id="blocklyDiv" />
      </div>
    )
  }
}
