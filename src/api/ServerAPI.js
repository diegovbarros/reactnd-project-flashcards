import { AsyncStorage } from 'react-native';
import _ from 'lodash';

const STORAGE_KEY = 'FLASHCARDS:DATABASE';

/**
 * @description Return all decks
 * @returns {Object} All decks
 */
export async function getDecks() {
  return AsyncStorage.getItem(STORAGE_KEY).then((data) => {
    return data ? JSON.parse(data) : {};
  });
}

/**
 * @description Returns a specific Deck
 * @param {String} title - Deck Title
 * @returns {Object} Returns the Deck
 */
export async function getDeck(title) {
  return AsyncStorage.getItem(STORAGE_KEY).then((data) => {
    return data && JSON.parse(data)[title] ? { [title]: JSON.parse(data)[title] } : {};
  });
}

/**
 * @description Add/Up the deck
 * @param {String} title - Deck Title
 * @param {Timestamp} timestamp - Date now
 */
export async function saveDeck(title, timestamp) {
  const all = await getDecks();
  const decks = {
    ...all,
    [title]: { title, questions: [], quizzes: [], timestamp },
  };

  AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(decks));

  return getDeck(title);
}

/**
 * @description Add/Up a card on a specific Deck
 * @param {String} title - Deck Title
 * @param {Object}  card  - Card
 */
export async function saveCard(title, card) {
  const all = await getDecks();
  const decks = {
    ...all,
    [title]: { ...all[title], questions: all[title].questions.concat(card) },
  };

  AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(decks));

  return getDeck(title);
}

/**
 * @description Remove a deck
 * @param {String} title - Deck Title
 */
export async function removeDeck(title) {
  return AsyncStorage.getItem(STORAGE_KEY).then((results) => {
    const data = JSON.parse(results);
    data[title] = undefined;
    delete data[title];
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  });
}

/**
 * @description Remove a Deck`s card
 * @param {String} title  - Deck Title
 * @param {Object} id     - Card`s Id
 */
export function removeCard(title, id) {
  return AsyncStorage.getItem(STORAGE_KEY).then((results) => {
    const data = JSON.parse(results);
    data[title].questions = data[title].questions.filter((c) => c.id !== id);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  });
}

/**
 * @description Add/Up a card on a specific Deck
 * @param {String} title - Deck Title
 * @param {Number}  points  - Points
 * @param {Array}  cards  - List of Questions
 */
export async function saveQuiz(title, quiz) {
  const all = await getDecks();
  const quizzes = [...all[title].quizzes, quiz];

  const decks = {
    ...all,
    [title]: { ...all[title], quizzes: _.take(_.orderBy(quizzes, ['points'], ['desc']), 3) },
  };

  AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(decks));

  return getDeck(title);
}
