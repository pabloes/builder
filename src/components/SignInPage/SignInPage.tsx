import React from 'react'
import Navbar from 'components/Navbar'
import { Page } from 'decentraland-ui'
import Footer from 'components/Footer'
import { default as SignIn } from 'decentraland-dapps/dist/containers/SignInPage'
import { Props } from './SignInPage.types'

export default class SignInPage extends React.PureComponent<Props> {
  render() {
    const { isConnected, onConnect } = this.props
    return (
      <>
        <Navbar isSignIn />
        <Page>
          <SignIn isConnected={isConnected} onConnect={onConnect} />
        </Page>
        <Footer />
      </>
    )
  }
}
