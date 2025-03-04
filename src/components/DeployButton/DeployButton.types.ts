import { Dispatch } from 'redux'
import { openModal, OpenModalAction } from 'modules/modal/actions'
import { DeploymentStatus } from 'modules/deployment/types'
import { SceneMetrics } from 'modules/scene/types'
import { Project } from 'modules/project/types'

export type Props = {
  project: Project
  metrics: SceneMetrics
  limits: SceneMetrics
  isLoading: boolean
  areEntitiesOutOfBoundaries: boolean
  deploymentStatus: DeploymentStatus
  onOpenModal: typeof openModal
  onClick: () => void
}

export type DefaultProps = Pick<Props, 'onClick'>

export type MapStateProps = Pick<Props, 'project' | 'deploymentStatus' | 'metrics' | 'limits' | 'isLoading' | 'areEntitiesOutOfBoundaries'>

export type MapDispatchProps = Pick<Props, 'onOpenModal'>

export type MapDispatch = Dispatch<OpenModalAction>
