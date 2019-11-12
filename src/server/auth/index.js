// import CryptoJS from '../helpers/AES';
import config from '../config';
import { addHeadings, getArrayOfRowAttribute } from '../utils';

// function isAuthorized(e) {
//     return 'key' in e.parameters && e.parameters.key[0] === config.API_KEY;
// }
function LoginUser(e) {
  return e;
}

function UpdateProfile(e) {
  return e;
}

function encryptPassword(pw, salt) {
  return CryptoJS.AES.encrypt(pw, salt).toString();
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
  const ArrayOfRows = addHeadings(valueRows, headings);
  // check unique email and username
  const usernameList = getArrayOfRowAttribute(ArrayOfRows, headings, 'username');
  if (usernameList.indexOf(request.user.username) !== -1) {
    response.errors.username = `username already in use`;
  } else {
    const emailList = getArrayOfRowAttribute(ArrayOfRows, headings, 'email');
    if (emailList.indexOf(request.user.email) !== -1) {
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
  request.user.password = encryptPassword(request.user.password, request.user.salt);
  response = request;
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
