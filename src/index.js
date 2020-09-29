(async () => {
  const sampleJs = require('raw-loader!./sample.txt').default;
  const Linter = require('eslint4b');
  const linter = new Linter();
  linter.defineRules({
    'xss/no-mixed-html': require('eslint-plugin-xss/lib/rules/no-mixed-html'),
    'xss/no-location-href-assign': require('eslint-plugin-xss/lib/rules/no-location-href-assign')
  });

  const editor = ace.edit('editor');
  const consoleElement = document.getElementById('console');
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
    const checks = linter.verify(
      code,
      eslintConfigs[versionSelect.value]
    ).filter((check) =>
      !check.message.match(/^Definition for rule .* was not found.$/) && check.ruleId !== "linebreak-style"
    );
    consoleElement.innerHTML = '';
    checks.forEach((check) => {
      const checkElement = document.createElement('p');
      checkElement.innerText = `Line ${check.line}, ${check.message} (${check.ruleId})\n${splitCode[check.line-1]}`;
      checkElement.classList.add(check.severity === 1 ? 'warning' : 'error');
      consoleElement.appendChild(checkElement);
    });
    if(!checks.length) {
      const checkElement = document.createElement('div');
      checkElement.innerText = '✓ Looks good to me!';
      checkElement.classList.add('lgtm');
      consoleElement.appendChild(checkElement);
    }
  }
  versionSelect.addEventListener('change', validate)
  editor.getSession().on('change', validate);
  validate();
})();
