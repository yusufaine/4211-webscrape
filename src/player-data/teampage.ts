import {
  PLAYERS_COL_DATA_SELECTOR,
  createPlayerObject,
  PlayerInfoType,
} from "./constants";
import { TeamPageInfoType } from "../team-data/constants";
import {
  axiosInstance,
  cheerioInstance,
  processConcurrently,
  transposeMatrix,
} from "../utils";

async function getTeamColData(htmlData: string): Promise<string[][]> {
  const $ = cheerioInstance(htmlData);
  const columnData: string[][] = [];
  let playerCount = -1;

  let i = 4;
  while (true) {
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

    if (colData.length == 0) {
      return columnData;
    }

    if (playerCount == -1) {
      playerCount = colData.length;
    }

    if (colData.length > playerCount) {
      const spliced = colData.slice(0, playerCount);
      columnData.push(spliced);
    } else {
      columnData.push(colData);
    }
    i += 1;
  }
}

function toTeamObject(name: string, matrix: string[][]): PlayerInfoType[] {
  const teamArray: PlayerInfoType[] = [];
  const teamByPlayersMatrix = transposeMatrix(matrix);
  for (const playerLine of teamByPlayersMatrix) {
    const playerObject = createPlayerObject(name, playerLine);
    teamArray.push(playerObject);
  }
  return teamArray;
}

export async function formTeams(
  teamHref: TeamPageInfoType[]
): Promise<PlayerInfoType[]> {
  const res: PlayerInfoType[] = [];
  const queryFuncs: (() => Promise<void>)[] = [];
  const timeouts: TeamPageInfoType[] = [];
  for (const { href, name } of teamHref) {
    queryFuncs.push(async () => {
      try {
        const { data } = await axiosInstance.get(href);
        if (!data) {
          throw new Error(`unable to get data for ${href}`);
        }
        const teamByStat = await getTeamColData(data);
        const teamByPlayers = toTeamObject(name, teamByStat);

        console.log({ message: name + " completed" });
        res.push(...teamByPlayers);
      } catch (error) {
        timeouts.push({ href, name });
      }
    });
  }
  await processConcurrently(queryFuncs, 5);
  if (timeouts.length !== 0) {
    console.error(timeouts, { length: timeouts.length });
  }
  return res;
}
