import { BlockSvg } from "blockly";

const blocks = require('./DCLBasicBlocks.json')
const toolbox = require('./DCL_Basic_Toolbox.xml')

export function setupBlockly(Blockly: any) {
  Blockly.defineBlocksWithJsonArray(blocks)

  Blockly.JavaScript['vector3'] = function(block: any) {
    var value_x = Blockly.JavaScript.valueToCode(block, 'x', Blockly.JavaScript.ORDER_ATOMIC)
    var value_y = Blockly.JavaScript.valueToCode(block, 'y', Blockly.JavaScript.ORDER_ATOMIC)
    var value_z = Blockly.JavaScript.valueToCode(block, 'z', Blockly.JavaScript.ORDER_ATOMIC)
    var code = `new Vector3(${value_x}, ${value_y}, ${value_z})`
    return [code, Blockly.JavaScript.ORDER_ATOMIC]
  }

  Blockly.JavaScript['transformcomponent'] = Blockly.JavaScript['transform_component'] = function(block: any) {
    var value_position = Blockly.JavaScript.valueToCode(block, 'Position', Blockly.JavaScript.ORDER_ATOMIC)
    var value_rotation = Blockly.JavaScript.valueToCode(block, 'Rotation', Blockly.JavaScript.ORDER_ATOMIC)
    var value_scale = Blockly.JavaScript.valueToCode(block, 'Scale', Blockly.JavaScript.ORDER_ATOMIC)
    if (!value_scale.startsWith('new')) {
      value_scale = `new Vector({ x: ${value_scale}, y: ${value_scale}, z: ${value_scale} })`
    }
    var code = `new Transform({position: ${value_position}, rotation: ${value_rotation}, scale: ${value_scale}})`
    return code
  }

  Blockly.JavaScript['gltfshape'] = function(block: any) {
    var value_src = Blockly.JavaScript.valueToCode(block, 'src', Blockly.JavaScript.ORDER_ATOMIC)
    return `new GLTFShape('${value_src}')`
  }

  Blockly.JavaScript['cube_shape'] = function() {
    return `new BoxShape()`
  }

  Blockly.JavaScript['component_array'] = function(block: any) {
    const childs = block.childBlocks_
    const length = childs.length
    var elements: any[] = []
    for (var i = 0; i < length; i++) {
      let target = childs[i]
      while (target) {
        elements.push(Blockly.JavaScript.blockToCode(target, Blockly.JavaScript.ORDER_COMMA))
        if (target.nextConnection) {
          target = (target as BlockSvg).nextConnection.targetBlock()
        } else {
          target = null
        }
      }
    }
    var code = `[${elements.join(', ')}]`
    return [code, Blockly.JavaScript.ORDER_ATOMIC]
  }

  Blockly.JavaScript['entity'] = function(block: any) {
    var spawnEntityWithComponents = Blockly.JavaScript.provideFunction_('spawnEntityWithComponents', [
      'function ' + Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_ + '(entityId, components) {',
      '  var entity = new Entity(entityId);',
      '  engine.addEntity(entity);',
      '  components.forEach(function(component) { entity.addComponent(component); });',
      '  return entity;',
      '}'
    ])
    var value_components = Blockly.JavaScript.valueToCode(block, 'Components', Blockly.JavaScript.ORDER_ATOMIC)
    var id = Blockly.JavaScript.variableDB_.getDistinctName('entity', Blockly.Variables.NAME_TYPE)
    var code = spawnEntityWithComponents + `('${id}', ${value_components})`
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL]
  }

  return toolbox
}

export default setupBlockly
