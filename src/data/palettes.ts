export interface Palette {
  id: string
  name: string
  category: 'neutral' | 'monochrome' | 'pastel' | 'warm' | 'cool' | 'earthy' | 'bold' | 'neon' | 'colored'
  colors: {
    bg: string
    text?: string
    heading?: string
    body?: string
    accent?: string
    surface?: string
  }
  colorCount: 2 | 3 | 4 | 5
}

export const palettes: Palette[] = [
  // neutral
  { id: 'paper', name: 'Paper', category: 'neutral', colorCount: 2, colors: { bg: '#FFFFFF', text: '#1A1A1A' } },
  { id: 'graphite', name: 'Graphite', category: 'neutral', colorCount: 3, colors: { bg: '#F9FAFB', text: '#111827', accent: '#4B5563' } },
  { id: 'ink', name: 'Ink', category: 'neutral', colorCount: 3, colors: { bg: '#1A1A1A', text: '#F5F5F5', accent: '#9CA3AF' } },
  { id: 'ash', name: 'Ash', category: 'neutral', colorCount: 4, colors: { bg: '#F5F5F4', heading: '#1C1917', body: '#57534E', accent: '#78716C' } },
  { id: 'slate', name: 'Slate', category: 'neutral', colorCount: 5, colors: { bg: '#0F172A', heading: '#F8FAFC', body: '#CBD5E1', accent: '#38BDF8', surface: '#1E293B' } },

  // monochrome
  { id: 'ocean-mono', name: 'Ocean Mono', category: 'monochrome', colorCount: 2, colors: { bg: '#F0F4F8', text: '#0A2540' } },
  { id: 'forest-mono', name: 'Forest Mono', category: 'monochrome', colorCount: 3, colors: { bg: '#F0FDF4', text: '#052E16', accent: '#16A34A' } },
  { id: 'berry-mono', name: 'Berry Mono', category: 'monochrome', colorCount: 4, colors: { bg: '#FDF2F8', heading: '#500724', body: '#831843', accent: '#DB2777' } },
  { id: 'amber-mono', name: 'Amber Mono', category: 'monochrome', colorCount: 5, colors: { bg: '#FFFBEB', heading: '#451A03', body: '#78350F', accent: '#D97706', surface: '#FEF3C7' } },
  { id: 'violet-mono', name: 'Violet Mono', category: 'monochrome', colorCount: 3, colors: { bg: '#F5F3FF', text: '#2E1065', accent: '#7C3AED' } },

  // pastel
  { id: 'cotton-candy', name: 'Cotton Candy', category: 'pastel', colorCount: 2, colors: { bg: '#FFF1F2', text: '#1F2937' } },
  { id: 'lavender-mist', name: 'Lavender Mist', category: 'pastel', colorCount: 3, colors: { bg: '#F5F3FF', text: '#1E1B4B', accent: '#8B5CF6' } },
  { id: 'seafoam', name: 'Seafoam', category: 'pastel', colorCount: 4, colors: { bg: '#F0FDFA', heading: '#134E4A', body: '#374151', accent: '#2DD4BF' } },
  { id: 'peach-cream', name: 'Peach Cream', category: 'pastel', colorCount: 5, colors: { bg: '#FFF7ED', heading: '#1C1917', body: '#57534E', accent: '#FB923C', surface: '#FFEDD5' } },
  { id: 'sky', name: 'Sky', category: 'pastel', colorCount: 3, colors: { bg: '#F0F9FF', text: '#0C4A6E', accent: '#0EA5E9' } },

  // warm
  { id: 'terracotta', name: 'Terracotta', category: 'warm', colorCount: 3, colors: { bg: '#FFFAF5', text: '#431407', accent: '#C2410C' } },
  { id: 'ember', name: 'Ember', category: 'warm', colorCount: 5, colors: { bg: '#1C0F0A', heading: '#FEF2E8', body: '#D6C3B6', accent: '#F97316', surface: '#2D1A10' } },
  { id: 'sandstone', name: 'Sandstone', category: 'warm', colorCount: 2, colors: { bg: '#FAF7F2', text: '#292524' } },
  { id: 'rust', name: 'Rust', category: 'warm', colorCount: 4, colors: { bg: '#FEF2F2', heading: '#450A0A', body: '#7F1D1D', accent: '#DC2626' } },
  { id: 'cinnamon', name: 'Cinnamon', category: 'warm', colorCount: 5, colors: { bg: '#FAF5F0', heading: '#3B1F0B', body: '#6D4422', accent: '#D97706', surface: '#F0E6D8' } },

  // cool
  { id: 'arctic', name: 'Arctic', category: 'cool', colorCount: 3, colors: { bg: '#F8FAFC', text: '#0F172A', accent: '#0EA5E9' } },
  { id: 'midnight', name: 'Midnight', category: 'cool', colorCount: 5, colors: { bg: '#0F172A', heading: '#F1F5F9', body: '#94A3B8', accent: '#3B82F6', surface: '#1E293B' } },
  { id: 'steel', name: 'Steel', category: 'cool', colorCount: 2, colors: { bg: '#F1F5F9', text: '#0F172A' } },
  { id: 'frost', name: 'Frost', category: 'cool', colorCount: 4, colors: { bg: '#ECFEFF', heading: '#164E63', body: '#475569', accent: '#06B6D4' } },
  { id: 'deep-sea', name: 'Deep Sea', category: 'cool', colorCount: 3, colors: { bg: '#082F49', text: '#E0F2FE', accent: '#0284C7' } },

  // earthy
  { id: 'sage', name: 'Sage', category: 'earthy', colorCount: 4, colors: { bg: '#F6F7F4', heading: '#1A2E1A', body: '#3D5A3D', accent: '#5F8D4E' } },
  { id: 'moss', name: 'Moss', category: 'earthy', colorCount: 5, colors: { bg: '#1A2E1A', heading: '#E8ECE3', body: '#B5C5A8', accent: '#6A9F4D', surface: '#243824' } },
  { id: 'olive', name: 'Olive', category: 'earthy', colorCount: 2, colors: { bg: '#FAFAF5', text: '#1C1C12' } },
  { id: 'clay', name: 'Clay', category: 'earthy', colorCount: 3, colors: { bg: '#FAF6F1', text: '#2C1810', accent: '#8B6F4E' } },
  { id: 'fern', name: 'Fern', category: 'earthy', colorCount: 5, colors: { bg: '#F0FDF0', heading: '#14532D', body: '#3F6B4F', accent: '#22C55E', surface: '#DCFCE7' } },

  // bold
  { id: 'electric', name: 'Electric', category: 'bold', colorCount: 3, colors: { bg: '#FFFFFF', text: '#0A0A0A', accent: '#2563EB' } },
  { id: 'neon-night', name: 'Neon Night', category: 'bold', colorCount: 5, colors: { bg: '#0A0A0A', heading: '#FFFFFF', body: '#D4D4D4', accent: '#8B5CF6', surface: '#1A1A2E' } },
  { id: 'crimson', name: 'Crimson', category: 'bold', colorCount: 4, colors: { bg: '#FFFFFF', heading: '#1A1A1A', body: '#404040', accent: '#DC2626' } },
  { id: 'citrus', name: 'Citrus', category: 'bold', colorCount: 2, colors: { bg: '#FFFEF5', text: '#1A1A0A' } },
  { id: 'coral-reef', name: 'Coral Reef', category: 'bold', colorCount: 4, colors: { bg: '#0C0A09', heading: '#FAFAF9', body: '#D6D3D1', accent: '#F43F5E' } },
  { id: 'bubblegum', name: 'Bubblegum', category: 'bold', colorCount: 5, colors: { bg: '#FFF0F5', heading: '#2D0A1F', body: '#6B3A5A', accent: '#FF1493', surface: '#FFE0EB' } },
  { id: 'lava', name: 'Lava', category: 'bold', colorCount: 4, colors: { bg: '#1A0000', heading: '#FFFFFF', body: '#FFB3B3', accent: '#FF3300' } },
  { id: 'wasabi', name: 'Wasabi', category: 'bold', colorCount: 4, colors: { bg: '#F5F5DC', heading: '#1A1A00', body: '#4D4D00', accent: '#7FFF00' } },
  { id: 'bruised', name: 'Bruised', category: 'bold', colorCount: 5, colors: { bg: '#0D0015', heading: '#E8D5FF', body: '#B89FD4', accent: '#9B59B6', surface: '#1A0A2E' } },

  // neon
  { id: 'acid', name: 'Acid', category: 'neon', colorCount: 3, colors: { bg: '#0D0D0D', text: '#E0FF00', accent: '#FF00FF' } },
  { id: 'cyberpunk', name: 'Cyberpunk', category: 'neon', colorCount: 5, colors: { bg: '#0A0A1A', heading: '#00FFFF', body: '#B8C0CC', accent: '#FF2D6B', surface: '#12122A' } },
  { id: 'terminal', name: 'Terminal', category: 'neon', colorCount: 3, colors: { bg: '#0C0C0C', text: '#00FF41', accent: '#FF5F1F' } },
  { id: 'synthwave', name: 'Synthwave', category: 'neon', colorCount: 5, colors: { bg: '#1A0A2E', heading: '#FF6EC7', body: '#C4B5E0', accent: '#00D4FF', surface: '#2D1B4E' } },
  { id: 'coral-punch', name: 'Coral Punch', category: 'warm', colorCount: 4, colors: { bg: '#FFF5F0', heading: '#1A0505', body: '#4A2020', accent: '#FF4040' } },
  { id: 'mango', name: 'Mango', category: 'warm', colorCount: 3, colors: { bg: '#FFF8E1', text: '#1A1200', accent: '#FF6D00' } },
  { id: 'rust-and-teal', name: 'Rust & Teal', category: 'earthy', colorCount: 4, colors: { bg: '#F0EDE8', heading: '#1C1210', body: '#5C3D2E', accent: '#00897B' } },
  { id: 'newspaper', name: 'Newspaper', category: 'neutral', colorCount: 3, colors: { bg: '#FFFEF5', text: '#1A1A1A', accent: '#C41E3A' } },
  { id: 'tokyo-night', name: 'Tokyo Night', category: 'cool', colorCount: 5, colors: { bg: '#1A1B26', heading: '#C0CAF5', body: '#9AA5CE', accent: '#7AA2F7', surface: '#24283B' } },
  { id: 'desert-storm', name: 'Desert Storm', category: 'earthy', colorCount: 4, colors: { bg: '#FAF0E4', heading: '#2C1810', body: '#6B4226', accent: '#D4A574' } },
  { id: 'arctic-aurora', name: 'Arctic Aurora', category: 'cool', colorCount: 5, colors: { bg: '#0B1426', heading: '#E0F0FF', body: '#8BA4C0', accent: '#00E676', surface: '#142238' } },

  // colored
  { id: 'ocean-floor', name: 'Ocean Floor', category: 'colored', colorCount: 5, colors: { bg: '#1B4965', heading: '#FFFFFF', body: '#BEE9E8', accent: '#62B6CB', surface: '#1F5573' } },
  { id: 'royal', name: 'Royal', category: 'colored', colorCount: 4, colors: { bg: '#2D1B69', heading: '#FFFFFF', body: '#D4C5F9', accent: '#FFD700' } },
  { id: 'forest-floor', name: 'Forest Floor', category: 'colored', colorCount: 5, colors: { bg: '#2D4A22', heading: '#F0FFE0', body: '#C8E6B0', accent: '#FFD166', surface: '#365E2B' } },
  { id: 'sunset', name: 'Sunset', category: 'colored', colorCount: 5, colors: { bg: '#C2185B', heading: '#FFFFFF', body: '#FFE0EC', accent: '#FFD54F', surface: '#D81B60' } },
  { id: 'indigo', name: 'Indigo', category: 'colored', colorCount: 4, colors: { bg: '#283593', heading: '#FFFFFF', body: '#C5CAE9', accent: '#FF8A65' } },
  { id: 'olive-oil', name: 'Olive Oil', category: 'colored', colorCount: 3, colors: { bg: '#556B2F', text: '#FFFFF0', accent: '#FFD700' } },
  { id: 'terracotta-villa', name: 'Terracotta Villa', category: 'colored', colorCount: 5, colors: { bg: '#B7562A', heading: '#FFFFFF', body: '#FFE0CC', accent: '#1A5C4B', surface: '#C46333' } },
  { id: 'deep-teal', name: 'Deep Teal', category: 'colored', colorCount: 4, colors: { bg: '#004D4D', heading: '#FFFFFF', body: '#B2DFDB', accent: '#FF6F61' } },
  { id: 'plum', name: 'Plum', category: 'colored', colorCount: 5, colors: { bg: '#4A1942', heading: '#FFE0F5', body: '#D4A5CC', accent: '#00E5FF', surface: '#5C2254' } },
  { id: 'burnt-orange', name: 'Burnt Orange', category: 'colored', colorCount: 3, colors: { bg: '#BF5700', text: '#FFFFFF', accent: '#FFE0B2' } },
  { id: 'navy-brass', name: 'Navy Brass', category: 'colored', colorCount: 5, colors: { bg: '#1B2A4A', heading: '#F5F0E0', body: '#B8C4D4', accent: '#D4A843', surface: '#243558' } },
  { id: 'bordeaux', name: 'Bordeaux', category: 'colored', colorCount: 4, colors: { bg: '#5C0029', heading: '#FFFFFF', body: '#F0C4D4', accent: '#FFB347' } },
  { id: 'jungle', name: 'Jungle', category: 'colored', colorCount: 5, colors: { bg: '#0D3B0D', heading: '#E0FFE0', body: '#A8D8A8', accent: '#FF6B35', surface: '#154D15' } },
  { id: 'denim', name: 'Denim', category: 'colored', colorCount: 3, colors: { bg: '#3B5998', text: '#FFFFFF', accent: '#FFD700' } },
  { id: 'clay-red', name: 'Clay Red', category: 'colored', colorCount: 4, colors: { bg: '#8B3A3A', heading: '#FFFFFF', body: '#F0D0D0', accent: '#5FCED4' } },
]

export default palettes
