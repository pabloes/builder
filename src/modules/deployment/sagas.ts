import { DeploymentWithMetadataContentAndPointers } from 'dcl-catalyst-client'
import { CatalystClient } from 'dcl-catalyst-client'
import { utils } from 'decentraland-commons'
import { Omit } from 'decentraland-dapps/dist/lib/types'
import { takeLatest, put, select, call, take } from 'redux-saga/effects'
import { getData as getDeployments } from 'modules/deployment/selectors'
import { getCurrentProject, getData as getProjects } from 'modules/project/selectors'
import { Deployment, SceneDefinition, Placement } from 'modules/deployment/types'
import { Project } from 'modules/project/types'
import {
  DEPLOY_TO_POOL_REQUEST,
  deployToPoolFailure,
  deployToPoolSuccess,
  setProgress,
  DEPLOY_TO_LAND_REQUEST,
  deployToLandFailure,
  DeployToLandRequestAction,
  DeployToPoolRequestAction,
  deployToLandSuccess,
  CLEAR_DEPLOYMENT_REQUEST,
  ClearDeploymentRequestAction,
  clearDeploymentFailure,
  clearDeploymentSuccess,
  FETCH_DEPLOYMENTS_REQUEST,
  FetchDeploymentsRequestAction,
  fetchDeploymentsRequest,
  fetchDeploymentsSuccess,
  fetchDeploymentsFailure
} from './actions'
import { store } from 'modules/common/store'
import { Media } from 'modules/media/types'
import { getMedia } from 'modules/media/selectors'
import { createFiles, EXPORT_PATH } from 'modules/project/export'
import { recordMediaRequest, RECORD_MEDIA_SUCCESS, RecordMediaSuccessAction } from 'modules/media/actions'
import { ProgressStage } from './types'
import { takeScreenshot } from 'modules/editor/actions'
import { objectURLToBlob } from 'modules/media/utils'
import { getSceneByProjectId } from 'modules/scene/utils'
import { PEER_URL } from 'lib/api/peer'
import { builder, getPreviewUrl } from 'lib/api/builder'
import { buildDeployData, deploy, ContentFile, makeContentFile } from './contentUtils'
import { getIdentity } from 'modules/identity/utils'
import { isLoggedIn } from 'modules/identity/selectors'
import { getAddress } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { getName } from 'modules/profile/selectors'
import { getEmptyDeployment } from './utils'
import { FETCH_LANDS_SUCCESS, FetchLandsSuccessAction } from 'modules/land/actions'
import { LandType } from 'modules/land/types'
import { coordsToId, idToCoords } from 'modules/land/utils'
import { getCoordsByEstateId } from 'modules/land/selectors'

const blacklist = ['.dclignore', 'Dockerfile', 'builder.json', 'src/game.ts']

const handleProgress = (type: ProgressStage) => (args: { loaded: number; total: number }) => {
  const { loaded, total } = args
  const progress = ((loaded / total) * 100) | 0
  store.dispatch(setProgress(type, progress))
}

export function* deploymentSaga() {
  yield takeLatest(DEPLOY_TO_POOL_REQUEST, handleDeployToPoolRequest)
  yield takeLatest(DEPLOY_TO_LAND_REQUEST, handleDeployToLandRequest)
  yield takeLatest(CLEAR_DEPLOYMENT_REQUEST, handleClearDeploymentRequest)
  yield takeLatest(FETCH_DEPLOYMENTS_REQUEST, handleFetchDeploymentsRequest)
  yield takeLatest(FETCH_LANDS_SUCCESS, handleFetchLandsSuccess)
}

