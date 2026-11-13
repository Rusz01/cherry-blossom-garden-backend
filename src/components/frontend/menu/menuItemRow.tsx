import type { CSSProperties } from 'react'

import { formatPrice, isPopular } from '@/lib/frontend/menu'
import type { MenuItem } from '@/types/menu'
import MenuBadge, { type MenuBadgeKind } from './menuBadge'

/** Badge order: highlight first, then dietary, then the gluten note. */
function badgesFor(item: MenuItem): MenuBadgeKind[] {
  const d = item.dietary
  const kinds: MenuBadgeKind[] = []

  if (item.signature) kinds.push('signature')
  if (isPopular(item)) kinds.push('popular')
  if (d.vegan) kinds.push('vegan')
  else if (d.vegetarian) kinds.push('vegetarian')
  if (d.glutenFree) kinds.push('gluten-free')
  if (d.spicy) kinds.push('spicy')
  if (d.containsGluten && !d.glutenFree) kinds.push('contains-gluten')

  return kinds
}

/**
 * One menu line: name and description on the left, price and badges on
 * the right (badges drop under the text on narrow screens).
 * `index` staggers the CSS entrance a little; new rows fade in, rows that
 * stay on screen while searching do not re-animate.
 */
export default function MenuItemRow({ item, index }: { item: MenuItem; index: number }) {
  const badges = badgesFor(item)

  const customTags = (item.dietaryTags ?? []).filter(
    (tag) => !['vegan', 'vegetarian', 'gluten-free', 'spicy', 'contains-gluten'].includes(tag.id),
  )

  return (
    <li
      className="cbg-enter-fade grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-2 border-b border-champagne/12 py-4 sm:grid-cols-[minmax(0,1fr)_auto_104px] sm:gap-x-5"
      style={
        {
          animationDelay: `${Math.min(index, 12) * 30}ms`,
          animationDuration: '500ms',
        } as CSSProperties
      }
    >
      <div className="min-w-0">
        <h4 className="font-inter text-[14px] font-medium leading-snug text-ivory">{item.name}</h4>
        <p className="mt-1 font-inter text-[12px] leading-relaxed text-ivory/65">
          {item.description}
        </p>
      </div>

      <p className="pt-px font-inter text-[14px] tabular-nums text-ivory">
        {formatPrice(item.price)}
      </p>

      {badges.length || customTags.length ? (
        <ul
          aria-label="Dietary and highlights"
          className="col-span-2 flex flex-wrap gap-1.5 sm:col-span-1 sm:flex-col sm:items-start"
        >
          {badges.map((kind) => (
            <li key={kind}>
              <MenuBadge kind={kind} />
            </li>
          ))}
          {customTags.map((tag) => (
            <li key={tag.id}>
              <span className="inline-flex h-[22px] items-center rounded-full border border-champagne/30 px-2.5 font-inter text-[10px] text-ivory/80">
                {tag.label}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <span className="hidden sm:block" />
      )}
    </li>
  )
}
