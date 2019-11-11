import { mock } from './mock';
import ArticleService from './articles';
import AuthService from './auth';

/**
 * match response here https://github.com/gothinkster/realworld/tree/master/api
 * @param {*} result
 */
function buildSuccessResponse(result) {
  const output = JSON.stringify(result);

  return ContentService.createTextOutput(output).setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function buildErrorResponse(message, code) {
  const output = JSON.stringify({
    errors: message,
    message
  });

  return ContentService.createTextOutput(output).setMimeType(ContentService.MimeType.JAVASCRIPT);
}

const doPost = e => {
  // if (!isAuthorized(e)) {
  //   return buildErrorResponse('not authorized', 403);
  // }
  const request = JSON.parse(JSON.stringify(e));
  if (!request.parameter.method) {
    return buildErrorResponse('Post method query parameter missing.', 404);
  }
  if (request.postData.type === 'application/json') {
    try {
      request.postData.contents = JSON.parse(request.postData.contents);
    } catch (error) {
      return buildErrorResponse('Post Data is not a vald json', 405);
    }
  } else {
    return buildErrorResponse('Content Type should be application/json', 405);
  }
  let response = null;
  switch (request.parameter.method) {
    case '/api/users/login':
      // POST
      response = AuthService.LoginUser(request);
      return buildSuccessResponse(response);
    case '/api/users':
      // POST
      response = AuthService.UpdateProfile(request);
      return buildSuccessResponse(response);
    case '/api/user':
      // PUT
      response = AuthService.RegisterUser(request);
      return buildSuccessResponse(response);
    case '/api/tags':
      return buildSuccessResponse(request);
    default:
      break;
  }
  if (
    request.parameter.method.indexOf('/api/profiles/') !== -1 &&
    request.parameter.method.indexOf('/follow') !== -1
  ) {
    // POST /api/profiles/:username/follow
    // DELETE /api/profiles/:username/follow
    // support unfollow as well with same method
    response = ArticleService.FollowProfile(request);
    return buildSuccessResponse(response);
  }
  if (
    request.parameter.method.indexOf('/api/articles/') !== -1 &&
    request.parameter.method.indexOf('/comments/') !== -1
  ) {
    // DELETE /api/articles/:slug/comments/:id
    response = ArticleService.DeleteArticleComment(request);
    return buildSuccessResponse(response);
  }
  if (
    request.parameter.method.indexOf('/api/articles/') !== -1 &&
    request.parameter.method.indexOf('/comments') !== -1
  ) {
    // POST /api/articles/:slug/comments
    response = ArticleService.CreateArticleComment(request);
    return buildSuccessResponse(response);
  }
  if (
    request.parameter.method.indexOf('/api/articles/') !== -1 &&
    request.parameter.method.indexOf('/favorite') !== -1
  ) {
    // POST /api/articles/:slug/favorite
    // DELETE /api/articles/:slug/favorite
    response = ArticleService.FavoriteArticle(request);
    return buildSuccessResponse(response);
  }
  if (request.parameter.method.indexOf('/api/articles/') !== -1) {
    // PUT /api/articles/:slug
    // DELETE /api/articles/:slug
    response = ArticleService.CreateDeleteArticle(request);
    return buildSuccessResponse(response);
  }
  if (request.parameter.method.indexOf('/api/articles') !== -1) {
    // POST /api/articles
    response = ArticleService.UpdateArticle(request);
    return buildSuccessResponse(response);
  }
  // check dynamic routes here?
  // /api/profiles/:username
  return buildErrorResponse('Post Method not found', 404);
};
const doGet = e => {
  let request = null;
  try {
    request = JSON.parse(JSON.stringify(e));
  } catch (error) {
    Logger.log('Debugging function directly.');
  }

  // makes debugging online easier without deploying a new version
  /* global useMock */
  if (typeof useMock !== 'undefined' && useMock) {
    if (mock.postMethod) return doPost(mock.ePost);
    request = mock.eGet;
    // return buildSuccessResponse(request);
  }
  if (!request) {
    return buildErrorResponse('GET url is empty.', 404);
  }
  if (!request.parameter.method) {
    return buildErrorResponse('GET method query parameter missing.', 404);
  }
  let response = null;
  // route by method
  switch (request.parameter.method) {
    case '/api/user':
      response = AuthService.GetCurrentProfile(request);
      return buildSuccessResponse(response);
    case '/api/articles':
      response = ArticleService.getArticle(request);
      return buildSuccessResponse(response);
    case '/api/articles/feed':
      response = ArticleService.getArticleFeed(request);
      return buildSuccessResponse(response);
    case '/api/tags':
      response = ArticleService.UpdateArticle(request);
      return buildSuccessResponse(response);
    default:
      break;
  }
  if (request.parameter.method.indexOf('/api/profiles/') !== -1) {
    // /api/profiles/:username
    response = AuthService.GetUserProfile(request);
    return buildSuccessResponse(response);
  }
  if (
    request.parameter.method.indexOf('/api/articles/') !== -1 &&
    request.parameter.method.indexOf('/comments') !== -1
  ) {
    // GET /api/articles/:slug/comments
    response = ArticleService.getArticleComments(request);
    return buildSuccessResponse(response);
  }
  if (request.parameter.method.indexOf('/api/articles/') !== -1) {
    // GET /api/articles/:slug
    response = ArticleService.getArticles(request);
    return buildSuccessResponse(response);
  }
  // default:
  // check dynamic routes here?
  // /api/profiles/:username
  return buildErrorResponse(`GET Method not found:${request.parameter.method}`, 404);
};

export { doGet, doPost };
