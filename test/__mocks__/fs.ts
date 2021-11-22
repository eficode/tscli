const existsSync = jest.fn();
const promises = {
  readFile: jest.fn(),
  writeFile: jest.fn(),
};

export {
  existsSync,
  promises
}
