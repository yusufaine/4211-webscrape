import { Axios } from "axios";
import * as cheerio from "cheerio";
import * as fs from "fs";
import { chunk } from "lodash";
import ObjectsToCsv from "objects-to-csv";
import path from "path";

import { PlayerInfoType } from "./constant";

const pathToDataFile = (fileName: string) => {
  return path.resolve(__dirname, "..", "assets", fileName);
};

async function saveAsCsv(data: PlayerInfoType[]) {
  const csv = new ObjectsToCsv(data);
  await csv.toDisk(pathToDataFile("data.csv"));
}

function saveAsJson(data: PlayerInfoType[]) {
  fs.writeFileSync(pathToDataFile("data.json"), JSON.stringify(data, null, 2));
}

export const csvBool = (): boolean => {
  const dotenvCsv = process.env.CSV_BOOL ?? "false";
  return dotenvCsv.toLowerCase() === "true";
};

export const jsonBool = (): boolean => {
  const dotenvJson = process.env.JSON_BOOL ?? "false";
  return dotenvJson.toLowerCase() === "true";
};

export const axiosInstance = new Axios({
  baseURL: "https://naiastats.prestosports.com",
});

export const cheerioInstance = (htmlData: string) => {
  return cheerio.load(htmlData);
};

export async function saveData(
  data: PlayerInfoType[],
  csv: boolean,
  json: boolean
) {
  if (csv) {
    await saveAsCsv(data);
  }

  if (json) {
    saveAsJson(data);
  }
}

export async function wait(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(() => res(undefined), ms));
}

export async function processConcurrently(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  funcs: (() => Promise<any>)[],
  chunkSize = 20,
  waitTimeMs = 500
) {
  // chunkSize == qps
  const safeChunkSize = Math.min(chunkSize, 20);
  const chunks = chunk(funcs, safeChunkSize);
  for (const chunk of chunks) {
    const promises = chunk.map((func) => func());
    await Promise.allSettled([...promises, wait(waitTimeMs)]);
  }
}
