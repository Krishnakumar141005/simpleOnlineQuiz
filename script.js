(() => {
  // Elements
  const authContainer = document.getElementById('auth-container');
  const quizContainer = document.getElementById('quiz-container');
  const resultContainer = document.getElementById('result-container');
  const formTitle = document.getElementById('form-title');
  const authButton = document.getElementById('auth-button');
  const toggleText = document.getElementById('toggle-text');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirm-password');
  const userInfo = document.getElementById('user-info');

  const questionNav = document.getElementById('question-nav');
  const questionText = document.getElementById('question-text');
  const optionsContainer = document.getElementById('options-container');
  const fillInput = document.getElementById('input-fill');
  const fillAnswerInput = document.getElementById('fill-answer');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const submitBtn = document.getElementById('submit-btn');
  const scoreText = document.getElementById('score-text');
  const logoutBtn = document.getElementById('logout-btn');
  const reviewBtn = document.getElementById('review-btn');
  const reviewContainer = document.getElementById('review-container');

  let isLogin = true;
  let questions = [];
  let currentQuestion = 0;
  let userAnswers = [];

  // Full pool of questions
  const allQuestions = [ { type: "mcq", question: "What does HTML stand for?", options: ["HyperText Markup Language", "HighText Machine Language", "Hyper Tabular Markup Language", "None of these"], answer: "HyperText Markup Language" },
  { type: "mcq", question: "Which HTML tag is used to define an internal style sheet?", options: ["<css>", "<script>", "<style>", "<link>"], answer: "<style>" },
  { type: "fill", question: "Fill in the blank: CSS stands for Cascading ___ Sheets.", answer: "Style" },
  { type: "mcq", question: "Which HTML attribute is used to define inline styles?", options: ["style", "class", "font", "styles"], answer: "style" },
  { type: "mcq", question: "Which is the correct CSS syntax?", options: ["{body;color:black;}", "body:color=black;", "body {color: black;}", "{body:color=black;}"], answer: "body {color: black;}" },
  { type: "fill", question: "Fill in the blank: JavaScript was created in ___ days.", answer: "10" },
  { type: "mcq", question: "Which company developed JavaScript?", options: ["Netscape", "Mozilla", "Microsoft", "Sun Microsystems"], answer: "Netscape" },
  { type: "fill", question: "Fill in the blank: JavaScript is a ___-side scripting language.", answer: "Client" },
  { type: "mcq", question: "Which symbol is used for comments in JavaScript?", options: ["//", "##", "<!-- -->", "**"], answer: "//" },
  { type: "mcq", question: "How do you create a function in JavaScript?", options: ["function = myFunc()", "function:myFunc()", "function myFunc()", "create myFunc()"], answer: "function myFunc()" },
  { type: "fill", question: "Fill in the blank: The DOM stands for Document ___ Model.", answer: "Object" },
  { type: "mcq", question: "Which method is used to select an element by ID in JavaScript?", options: ["getElementById()", "querySelectorAll()", "getElementsByTagName()", "getElementsByClassName()"], answer: "getElementById()" },
  { type: "mcq", question: "Which HTML tag is used to include JavaScript code?", options: ["<js>", "<script>", "<javascript>", "<code>"], answer: "<script>" },
  { type: "mcq", question: "What does the '===' operator do in JavaScript?", options: ["Assign value", "Compare with type", "Compare without type", "None of the above"], answer: "Compare with type" },
  { type: "fill", question: "Fill in the blank: To link a CSS file to HTML, use the ___ tag.", answer: "link" },
  { type: "mcq", question: "Which of the following is not a JavaScript data type?", options: ["String", "Boolean", "Float", "Undefined"], answer: "Float" },
  { type: "mcq", question: "What is the default position in CSS?", options: ["static", "absolute", "relative", "fixed"], answer: "static" },
  { type: "fill", question: "Fill in the blank: JSON stands for JavaScript Object ___.", answer: "Notation" },
  { type: "mcq", question: "Which CSS property controls the text size?", options: ["font-style", "text-size", "font-size", "text-style"], answer: "font-size" },
  { type: "mcq", question: "Which method is used to add an element at the end of an array?", options: ["push()", "add()", "insert()", "append()"], answer: "push()" },
  { type: "fill", question: "Fill in the blank: In HTML5, the ___ element is used for navigation links.", answer: "nav" },
  { type: "mcq", question: "What does event.preventDefault() do in JavaScript?", options: ["Stops default browser behavior", "Stops execution", "Closes browser", "Logs the error"], answer: "Stops default browser behavior" },
  { type: "mcq", question: "Which property is used to hide elements in CSS?", options: ["visibility", "display", "hide", "none"], answer: "display" },
  { type: "fill", question: "Fill in the blank: ___ is used to style HTML pages.", answer: "CSS" },
  { type: "mcq", question: "Which is not a semantic HTML tag?", options: ["<article>", "<div>", "<section>", "<footer>"], answer: "<div>" },
  { type: "mcq", question: "What is the correct way to comment out code in CSS?", options: ["// comment", "# comment", "/* comment */", "<!-- comment -->"], answer: "/* comment */" },
  { type: "fill", question: "Fill in the blank: GitHub uses ___ control system.", answer: "Version" },
  { type: "mcq", question: "What does 'this' keyword refer to in a regular JS function?", options: ["The function itself", "Global object", "Parent object", "Current HTML element"], answer: "Global object" },
  { type: "mcq", question: "Which attribute is used in HTML to open links in a new tab?", options: ["target='_blank'", "href='new'", "newtab", "blank"], answer: "target='_blank'" },
  { type: "fill", question: "Fill in the blank: HTML was invented by Tim ___.", answer: "Berners-Lee" } ];

  // Toggle login/signup mode
  function toggleMode() {
    isLogin = !isLogin;
    formTitle.innerText = isLogin ? 'Login' : 'Sign Up';
    authButton.innerText = isLogin ? 'Login' : 'Sign Up';
    confirmPasswordInput.style.display = isLogin ? 'none' : 'block';
    toggleText.innerHTML = isLogin
      ? `Don't have an account? <a id="toggle-link">Sign up</a>`
      : `Already have an account? <a id="toggle-link">Login</a>`;
    clearAuthInputs();
    document.getElementById('toggle-link').addEventListener('click', toggleMode);
  }

  function clearAuthInputs() {
    usernameInput.value = '';
    passwordInput.value = '';
    confirmPasswordInput.value = '';
  }

  function handleAuth() {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    if (!username || !password || (!isLogin && !confirmPassword)) {
      alert('Please fill in all fields.');
      return;
    }

    if (!isLogin) {
      if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
      }
      if (localStorage.getItem('user_' + username)) {
        alert('Username already exists.');
        return;
      }
      localStorage.setItem('user_' + username, JSON.stringify({ password }));
      alert('Account created! Please log in.');
      toggleMode();
    } else {
      const userData = JSON.parse(localStorage.getItem('user_' + username));
      if (!userData || userData.password !== password) {
        alert('Invalid credentials.');
        return;
      }
      localStorage.setItem('currentUser', username);
      startQuiz();
    }
  }

  function startQuiz() {
    questions = allQuestions.sort(() => 0.5 - Math.random()).slice(0, 10);
    userAnswers = new Array(questions.length).fill(null);
    currentQuestion = 0;

    authContainer.style.display = 'none';
    quizContainer.style.display = 'block';
    resultContainer.style.display = 'none';
    reviewContainer.style.display = 'none';
    reviewBtn.style.display = 'none';
    userInfo.textContent = `Logged in as: ${localStorage.getItem('currentUser')}`;

    renderQuestionNav();
    renderQuestion(currentQuestion);
  }

  function renderQuestionNav() {
    questionNav.innerHTML = '';
    questions.forEach((_, i) => {
      const btn = document.createElement('button');
      btn.textContent = i + 1;
      btn.classList.toggle('answered', userAnswers[i] !== null);
      btn.classList.toggle('current', i === currentQuestion);
      btn.addEventListener('click', () => {
        saveAnswer();
        currentQuestion = i;
        renderQuestion(currentQuestion);
      });
      questionNav.appendChild(btn);
    });
  }

  function renderQuestion(index) {
    const q = questions[index];
    questionText.textContent = `${index + 1}. ${q.question}`;
    optionsContainer.innerHTML = '';
    fillInput.style.display = 'none';
    fillAnswerInput.value = '';

    if (q.type === 'mcq') {
      q.options.forEach(opt => {
        const label = document.createElement('label');
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'option';
        radio.value = opt;
        if (userAnswers[index] === opt) radio.checked = true;
        label.appendChild(radio);
        label.append(opt);
        optionsContainer.appendChild(label);
      });
    } else {
      fillInput.style.display = 'block';
      if (userAnswers[index]) fillAnswerInput.value = userAnswers[index];
    }

    renderQuestionNav();
    updateControls();
  }

  function saveAnswer() {
    const q = questions[currentQuestion];
    if (q.type === 'mcq') {
      const selected = document.querySelector('input[name="option"]:checked');
      userAnswers[currentQuestion] = selected ? selected.value : null;
    } else {
      userAnswers[currentQuestion] = fillAnswerInput.value.trim() || null;
    }
  }

  function updateControls() {
    prevBtn.disabled = currentQuestion === 0;
    nextBtn.disabled = currentQuestion === questions.length - 1;
  }

  function submitQuiz() {
    saveAnswer();
    let score = 0;
    questions.forEach((q, i) => {
      if (!userAnswers[i]) return;
      if (q.type === 'mcq' && userAnswers[i] === q.answer) score++;
      if (q.type === 'fill' && userAnswers[i].toLowerCase() === q.answer.toLowerCase()) score++;
    });

    quizContainer.style.display = 'none';
    resultContainer.style.display = 'block';
    scoreText.textContent = `You scored ${score} out of ${questions.length}`;
    reviewBtn.style.display = 'inline-block';
  }

  function logout() {
    localStorage.removeItem('currentUser');
    userAnswers.fill(null);
    currentQuestion = 0;
    clearAuthInputs();
    authContainer.style.display = 'block';
    quizContainer.style.display = 'none';
    resultContainer.style.display = 'none';
  }

  function reviewAnswers() {
    reviewContainer.innerHTML = '';
    questions.forEach((q, i) => {
      const div = document.createElement('div');
      const userAns = userAnswers[i] || '(No answer)';
      const isCorrect = q.type === 'mcq'
        ? userAns === q.answer
        : userAns.toLowerCase() === q.answer.toLowerCase();

      div.innerHTML = `
        <p><strong>Q${i + 1}:</strong> ${q.question}</p>
        <p><strong>Your Answer:</strong> ${userAns}</p>
        <p><strong>Correct Answer:</strong> ${q.answer}</p>
        <p style="color: ${isCorrect ? 'green' : 'red'};"><strong>${isCorrect ? 'Correct' : 'Incorrect'}</strong></p>
        <hr>
      `;
      reviewContainer.appendChild(div);
    });
    reviewContainer.style.display = 'block';
    reviewBtn.style.display = 'none';
  }

  // Event listeners
  authButton.addEventListener('click', handleAuth);
  document.getElementById('toggle-link').addEventListener('click', toggleMode);
  prevBtn.addEventListener('click', () => {
    saveAnswer();
    if (currentQuestion > 0) {
      currentQuestion--;
      renderQuestion(currentQuestion);
    }
  });
  nextBtn.addEventListener('click', () => {
    saveAnswer();
    if (currentQuestion < questions.length - 1) {
      currentQuestion++;
      renderQuestion(currentQuestion);
    }
  });
  submitBtn.addEventListener('click', () => {
    if (userAnswers.includes(null)) {
      if (!confirm("You have unanswered questions. Submit anyway?")) return;
    }
    submitQuiz();
  });
  logoutBtn.addEventListener('click', logout);
  reviewBtn.addEventListener('click', reviewAnswers);

})();
