import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'

import { ParamsProducts, DataProducts } from '@@models/product.models'

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient)

  products(params: ParamsProducts) {
    const { limit = 15, skip = 0 } = params
    return this.http.get<DataProducts>(`products?limit=${limit}&skip=${skip}`)
  }

  productsBySearch(params: ParamsProducts) {
    const { limit, skip, category } = params
    return this.http.get<DataProducts>(`products/category/${category}?limit=${limit}&skip=${skip}`)
  }

  productsByCategory(params: ParamsProducts) {
    const { limit, skip, category } = params
    return this.http.get<DataProducts>(`products/category/${category}?limit=${limit}&skip=${skip}`)
  }

  searchByProducts(params: ParamsProducts) {
    const { limit, skip, search } = params
    return this.http.get<DataProducts>(`products/search?q=${search}&limit=${limit}&skip=${skip}`)
  }
}
