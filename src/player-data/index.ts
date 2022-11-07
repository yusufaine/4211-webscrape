import {
  createPlayerObject,
  PlayerInfoType,
  PLAYERS_COL_DATA_SELECTOR,
} from "./constants";
import { ADD_LINEUP_PARAM, TeamPageInfoType } from "../team-data/constants";
import {
  axiosInstance,
  cheerioInstance,
  csvBool,
  jsonBool,
  processConcurrently,
  saveData,
  transposeMatrix,
} from "../utils";

function toTeamObject(name: string, data: string[][]): PlayerInfoType[] {
  const teamArray: PlayerInfoType[] = [];
  const teamByPlayersMatrix = transposeMatrix(data);

  for (const playerLine of teamByPlayersMatrix) {
    const playerObject = createPlayerObject(name, playerLine);
    teamArray.push(playerObject);
  }

  return teamArray;
}

async function getTeamColData(htmlData: string): Promise<string[][]> {
  const $ = cheerioInstance(htmlData);
  const teamColData: string[][] = [];
  let playerCount = -1;

  for (let i = 4; ; i++) {
    const colData: string[] = $(PLAYERS_COL_DATA_SELECTOR(i))
      .text()
      .split("\n")
      .map((v) => v.trim())
      .reduce((prev: string[], curr: string) => {
        if (curr) {
          prev.push(curr);
        }
        return prev;
      }, []);

    if (playerCount == -1) {
      playerCount = colData.length;
    }

    if (colData.length != 0) {
      if (colData.length > playerCount) {
        teamColData.push(colData.splice(0, playerCount));
      } else {
        teamColData.push(colData);
      }
      continue;
    }

    return teamColData;
  }
}

export async function formTeams(
  teamHref: TeamPageInfoType[]
): Promise<PlayerInfoType[]> {
  const teams: PlayerInfoType[] = [];

  const queryFuncs: (() => Promise<void>)[] = [];
  const errorLogs: (TeamPageInfoType & { error: string })[] = [];

  for (const { route, name } of teamHref) {
    const href = ADD_LINEUP_PARAM(route);
    queryFuncs.push(async () => {
      try {
        const { data } = await axiosInstance.get(href);
        if (!data) {
          errorLogs.push({ name, route, error: "no data" });
        }
        const teamByStat = await getTeamColData(data);
        const teamByPlayers = toTeamObject(name, teamByStat);

        console.log({ message: `TEAMINFO: ${name} completed` });
        teams.push(...teamByPlayers);
      } catch (error) {
        errorLogs.push({ name, route, error: "timeout or unreachable" });
      }
    });
  }

  await processConcurrently(queryFuncs);

  if (errorLogs.length !== 0) {
    const csv = csvBool();
    const json = jsonBool();

    saveData(errorLogs, "playerdata-error", { csv, json });
  }

  return teams;
}
