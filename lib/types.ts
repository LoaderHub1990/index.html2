export interface Product {
  id: string
  name: string
  description: string
  price: number
  categoryId: string
  image: string
  deliveryType: 'auto' | 'manual'
  keys: string[]
  stock: number
  totalSold: number
  createdAt: string
  active: boolean
}

export interface Category {
  id: string
  name: string
  description: string
  createdAt: string
}

export interface Order {
  id: string
  productId: string
  productName: string
  productImage: string
  buyerAlias: string
  price: number
  status: 'pending' | 'completed' | 'cancelled'
  deliveredKey?: string
  note?: string
  createdAt: string
}

export interface Review {
  id: string
  productId: string
  productName: string
  author: string
  rating: number
  comment: string
  visible: boolean
  createdAt: string
}

export interface Settings {
  shopName: string
  shopDescription: string
  shopLogo: string
  discordUrl: string
  announcement: string
}
