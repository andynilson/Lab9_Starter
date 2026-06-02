/*
  Lab 9 - JavaScript Error Handling, Monitoring, and JS Docs

  This file demonstrates:
  - console.log, console.error, console.table, console.dir, console.dirxml,
    console.group/console.groupEnd, console.time/console.timeEnd, and console.trace
  - try/catch/finally
  - throw
  - custom error classes extending Error
  - global error handling with window.addEventListener('error')
*/

class CalculatorInputError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CalculatorInputError';
  }
}

class CalculationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CalculationError';
  }
}

const form = document.querySelector('#calculator-form');
const output = document.querySelector('#result-output');
const firstNumInput = document.querySelector('#first-num');
const secondNumInput = document.querySelector('#second-num');
const operatorSelect = document.querySelector('#operator');

/**
 * Converts an input string into a number.
 * Throws a custom CalculatorInputError when the input is empty or invalid.
 *
 * @param {string} value - Raw value from the input element.
 * @param {string} fieldName - Human-readable field name for error messages.
 * @returns {number} The parsed number.
 */
function parseNumber(value, fieldName) {
  if (value.trim() === '') {
    throw new CalculatorInputError(`${fieldName} is required.`);
  }

  const parsedValue = Number(value);

  if (Number.isNaN(parsedValue)) {
    throw new CalculatorInputError(`${fieldName} must be a valid number.`);
  }

  return parsedValue;
}

/**
 * Performs one calculator operation.
 * Throws a custom CalculationError for invalid calculations.
 *
 * @param {number} firstNum - First operand.
 * @param {string} operator - Calculator operator.
 * @param {number} secondNum - Second operand.
 * @returns {number} The calculation result.
 */
function calculateResult(firstNum, operator, secondNum) {
  switch (operator) {
    case '+':
      return firstNum + secondNum;
    case '-':
      return firstNum - secondNum;
    case '*':
      return firstNum * secondNum;
    case '/':
      if (secondNum === 0) {
        throw new CalculationError('Division by zero is not allowed.');
      }
      return firstNum / secondNum;
    default:
      throw new CalculationError(`Unsupported operator: ${operator}`);
  }
}

/**
 * Handles calculator form submission using try/catch/finally.
 * This is intentionally realistic: user input can be blank, invalid, or mathematically impossible.
 *
 * @param {SubmitEvent} event - Form submit event.
 */
function handleCalculate(event) {
  event.preventDefault();

  try {
    const firstNum = parseNumber(firstNumInput.value, 'First number');
    const secondNum = parseNumber(secondNumInput.value, 'Second number');
    const result = calculateResult(firstNum, operatorSelect.value, secondNum);

    output.textContent = result;
    console.log('Calculation succeeded.', {
      firstNum,
      operator: operatorSelect.value,
      secondNum,
      result
    });
  } catch (error) {
    output.textContent = error.message;

    if (error instanceof CalculatorInputError || error instanceof CalculationError) {
      console.warn(`${error.name}: ${error.message}`);
    } else {
      console.error('Unexpected calculation error:', error);
    }
  } finally {
    console.log('Calculation attempt finished.');
  }
}

form.addEventListener('submit', handleCalculate);

// Required console method demos.
document.querySelector('#console-log-btn').addEventListener('click', () => {
  console.log('Console log demo:', {
    firstValue: firstNumInput.value || '(empty)',
    operator: operatorSelect.value,
    secondValue: secondNumInput.value || '(empty)'
  });
});

document.querySelector('#console-error-btn').addEventListener('click', () => {
  console.error('Console error demo: simulated calculator failure.', {
    reason: 'This is only a demo for Lab 9.'
  });
});

document.querySelector('#console-table-btn').addEventListener('click', () => {
  console.table([
    { field: 'first-num', value: firstNumInput.value || '(empty)' },
    { field: 'operator', value: operatorSelect.value },
    { field: 'second-num', value: secondNumInput.value || '(empty)' }
  ]);
});

document.querySelector('#console-dir-btn').addEventListener('click', () => {
  console.dir(form);
});

document.querySelector('#console-dirxml-btn').addEventListener('click', () => {
  console.dirxml(document.querySelector('main'));
});

document.querySelector('#console-group-start-btn').addEventListener('click', () => {
  console.group('Calculator debug group');
  console.log('First input:', firstNumInput.value || '(empty)');
  console.log('Operator:', operatorSelect.value);
  console.log('Second input:', secondNumInput.value || '(empty)');
  console.log('Press Console Group End to close this group.');
});

document.querySelector('#console-group-end-btn').addEventListener('click', () => {
  console.groupEnd();
});

document.querySelector('#start-timer-btn').addEventListener('click', () => {
  console.time('calculation-demo');
  console.log('Timer started: calculation-demo');
});

document.querySelector('#end-timer-btn').addEventListener('click', () => {
  console.timeEnd('calculation-demo');
});

document.querySelector('#console-trace-btn').addEventListener('click', () => {
  console.trace('Console trace demo');
});

// Extra starter buttons. These are not the main listed lab requirements, but the starter code includes them.
document.querySelector('#console-count-btn').addEventListener('click', () => {
  console.count('Console Count button pressed');
});

document.querySelector('#console-warn-btn').addEventListener('click', () => {
  console.warn('Console warn demo: blank inputs and division by zero are blocked.');
});

document.querySelector('#console-assert-btn').addEventListener('click', () => {
  const bothInputsPresent = firstNumInput.value.trim() !== '' && secondNumInput.value.trim() !== '';
  console.assert(bothInputsPresent, 'Console assert demo: both number fields should be filled in.');
});

document.querySelector('#console-clear-btn').addEventListener('click', () => {
  console.clear();
  console.log('Console was cleared.');
});

// Global error handler. This does not call preventDefault(), so TrackJS can still capture errors.
window.addEventListener('error', event => {
  console.log('Global error caught by window.addEventListener("error").', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    errorName: event.error?.name,
    errorMessage: event.error?.message
  });
});

// This intentionally creates a global, uncaught error for the global error handler and TrackJS.
document.querySelector('#global-error-btn').addEventListener('click', () => {
  setTimeout(() => {
    const missingCalculatorConfig = undefined;
    console.log(missingCalculatorConfig.precision);
  }, 0);
});
