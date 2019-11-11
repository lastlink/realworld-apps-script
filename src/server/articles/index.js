import config from '../config';
import { addHeadings } from '../utils';
/**
 * retrieve full article list, support filter parameters for pagination
 * @param {*} e
 */
function getArticles(e) {
  // work again
  const spreadsheet = SpreadsheetApp.openById(config.SPREADSHEET_ID);
  // check if device in attempts or checkins
  // check checkins
  const wkst = spreadsheet.getSheetByName('articles');
  // will need to filter length from e
  const rows = wkst
    .getDataRange()
    // .sort({ column: 2, ascending: false })
    .getValues();
  const headings = rows[0];
  const valueRows = rows.slice(1);
  const items = {
    articles: addHeadings(valueRows, headings)
  };
  for (let i = 0; i < items.articles.length; i++) {
    try {
      items.articles[i].author = JSON.parse(items.articles[i].author);
    } catch (error) {}
    if (!items.articles[i].favoritesCount) {
      items.articles[i].favoritesCount = 0;
      items.articles[i].favorited = true;
    } else items.articles[i].favorited = false;
    if (!items.articles[i].tagList) {
      items.articles[i].tagList = [];
    }
  }
  Logger.log(e);

  return items;
}

function getArticleFeed(e) {
  return e;
}

function getArticleComments(e) {
  return e;
}

function getArticle(e) {
  return e;
}

function CreateDeleteArticle(e) {
  return e;
}

function UpdateArticle(e) {
  return e;
}

/**
 * favorite or unfavorite an article
 * @param {*} e
 */
function FavoriteArticle(e) {
  return e;
}

function CreateArticleComment(e) {
  return e;
}

function DeleteArticleComment(e) {
  return e;
}

/**
 * follow or unfollow a profile
 * @param {*} e
 */
function FollowProfile(e) {
  return e;
}

function UpdateArticleTags(e) {
  return e;
}

export default {
  getArticles,
  getArticleFeed,
  getArticleComments,
  getArticle,
  CreateDeleteArticle,
  UpdateArticle,
  FavoriteArticle,
  CreateArticleComment,
  DeleteArticleComment,
  FollowProfile,
  UpdateArticleTags
};