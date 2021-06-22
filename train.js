if (process.argv[2] == undefined) {
  console.log("Must Specify Training Data to Use.");
  process.exit(1);
}

const fs = require('fs');
const modelName = process.argv[2];

var training = `${fs.readFileSync(modelName + '/training.txt', 'utf8')}`;
// const stats = JSON.parse(fs.readFileSync('stats.json'));
const stats = {};

function trainMarkovStats(input) {
  input = input.replace(/[\n/]/g, " ");
  input = input.replace(/[!?]/g, ".")
  input = input.replace(/[^\w^\s\-\.]/g, "");
  // console.log(input);
  var sentences = input.split(/[!?;.] +/);

  var starts = [];

  sentences.forEach(sentence => {
    var words = sentence.split(/\s+/);
    // console.log(sentence);

    words.forEach((word, i) => {
      if (word === undefined || word == "") return;
      if (stats[word] == undefined)
        stats[word] = {
          next: [],
          end: 0
        }

      if (i == 0) {
        starts.push(word);
        // console.log("start: " + word);
      }
      if (i == words.length - 1) {
        stats[word].end++;
        // console.log("end:   " + word);
        return;
      }

      stats[word].next.push(words[i + 1]);

    });
  });

  fs.writeFileSync(modelName + '/stats.json', JSON.stringify({"starts": starts,"words": stats}));
}

trainMarkovStats(training);

console.log(`stats.json: ${Math.round(fs.statSync(modelName + '/stats.json')['size']/1024)} mB`);
