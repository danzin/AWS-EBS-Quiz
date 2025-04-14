var Data = {
  questions: [],
  currentQuestionIndex: 0,
  selected: null,
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
      alert("Quiz complete! Restarting from the first question.");
      Data.currentQuestionIndex = 0;
    }
    Data.selected = null;
  },
};

var Choice = {
  click: function (index) {
    return function () {
      Data.selected = index;
    };
  },
  classes: function (index) {
    return Data.selected === index ? "active" : "";
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

    if (current.correctAnswer === Data.selected) {
      alert("Correct!");
    } else {
      alert(
        "Incorrect! The correct answer was: " +
          current.choices[current.correctAnswer]
      );
    }

    // m.request({
    //   method: "POST",
    //   url: "/submit",
    //   body: { selected: Data.selected },
    // })
    //   .then(function (response) {
    //     console.log("Submission response:", response);
    //     alert("Your answer was submitted!");
    //   })
    //   .catch(function (err) {
    //     console.error("Error during submission:", err);
    //     alert("Submission failed.");
    //   });

    Data.nextQuestion();
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
        m(".submit", m("button", { onclick: App.submit }, "Submit")),
      ]),
    ]);
  },
};

m.mount(document.body, App);
