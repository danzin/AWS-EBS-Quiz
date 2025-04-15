var Data = {
  questions: [],
  currentQuestionIndex: 0,
  selected: null,
  feedbackVisible: false,
  fetch: function () {
    return m
      .request({
        method: "GET",
        url: "/questions",
      })
      .then(function (items) {
        Data.questions = items;
        Data.currentQuestionIndex = 0;
        Data.selected = null;
        Data.userAnswers = [];
        Data.feedbackVisible = false;
        console.log("Fetched questions:", Data.questions);
      })
      .catch(function (err) {
        console.error("Error fetching questions:", err);
      });
  },
  getCurrentQuestion: function () {
    return Data.questions[Data.currentQuestionIndex];
  },
  nextQuestion: function () {
    Data.currentQuestionIndex++;
    if (Data.currentQuestionIndex >= Data.questions.length) {
      console.log("Quiz complete! Restarting from the first question.");
      Data.currentQuestionIndex = 0;
    }
    Data.selected = null;
    Data.feedbackVisible = false;
  },
  correctCount: function () {
    return Data.userAnswers.filter((ans) => ans.isCorrect).length;
  },
};

var Choice = {
  click: function (index) {
    return function () {
      if (!Data.feedbackVisible) {
        Data.selected = index;
      }
    };
  },
  classes: function (index) {
    const question = Data.getCurrentQuestion();
    let classNames = "";

    if (Data.selected === index) {
      classNames += " active";
    }

    if (Data.feedbackVisible) {
      if (question.correctAnswer === index) {
        classNames += " correct";
      } else if (Data.selected === index) {
        classNames += " incorrect";
      }
    }

    return classNames;
  },
  view: function (vnode) {
    const index = vnode.attrs.index;
    const current = Data.getCurrentQuestion();
    const choiceText =
      current && current.choices && current.choices[index]
        ? current.choices[index]
        : "";
    return m(
      ".choice",
      { class: Choice.classes(index), onclick: Choice.click(index) },
      m("span.l"),
      m("span.v", choiceText)
    );
  },
};

var App = {
  oninit: Data.fetch,
  submit: function () {
    if (Data.selected === null) {
      alert("Please select an answer before submitting!");
      return;
    }

    const current = Data.getCurrentQuestion();
    const isCorrect = current.correctAnswer === Data.selected;

    Data.feedbackVisible = true;

    Data.userAnswers.push({
      question: current.question,
      selected: Data.selected,
      correct: current.correctAnswer,
      isCorrect: isCorrect,
    });

    setTimeout(function () {
      Data.nextQuestion();
      m.redraw();
    }, 2000);
  },
  view: function () {
    if (!Data.questions.length) {
      return m("main", "Loading...");
    }
    const current = Data.getCurrentQuestion();
    return m("main", [
      m("h1", "Quiz App"),
      m("article", [
        m("h2", "Question:"),
        m(".question", current.question),
        current.choices &&
          current.choices.map(function (_, index) {
            return m(Choice, { key: index, index: index });
          }),
        Data.feedbackVisible
          ? m(
              ".feedback",
              current.correctAnswer === Data.selected
                ? m("p.correct-feedback", "Correct! Moving to next question...")
                : m(
                    "p.incorrect-feedback",
                    "Incorrect! The correct answer is highlighted in green."
                  )
            )
          : m(".submit", m("button", { onclick: App.submit }, "Submit")),
        m("footer", [
          m("p", `Score: ${Data.correctCount()}/${Data.userAnswers.length}`),
        ]),
      ]),
    ]);
  },
};

m.mount(document.body, App);
