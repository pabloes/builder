import { store } from 'modules/common/store'
import { RootState } from 'modules/common/types'
import { getAccessToken } from 'modules/auth/selectors'
import { getData } from 'modules/identity/selectors'
import { Authenticator } from 'dcl-crypto'
import { getAddress } from 'decentraland-dapps/dist/modules/wallet/selectors'

const AUTH_CHAIN_HEADER_PREFIX = 'x-identity-auth-chain-'

export function createHeaders(idToken: string) {
  if (!idToken) return {}
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${idToken}`
  }
  return headers
}

export const authorize = (method: string = 'get', path: string = '') => {
  const headers: Record<string, string> = {}
  const state = store.getState() as RootState
  const address = getAddress(state)
  if (address) {
    const identities = getData(state)
    const identity = identities[address]
    if (identity) {
      const endpoint = (method + ':' + path).toLowerCase()
      const authChain = Authenticator.signPayload(identity, endpoint)
      for (let i = 0; i < authChain.length; i++) {
        headers[AUTH_CHAIN_HEADER_PREFIX + i] = JSON.stringify(authChain[i])
      }
    }
  }
  return headers
}

export const authorizeAuth0 = (accessToken?: string) => {
  const state = store.getState() as RootState
  const headers = createHeaders(accessToken || getAccessToken(state)!)
  return { headers }
}
