(() => {
  const fs = require('fs');
  const { ESLint } = require("eslint");
  const originDir = 'config';
  const distFile = 'dist/config.js';
  const dummyFile = '.eslintrc.js';
  fs.readdir(originDir, async (err, files) =>{
    if (err) throw err;
    const configs = {};
    for (file of files) {
      const eslint = new ESLint();
      fs.copyFileSync(`${originDir}/${file}`, dummyFile);
      configs[file.slice(0, -3)] = await eslint.calculateConfigForFile(dummyFile);
      fs.unlinkSync(dummyFile);
    }
    fs.writeFileSync(distFile, `window.eslintConfigs=${JSON.stringify(configs)}`);
  });
})();
