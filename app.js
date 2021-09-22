import fs from 'fs';
import path from 'path';
import translate from '@vitalets/google-translate-api';


const __dirname = path.resolve();
const filePath = path.join(__dirname, 'en.json');

fs.readFile(filePath, { encoding: 'utf-8' }, async function (err, data) {
  if (!err) {
    const jsonMap = new Map(Object.entries(JSON.parse(data)));
    var trData = "{\n\t";
    var keyData = "class LangKeys {\n\t";
    var index = 0;
    for (var entry of jsonMap.entries()) {
      const translated = await translate(entry[1], { from: 'en', to: 'tr' });
      if (index != 0) trData += ',\n\t'
      keyData += `static const String ${entry[0]} = '${entry[0]}';\n`;
      trData += `\"${entry[0]}\": \"${translated.text}\"`;
      if (index != jsonMap.keys.length - 1) keyData += "\t";
      index += 1;
    }
    trData += '\n}';
    fs.writeFile(`/${path.basename(path.resolve())}/tr.json`, trData, function (err) {
      if (err) {
        return console.log(err);
      }
      console.log("The file was saved!");
    });
    keyData += "}";
    fs.writeFile(`/${path.basename(path.resolve())}/lang_keys.dart`, keyData, function (err) {
      if (err) {
        return console.log(err);
      }
      console.log("The file was saved!");
    });
  } else {
    console.log(err);
  }
});