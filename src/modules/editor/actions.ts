import { action } from 'typesafe-actions'

import { Scene } from 'modules/scene/types'
import { Asset } from 'modules/asset/types'
import { Project } from 'modules/project/types'
import { Gizmo, OpenEditorOptions } from './types'

// Bind keyboard shortcuts

export const BIND_EDITOR_KEYBOARD_SHORTCUTS = 'Bind editor keyboard shortcuts'

export const bindEditorKeyboardShortcuts = () => action(BIND_EDITOR_KEYBOARD_SHORTCUTS, {})

export type BindEditorKeybardShortcutsAction = ReturnType<typeof bindEditorKeyboardShortcuts>

// Unbind keyboard shortcuts

export const UNBIND_EDITOR_KEYBOARD_SHORTCUTS = 'Unbind editor keyboard shortcuts'

export const unbindEditorKeyboardShortcuts = () => action(UNBIND_EDITOR_KEYBOARD_SHORTCUTS, {})

export type UnbindEditorKeybardShortcutsAction = ReturnType<typeof unbindEditorKeyboardShortcuts>

// Open editor

export const OPEN_EDITOR = 'Open editor'

export const openEditor = (options: Partial<OpenEditorOptions> = {}) =>
  action(OPEN_EDITOR, { isReadOnly: false, type: 'project', ...options } as OpenEditorOptions)

export type OpenEditorAction = ReturnType<typeof openEditor>

// Close editor

export const CLOSE_EDITOR = 'Close editor'

export const closeEditor = () => action(CLOSE_EDITOR, {})

export type CloseEditorAction = ReturnType<typeof closeEditor>

// Update editor

export const UPDATE_EDITOR = 'Update editor'

export const updateEditor = (sceneId: string, scene: Scene, mappings: Record<string, string>) =>
  action(UPDATE_EDITOR, { sceneId, scene, mappings })

export type UpdateEditorAction = ReturnType<typeof updateEditor>

// Set Script URL
export const SET_SCRIPT_URL = 'Set script url'

export const setScriptUrl = (url: string) => action(SET_SCRIPT_URL, { url })

export type SetScriptUrlAction = ReturnType<typeof setScriptUrl>

// Undo/Redo

export const EDITOR_UNDO = 'Editor undo'
export const EDITOR_REDO = 'Editor redo'

export const editorUndo = () => action(EDITOR_UNDO, {})
export const editorRedo = () => action(EDITOR_REDO, {})

export type EditorUndoAction = ReturnType<typeof editorUndo>
export type EditorRedoAction = ReturnType<typeof editorRedo>

// Set Gizmo

export const SET_GIZMO = 'Set gizmo'

export const setGizmo = (gizmo: Gizmo) => action(SET_GIZMO, { gizmo })

export type SetGizmoAction = ReturnType<typeof setGizmo>

// Toggle Play

export const TOGGLE_PREVIEW = 'Toggle preview'

export const togglePreview = (isEnabled: boolean) => action(TOGGLE_PREVIEW, { isEnabled })

export type TogglePreviewAction = ReturnType<typeof togglePreview>

// Toggle Sidebar

export const TOGGLE_SIDEBAR = 'Toggle sidebar'

export const toggleSidebar = (isEnabled: boolean) => action(TOGGLE_SIDEBAR, { isEnabled })

export type ToggleSidebarAction = ReturnType<typeof toggleSidebar>

// Select Entity

export const SET_SELECTED_ENTITIES = 'Set selected entities'

export const setSelectedEntities = (entityIds: string[]) => action(SET_SELECTED_ENTITIES, { entityIds })

export type SetSelectedEntitiesAction = ReturnType<typeof setSelectedEntities>

// Zoom in/out

export const ZOOM_IN = 'Zoom in'

export const zoomIn = () => action(ZOOM_IN, {})

export type ZoomInAction = ReturnType<typeof zoomIn>

export const ZOOM_OUT = 'Zoom out'

export const zoomOut = () => action(ZOOM_OUT, {})

export type ZoomOutAction = ReturnType<typeof zoomOut>

// Reset camera

export const RESET_CAMERA = 'Reset camera'

export const resetCamera = () => action(RESET_CAMERA, {})

export type ResetCameraAction = ReturnType<typeof resetCamera>

// Set editor ready

export const SET_EDITOR_READY = 'Set editor ready'

export const setEditorReady = (isReady: boolean) => action(SET_EDITOR_READY, { isReady })

export type SetEditorReadyAction = ReturnType<typeof setEditorReady>

// Set editor loading (loading 3D entities)

export const SET_EDITOR_LOADING = 'Set editor loading'

export const setEditorLoading = (isLoading: boolean) => action(SET_EDITOR_LOADING, { isLoading })

export type SetEditorLoadingAction = ReturnType<typeof setEditorLoading>

// Set editor read only

export const SET_EDITOR_READ_ONLY = 'Set editor read only'

export const setEditorReadOnly = (isReadOnly: boolean) => action(SET_EDITOR_READ_ONLY, { isReadOnly })

export type SetEditorReadOnlyAction = ReturnType<typeof setEditorReadOnly>

// Screenshot

export const TAKE_SCREENSHOT = 'Take screenshot'

export const takeScreenshot = () => action(TAKE_SCREENSHOT, {})

export type TakeScreenshotAction = ReturnType<typeof takeScreenshot>

export const SET_SCREENSHOT_READY = 'Set screenshot ready'

export const setScreenshotReady = (isScreenshotReady: boolean) => action(SET_SCREENSHOT_READY, { isScreenshotReady })

export type SetScreenshotReadyAction = ReturnType<typeof setScreenshotReady>

// Toggle snap to grid

export const TOGGLE_SNAP_TO_GRID = 'Toggle snap to grid'

export const toggleSnapToGrid = (enabled: boolean) => action(TOGGLE_SNAP_TO_GRID, { enabled })

export type ToggleSnapToGridAction = ReturnType<typeof toggleSnapToGrid>

// Create update the editor scene from a project

export const CREATE_EDITOR_SCENE = 'Create editor scene'

export const createEditorScene = (project: Project) => action(CREATE_EDITOR_SCENE, { project })

export type CreateEditorSceneAction = ReturnType<typeof createEditorScene>

// Close editor

export const PREFETCH_ASSET = 'Prefetch Asset'

export const prefetchAsset = (asset: Asset) => action(PREFETCH_ASSET, { asset })

export type PrefetchAssetAction = ReturnType<typeof prefetchAsset>

// Set entities out of bounds

export const SET_ENTITIES_OUT_OF_BOUNDARIES = 'Set entities out of boundaries'

export const setEntitiesOutOfBoundaries = (entities: string[]) => action(SET_ENTITIES_OUT_OF_BOUNDARIES, { entities })

export type SetEntitiesOutOfBoundariesAction = ReturnType<typeof setEntitiesOutOfBoundaries>

// Set export loading

export const SET_EXPORT_PROGRESS = 'Set export progress'

export const setExportProgress = (args: { loaded: number; total: number }) => action(SET_EXPORT_PROGRESS, args)

export type SetExportProgressAction = ReturnType<typeof setExportProgress>

// Toggle snap to grid

export const TOGGLE_MULTISELECTION = 'Toggle multiselection'

export const toggleMultiselection = (enabled: boolean) => action(TOGGLE_MULTISELECTION, { enabled })

export type ToggleMultiselectionAction = ReturnType<typeof toggleMultiselection>
