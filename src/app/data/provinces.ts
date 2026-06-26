export interface ProvinceData {
  id: string;
  name: string;
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
  { id: "phnom-penh", name: "Phnom Penh", lat: 11.5564, lng: 104.9282, users: 852, sites: 73, queries: 2844, activeUsers: 602, inactiveUsers: 200, terminatedUsers: 50 },
  { id: "siem-reap", name: "Siem Reap", lat: 13.3633, lng: 103.8600, users: 372, sites: 33, queries: 1417, activeUsers: 292, inactiveUsers: 60, terminatedUsers: 20 },
  { id: "kandal", name: "Kandal", lat: 11.4800, lng: 104.9500, users: 336, sites: 29, queries: 1226, activeUsers: 231, inactiveUsers: 90, terminatedUsers: 15 },
  { id: "battambang", name: "Battambang", lat: 13.0957, lng: 103.2022, users: 294, sites: 25, queries: 1058, activeUsers: 207, inactiveUsers: 75, terminatedUsers: 12 },
  { id: "kampong-cham", name: "Kampong Cham", lat: 12.0000, lng: 105.4500, users: 268, sites: 23, queries: 972, activeUsers: 193, inactiveUsers: 65, terminatedUsers: 10 },
  { id: "kampong-thom", name: "Kampong Thom", lat: 12.7111, lng: 104.8900, users: 213, sites: 18, queries: 769, activeUsers: 155, inactiveUsers: 50, terminatedUsers: 8 },
  { id: "banteay-meanchey", name: "Banteay Meanchey", lat: 13.7500, lng: 102.9800, users: 226, sites: 18, queries: 824, activeUsers: 162, inactiveUsers: 55, terminatedUsers: 9 },
  { id: "prey-veng", name: "Prey Veng", lat: 11.4850, lng: 105.3250, users: 206, sites: 18, queries: 750, activeUsers: 148, inactiveUsers: 50, terminatedUsers: 8 },
  { id: "kampong-speu", name: "Kampong Speu", lat: 11.4500, lng: 104.5200, users: 203, sites: 18, queries: 734, activeUsers: 145, inactiveUsers: 50, terminatedUsers: 8 },
  { id: "takeo", name: "Takeo", lat: 10.9900, lng: 104.7900, users: 156, sites: 14, queries: 570, activeUsers: 113, inactiveUsers: 37, terminatedUsers: 6 },
  { id: "kampong-chhnang", name: "Kampong Chhnang", lat: 12.2500, lng: 104.6700, users: 153, sites: 13, queries: 557, activeUsers: 110, inactiveUsers: 37, terminatedUsers: 6 },
  { id: "tboung-khmum", name: "Tboung Khmum", lat: 12.0000, lng: 105.6700, users: 136, sites: 12, queries: 492, activeUsers: 65, inactiveUsers: 32, terminatedUsers: 5 },
  { id: "pursat", name: "Pursat", lat: 12.5388, lng: 103.9192, users: 127, sites: 11, queries: 460, activeUsers: 60, inactiveUsers: 30, terminatedUsers: 5 },
  { id: "svay-rieng", name: "Svay Rieng", lat: 11.0900, lng: 105.8000, users: 123, sites: 11, queries: 454, activeUsers: 60, inactiveUsers: 30, terminatedUsers: 5 },
  { id: "preah-sihanouk", name: "Preah Sihanouk", lat: 10.6097, lng: 103.5297, users: 107, sites: 14, queries: 544, activeUsers: 50, inactiveUsers: 25, terminatedUsers: 4 },
  { id: "oddar-meanchey", name: "Oddar Meanchey", lat: 14.1800, lng: 103.5000, users: 103, sites: 9, queries: 357, activeUsers: 50, inactiveUsers: 25, terminatedUsers: 4 },
  { id: "kratie", name: "Kratie", lat: 12.4880, lng: 106.0188, users: 93, sites: 8, queries: 341, activeUsers: 45, inactiveUsers: 22, terminatedUsers: 4 },
  { id: "kampot", name: "Kampot", lat: 10.6100, lng: 104.1800, users: 86, sites: 8, queries: 315, activeUsers: 40, inactiveUsers: 20, terminatedUsers: 4 },
  { id: "koh-kong", name: "Koh Kong", lat: 11.6150, lng: 103.0000, users: 73, sites: 7, queries: 267, activeUsers: 35, inactiveUsers: 17, terminatedUsers: 3 },
  { id: "preah-vihear", name: "Preah Vihear", lat: 13.8000, lng: 104.9800, users: 59, sites: 5, queries: 216, activeUsers: 25, inactiveUsers: 12, terminatedUsers: 3 },
  { id: "ratanakiri", name: "Ratanakiri", lat: 13.7300, lng: 107.0000, users: 57, sites: 5, queries: 206, activeUsers: 25, inactiveUsers: 12, terminatedUsers: 3 },
  { id: "stung-treng", name: "Stung Treng", lat: 13.5260, lng: 105.9700, users: 44, sites: 4, queries: 155, activeUsers: 20, inactiveUsers: 10, terminatedUsers: 2 },
  { id: "pailin", name: "Pailin", lat: 12.8490, lng: 102.6090, users: 34, sites: 3, queries: 123, activeUsers: 15, inactiveUsers: 7, terminatedUsers: 2 },
  { id: "mondulkiri", name: "Mondulkiri", lat: 12.4500, lng: 107.1880, users: 29, sites: 2, queries: 107, activeUsers: 15, inactiveUsers: 7, terminatedUsers: 2 },
  { id: "kep", name: "Kep", lat: 10.4833, lng: 104.3167, users: 23, sites: 2, queries: 84, activeUsers: 10, inactiveUsers: 5, terminatedUsers: 1 },
];
