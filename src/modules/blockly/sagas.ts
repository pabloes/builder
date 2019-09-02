import { takeLatest } from 'redux-saga/effects'
import { PROVISION_SCENE, ProvisionSceneAction } from 'modules/scene/actions'

export function* blocklySaga() {
  yield takeLatest(PROVISION_SCENE, handleSceneProvision)
}

export function handleSceneProvision(action: ProvisionSceneAction) {
  action
}
