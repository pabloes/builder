import { loadingReducer, LoadingState } from 'decentraland-dapps/dist/modules/loading/reducer'
import { DataByKey } from 'decentraland-dapps/dist/lib/types'

import { DELETE_PROJECT, DeleteProjectAction } from 'modules/project/actions'
import {
  DEPLOY_TO_POOL_SUCCESS,
  DEPLOY_TO_POOL_FAILURE,
  DeployToPoolRequestAction,
  DeployToPoolSuccessAction,
  DeployToPoolFailureAction,
  SetProgressAction,
  SET_PROGRESS,
  DEPLOY_TO_LAND_SUCCESS,
  DeployToLandSuccessAction,
  ClearDeploymentSuccessAction,
  ClearDeploymentFailureAction,
  CLEAR_DEPLOYMENT_SUCCESS,
  CLEAR_DEPLOYMENT_FAILURE,
  DEPLOY_TO_LAND_FAILURE,
  DeployToLandFailureAction,
  DEPLOY_TO_POOL_REQUEST,
  DEPLOY_TO_LAND_REQUEST,
  DeployToLandRequestAction,
  CLEAR_DEPLOYMENT_REQUEST,
  ClearDeploymentRequestAction,
  FetchDeploymentsFailureAction,
  FetchDeploymentsSuccessAction,
  FETCH_DEPLOYMENTS_SUCCESS,
  FETCH_DEPLOYMENTS_REQUEST,
  FetchDeploymentsRequestAction,
  FETCH_DEPLOYMENTS_FAILURE
} from './actions'
import { ProgressStage, Deployment } from './types'

export type DeploymentState = {
  data: DataByKey<Deployment>
  progress: {
    stage: ProgressStage
    value: number
  }
  loading: LoadingState
  error: string | null
}

export const INITIAL_STATE: DeploymentState = {
  data: {},
  progress: {
    stage: ProgressStage.NONE,
    value: 0
  },
  loading: [],
  error: null
}

export type DeploymentReducerAction =
  | DeployToPoolRequestAction
  | DeployToPoolSuccessAction
  | DeployToPoolFailureAction
  | SetProgressAction
  | DeployToLandRequestAction
  | DeployToLandSuccessAction
  | DeployToLandFailureAction
  | ClearDeploymentRequestAction
  | ClearDeploymentSuccessAction
  | ClearDeploymentFailureAction
  | DeleteProjectAction
  | FetchDeploymentsRequestAction
  | FetchDeploymentsSuccessAction
  | FetchDeploymentsFailureAction

export const deploymentReducer = (state = INITIAL_STATE, action: DeploymentReducerAction): DeploymentState => {
  switch (action.type) {
    case DEPLOY_TO_POOL_REQUEST: {
      return {
        ...state,
        error: null,
        loading: loadingReducer(state.loading, action)
      }
    }
    case DEPLOY_TO_POOL_SUCCESS: {
      return {
        ...state,
        data: {
          ...state.data
        },
        progress: {
          stage: ProgressStage.NONE,
          value: 0
        },
        error: null,
        loading: loadingReducer(state.loading, action)
      }
    }
    case DEPLOY_TO_POOL_FAILURE: {
      return {
        ...state,
        data: {
          ...state.data
        },
        progress: {
          stage: ProgressStage.NONE,
          value: 0
        },
        error: action.payload.error,
        loading: loadingReducer(state.loading, action)
      }
    }
    case DEPLOY_TO_LAND_REQUEST: {
      return {
        ...state,
        error: null
      }
    }
    case DEPLOY_TO_LAND_SUCCESS: {
      const { deployment, overrideDeploymentId } = action.payload

      const newData = {
        ...state.data,
        [deployment.id]: deployment
      }

      if (overrideDeploymentId) {
        delete newData[overrideDeploymentId]
      }

      return {
        ...state,
        data: newData,
        progress: {
          stage: ProgressStage.NONE,
          value: 0
        }
      }
    }
    case DEPLOY_TO_LAND_FAILURE: {
      return {
        ...state,
        data: {
          ...state.data
        },
        error: action.payload.error
      }
    }
    case SET_PROGRESS: {
      const { stage, value } = action.payload

      return {
        ...state,
        progress: {
          ...state.progress,
          stage,
          value
        }
      }
    }
    case CLEAR_DEPLOYMENT_REQUEST: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    }
    case CLEAR_DEPLOYMENT_SUCCESS: {
      const { deploymentId } = action.payload
      const newState = {
        ...state,
        data: {
          ...state.data
        },
        progress: {
          stage: ProgressStage.NONE,
          value: 0
        },
        loading: loadingReducer(state.loading, action)
      }
      delete newState.data[deploymentId]
      return newState
    }
    case CLEAR_DEPLOYMENT_FAILURE: {
      return {
        ...state,
        data: {
          ...state.data
        },
        loading: loadingReducer(state.loading, action),
        error: action.payload.error
      }
    }
    case DELETE_PROJECT: {
      const { project } = action.payload
      const newState = {
        ...state,
        data: {
          ...state.data
        },
        progress: {
          stage: ProgressStage.NONE,
          value: 0
        }
      }
      delete newState.data[project.id]
      return newState
    }
    case FETCH_DEPLOYMENTS_REQUEST: {
      return {
        ...state,
        error: null,
        loading: loadingReducer(state.loading, action)
      }
    }
    case FETCH_DEPLOYMENTS_SUCCESS: {
      return {
        ...state,
        data: {
          ...state.data,
          ...action.payload.deployments.reduce<DataByKey<Deployment>>((obj, deployment) => {
            obj[deployment.id] = deployment
            return obj
          }, {})
        }
      }
    }
    case FETCH_DEPLOYMENTS_FAILURE: {
      return {
        ...state,
        error: action.payload.error,
        loading: loadingReducer(state.loading, action)
      }
    }
    default:
      return state
  }
}
