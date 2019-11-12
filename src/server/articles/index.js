import config from '../config';
import { addHeadings } from '../utils';
/**
 * retrieve full article list, support filter parameters for pagination
 * @param {*} e
 */
function getArticles(e) {
  const spreadsheet = SpreadsheetApp.openById(config.SPREADSHEET_ID);
  const wkst = spreadsheet.getSheetByName('articles');
  // will need to filters for pagination from e
  const rows = wkst.getDataRange().getValues();
  const headings = rows[0];
  const valueRows = rows.slice(1);
  const items = {
    articles: addHeadings(valueRows, headings)
  };
  for (let i = 0; i < items.articles.length; i += 1) {
    try {
      items.articles[i].author = JSON.parse(items.articles[i].author);
    } catch (error) {
      Logger.log('Failed to parse author info to json');
      Logger.log(error);
    }
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

function getTags(e) {
  return e;
}

function UpdateDeleteArticle(e) {
  return e;
}

function CreateArticle(e) {
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
  getTags,
  UpdateDeleteArticle,
  CreateArticle,
  FavoriteArticle,
  CreateArticleComment,
  DeleteArticleComment,
  FollowProfile,
  UpdateArticleTags
};
