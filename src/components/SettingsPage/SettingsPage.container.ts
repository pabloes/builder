import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { getAddress, getMana } from 'decentraland-dapps/dist/modules/wallet/selectors'

import { RootState } from 'modules/common/types'
import { isLoggedIn, isLoggingIn } from 'modules/identity/selectors'
import { getAuthorizations } from 'modules/land/selectors'
import { setUpdateManagerRequest } from 'modules/land/actions'
import { MapStateProps, MapDispatchProps, MapDispatch } from './SettingsPage.types'
import SettingsPage from './SettingsPage'

const mapState = (state: RootState): MapStateProps => ({
  address: getAddress(state),
  mana: getMana(state),
  isLoggedIn: isLoggedIn(state),
  isLoggingIn: isLoggingIn(state),
  authorizations: getAuthorizations(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onNavigate: path => dispatch(push(path)),
  onSetUpdateManager: (address, type, isApproved) => dispatch(setUpdateManagerRequest(address, type, isApproved))
})

export default connect(mapState, mapDispatch)(SettingsPage)
