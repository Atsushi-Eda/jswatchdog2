(async () => {
  const sampleJs = require('raw-loader!./sample.txt').default;
  const Linter = require('eslint4b');
  const linter = new Linter();
  linter.defineRules({
    'xss/no-mixed-html': require('eslint-plugin-xss/lib/rules/no-mixed-html'),
    'xss/no-location-href-assign': require('eslint-plugin-xss/lib/rules/no-location-href-assign')
  });

  const editor = ace.edit('editor');
  const consoleBox = document.getElementById('console');
  editor.getSession().setMode('ace/mode/javascript');
  editor.getSession().setUseWorker(false);
  editor.getSession().setTabSize(2);
  editor.setValue(sampleJs);
  editor.clearSelection();

  const versionSelect = document.getElementById('version');
  Object.keys(eslintConfigs).forEach((version) => {
    const option = document.createElement('option');
    option.value = version;
    option.innerText = version;
    versionSelect.appendChild(option);
  });
  versionSelect.value = 'latest';

  const validate = () => {
    const code = editor.getSession().getValue();
    const splitCode = code.split('\n');
    const errors = linter.verify(
      code,
      eslintConfigs[versionSelect.value]
    ).filter((error) =>
      !error.message.match(/^Definition for rule .* was not found.$/) && error.ruleId !== "linebreak-style"
    );
    consoleBox.innerHTML = '';
    errors.forEach((error) => {
      const errorBox = document.createElement('p');
      errorBox.innerText = `Line ${error.line}, ${error.message}\n${splitCode[error.line-1]}`;
      errorBox.classList.add(error.severity === 1 ? 'warning' : 'error');
      consoleBox.appendChild(errorBox);
    });
    if(!errors.length) {
      const errorBox = document.createElement('div');
      errorBox.innerText = '✓ Looks good to me!';
      errorBox.classList.add('lgtm');
      consoleBox.appendChild(errorBox);
    }
  }
  versionSelect.addEventListener('change', validate)
  editor.getSession().on('change', validate);
  validate();
})();
