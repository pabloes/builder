import * as React from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Container, Button } from 'decentraland-ui'

import HomePageBanner from 'components/Banners/HomePageBanner'
import HomePageHero from 'components/HomePageHero'
import ProjectCard from 'components/ProjectCard'
import { Template } from 'modules/template/types'
import Icon from 'components/Icon'

import { Props, State, DefaultProps } from './HomePage.types'
import './HomePage.css'

export default class HomePage extends React.PureComponent<Props, State> {
  static defaultProps: DefaultProps = {
    projects: {}
  }

  state = {
    isAnimationPlaying: false
  }

  handleTemplateClick = (template: Template) => {
    if (template.custom) {
      this.props.onOpenModal('CustomLayoutModal')
    } else {
      this.props.onCreateProject(template)
    }
  }

  handleStart = () => {
    this.setState({ isAnimationPlaying: true })
    document.getElementById('template-cards')!.scrollIntoView()
    setTimeout(() => {
      this.setState({ isAnimationPlaying: false })
    }, 2000)
  }

  handleWatchVideo = () => {
    this.props.onOpenModal('VideoModal')
  }

  handleOpenImportModal = () => {
    this.props.onOpenModal('ImportModal')
  }

  renderImportButton = () => {
    return (
      <Button basic className="import-scene" onClick={this.handleOpenImportModal}>
        <Icon name="import" />
        {t('home_page.import_scene')}
      </Button>
    )
  }

  render() {
    const projects = Object.values(this.props.projects)

    return (
      <>
        {!projects.length ? (
          <HomePageHero onWatchVideo={this.handleWatchVideo} onStart={this.handleStart} />
        ) : (
          <div className="home-page-divider" />
        )}
        <HomePageBanner className="home-page-banner" />
        <Container>
          <div className="HomePage">
            {projects.length > 0 && (
              <div className="project-cards">
                <div className="subtitle">
                  {t('home_page.projects_title')}
                  {this.renderImportButton()}
                </div>
                <div className="CardList">
                  {projects
                    .sort(project => -project.createdAt)
                    .map((project, index) => (
                      <ProjectCard key={index} project={project} />
                    ))}
                </div>
              </div>
            )}
          </div>
        </Container>
      </>
    )
  }
}
