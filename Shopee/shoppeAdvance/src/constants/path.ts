const path = {
  home: '/',
  login: '/login',
  register: '/register',
  profile: '/profile',
  logout: '/logout',
  products: '/products',
  categories: '/categories',
  productDetail: ':productId',
  cart: '/cart'
} as const

export default path
