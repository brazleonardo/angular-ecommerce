import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private http = inject(HttpClient)

  categories() {
    return this.http.get<string[]>('products/categories')
  }
}
