import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'

import { Category } from '@@models/category.models'

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private http = inject(HttpClient)

  categories() {
    return this.http.get<Category[]>('products/categories')
  }
}
