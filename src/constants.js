export const ModuleType = 'string'
export const ProcedureType = 'string'

export const MAX_APP = 5

export const AppState = {
  UNREGISTER: 'unregister',
  UNLOAD: 'unload',
  BACKEND: 'backend',
  FRONTEND: 'frontend',
}

export const OsHandler = {
  REGISTER: 'register',
  LOAD: 'load',
  OPEN: 'open',
  SUSPEND: 'suspend',
  KILL: 'kill',
}

export const AppPriority = {
  FORERVER: 'forever',
  TEMPORARY: 'temporary',
}
