// import CryptoJS from '../helpers/AES';
import config from '../config';
import { addHeadings, getArrayOfRowAttribute } from '../utils';

// function isAuthorized(e) {
//     return 'key' in e.parameters && e.parameters.key[0] === config.API_KEY;
// }

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

  // store in cache???

  response = {
    user: {}
  };
  // return results
  const selectAttrs = ['username', 'email', 'bio', 'image', 'token'];
  for (let i = 0; i < selectAttrs.length; i += 1) {
    response.user[selectAttrs[i]] = request.user[selectAttrs[i]];
  }
  return e;
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

function GetCurrentProfile(e) {
  return e;
}

function GetUserProfile(e) {
  return e;
}
export default { LoginUser, UpdateProfile, RegisterUser, GetCurrentProfile, GetUserProfile };
