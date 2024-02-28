export interface Product {
  id: number
  title: string
  description: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  brand: string
  category: string
  thumbnail: string
  images: string[]
}

export interface DataProducts {
  products: Product[]
  total: number
  skip: number
  limit: number
}

export interface ParamsProducts {
  skip?: number | string
  limit?: number | string
  search?: string
  category?: string
}
