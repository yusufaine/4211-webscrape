import {
  ADD_GAMELOG_PARAM,
  createGamelogObject,
  GamelogInfoType,
  GAMELOG_COL_SELECTOR,
} from "./constants";
import {
  axiosInstance,
  cheerioInstance,
  csvBool,
  jsonBool,
  processConcurrently,
  saveData,
  transposeMatrix,
} from "../utils";
import { TeamPageInfoType } from "../team-data/constants";

function toGamelogObject(name: string, data: string[][]): GamelogInfoType[] {
  const gamelogArray: GamelogInfoType[] = [];
  const gameByEvent = transposeMatrix(data);

  for (const game of gameByEvent) {
    const gamelogObject: GamelogInfoType = createGamelogObject(name, game);
    gamelogArray.push(gamelogObject);
  }

  return gamelogArray;
}

async function getGamelogColData(htmlData: string): Promise<string[][]> {
  const $ = cheerioInstance(htmlData);
  const gamelogColData: string[][] = [];

  for (let i = 1; ; i++) {
    if (i == 2) {
      continue;
    }

    const colData: string[] = [];

    $(GAMELOG_COL_SELECTOR(i)).each((_id, el) => {
      colData.push($(el).text().trim());
    });

    if (colData.length === 0) {
      return gamelogColData;
    }
    gamelogColData.push(colData);
  }
}

export async function getGamelog(
  nameAndTeamRoute: TeamPageInfoType[]
): Promise<GamelogInfoType[]> {
  const gameLogs: GamelogInfoType[] = [];

  const queryFuncs: (() => Promise<void>)[] = [];
  const errorLogs: (TeamPageInfoType & { error: string })[] = [];

  for (const { name, route } of nameAndTeamRoute) {
    const gamelogRoute = ADD_GAMELOG_PARAM(route);
    queryFuncs.push(async () => {
      try {
        const { data } = await axiosInstance.get(gamelogRoute);
        if (!data) {
          errorLogs.push({ name, route, error: "no data" });
          return;
        }
        const gamelogByStat = await getGamelogColData(data);
        const gamelogByEvent = toGamelogObject(name, gamelogByStat);

        console.log({ mesasge: `GAMELOG: ${name} completed` });
        gameLogs.push(...gamelogByEvent);
      } catch (error) {
        errorLogs.push({ name, route, error: "timeout or unreachable" });
      }
    });
  }

  await processConcurrently(queryFuncs);

  if (errorLogs.length !== 0) {
    const csv = csvBool();
    const json = jsonBool();

    saveData(errorLogs, "gamelog-error", { csv, json });
  }

  return gameLogs;
}
