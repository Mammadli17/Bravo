import type { SectionType } from '../types';

export const SECTIONS: { id: SectionType; en: string; az: string; icon: string }[] = [
  { id: 'fruit_vegetables', en: 'Fruit & Vegetables', az: 'Meyvə-Tərəvəz', icon: '🥦' },
  { id: 'dry_foods', en: 'Dry Foods', az: 'Quru Qidalar', icon: '🌾' },
  { id: 'beverages', en: 'Beverages', az: 'İçkilər', icon: '🥤' },
  { id: 'cash_desk', en: 'Cash Desk', az: 'Kassa', icon: '🏧' },
  { id: 'dairy', en: 'Dairy', az: 'Süd Məhsulları', icon: '🥛' },
  { id: 'meat', en: 'Meat & Poultry', az: 'Ət və Toyuq', icon: '🥩' },
  { id: 'bakery', en: 'Bakery', az: 'Çörəkxana', icon: '🥖' },
  { id: 'operations', en: 'Operations', az: 'Operativ', icon: '⚙️' },
];

export function getSectionLabel(sectionId?: SectionType): string {
  if (!sectionId) return '—';
  return SECTIONS.find(s => s.id === sectionId)?.az ?? sectionId;
}
