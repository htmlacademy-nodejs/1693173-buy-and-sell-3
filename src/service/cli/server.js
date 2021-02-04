'use strict';

const chalk = require(`chalk`);
const http = require(`http`);
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

const readContent = async (filePath) => {
  try {
    return await fs.readFile(filePath, `utf8`);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

module.exports = {
  name: `--server`,
  run(args) {
    const serverPort = Number.parseInt(args, 10) || DEFAULT_PORT;

    const sendResponse = (res, statusCode, message) => {
      const template = `
    <!Doctype html>
      <html lang="ru">
      <head>
      <title>module2-task3</title>
      </head>
      <body>${message}</body>
    </html>`.trim();

      res.statusCode = statusCode;
      res.writeHead(statusCode, {
        'Content-Type': `text/html; charset=UTF-8`,
      });

      res.end(template);
    };

    const onClientConnect = async (req, res) => {
      const notFoundMessageText = `Not found`;

      switch (req.url) {
        case `/`:
          try {
            const mocks = JSON.parse(await readContent(MOCK_FILE_PATH));
            const message = mocks.map((post) => `<li>${post.title}</li>`).join(``);
            sendResponse(res, HttpCode.OK, `<ul>${message}</ul>`);
          } catch (err) {
            sendResponse(res, HttpCode.INTERNAL_SERVER_ERROR, notFoundMessageText);
          }

          break;
        default:
          sendResponse(res, HttpCode.NOT_FOUND, notFoundMessageText);
          break;
      }
    };


    http.createServer(onClientConnect)
      .listen(serverPort)
      .on(`listening`, (err) => {
        if (err) {
          return console.error(chalk.red(`Ошибка при создании сервера`), err);
        }

        return console.info(chalk.green(`Ожидаю соединений на ${serverPort}`));
      });
  }
};
