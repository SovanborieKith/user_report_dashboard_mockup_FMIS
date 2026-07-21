export interface ProvinceData {
  id: string;
  /** Khmer province/capital name kept for backward compatibility. */
  name: string;
  englishName: string;
  lat: number;
  lng: number;
  users: number;
  sites: number;
  queries: number;
  activeUsers: number;
  inactiveUsers: number;
  terminatedUsers: number;
}

export const provinces: ProvinceData[] = [
  { id: "phnom-penh", name: "ភ្នំពេញ", englishName: "Phnom Penh", lat: 11.5564, lng: 104.9282, users: 2786, sites: 204, queries: 2844, activeUsers: 1749, inactiveUsers: 681, terminatedUsers: 356 },
  { id: "siem-reap", name: "សៀមរាប", englishName: "Siem Reap", lat: 13.3633, lng: 103.8600, users: 116, sites: 11, queries: 1417, activeUsers: 100, inactiveUsers: 13, terminatedUsers: 3 },
  { id: "kandal", name: "កណ្តាល", englishName: "Kandal", lat: 11.4800, lng: 104.9500, users: 127, sites: 17, queries: 1226, activeUsers: 103, inactiveUsers: 18, terminatedUsers: 6 },
  { id: "battambang", name: "បាត់ដំបង", englishName: "Battambang", lat: 13.0957, lng: 103.2022, users: 71, sites: 6, queries: 1058, activeUsers: 47, inactiveUsers: 13, terminatedUsers: 11 },
  { id: "kampong-cham", name: "កំពង់ចាម", englishName: "Kampong Cham", lat: 12.0000, lng: 105.4500, users: 51, sites: 5, queries: 972, activeUsers: 32, inactiveUsers: 13, terminatedUsers: 6 },
  { id: "kampong-thom", name: "កំពង់ធំ", englishName: "Kampong Thom", lat: 12.7111, lng: 104.8900, users: 90, sites: 13, queries: 769, activeUsers: 70, inactiveUsers: 12, terminatedUsers: 8 },
  { id: "banteay-meanchey", name: "បន្ទាយមានជ័យ", englishName: "Banteay Meanchey", lat: 13.7500, lng: 102.9800, users: 64, sites: 6, queries: 824, activeUsers: 51, inactiveUsers: 10, terminatedUsers: 3 },
  { id: "prey-veng", name: "ព្រៃវែង", englishName: "Prey Veng", lat: 11.4850, lng: 105.3250, users: 111, sites: 17, queries: 750, activeUsers: 92, inactiveUsers: 8, terminatedUsers: 11 },
  { id: "kampong-speu", name: "កំពង់ស្ពឺ", englishName: "Kampong Speu", lat: 11.4500, lng: 104.5200, users: 98, sites: 13, queries: 734, activeUsers: 84, inactiveUsers: 9, terminatedUsers: 5 },
  { id: "takeo", name: "តាកែវ", englishName: "Takeo", lat: 10.9900, lng: 104.7900, users: 62, sites: 5, queries: 570, activeUsers: 39, inactiveUsers: 10, terminatedUsers: 13 },
  { id: "kampong-chhnang", name: "កំពង់ឆ្នាំង", englishName: "Kampong Chhnang", lat: 12.2500, lng: 104.6700, users: 51, sites: 5, queries: 557, activeUsers: 32, inactiveUsers: 10, terminatedUsers: 9 },
  { id: "tboung-khmum", name: "ត្បូងឃ្មុំ", englishName: "Tboung Khmum", lat: 12.0000, lng: 105.6700, users: 58, sites: 5, queries: 492, activeUsers: 39, inactiveUsers: 10, terminatedUsers: 9 },
  { id: "pursat", name: "ពោធិ៍សាត់", englishName: "Pursat", lat: 12.5388, lng: 103.9192, users: 62, sites: 5, queries: 460, activeUsers: 42, inactiveUsers: 11, terminatedUsers: 9 },
  { id: "svay-rieng", name: "ស្វាយរៀង", englishName: "Svay Rieng", lat: 11.0900, lng: 105.8000, users: 61, sites: 6, queries: 454, activeUsers: 44, inactiveUsers: 9, terminatedUsers: 8 },
  { id: "preah-sihanouk", name: "ព្រះសីហនុ", englishName: "Preah Sihanouk", lat: 10.6097, lng: 103.5297, users: 62, sites: 7, queries: 544, activeUsers: 45, inactiveUsers: 8, terminatedUsers: 9 },
  { id: "oddar-meanchey", name: "ឧត្តរមានជ័យ", englishName: "Oddar Meanchey", lat: 14.1800, lng: 103.5000, users: 47, sites: 5, queries: 357, activeUsers: 31, inactiveUsers: 9, terminatedUsers: 7 },
  { id: "kratie", name: "ក្រចេះ", englishName: "Kratie", lat: 12.4880, lng: 106.0188, users: 50, sites: 5, queries: 341, activeUsers: 35, inactiveUsers: 11, terminatedUsers: 4 },
  { id: "kampot", name: "កំពត", englishName: "Kampot", lat: 10.6100, lng: 104.1800, users: 61, sites: 6, queries: 315, activeUsers: 37, inactiveUsers: 14, terminatedUsers: 10 },
  { id: "koh-kong", name: "កោះកុង", englishName: "Koh Kong", lat: 11.6150, lng: 103.0000, users: 52, sites: 5, queries: 267, activeUsers: 33, inactiveUsers: 8, terminatedUsers: 11 },
  { id: "preah-vihear", name: "ព្រះវិហារ", englishName: "Preah Vihear", lat: 13.8000, lng: 104.9800, users: 55, sites: 5, queries: 216, activeUsers: 35, inactiveUsers: 16, terminatedUsers: 4 },
  { id: "ratanakiri", name: "រតនគិរី", englishName: "Ratanakiri", lat: 13.7300, lng: 107.0000, users: 58, sites: 5, queries: 206, activeUsers: 38, inactiveUsers: 11, terminatedUsers: 9 },
  { id: "stung-treng", name: "ស្ទឹងត្រែង", englishName: "Stung Treng", lat: 13.5260, lng: 105.9700, users: 52, sites: 5, queries: 155, activeUsers: 40, inactiveUsers: 7, terminatedUsers: 5 },
  { id: "pailin", name: "ប៉ៃលិន", englishName: "Pailin", lat: 12.8490, lng: 102.6090, users: 53, sites: 5, queries: 123, activeUsers: 39, inactiveUsers: 7, terminatedUsers: 7 },
  { id: "mondulkiri", name: "មណ្ឌលគិរី", englishName: "Mondulkiri", lat: 12.4500, lng: 107.1880, users: 49, sites: 5, queries: 107, activeUsers: 30, inactiveUsers: 9, terminatedUsers: 10 },
  { id: "kep", name: "កែប", englishName: "Kep", lat: 10.4833, lng: 104.3167, users: 44, sites: 5, queries: 84, activeUsers: 32, inactiveUsers: 5, terminatedUsers: 7 },
];