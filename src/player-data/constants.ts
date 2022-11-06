export type PlayerInfoType = {
  team: string;
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

export const PLAYERS_COL_DATA_SELECTOR = (col: number) => {
  return `div.active:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr > td:nth-child(${col})`;
};

export const PLAYERS_ROW_DATA_SELECTOR = (row: number) => {
  return `div.active:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(${row}) > td`;
};

export function createPlayerObject(
  team: string,
  data: string[]
): PlayerInfoType {
  if (data.length !== 22) {
    console.error("error in player data for", team);
    process.exit(1);
  }
  return {
    team: team,
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
