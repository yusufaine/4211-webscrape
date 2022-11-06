import { PlayerInfoType } from "src/player-data/constants";

export type TeamPageInfoType = {
  name: string;
  href: string;
};

export type TeamInfoType = Omit<PlayerInfoType, "position"> & {
  rank: string;
};

export const HREF_LINK = (href: string) => {
  return `${href}/?view=lineup&r=0&pos=`;
};

export const INVALID_TEAM = new Set<string>([
  "Holy Family",
  "Penn State Schuylkill",
  "Southern-New Orleans",
  "Wilberforce",
]);

export const MAINPAGE_ROUTE = "sports/wvball/2022-23/teams?sort=name&r=0&pos=";

export const TEAM_HREF_NAME_SELECTOR =
  "div.tab-panel:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr > td > a";

export const TEAM_COL_SELECTOR = (col: number) => {
  return `div.tab-panel:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr > td:nth-child(${col})`;
};

export function createTeamObject(data: string[]): TeamInfoType {
  if (data.length !== 23) {
    console.error("error in team data", data.length, data[22]);
    process.exit(1);
  }
  return {
    rank: data[0],
    team: data[1],
    matches: data[2],
    sets: data[3],
    kills: data[4],
    kills_per_set: data[5],
    errors: data[6],
    total_attacks: data[7],
    hitting_percentage: data[8],
    assists: data[9],
    assists_per_set: data[10],
    service_aces: data[11],
    service_aces_per_set: data[12],
    reception: data[13],
    reception_errors: data[14],
    digs: data[15],
    digs_per_set: data[16],
    block_solo: data[17],
    block_assist: data[18],
    block_total: data[19],
    blocks_per_set: data[20],
    points: data[21],
    points_per_set: data[22],
  };
}
