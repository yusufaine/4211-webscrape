export type GamelogInfoType = {
  team: string;
  date: string;
  score: string;
  sets: string;
  kills: string;
  errors: string;
  total_attack: string;
  hitting_percentage: string;
  assists: string;
  service_aces: string;
  service_errors: string;
  reception: string;
  reception_errors: string;
  digs: string;
  block_solo: string;
  block_assist: string;
  block_error: string;
  total_block: string;
  ball_handling_error: string;
  points: string;
};

export const ADD_GAMELOG_PARAM = (teamHref: string) => {
  return `${teamHref}?view=gamelog`;
};

export const GAMELOG_COL_SELECTOR = (col: number) => {
  return `div.tab-panel:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr > td:nth-child(${col})`;
};

export function createGamelogObject(
  team: string,
  data: string[]
): GamelogInfoType {
  return {
    team,
    date: data[0],
    score: data[1],
    sets: data[2],
    kills: data[3],
    errors: data[4],
    total_attack: data[5],
    hitting_percentage: data[6],
    assists: data[7],
    service_aces: data[8],
    service_errors: data[9],
    reception: data[10],
    reception_errors: data[11],
    digs: data[12],
    block_solo: data[13],
    block_assist: data[14],
    block_error: data[15],
    total_block: data[16],
    ball_handling_error: data[17],
    points: data[18],
  };
}
