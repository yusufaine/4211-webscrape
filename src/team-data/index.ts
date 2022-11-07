import {
  INVALID_TEAM,
  MAINPAGE_ROUTE,
  TEAM_HREF_NAME_SELECTOR,
  TeamPageInfoType,
  TEAM_COL_SELECTOR,
  createTeamObject,
  TeamInfoType,
} from "./constants";
import { axiosInstance, cheerioInstance, transposeMatrix } from "../utils";

async function getMainPageHtml() {
  const { data } = await axiosInstance.get(MAINPAGE_ROUTE);

  if (!data) {
    throw new Error("unable to fetch main page html");
  }

  return data;
}

export async function formTeamOverallData(): Promise<TeamInfoType[]> {
  const teamData = await getTeamOverallData();
  const res: TeamInfoType[] = [];
  for (const data of teamData) {
    res.push(createTeamObject(data));
  }
  return res;
}

async function getTeamOverallData(): Promise<string[][]> {
  const teamColData: string[][] = [];

  const htmlData = await getMainPageHtml();
  const $ = cheerioInstance(htmlData);

  for (let i = 1; ; i++) {
    const colData: string[] = [];
    $(TEAM_COL_SELECTOR(i)).each((_id, el) => {
      const res = $(el).text().trim();
      colData.push(res);
    });

    if (colData.length != 0) {
      teamColData.push(colData);
      continue;
    }
    return transposeMatrix(teamColData);
  }
}

export async function getTeamNameAndHref(): Promise<TeamPageInfoType[]> {
  const nameAndTeamRoute: TeamPageInfoType[] = [];

  const htmlData = await getMainPageHtml();
  const $ = cheerioInstance(htmlData);

  $(TEAM_HREF_NAME_SELECTOR).each((_id, el) => {
    const name = $(el).text();
    if (!name) {
      throw new Error("unable to get tea, name");
    }

    // Ignore teams with all "-"
    if (INVALID_TEAM.has(name.trim())) {
      return;
    }

    const route = $(el).attr("href");
    if (!route) {
      throw new Error("unable to get team href");
    }
    nameAndTeamRoute.push({ name, route });
  });

  return nameAndTeamRoute;
}
