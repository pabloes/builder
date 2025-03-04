import {
  SetGizmoAction,
  TogglePreviewAction,
  ToggleSidebarAction,
  SET_GIZMO,
  TOGGLE_PREVIEW,
  TOGGLE_SIDEBAR,
  SetSelectedEntitiesAction,
  SET_SELECTED_ENTITIES,
  SET_EDITOR_READY,
  CLOSE_EDITOR,
  SetEditorReadyAction,
  CloseEditorAction,
  ToggleSnapToGridAction,
  TOGGLE_SNAP_TO_GRID,
  SetEntitiesOutOfBoundariesAction,
  SET_ENTITIES_OUT_OF_BOUNDARIES,
  SetExportProgressAction,
  SET_EXPORT_PROGRESS,
  SET_EDITOR_LOADING,
  SetEditorLoadingAction,
  SetScreenshotReadyAction,
  SET_SCREENSHOT_READY,
  SetEditorReadOnlyAction,
  SET_EDITOR_READ_ONLY,
  TOGGLE_MULTISELECTION,
  ToggleMultiselectionAction
} from './actions'
import { LOAD_ASSET_PACKS_SUCCESS, LoadAssetPacksSuccessAction } from 'modules/assetPack/actions'
import { DELETE_ITEM, DeleteItemAction } from 'modules/scene/actions'
import {
  EXPORT_PROJECT_SUCCESS,
  EXPORT_PROJECT_REQUEST,
  ExportProjectRequestAction,
  ExportProjectSuccessAction
} from 'modules/project/actions'
import { Gizmo } from './types'

export type EditorState = {
  gizmo: Gizmo
  preview: boolean
  sidebar: boolean
  snapToGrid: boolean
  multiselectionEnabled: boolean
  selectedEntityIds: string[]
  entitiesOutOfBoundaries: string[]
  isReady: boolean // editor is ready to be interacted with via API
  isLoading: boolean // models are done loading
  isScreenshotReady: boolean
  isReadOnly: boolean
  hasLoadedAssetPacks: boolean
  export: {
    isLoading: boolean
    progress: number
    total: number
  }
}

const INITIAL_STATE: EditorState = {
  gizmo: Gizmo.NONE,
  preview: false,
  sidebar: true,
  snapToGrid: true,
  multiselectionEnabled: false,
  selectedEntityIds: [],
  entitiesOutOfBoundaries: [],
  isReady: false,
  isLoading: false,
  isScreenshotReady: false,
  isReadOnly: false,
  hasLoadedAssetPacks: false,
  export: {
    isLoading: false,
    progress: 0,
    total: 0
  }
}

export type EditorReducerAction =
  | SetGizmoAction
  | SetScreenshotReadyAction
  | TogglePreviewAction
  | ToggleSidebarAction
  | SetSelectedEntitiesAction
  | SetEditorReadyAction
  | CloseEditorAction
  | ToggleSnapToGridAction
  | SetEntitiesOutOfBoundariesAction
  | DeleteItemAction
  | SetExportProgressAction
  | SetEditorLoadingAction
  | SetEditorReadOnlyAction
  | ExportProjectRequestAction
  | ExportProjectSuccessAction
  | LoadAssetPacksSuccessAction
  | ToggleMultiselectionAction

export const editorReducer = (state = INITIAL_STATE, action: EditorReducerAction): EditorState => {
  switch (action.type) {
    case SET_GIZMO: {
      const { gizmo } = action.payload
      return {
        ...state,
        gizmo
      }
    }
    case TOGGLE_PREVIEW: {
      const { isEnabled: enabled } = action.payload
      return {
        ...state,
        preview: enabled
      }
    }
    case TOGGLE_SIDEBAR: {
      const { isEnabled: enabled } = action.payload
      return {
        ...state,
        sidebar: enabled
      }
    }
    case SET_SELECTED_ENTITIES: {
      return {
        ...state,
        selectedEntityIds: action.payload.entityIds ? action.payload.entityIds : []
      }
    }
    case SET_EDITOR_READY: {
      const { isReady } = action.payload
      return {
        ...state,
        isLoading: isReady,
        isReady
      }
    }
    case CLOSE_EDITOR: {
      return {
        ...INITIAL_STATE
      }
    }
    case TOGGLE_SNAP_TO_GRID: {
      return {
        ...state,
        snapToGrid: action.payload.enabled
      }
    }
    case SET_ENTITIES_OUT_OF_BOUNDARIES: {
      return {
        ...state,
        entitiesOutOfBoundaries: action.payload.entities
      }
    }
    case DELETE_ITEM: {
      return {
        ...state,
        entitiesOutOfBoundaries: state.entitiesOutOfBoundaries.filter(entityId => !state.selectedEntityIds.includes(entityId))
      }
    }
    case EXPORT_PROJECT_REQUEST: {
      return {
        ...state,
        export: {
          ...state.export,
          isLoading: true
        }
      }
    }
    case SET_EXPORT_PROGRESS: {
      const { loaded, total } = action.payload
      return {
        ...state,
        export: {
          ...state.export,
          ...action.payload,
          progress: loaded,
          total
        }
      }
    }
    case EXPORT_PROJECT_SUCCESS: {
      return {
        ...state,
        export: {
          ...state.export,
          isLoading: false,
          progress: 0,
          total: 0
        }
      }
    }
    case SET_EDITOR_LOADING: {
      return {
        ...state,
        isLoading: action.payload.isLoading
      }
    }
    case SET_EDITOR_READ_ONLY: {
      return {
        ...state,
        isReadOnly: action.payload.isReadOnly
      }
    }
    case SET_SCREENSHOT_READY: {
      return {
        ...state,
        isScreenshotReady: action.payload.isScreenshotReady
      }
    }
    case LOAD_ASSET_PACKS_SUCCESS: {
      return {
        ...state,
        hasLoadedAssetPacks: true
      }
    }
    case TOGGLE_MULTISELECTION: {
      return {
        ...state,
        multiselectionEnabled: action.payload.enabled
      }
    }
    default:
      return state
  }
}
