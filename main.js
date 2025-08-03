
// Calculator logic
document.addEventListener('DOMContentLoaded', function () {
  const display = document.getElementById('display');
  const buttons = document.querySelectorAll('.buttons button');
  const liveResult = document.getElementById('live-result');
  let current = '';

  buttons.forEach(btn => {
    btn.addEventListener('click', function () {
      let value = this.textContent;
      if (value === 'X' || value === 'x') value = '*';
      if (value === 'C') {
        current = '';
        display.value = '';
      } else if (value === '%') {
        // Percent: divide last number by 100
        let match = current.match(/(\d*\.?\d+)$/);
        if (match) {
          let num = parseFloat(match[1]);
          let percent = num / 100;
          current = current.replace(/(\d*\.?\d+)$/, percent);
          display.value = current;
        }
      } else if (value === '+/-') {
        // Toggle sign of last number
        let match = current.match(/(-?\d*\.?\d+)$/);
        if (match) {
          let num = parseFloat(match[1]);
          let toggled = -num;
          // Remove double minus if toggling back to positive
          current = current.replace(/(-?\d*\.?\d+)$/, toggled >= 0 ? toggled : toggled);
          // Remove leading + if present (shouldn't be, but for safety)
          current = current.replace(/^\+/, '');
          display.value = current;
          updateLiveResult();
        }
      } else if (value === '1/x') {
        // Inverse of last number
        let match = current.match(/(\d*\.?\d+)$/);
        if (match) {
          let num = parseFloat(match[1]);
          if (num !== 0) {
            let inv = 1 / num;
            current = current.replace(/(\d*\.?\d+)$/, inv);
            display.value = current;
          } else {
            display.value = 'Error';
            current = '';
          }
        }
      } else if (value === '=' || value === '＝') {
        if (current.trim() === '') {
          display.value = '';
          current = '';
          return;
        }
        try {
          let expr = current.replace(/÷/g, '/').replace(/×/g, '*');
          display.value = eval(expr);
          current = display.value;
        } catch {
          display.value = 'Error';
          current = '';
        }
      } else if (value === '.') {
        // Only allow one decimal per number
        let lastNum = current.split(/[-+*/]/).pop();
        if (!lastNum.includes('.')) {
          current += value;
          display.value = current;
        }
      } else {
        if ('+-*/'.includes(value)) {
          if (current === '') {
            // Only allow minus at the start for negative numbers
            if (value === '-') {
              current = '-';
              display.value = current;
              updateLiveResult();
            }
            return;
          }
          // Replace last operator if previous is operator (but allow negative numbers)
          if ('+-*/'.includes(current.slice(-1))) {
            // If last is operator and value is '-', allow for negative numbers after operator
            if (value === '-' && current.slice(-1) !== '-') {
              current += '-';
            } else {
              current = current.slice(0, -1) + value;
            }
          } else {
            current += value;
          }
          display.value = current;
          updateLiveResult();
        } else {
          current += value;
          display.value = current;
          updateLiveResult();
        }
      }

    });
  });

  // Live result update
  function updateLiveResult() {
    let expr = current.replace(/÷/g, '/').replace(/×/g, '*').replace(/X/g, '*').replace(/x/g, '*');
    // Remove trailing operator for preview
    if (/[-+*/.]$/.test(expr)) expr = expr.slice(0, -1);
    try {
      if (expr && isNaN(Number(expr))) {
        let result = eval(expr);
        if (typeof result === 'number' && isFinite(result)) {
          liveResult.textContent = result;
        } else {
          liveResult.textContent = '';
        }
      } else {
        liveResult.textContent = '';
      }
    } catch {
      liveResult.textContent = '';
    }
  }

  // Initial clear
  updateLiveResult();
});

