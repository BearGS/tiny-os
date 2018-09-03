/* eslint-disable */
let warning = () => {};

if (__DEV__) {
  const printWarning = function(format, ...args) {
    let argIndex = 0;
    const message = 'Warning: ' + format.replace(/%s/g, () => args[argIndex++]);
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      throw new Error(message);
    } catch (x) {}
  };

  warning = function(condition, format, ...args) {
    if (format === undefined) {
      throw new Error(
        '`warning(condition, format, ...args)` requires a warning ' +
          'message argument',
      );
    }
    if (condition) {
      printWarning(format, ...args);
    }
  };
}

export default warning;

