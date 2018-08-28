/* eslint-disable */
let lowPriorityWarning = function() {};

if (process.env.NODE_ENV !== 'production') {
  const printWarning = function(format, ...args) {
    let argIndex = 0;
    const message = 'Warning: ' + format.replace(/%s/g, () => args[argIndex++]);
    if (typeof console !== 'undefined') {
      console.warn(message);
    }
    try {
      throw new Error(message);
    } catch (x) {}
  };

  lowPriorityWarning = function(condition, format, ...args) {
    if (format === undefined) {
      throw new Error(
        '`warning(condition, format, ...args)` requires a warning ' +
          'message argument',
      );
    }
    if (!condition) {
      printWarning(format, ...args);
    }
  };
}

export default lowPriorityWarning;
