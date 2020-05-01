function omit(obj = {}, fieldName = '') {
  const newObj = {};

  for (let key of obj) {
    if (key === fieldName) {
      newObj[key] = obj[key];
    }
  }

  return newObj;
}

export { omit };
