const isSuccesfullRequest = (code) => {
  if (code >= 200 && code < 300) {
    return true;
  }
  return false;
};

const isNoData = (code) => {
  if (code == 9006) {
    return true;
  }
  return false;
};

const isExpiredToken = (code) => {
  if (code >= 200 && code < 300) {
    return true;
  }
  return false;
};

export { isSuccesfullRequest, isExpiredToken, isNoData };
