import type { Cocktail } from './data';

export const spiritFilters = ['全部', '金酒', '伏特加', '朗姆酒', '龙舌兰', '威士忌', '白兰地', '其他'] as const;
export type SpiritFilter = typeof spiritFilters[number];
export const collectionFilters = ['编辑之选', ...spiritFilters] as const;
export type CollectionFilter = typeof collectionFilters[number];

// Keep the recipe's precise base label; simplify only the collection filter.
export function spiritGroup(drink: Pick<Cocktail, 'base'>): SpiritFilter {
 return spiritFilters.slice(1, -1).includes(drink.base as SpiritFilter) ? drink.base as SpiritFilter : '其他';
}
