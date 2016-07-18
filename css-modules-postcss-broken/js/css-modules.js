import path from 'path';
import fs from 'fs';

module.exports = (module, className) => {
  const moduleFileName  = path.resolve('./', `${ module }.json`);
  const classNames      = fs.readFileSync(moduleFileName).toString();
  return JSON.parse(classNames)[className];
}