function* handleDeployToPoolRequest(action: DeployToPoolRequestAction) {
  const { projectId, additionalInfo } = action.payload
  const rawProject: Project | null = yield select(getCurrentProject)

  if (rawProject && rawProject.id === projectId) {
    const project: Omit<Project, 'thumbnail'> = utils.omit(rawProject, ['thumbnail'])

    try {
      yield put(setProgress(ProgressStage.NONE, 1))
      yield put(recordMediaRequest())
      const successAction: RecordMediaSuccessAction = yield take(RECORD_MEDIA_SUCCESS)
      const { north, east, south, west, preview } = successAction.payload.media

      if (!north || !east || !south || !west || !preview) {
        throw new Error('Failed to capture scene preview')
      }

      yield put(setProgress(ProgressStage.NONE, 30))
      yield call(() => builder.uploadMedia(rawProject.id, preview, { north, east, south, west }))

      yield put(setProgress(ProgressStage.NONE, 60))
      yield put(takeScreenshot())

      yield put(setProgress(ProgressStage.NONE, 90))
      yield call(() => builder.deployToPool(project.id, additionalInfo))

      yield put(setProgress(ProgressStage.NONE, 100))
      yield put(deployToPoolSuccess(window.URL.createObjectURL(preview)))
    } catch (e) {
      yield put(deployToPoolFailure(e.message))
    }
  } else if (rawProject) {
    yield put(deployToPoolFailure('Unable to Publish: Not current project'))
  } else {
    yield put(deployToPoolFailure('Unable to Publish: Invalid project'))
  }
}

function* handleDeployToLandRequest(action: DeployToLandRequestAction) {
  const { placement, projectId, overrideDeploymentId } = action.payload

  const projects: ReturnType<typeof getProjects> = yield select(getProjects)
  const project = projects[projectId]
  if (!project) {
    yield put(deployToLandFailure('Unable to Publish: Invalid project'))
    return
  }

  const scene = yield getSceneByProjectId(project.id)
  if (!scene) {
    yield put(deployToLandFailure('Unable to Publish: Invalid scene'))
    return
  }

  const identity = yield getIdentity()
  if (!identity) {
    yield put(deployToLandFailure('Unable to Publish: Invalid identity'))
    return
  }

  const author = yield select(getName)

  // upload media if logged in
  let previewUrl: string | null = null
  if (yield select(isLoggedIn)) {
    const media: Media | null = yield select(getMedia)
    if (media) {
      const north: Blob = yield call(() => objectURLToBlob(media.north))
      const east: Blob = yield call(() => objectURLToBlob(media.east))
      const south: Blob = yield call(() => objectURLToBlob(media.south))
      const west: Blob = yield call(() => objectURLToBlob(media.west))
      const thumbnail: Blob = yield call(() => objectURLToBlob(media.preview))

      yield call(() =>
        builder.uploadMedia(project.id, thumbnail, { north, east, south, west }, handleProgress(ProgressStage.UPLOAD_RECORDING))
      )

      previewUrl = getPreviewUrl(project.id)
    } else {
      console.warn('Failed to upload scene preview')
    }
  }

  try {
    const files = yield call(() =>
      createFiles({
        project,
        scene,
        point: placement.point,
        rotation: placement.rotation,
        author,
        thumbnail: previewUrl,
        isDeploy: true,
        onProgress: handleProgress(ProgressStage.CREATE_FILES)
      })
    )
    const contentFiles: ContentFile[] = yield getContentServiceFiles(files)
    const sceneDefinition: SceneDefinition = JSON.parse(files[EXPORT_PATH.SCENE_FILE])
    const [data] = yield call(() => buildDeployData(identity, [...sceneDefinition.scene.parcels], sceneDefinition, contentFiles))
    yield call(() => deploy(PEER_URL, data))
    // generate new deployment
    const deployment: Deployment = {
      id: data.entityId,
      placement,
      owner: yield select(getAddress) || '',
      timestamp: +new Date(),
      layout: project.layout,
      name: project.title,
      thumbnail: previewUrl,
      projectId: project.id,
      base: sceneDefinition.scene.base,
      parcels: sceneDefinition.scene.parcels
    }

    // notify success
    yield put(deployToLandSuccess(deployment, overrideDeploymentId))
  } catch (e) {
    yield put(deployToLandFailure(e.message.split('\n')[0]))
  }
}

