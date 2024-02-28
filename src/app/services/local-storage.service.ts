import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private storage = window.localStorage

  set(key: string, value: unknown) {
    if (this.storage) {
      this.storage.setItem(key, JSON.stringify(value))
    }
  }

  get(key: string) {
    if (this.storage) {
      return this.storage.getItem(key)
    }
    return null
  }

  remove(key: string) {
    if (this.storage) {
      this.storage.removeItem(key)
    }
  }

  clear() {
    if (this.storage) {
      this.storage.clear()
    }
  }
}
