// * Main page constants
export const HREF_LINK = (href: string) => {
  return `${href}/?view=lineup&r=0&pos=`;
};

export const INVALID_SCHOOL = new Set<string>([
  "Holy Family",
  "Penn State Schuylkill",
  "Southern-New Orleans",
  "Wilberforce",
]);

export const MAINPAGE_ROUTE = "sports/wvball/2022-23/teams?sort=name&r=0&pos=";

export const SCHOOL_HREF_NAME_SELECTOR =
  "div.tab-panel:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr > td > a";

export type MainPageType = {
  name: string;
  href: string;
};

// * School page constants
export const SCHOOL_COL_DATA_SELECTOR = (col: number) => {
  return `div.active:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr > td:nth-child(${col})`;
};

export const SCHOOL_ROW_DATA_SELECTOR = (row: number) => {
  return `div.active:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(${row}) > td`;
};

// * 22 keys from website, excludes school name as it's manual
export type PlayerInfoType = {
  school: string;
  position: string;
  matches: string;
  sets: string;
  kills: string;
  kills_per_set: string;
  errors: string;
  total_attacks: string;
  hitting_percentage: string;
  assists: string;
  assists_per_set: string;
  service_aces: string;
  service_aces_per_set: string;
  reception: string;
  reception_errors: string;
  digs: string;
  digs_per_set: string;
  block_solo: string;
  block_assist: string;
  block_total: string;
  blocks_per_set: string;
  points: string;
  points_per_set: string;
};

export function createPlayerObject(
  schoolName: string,
  data: string[]
): PlayerInfoType {
  if (data.length !== 22) {
    console.error("error in player data for", schoolName);
    process.exit(1);
  }
  return {
    school: schoolName,
    position: data[0],
    matches: data[1],
    sets: data[2],
    kills: data[3],
    kills_per_set: data[4],
    errors: data[5],
    total_attacks: data[6],
    hitting_percentage: data[7],
    assists: data[8],
    assists_per_set: data[9],
    service_aces: data[10],
    service_aces_per_set: data[11],
    reception: data[12],
    reception_errors: data[13],
    digs: data[14],
    digs_per_set: data[15],
    block_solo: data[16],
    block_assist: data[17],
    block_total: data[18],
    blocks_per_set: data[19],
    points: data[20],
    points_per_set: data[21],
  };
}

export const NUMBER_KEY_MAP: Record<number, string> = {
  0: "school",
  1: "position",
  2: "matches",
  3: "sets",
  4: "kills",
  5: "kills_per_set",
  6: "errors",
  7: "total_attacks",
  8: "hitting_percentage",
  9: "assists",
  10: "assists_per_set",
  11: "service_aces",
  12: "service_aces_per_set",
  13: "reception",
  14: "reception_errors",
  15: "digs",
  16: "digs_per_set",
  17: "block_solo",
  18: "block_assist",
  19: "block_total",
  20: "blocks_per_set",
  21: "points",
  22: "points_per_set",
};