function* handleClearDeploymentRequest(action: ClearDeploymentRequestAction) {
  const { deploymentId } = action.payload

  const deployments: ReturnType<typeof getDeployments> = yield select(getDeployments)
  const deployment = deployments[deploymentId]
  if (!deployment) {
    yield put(deployToLandFailure('Unable to Publish: Invalid deployment'))
    return
  }
  if (!deployment.projectId) {
    yield put(deployToLandFailure('Unable to Publish: Invalid deployment.projectId'))
    return
  }

  const projects: ReturnType<typeof getProjects> = yield select(getProjects)
  const project = projects[deployment.projectId]
  if (!project) {
    yield put(deployToLandFailure('Unable to Publish: Invalid project'))
    return
  }

  const scene = yield getSceneByProjectId(project.id)
  if (!scene) {
    yield put(deployToLandFailure('Unable to Publish: Invalid scene'))
    return
  }

  const identity = yield getIdentity()
  if (!identity) {
    yield put(deployToLandFailure('Unable to Publish: Invalid identity'))
    return
  }

  try {
    const { placement } = deployment
    const [emptyProject, emptyScene] = getEmptyDeployment(project.id)
    const files = yield call(() =>
      createFiles({
        project: emptyProject,
        scene: emptyScene,
        point: placement.point,
        rotation: placement.rotation,
        thumbnail: null,
        author: null,
        isDeploy: true,
        isEmpty: true,
        onProgress: handleProgress(ProgressStage.CREATE_FILES)
      })
    )
    const contentFiles: ContentFile[] = yield getContentServiceFiles(files)
    const sceneDefinition = JSON.parse(files[EXPORT_PATH.SCENE_FILE])
    console.log(sceneDefinition)
    const [data] = yield call(() => buildDeployData(identity, [...sceneDefinition.scene.parcels], sceneDefinition, contentFiles))
    yield call(() => deploy(PEER_URL, data))
    yield put(clearDeploymentSuccess(deploymentId))
  } catch (error) {
    yield put(clearDeploymentFailure(deploymentId, error.message))
  }
}

function* getContentServiceFiles(files: Record<string, string | Blob>) {
  let contentFiles: ContentFile[] = []

  for (const fileName of Object.keys(files)) {
    if (blacklist.includes(fileName)) continue
    let file: ContentFile
    file = yield call(() => makeContentFile(fileName, files[fileName]))
    contentFiles.push(file)
  }

  return contentFiles
}

function* handleFetchLandsSuccess(action: FetchLandsSuccessAction) {
  const coords: string[] = []
  for (const land of action.payload.lands) {
    switch (land.type) {
      case LandType.PARCEL: {
        coords.push(coordsToId(land.x!, land.y!))
        break
      }
      case LandType.ESTATE: {
        const coordsByEstateId = yield select(getCoordsByEstateId)
        if (land.id in coordsByEstateId) {
          for (const coord of coordsByEstateId[land.id]) {
            coords.push(coord)
          }
        }
      }
    }
  }
  yield put(fetchDeploymentsRequest(coords))
}

function* handleFetchDeploymentsRequest(action: FetchDeploymentsRequestAction) {
  const { coords } = action.payload

  try {
    const catalyst = new CatalystClient(PEER_URL, 'builder')

    const entities: DeploymentWithMetadataContentAndPointers[] = yield call(() =>
      catalyst.fetchAllDeployments({ pointers: coords, onlyCurrentlyPointed: true })
    )
    const deployments = new Map<string, Deployment>()
    for (const entity of entities
      .filter(entity => entity.entityType === 'scene')
      .sort((a, b) => (a.entityTimestamp > b.entityTimestamp ? 1 : -1))) {
      const id = entity.pointers[0]
      if (id) {
        const [x, y] = idToCoords(id)
        const definition = entity.metadata as SceneDefinition
        const name = (definition && definition.display && definition.display.title) || 'Unknown'
        const thumbnail: string | null = (definition && definition.display && definition.display.navmapThumbnail) || null
        const placement: Placement = {
          point: { x, y },
          rotation: (definition && definition.source && definition.source.rotation) || 'north'
        }
        const owner = entity.deployedBy
        const projectId = (definition && definition.source && definition.source.projectId) || null
        const layout = (definition && definition.source && definition.source.layout) || null
        const { base, parcels } = definition.scene
        const isEmpty = !!(definition && definition.source && definition.source.isEmpty)
        if (!isEmpty) {
          deployments.set(id, {
            id: entity.entityId,
            timestamp: entity.entityTimestamp,
            projectId,
            name,
            thumbnail,
            placement,
            owner,
            layout,
            base,
            parcels
          })
        } else {
          deployments.delete(id)
        }
      }
    }
    yield put(fetchDeploymentsSuccess(coords, Array.from(deployments.values())))
  } catch (error) {
    yield put(fetchDeploymentsFailure(coords, error.message))
  }
}
