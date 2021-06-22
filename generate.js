if (process.argv[2] == undefined) {
  console.log("Must Specify Model to Use.");
  process.exit(1);
}

const fs = require('fs');
const modelName = process.argv[2];

const stats = JSON.parse(fs.readFileSync(modelName + '/stats.json'));
var starts = stats.starts;
var markov = stats.words;

function getSentences(n) {
  var output = "";
  for (var i = 0; i < n; i++) {
    var sentence = getSentence();
    // output += "\n* " + sentence;
	output += sentence + " ";
  }
  return output;
}

function getSentence() {
  var words = [randomEl(starts)];

  for (var i = 0; i < 10; i++) {
   
	var prev = words[words.length - 1];
    if (markov[prev] == undefined) break;
    if (i >= 5 && Math.random() < markov[prev].end / (markov[prev].next.length + markov[prev].end)) break;

    var next = randomEl(markov[prev].next);
    words.push(next);
  }

  var sentence = words.join(" ");
  return sentence + ".";
}

const randomEl = (arr) => arr[Math.floor(Math.random()*arr.length)];

var numSentences = process.argv[3] == undefined ? Math.floor(Math.random() * 5) + 7 : process.argv[3];
console.log(getSentences(numSentences) + "\n");
