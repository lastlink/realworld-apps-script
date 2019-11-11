import { useMock, mock } from './mock';

function buildSuccessResponse(result) {
  const output = JSON.stringify({
    status: 'success',
    data: result
  });

  return ContentService.createTextOutput(output).setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function buildErrorResponse(message, code) {
  const output = JSON.stringify({
    status: 'error',
    code,
    message
  });

  return ContentService.createTextOutput(output).setMimeType(ContentService.MimeType.JAVASCRIPT);
}

const doPost = e => {
  // if (!isAuthorized(e)) {
  //   return buildErrorResponse('not authorized', 403);
  // }
  const request = JSON.parse(JSON.stringify(e));
  if (!e.parameter.method) {
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
  switch (request.parameter.method) {
    case '/api/users/login':
      // POST
      return buildSuccessResponse(request);
    case '/api/users':
      // POST
      return buildSuccessResponse(request);
    case '/api/user':
      // PUT
      return buildSuccessResponse(request);
    case '/api/tags':
      return buildSuccessResponse(request);
    case e.parameter.method.indexOf('/api/profiles/') !== -1 &&
      e.parameter.method.indexOf('/follow') !== -1:
      // POST /api/profiles/:username/follow
      // DELETE /api/profiles/:username/follow
      // support unfollow as well with same method
      return buildSuccessResponse(request);
    case e.parameter.method.indexOf('/api/articles/') !== -1 &&
      e.parameter.method.indexOf('/comments/') !== -1:
      // DELETE /api/articles/:slug/comments/:id
      return buildSuccessResponse(request);
    case e.parameter.method.indexOf('/api/articles/') !== -1 &&
      e.parameter.method.indexOf('/comments') !== -1:
      // POST /api/articles/:slug/comments
      return buildSuccessResponse(request);
    case e.parameter.method.indexOf('/api/articles/') !== -1 &&
      e.parameter.method.indexOf('/favorite') !== -1:
      // POST /api/articles/:slug/favorite
      // DELETE /api/articles/:slug/favorite
      return buildSuccessResponse(request);
    case e.parameter.method.indexOf('/api/articles/') !== -1:
      // PUT /api/articles/:slug
      // DELETE /api/articles/:slug
      return buildSuccessResponse(request);
    default:
      // check dynamic routes here?
      // /api/profiles/:username
      return buildErrorResponse('Post Method not found', 404);
  }
};

const doGet = e => {
  let request = JSON.parse(JSON.stringify(e));
  // makes debugging online easier without deploying a new version
  if (useMock) {
    if (mock.postMethod) return doPost(mock.ePost);
    request = mock.eGet;
  }
  if (!e.parameter.method) {
    return buildErrorResponse('GET method query parameter missing.', 404);
  }
  // route by method
  switch (e.parameter.method) {
    case '/api/user':
      return buildSuccessResponse(request);
    case '/api/articles':
      return buildSuccessResponse(request);
    case '/api/articles/feed':
      return buildSuccessResponse(request);
    case '/api/tags':
      return buildSuccessResponse(request);
    case e.parameter.method.indexOf('/api/profiles/') !== -1:
      // /api/profiles/:username
      return buildSuccessResponse(request);
    case e.parameter.method.indexOf('/api/articles/') !== -1 &&
      e.parameter.method.indexOf('/comments') !== -1:
      // GET /api/articles/:slug/comments
      return buildSuccessResponse(request);
    case e.parameter.method.indexOf('/api/articles/') !== -1:
      // GET /api/articles/:slug
      return buildSuccessResponse(request);
    default:
      // check dynamic routes here?
      // /api/profiles/:username
      return buildErrorResponse('GET Method not found', 404);
  }
};

/*
function addHeadings(posts, headings) {
  return posts.map(function(postAsArray) {
    const postAsObj = {};

    headings.forEach(function(heading, i) {
      postAsObj[heading] = postAsArray[i];
    });

    return postAsObj;
  });
}
*/

export { doGet, doPost };
