import {
  createPlayerObject,
  MainPageType,
  PlayerInfoType,
  SCHOOL_COL_DATA_SELECTOR,
} from "./constant";
import { axiosInstance, cheerioInstance, processConcurrently } from "./utils";

async function getSchoolColData(htmlData: string): Promise<string[][]> {
  const $ = cheerioInstance(htmlData);
  const columnData: string[][] = [];
  let playerCount = -1;

  let i = 4;
  while (true) {
    const colData: string[] = $(SCHOOL_COL_DATA_SELECTOR(i))
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

function transposeMatrix(matrix: string[][]): string[][] {
  const res: string[][] = [];
  for (let i = 0; i < matrix[0].length; i++) {
    const col = [];
    for (let j = 0; j < matrix.length; j++) {
      col.push(matrix[j][i]);
    }
    res.push(col);
  }
  return res;
}

export async function formTeams(
  schoolHref: MainPageType[]
): Promise<PlayerInfoType[]> {
  const res: PlayerInfoType[] = [];
  const queryFuncs: (() => Promise<void>)[] = [];
  const timeouts: MainPageType[] = [];
  for (const { href, name } of schoolHref) {
    queryFuncs.push(async () => {
      try {
        const { data } = await axiosInstance.get(href);
        if (!data) {
          throw new Error(`unable to get data for ${href}`);
        }
        const teamByStat = await getSchoolColData(data);
        const teamByPlayers = toTeamObject(name, teamByStat);

        console.log({ message: name + " completed" });
        res.push(...teamByPlayers);
      } catch (error) {
        timeouts.push({ href, name });
      }
    });
  }
  await processConcurrently(queryFuncs, 5);
  if (timeouts.length !== 0) console.error(timeouts);
  return res;
}
