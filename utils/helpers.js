const checkInputs = (...arr) => {
  return [...arr].every(Boolean);
};

module.exports = { checkInputs };
