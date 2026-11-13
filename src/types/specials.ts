import type { CurrencyCode, DietaryInfo, MenuCategoryId, MenuDietaryTag } from '@/types/menu'

/** A calendar date in the restaurant's time zone (Asia/Kathmandu), "YYYY-MM-DD". */
export type RestaurantDate = string

/**
 * A daily special. It points at an existing menu item, so the dish is never
 * duplicated; the optional fields override the menu item for the special
 * (a longer description, a special-day price).
 */
export type DailySpecial = {
  id: string
  /** `MenuItem.id` of the dish being featured. */
  menuItemId: string
  name?: string
  description?: string
  price?: number
  currency: CurrencyCode
  chefsChoice?: boolean
  isNew?: boolean
  /**
   * Restaurant-local dates the special is served. Leave it out for an
   * unscheduled (sample) special: it is shown under a neutral label and
   * never as "Available today only".
   */
  availableOn?: RestaurantDate[]
  /** Inactive specials are ignored everywhere. */
  active: boolean
  /** Ascending display order in the popup. */
  order: number
}

/** A special joined with its menu item: everything the popup renders. Serialisable. */
export type ResolvedSpecial = {
  id: string
  menuItemId: string
  name: string
  description: string
  price: number
  currency: CurrencyCode
  category: MenuCategoryId
  dietary: DietaryInfo
  chefsChoice: boolean
  isNew: boolean
  availableOn: RestaurantDate[] | null
  order: number
  dietaryTags?: MenuDietaryTag[]
}

export type TodaysSpecials = {
  specials: ResolvedSpecial[]
  /** True only when every special shown is scheduled for today's date. */
  verified: boolean
}
