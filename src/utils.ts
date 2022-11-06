import { Axios } from "axios";
import * as cheerio from "cheerio";
import * as fs from "fs";
import { chunk } from "lodash";
import ObjectsToCsv from "objects-to-csv";
import path from "path";

import { PlayerInfoType } from "./player-data/constants";

const pathToDataFile = (fileName: string) => {
  return path.resolve(__dirname, "..", "assets", fileName);
};

async function saveAsCsv(data: PlayerInfoType[], filename: string) {
  const csv = new ObjectsToCsv(data);
  await csv.toDisk(pathToDataFile(`${filename}.csv`));
}

function saveAsJson(data: PlayerInfoType[], filename: string) {
  fs.writeFileSync(
    pathToDataFile(`${filename}.json`),
    JSON.stringify(data, null, 2)
  );
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

export function transposeMatrix(matrix: string[][]): string[][] {
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

export async function saveData(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[],
  filename: string,
  options: {
    csv: boolean;
    json: boolean;
  }
) {
  if (options.csv) {
    await saveAsCsv(data, filename);
  }

  if (options.json) {
    saveAsJson(data, filename);
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
