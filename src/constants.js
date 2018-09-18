export const MethodType = 'string'
export const ServiceType = 'string'

export const MAX_APP = 5
export const EXPIRED_TIME = 5 * 1000

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

export const Role = {
  OS: 'OS',
  APP: 'APP',
  MODULE: 'MODULE',
  WORKER: 'WORKER',
}

export const INVOKE_TIMEOUT = 10000 // 系统间invoke超时时间
