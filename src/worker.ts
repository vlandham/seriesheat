import { createDbWorker, WorkerHttpvfs } from "sql.js-httpvfs";

const workerUrl = new URL(
  "sql.js-httpvfs/dist/sqlite.worker.js",
  import.meta.url
);
const wasmUrl = new URL("sql.js-httpvfs/dist/sql-wasm.wasm", import.meta.url);

export async function loadWorker() {
  const worker = await createDbWorker(
    [
      {
        virtualFilename: "imdb",
        from: "jsonconfig",
        configUrl: "db4/config.json",
      },
    ],
    workerUrl.toString(),
    wasmUrl.toString()
  );

  // const result = await worker.db.query(
  //   `select * from titles t where t.primaryTitle like "%arrested%";`
  // );
  return worker;

  // console.log(result);

  // document.body.textContent = JSON.stringify(result);
}
