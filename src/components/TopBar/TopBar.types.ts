import { Dispatch } from 'redux'

import { Project } from 'modules/project/types'
import { Gizmo } from 'modules/editor/types'
import {
  setGizmo,
  togglePreview,
  toggleSidebar,
  SetGizmoAction,
  TogglePreviewAction,
  ToggleSidebarAction,
  EditorUndoAction,
  toggleBlockly,
  ToggleBlocklyAction
} from 'modules/editor/actions'
import { resetItem, duplicateItem, deleteItem, ResetItemAction, DuplicateItemAction, DeleteItemAction } from 'modules/scene/actions'
import { openModal, OpenModalAction } from 'modules/modal/actions'
import { SceneMetrics } from 'modules/scene/types'

export type Props = {
  gizmo: Gizmo
  metrics: SceneMetrics
  currentProject: Project | null
  selectedEntityId: string | null
  isLoading: boolean
  isPreviewing: boolean
  isSidebarOpen: boolean
  isBlocklyOpen: boolean
  enabledTools: Record<string, boolean>
  onSetGizmo: typeof setGizmo
  onTogglePreview: typeof togglePreview
  onToggleSidebar: typeof toggleSidebar
  onToggleBlockly: typeof toggleBlockly
  onReset: typeof resetItem
  onDuplicate: typeof duplicateItem
  onDelete: typeof deleteItem
  onOpenModal: typeof openModal
}

export type MapStateProps = Pick<
  Props,
  'gizmo' | 'currentProject' | 'metrics' | 'isLoading' | 'isPreviewing' | 'isSidebarOpen' | 'isBlocklyOpen' | 'selectedEntityId' | 'enabledTools'
>

export type MapDispatchProps = Pick<
  Props,
  'onSetGizmo' | 'onTogglePreview' | 'onToggleBlockly' | 'onToggleSidebar' | 'onReset' | 'onDuplicate' | 'onDelete' | 'onOpenModal'
>
export type MapDispatch = Dispatch<
  | SetGizmoAction
  | TogglePreviewAction
  | ToggleSidebarAction
  | ToggleBlocklyAction
  | EditorUndoAction
  | ResetItemAction
  | DuplicateItemAction
  | DeleteItemAction
  | OpenModalAction
>
