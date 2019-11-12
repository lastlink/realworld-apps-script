// import CryptoJS from '../helpers/AES';
import config from '../config';
import { addHeadings, getArrayOfRowAttribute } from '../utils';

/**
 * decode jwt token
 * @param {*} jwtToken
 */
function decodeJWT(jwtToken) {
  let jwtObject = null;
  try {
    jwtObject = CryptoJS.AES.decrypt(jwtToken, config.JWT_KEY).toString(CryptoJS.enc.Utf8);
    jwtObject = JSON.parse(jwtObject);
  } catch (error) {
    Logger.log('error decoding jwt');
    Logger.log(error);
  }
  return jwtObject;
}

function isAuthorized(e) {
  const currentDate = new Date();
  // return 'key' in e.parameters && e.parameters.key[0] === config.API_KEY;
  // check for auth token in post body then
  const request = e.postData.contents;
  if (!request.Authorization) {
    return {
      noAuth: true
    };
  }
  if (request.Authorization.indexOf('Token ') === -1) {
    return {
      errors: 'Authorization header in invalid format'
    };
  }
  const jwtObject = decodeJWT(request.Authorization.replace('Token ', ''));
  if (jwtObject && jwtObject.expires <= currentDate) {
    return {
      errors: 'Jwt token has now expired'
    };
  }
  return jwtObject;

  // check if jwt exists in cache return false
}

/**
 * encrypt the password, a bcrypt hash would be preferred
 * http://ramblings.mcpher.com/Home/excelquirks/gassnips/cryptogs
 * @param {*} pw
 * @param {*} salt
 */
function encryptPassword(pw, salt) {
  /* global CryptoJS */
  const encryptedPw = CryptoJS.AES.encrypt(pw, salt).toString();
  return encryptedPw;
}

/**
 * check that the passwords match
 * @param {*} pw
 * @param {*} hash
 * @param {*} salt
 */
function checkPasswordMatch(pw, hash, salt) {
  const decrypt = CryptoJS.AES.decrypt(hash, salt).toString(CryptoJS.enc.Utf8);
  return pw === decrypt;
}

/**
 * encode jwt object
 * @param {*} jwtObject
 */
function encodeJWT(jwtObject) {
  const jwtToken = encryptPassword(JSON.stringify(jwtObject), config.JWT_KEY);
  return jwtToken;
}

// const navigator = {};
// const window = {};
// // eval(UrlFetchApp.fetch('https://kjur.github.io/jsrsasign/jsrsasign-latest-all-min.js').getContentText());
// /* sample output:
// Signing JSON Web Token:eyJhbGciOiJIUzI1NiJ9.eyJuYW1lIjogInVzZXIiLCJnbWFpbCI6InVzZXJAZ21haWwuY29tIn0.iM_n__aH7Bl1ZfJirgTckU51x1xbRi6cw8lJMK4G5K8
// Validate Signature:true
// *** Header ***
// Parsing Header:{"alg":"HS256"}
// *** Payload ***
// Parsing Payload:{"name":"user","gmail":"user@gmail.com"}
// */
// const navigator = {};
// const window = {};
// function myfunction() {
//   // JWS signing
//   var sJWT = KJUR.jws.JWS.sign(null, '{"alg":"HS256"}', '{"name": "user","gmail":"user@gmail.com"}', {
//     utf8: 'password'
//   });

//   Logger.log('Signing JSON Web Token:${sJWT}');

//   // JWT validation
//   var isValid = KJUR.jws.JWS.verifyJWT(sJWT, { utf8: 'password' }, { alg: ['HS256'] });
//   Logger.log('Validate Signature:'+isValid);

//   const headerObj = KJUR.jws.JWS.readSafeJSONString(b64utoutf8(sJWT.split('.')[0]));
//   Logger.log('*** Header ***');
//   Logger.log('Parsing Header:'+JSON.stringify(headerObj));

//   const payloadObj = KJUR.jws.JWS.readSafeJSONString(b64utoutf8(sJWT.split('.')[1]));
//   Logger.log('*** Payload ***');
//   Logger.log('Parsing Payload:'+JSON.stringify(payloadObj));
// }

/**
 * check that user exists,
 * verify password matches encrypted password,
 * generate auth token,
 * return user info and token
 * @param {*} e
 */
