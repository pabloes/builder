import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import { History } from 'history'
import { translationReducer as translation } from 'decentraland-dapps/dist/modules/translation/reducer'
import { storageReducer as storage, storageReducerWrapper } from 'decentraland-dapps/dist/modules/storage/reducer'
import { transactionReducer as transaction } from 'decentraland-dapps/dist/modules/transaction/reducer'
import { walletReducer as wallet } from 'decentraland-dapps/dist/modules/wallet/reducer'
import { modalReducer as modal } from 'decentraland-dapps/dist/modules/modal/reducer'

import { RootState } from 'modules/common/types'
import { assetPackReducer as assetPack } from 'modules/assetPack/reducer'
import { editorReducer as editor } from 'modules/editor/reducer'
import { assetReducer as asset } from 'modules/asset/reducer'
import { uiReducer as ui } from 'modules/ui/reducer'
import { projectReducer as project } from 'modules/project/reducer'
import { poolGroupReducer as poolGroup } from 'modules/poolGroup/reducer'
import { poolReducer as pool } from 'modules/pool/reducer'
import { profileReducer as profile } from 'modules/profile/reducer'
import { sceneReducer as scene } from 'modules/scene/reducer'
import { deploymentReducer as deployment } from 'modules/deployment/reducer'
import { mediaReducer as media } from 'modules/media/reducer'
import { authReducer as auth } from 'modules/auth/reducer'
import { syncReducer as sync } from 'modules/sync/reducer'
import { identityReducer as identity } from 'modules/identity/reducer'
import { landReducer as land } from 'modules/land/reducer'
import { tileReducer as tile } from 'modules/tile/reducer'

export function createRootReducer(history: History) {
  return storageReducerWrapper(
    combineReducers<RootState>({
      storage,
      auth,
      editor,
      translation,
      transaction,
      wallet,
      modal,
      assetPack,
      asset,
      ui,
      project,
      poolGroup,
      pool,
      profile,
      scene,
      deployment,
      media,
      sync,
      identity,
      land,
      tile,
      router: connectRouter(history)
    })
  )
}
