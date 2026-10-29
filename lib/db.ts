import fs from 'fs'
import path from 'path'
import type { Product, Category, Order, Review, Settings } from './types'

const DATA = path.join(process.cwd(), 'data')

function read<T>(file: string, def: T): T {
  try {
    const fp = path.join(DATA, file)
    if (!fs.existsSync(fp)) return def
    return JSON.parse(fs.readFileSync(fp, 'utf-8')) as T
  } catch { return def }
}

function write(file: string, data: unknown) {
  fs.mkdirSync(DATA, { recursive: true })
  fs.writeFileSync(path.join(DATA, file), JSON.stringify(data, null, 2))
}

export const db = {
  products: {
    all: () => read<Product[]>('products.json', []),
    save: (d: Product[]) => write('products.json', d),
  },
  categories: {
    all: () => read<Category[]>('categories.json', []),
    save: (d: Category[]) => write('categories.json', d),
  },
  orders: {
    all: () => read<Order[]>('orders.json', []),
    save: (d: Order[]) => write('orders.json', d),
  },
  reviews: {
    all: () => read<Review[]>('reviews.json', []),
    save: (d: Review[]) => write('reviews.json', d),
  },
  settings: {
    get: (): Settings => read<Settings>('settings.json', {
      shopName: 'MyShop',
      shopDescription: 'สคริปต์คุณภาพ บริการทันใจ',
      shopLogo: '',
      discordUrl: 'https://discord.gg/',
      announcement: '',
    }),
    save: (d: Settings) => write('settings.json', d),
  },
  admin: {
    get: () => read<{ username: string; passwordHash: string } | null>('admin.json', null),
    save: (d: { username: string; passwordHash: string }) => write('admin.json', d),
  },
}
