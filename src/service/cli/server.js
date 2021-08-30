'use strict';

const express = require(`express`);
const app = express();

const fs = require(`fs`).promises;

const DEFAULT_PORT = 3000;
const MOCK_FILE_PATH = `./mocks.json`;

const HttpCode = {
  OK: 200,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
};

app.use(express.json());

app.get(`/offers`, async (req, res) => {
  try {
    const fileContent = await fs.readFile(MOCK_FILE_PATH);
    const mocks = JSON.parse(fileContent);
    res.json(mocks);
  } catch (_err) {
    res.send([]);
  }
});

app.use((req, res) => res
  .status(HttpCode.NOT_FOUND)
  .send(`Not found`));

module.exports = {
  name: `--server`,
  run(args) {
    const serverPort = Number.parseInt(args, 10) || DEFAULT_PORT;
    app.listen(serverPort);
  }
};
