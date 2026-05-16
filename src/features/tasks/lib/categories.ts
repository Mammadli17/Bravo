export const TASK_CATEGORIES = [
  { en: 'Shelf Arrangement', az: 'Rəf Düzəlişi' },
  { en: 'Cleaning', az: 'Təmizlik' },
  { en: 'Labeling', az: 'Etiketləmə' },
  { en: 'Fresh Produce', az: 'Təzə Məhsul' },
  { en: 'POS / Hardware', az: 'POS / Avadanlıq' },
  { en: 'Network', az: 'Şəbəkə' },
] as const;

export function getCategoryByIndex(index: number) {
  return TASK_CATEGORIES[index] ?? TASK_CATEGORIES[0];
}
