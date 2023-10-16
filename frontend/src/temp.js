(function () {
  //
  // `randomizeTest` accepts and returns a `Test` object. The questions in the returned object should
  // be in a random order. The order of the choices within each question should also be randomized.
  //
  function randomizeTest(test) {
    //
    // Your code to randomize questions and answers goes here
    //
  }

  function Test(questions, choices, answers) {
    this.questions = questions;
    this.choices = choices;
    this.answers = answers;
  }

  //
  // displays the sample test in the browser with the correct answer highlighted
  //
  function renderTest(test, parent) {
    const randomizedTest = randomizeTest(test);

    for (let i = 0; i < randomizedTest.questions.length; i += 1) {
      const qElement = document.createElement('li');
      let correctCount = 0;

      qElement.setAttribute('class', 'question');
      qElement.appendChild(
        document.createTextNode(randomizedTest.questions[i])
      );

      for (let j = 0; j < randomizedTest.answers[i].length; j += 1) {
        if (randomizedTest.answers[i][j] === 1) {
          correctCount += 1;
        }
      }

      for (let j = 0; j < randomizedTest.choices[i].length; j += 1) {
        const choiceLabelElement = document.createElement('label'),
          choiceInputElement = document.createElement('input');

        choiceInputElement.setAttribute(
          'name',
          (correctCount === 1 ? 'radio' : 'check') + i
        );
        choiceInputElement.setAttribute(
          'type',
          correctCount === 1 ? 'radio' : 'checkbox'
        );
        choiceInputElement.setAttribute('value', j);

        choiceLabelElement.classList.add('choice');
        if (randomizedTest.answers[i][j] === 1) {
          choiceLabelElement.classList.add('correct');
        }

        choiceLabelElement.appendChild(choiceInputElement);
        choiceLabelElement.appendChild(
          document.createTextNode(randomizedTest.choices[i][j])
        );

        qElement.appendChild(choiceLabelElement);
        parent.appendChild(qElement);
      }
    }
  }

  const questions = [
      "What can you find in Rustici Software's office?",
      'All of Rustici Software employees are expected to work no more than ____ hours per week.',
      "The end users of Rustici Software's products number in the _________",
      'Rustici Software is a (choose all that apply):',
      'Tim likes to wear:',
    ],
    choices = [
      [
        'Dart Board',
        'Ping Pong Table',
        'Cubicles',
        'Laptops with dual monitors',
        'TPS reports, ummm yeah',
      ],
      ['80', '40', '50', '60'],
      ['Tens', 'Hundreds', 'Thousands', 'Millions', 'Billions'],
      [
        'Great place to work',
        'Respected leader in its field',
        "Place where people don't matter, just results",
      ],
      ['Capri pants', 'Goth attire', 'Sport coat', 'T-shirt and shorts'],
    ],
    answers = [
      [1, 1, 0, 1, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 1, 0],
      [1, 1, 0],
      [0, 0, 0, 1, 0],
    ],
    test = new Test(questions, choices, answers);

  renderTest(test, document.getElementById('questions'));
})();
