'use strict';

const fs = require(`fs`);
const {getRandomInt, shuffle} = require(`../../utils`);
const {ExitCode} = require(`../../constants`);

const FILE_NAME = `mock.json`;
const MAX_POSTS_COUNT = 1000;
const DEFAULT_COUNT = 1;
const MONTHS_GAP = 3;
const DATE_GMT_INDEX = 24;

const TITLES = [
  `Ёлки. История деревьев`,
  `Как перестать беспокоиться и начать жить`,
  `Как достигнуть успеха не вставая с кресла`,
  `Обзор новейшего смартфона`,
  `Лучшие рок-музыканты 20-века`,
  `Как начать программировать`,
  `Учим HTML и CSS`,
  `Что такое золотое сечение`,
  `Как собрать камни бесконечности`,
  `Борьба с прокрастинацией`,
  `Рок — это протест`,
  `Самый лучший музыкальный альбом этого года`
];

const SENTENCES = [
  `Ёлки — это не просто красивое дерево. Это прочная древесина.`,
  `Первая большая ёлка была установлена только в 1938 году.`,
  `Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
  `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
  `Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
  `Собрать камни бесконечности легко, если вы прирожденный герой.`,
  `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
  `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
  `Программировать не настолько сложно, как об этом говорят.`,
  `Простые ежедневные упражнения помогут достичь успеха.`,
  `Это один из лучших рок-музыкантов.`,
  `Он написал больше 30 хитов.`,
  `Из под его пера вышло 8 платиновых альбомов.`,
  `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.`,
  `Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
  `Достичь успеха помогут ежедневные повторения.`,
  `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
  `Как начать действовать? Для начала просто соберитесь.`,
  `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
  `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`
];

const CATEGORIES = [
  `Деревья`,
  `За жизнь`,
  `Без рамки`,
  `Разное`,
  `IT`,
  `Музыка`,
  `Кино`,
  `Программирование`,
  `Железо`
];

const AnnounceLength = {
  MIN: 0,
  MAX: 5
};

const StatusMessage = {
  SUCCESS: `Operation success. File was created.`,
  ERROR: `Can't write data to file. Something went wrong.`,
  TOO_MANY_POSTS: `You can't get more then 1000 posts`
};

const getRandomDateInRange = () => {
  const currentDate = new Date();
  const currentDateInMs = currentDate.getTime();

  const pastDate = new Date();
  pastDate.setMonth(currentDate.getMonth() - MONTHS_GAP);
  const pastDateInMs = pastDate.getTime();

  return new Date(getRandomInt(pastDateInMs, currentDateInMs)).toString().slice(0, DATE_GMT_INDEX);
};

const generatePosts = (count) => (
  Array(count).fill({}).map(() => ({
    title: TITLES[getRandomInt(0, TITLES.length - 1)],
    createdDate: getRandomDateInRange(),
    announce: shuffle(SENTENCES).slice(AnnounceLength.MIN, AnnounceLength.MAX).join(` `),
    fullText: shuffle(SENTENCES).slice(0, getRandomInt(1, SENTENCES.length)).join(` `),
    сategory: shuffle(CATEGORIES).slice(0, getRandomInt(1, CATEGORIES.length))
  }))
);

module.exports = {
  name: `--generate`,
  run(args) {
    const [count] = args;
    const postsCount = parseInt(count, 10) || DEFAULT_COUNT;

    if (postsCount > MAX_POSTS_COUNT) {
      console.info(StatusMessage.TOO_MANY_POSTS);
      process.exit(ExitCode.SUCCESS);
    }

    const content = JSON.stringify(generatePosts(postsCount));

    fs.writeFile(FILE_NAME, content, (error) => {
      if (error) {
        return console.error(StatusMessage.ERROR);
      }

      return console.info(StatusMessage.SUCCESS);
    });
  }
};
