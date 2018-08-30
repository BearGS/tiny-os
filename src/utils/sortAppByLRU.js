import { AppPriority } from '../constants'

export default function sortAppByLRU (a, b) {
  if (a.priority === AppPriority.FORERVER) {
    return -1
  } else if (b.priority === AppPriority.FORERVER) {
    return 1
  }

  if (a.loadTime > b.loadTime) {
    return -1
  }

  return 1
}
