function problems() {
  return document.getElementById('problems').value.trim().split(/\s+/g);
}

function createDialog() {
  var dialog = document.createElement('div');
  dialog.setAttribute('id', 'dialog');
  document.body.appendChild(dialog);
  return dialog;
}

function updateDialog(dialog, i, problems) {
  dialog.innerHTML = 'Solving ' + i + ' of ' + problems.length;
}

function removeDialog(dialog) {
  document.body.removeChild(dialog);
}

function solveAll(problems) {
  for(var i = 0; i < problems.length; ++i) {
    console.log('solving', i + 1, 'of', problems.length);
    var wasSolved = solve(problems[i]);
    console.log('result of ', i + 1, wasSolved ? 'success' : 'failure');
  }
}

function getCellValue(problem, x, y) {
  return problem.charAt(x + y * 9);
}

function setValue(problem, index, value) {
  return problem.replace(new RegExp('(.{' + index + '}).'), '$1' + value);
}

function setCellValue(problem, x, y, value) {
  return setValue(problem, x + y * 9, value);
}

function getRow(problem, row) {
  return problem.substr(row * 9, 9);
}

function existingRowValues(problem, row) {
  return getRow(problem, row).replace(/0/g, '').split('');
}

function existingColumnValues(problem, column) {
  return problem.substring(column).replace(/(.).{0,8}/g, '$1').replace(/0/g, '').split('');
}

function existingBlockValues(problem, x, y) {
  var startX = Math.floor(x / 3) * 3;
  var startY = Math.floor(y / 3) * 3;
  var values = '';
  for(y = 0; y < 3; ++y) {
    values += getRow(problem, startY + y).substr(startX, 3);
  }
  return values.replace(/0/g, '').split('');
}

function existingValues(problem, x, y) {
  if(typeof y == undefined) {
    y = Math.floor(x / 9);
    x = x % 9;
  }
  return existingRowValues(problem, y)
    .concat(existingColumnValues(problem, x))
    .concat(existingBlockValues(problem, x, y))
    .sort().join('').replace(/(1)*(2)*(3)*(4)*(5)*(6)*(7)*(8)*(9)*/g, '$1$2$3$4$5$6$7$8$9').split('');
}

function findSolution(problem) {
  var i = 0, solved = false;
  var index = -1;
  while(!solved && i < 5000) {
    index = problem.indexOf('0', index + 1);

    var x = index % 9;
    var y = Math.floor(index / 9);

    var existing = existingValues(problem, x, y);

    if(existing.length == 8) {
      var sum = existing.reduce(function(total, value) { return parseInt(total) + parseInt(value); });
      problem = setCellValue(problem, x, y, 45 - sum);
    }

    if(!~index) {
      index = -1;
    }

    solved = isSolved(problem);
    i += 1;
  }
  return problem;
}

function isSolved(problem) {
  return !~problem.indexOf('0');
}

function brutish(problem) {
  var index = problem.indexOf('0');
  while(!!~index) {
    var possibilities = '123456789'.replace(new RegExp('[' + existingValues(problem, index).join('') + ']', 'g'), '').split('');
    for(var i = 0; i < possibilities.length; ++i) {
      var problemWithIssues = setValue(problem, index, possibilities[i]);
      problemWithIssues = findSolution(problemWithIssues);
      if(isSolved(problemWithIssues)) {
        return problemWithIssues;
      }
    }
    index = problem.indexOf('0', index + 1);
  }
  return problem;
}

function solve(problem) {
  var debug = false;
  problem = findSolution(problem);
  if(!isSolved(problem)) {
    problem = brutish(problem);
  }
  document.getElementById('solutions').value += problem + (debug ? ' (' + isSolved(problem) + ')' : '') + '\n';
  return isSolved(problem);
}

document.getElementById('problems').onblur = function load() {
  document.getElementById('solutions').value = '';
  setTimeout(function() { solveAll(problems()); }, 0);
};

x = problems()[0];
console.log(x.replace(/(.{9})/g, '$1\n'));