'use strict';

const {
  getRandomInt,
  shuffle,
} = require(`../../utils`);

const fs = require(`fs`).promises;
const chalk = require(`chalk`);

const DEFAULT_COUNT = 1;
const FILE_NAME = `mocks.json`;
const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;

const OfferType = {
  OFFER: `offer`,
  SALE: `sale`,
};

const PictureRestrict = {
  MIN: 0,
  MAX: 16
};

const SumRestrict = {
  MIN: 1000,
  MAX: 100000,
};

const getPictureFileName = (num) => {
  return `item${num}.jpg`;
};

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

const generateOffers = (count, titles, categories, sentences) => (
  Array(count).fill({}).map(() => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    picture: getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)),
    description: shuffle(sentences).slice(1, 5).join(` `),
    type: Object.keys(OfferType)[Math.floor(Math.random() * Object.keys(OfferType).length)],
    sum: getRandomInt(SumRestrict.MIN, SumRestrict.MAX),
    category: shuffle(categories).slice(0, (getRandomInt(0, categories.length - 1))),
  }))
);

module.exports = {
  name: `--generate`,
  async run(args) {
    let sentences;
    let titles;
    let categories;

    await Promise.all([readContent(FILE_SENTENCES_PATH), readContent(FILE_TITLES_PATH), readContent(FILE_CATEGORIES_PATH)]).then((values) => {
      [sentences, titles, categories] = values;
    });

    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    if (countOffer > 1000) {
      console.error(chalk.red(`Не больше 1000 объявлений...`));
      return;
    }

    const content = JSON.stringify(generateOffers(countOffer, titles, categories, sentences));
    try {
      await fs.writeFile(FILE_NAME, content);
      console.info(chalk.green(`Файл успешно создан.`));
    } catch (err) {
      console.error(chalk.red(`Не могу создать файл...`));
    }
  }
};
