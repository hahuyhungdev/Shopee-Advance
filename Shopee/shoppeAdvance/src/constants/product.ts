// NOTE, howerver is defined SortBy, but us can change value of it. example:
// sortBy.createAt = 'destroy'
// REMEMBER, in Typescript have const(mode public, private, readonly)

type SortByProps = {
  readonly [key in 'createdAt' | 'view' | 'sold' | 'price']: string
}
// us can use type or interface, but ts did support type with as const
// use readonly for sortBy
export const sortBy = {
  createdAt: 'createdAt',
  view: 'view',
  sold: 'sold',
  price: 'price',
  rating: 'rating'
} as const

export const order = {
  asc: 'asc',
  desc: 'desc'
} as const

//
