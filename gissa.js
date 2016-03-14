var repl = require("repl");
var _ = require('lodash');

var tree = {
   root: {
      question: 'Har den päls?',
      ja: {
         question: 'Har den lång svans?',
         ja: 'en råtta',
         nej: 'en björn'
      },
      nej: 'en gädda'
   }

};


function handleAnswer(answer, context, filename, callback) {
   answer = answer.trim();
   megaMind[context.state](answer, context, callback);
}


function askQuestion(context, callback) {
   callback(context.currentGuess.question);
}

var megaMind = {

   start: function(answer, context, callback) {
      context.state='question';
      context.currentGuess=tree.root;
      askQuestion(context, callback);
   },

   question: function(answer, context, callback) {
      context.guess = context.currentGuess[answer];
      if (!context.guess) {
         callback('Va?');
      } else if (_.isString(context.guess)) {
         context.state='guess';
         context.latestYesNo=answer;
         callback('Tänker du på en '+context.guess);
      } else {
         context.currentGuess=context.guess;
         askQuestion(context, callback);
      }      
   },

   guess: function(answer, context, callback) {
      if ('ja' === answer) {
         context.state='start';
         callback('Jag visste väl det! Vill du köra igan?');
      } else {
         context.state='learn_1';
         console.log('Ajdå, vad tänker du på?');
      }
   },

   learn_1: function(answer, context, callback) {
      context.newAnimal=answer;
      context.state='learn_2';
      callback('Ge mig en fråga som skiljer '+context.guess+' från '+context.newAnimal);
   },

   learn_2: function(answer, context, callback) {
      context.newQuestion=answer;
      context.state='learn_3';
      callback('Om jag svarar JA på frågan: '+answer+', tänker jag på '+context.newAnimal+' då?');
   },

   learn_3: function(answer, context, callback) {
      var isYes = ('ja'===answer);
      var newItem = {
         question: context.newQuestion,
         ja: (isYes) ? context.newAnimal : context.guess,
         nej: (!isYes) ? context.newAnimal : context.guess
      };
      context.currentGuess[context.latestYesNo] = newItem;
      context.state='start';
      callback('Då har jag lärt mig det! Vill du spela igen?');
   }

   
   
};



console.log('Tänk på ett djur! Har du tänkt ut ett djur?');
repl.start({
   prompt: "> ",
   input: process.stdin,
   output: process.stdout,
   eval: handleAnswer
}).context.state='start';