function LoginUser(e) {
  let response = {};
  const request = e.postData.contents;
  // check for required fields
  if (!request.user) {
    response.errors = {
      user: "can't be empty"
    };
    return response;
  }
  const required = ['email', 'password'];
  for (let i = 0; i < required.length; i += 1) {
    if (!request.user[required[i]]) {
      if (!response.errors) response.errors = {};

      response.errors[required[i]] = `can't be empty`;
    }
  }

  if (response.errors) {
    return response;
  }

  // search for user by username
  const spreadsheet = SpreadsheetApp.openById(config.SPREADSHEET_ID);
  const wkst = spreadsheet.getSheetByName('users');
  const rows = wkst.getDataRange().getValues();
  const headings = rows[0];
  const valueRows = rows.slice(1);
  const resultList = addHeadings(valueRows, headings);
  let rIndex = -1;
  let result = null;
  for (let i = 0; i < resultList.length; i += 1) {
    if (resultList[i].email === request.user.email) {
      rIndex = i;
      result = resultList[i];
      break;
    }
  }
  if (rIndex === -1 || result === null) {
    if (!response.errors) response.errors = {};
    response.errors.username = `this email is not in our database`;
  } else if (!checkPasswordMatch(request.user.password, result.hash, result.salt)) {
    // check password
    if (!response.errors) response.errors = {};
    response.errors.password = `password does not match, please try again`;
  }

  if (response.errors) {
    return response;
  }
  // generate a jwt token
  // https://wtfruby.com/gas/2018/11/21/jwt-app-scripts.html
  // const stateToken = ScriptApp.newStateToken()
  //   .withArgument('userId', result.id)
  //   .createToken();
  // result.token = stateToken;

  response = {
    user: {}
  };
  // return results
  const selectAttrs = ['username', 'email', 'bio', 'image'];
  for (let i = 0; i < selectAttrs.length; i += 1) {
    response.user[selectAttrs[i]] = result[selectAttrs[i]];
  }
  const jwtObject = JSON.parse(JSON.stringify(response));
  // expire in 7 days, really this is just so that the tokens are unique, the cache will enforce expiration
  const expireDate = new Date();
  expireDate.setDate(expireDate.getDate() + 7);
  jwtObject.expires = expireDate;
  response.user.token = encodeJWT(jwtObject);
  // store in cache??? no I'll just check the expiration date

  // const decodedJWT = decodeJWT(response.token);
  // Logger.log(decodedJWT);

  return response;
}

function UpdateProfile(e) {
  return e;
}

function RegisterUser(e) {
  let response = {};
  const request = e.postData.contents;
  // check for required fields
  if (!request.user) {
    response.errors = {
      user: "can't be empty"
    };
    return response;
  }
  const required = ['username', 'email', 'password'];
  for (let i = 0; i < required.length; i += 1) {
    if (!request.user[required[i]]) {
      if (!response.errors) response.errors = {};

      response.errors[required[i]] = `can't be empty`;
    }
  }

  if (response.errors) {
    return response;
  }

  const spreadsheet = SpreadsheetApp.openById(config.SPREADSHEET_ID);
  const wkst = spreadsheet.getSheetByName('users');
  const rows = wkst.getDataRange().getValues();
  const headings = rows[0];
  const valueRows = rows.slice(1);
  // check unique email and username
  const usernameList = getArrayOfRowAttribute(valueRows, headings, 'username');
  if (usernameList.indexOf(request.user.username) !== -1) {
    if (!response.errors) response.errors = {};
    response.errors.username = `username already in use`;
  } else {
    const emailList = getArrayOfRowAttribute(valueRows, headings, 'email');
    if (emailList.indexOf(request.user.email) !== -1) {
      if (!response.errors) response.errors = {};
      response.errors.email = `email already in use`;
    }
  }
  if (response.errors) {
    return response;
  }
  // encrypt password
  request.user.salt =
    Math.random()
      .toString(36)
      .substring(2, 15) +
    Math.random()
      .toString(36)
      .substring(2, 15);
  request.user.hash = encryptPassword(request.user.password, request.user.salt);
  // Logger.log(e);
  // only adds post data if there is a matching column in sheet
  const currentDate = new Date();
  const newUserRow = [];
  for (let h = 0; h < headings.length; h += 1) {
    if (request.user[headings[h]]) newUserRow.push(request.user[headings[h]]);
    else {
      switch (headings[h]) {
        case 'createdAt':
        case 'updatedAt':
          request.user.createdAt = currentDate;
          request.user.updatedAt = currentDate;
          newUserRow.push(currentDate);
          break;
        case 'id':
          newUserRow.push(rows.length - 1);
          request.user.id = rows.length - 1;
          break;
        default:
          newUserRow.push('');
          break;
      }
    }
  }
  response = {
    user: {}
  };
  // select attributes to include in response
  const selectAttrs = ['username', 'email', 'bio', 'image'];
  for (let i = 0; i < selectAttrs.length; i += 1) {
    response.user[selectAttrs[i]] = request.user[selectAttrs[i]];
  }
  wkst.appendRow(newUserRow);
  return response;
}

function GetCurrentProfile(jwtObject) {
  // retrieve from db the user current information
  return jwtObject;
}

function GetUserProfile(e) {
  return e;
}
export default {
  LoginUser,
  UpdateProfile,
  RegisterUser,
  GetCurrentProfile,
  GetUserProfile,
  isAuthorized
};
