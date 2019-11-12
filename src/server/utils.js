const ONE_SECOND = 1000;
const ONE_MINUTE = ONE_SECOND * 60;
const START_TIME = Date.now();
const MAX_RETRIES = 5;

const expBackoff = func => {
  for (let n = 0; n <= MAX_RETRIES; n += 1) {
    try {
      return func();
    } catch (e) {
      if (n === MAX_RETRIES) {
        throw e;
      }
      Utilities.sleep(2 ** n * ONE_SECOND + Math.round(Math.random() * ONE_SECOND));
    }
  }
  return null;
};

const hasCpuTime = () => !(Date.now() - START_TIME > ONE_MINUTE * 4);

function addHeadings(posts, headings) {
  return posts.map(function(postAsArray) {
    const postAsObj = {};

    headings.forEach(function(heading, i) {
      postAsObj[heading] = postAsArray[i];
    });

    return postAsObj;
  });
}

/**
 * can be used for unique email and username check
 * @param {*} sheetRows
 * @param {*} headings
 * @param {*} attr
 */
function getArrayOfRowAttribute(sheetRows, headings, attr) {
  return sheetRows.map(function(rowAsArray) {
    let attrValue = '';

    const hIndex = headings.indexOf(attr);
    if (hIndex !== -1) {
      attrValue = rowAsArray[hIndex];
    }

    return attrValue;
  });
}

export { expBackoff, hasCpuTime, addHeadings, getArrayOfRowAttribute };
