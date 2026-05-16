var translations = {
    en: {
        title: "Mental Math Generator",
        subtitle: "Practice quick mental calculations",
        correctLabel: "Correct",
        totalLabel: "Total",
        wrongLabel: "Wrong",
        yourAnswer: "Your answer",
        submit: "Submit",
        newProblem: "New Problem",
        skip: "Skip",
        reset: "Reset",
        rangeLabel: "Number Range",
        termsLabel: "Terms",
        negativeLabel: "Negative Numbers",
        operationsLabel: "Operations",
        positiveOnly: "Positive only",
        allowNegative: "Allow negative",
        terms2: "2 terms",
        terms3: "3 terms",
        terms4: "4 terms",
        clickToStart: "Click \"New Problem\" to start",
        correctMsg: "Correct!",
        wrongMsg: "Wrong! The answer was",
        selectOperation: "Please select at least one operation!"
    },
    pt: {
        title: "Gerador de Matemática Mental",
        subtitle: "Pratique cálculos mentais rápidos",
        correctLabel: "Corretas",
        totalLabel: "Total",
        wrongLabel: "Erradas",
        yourAnswer: "Sua resposta",
        submit: "Confirmar",
        newProblem: "Novo Problema",
        skip: "Pular",
        reset: "Reiniciar",
        rangeLabel: "Faixa de Números",
        termsLabel: "Termos",
        negativeLabel: "Números Negativos",
        operationsLabel: "Operações",
        positiveOnly: "Apenas positivos",
        allowNegative: "Permitir negativos",
        terms2: "2 termos",
        terms3: "3 termos",
        terms4: "4 termos",
        clickToStart: "Clique em \"Novo Problema\" para começar",
        correctMsg: "Correto!",
        wrongMsg: "Errado! A resposta era",
        selectOperation: "Por favor, selecione pelo menos uma operação!"
    },
    es: {
        title: "Generador de Matemáticas Mentales",
        subtitle: "Practica cálculos mentales rápidos",
        correctLabel: "Correctas",
        totalLabel: "Total",
        wrongLabel: "Incorrectas",
        yourAnswer: "Tu respuesta",
        submit: "Confirmar",
        newProblem: "Nuevo Problema",
        skip: "Saltar",
        reset: "Reiniciar",
        rangeLabel: "Rango de Números",
        termsLabel: "Términos",
        negativeLabel: "Números Negativos",
        operationsLabel: "Operaciones",
        positiveOnly: "Solo positivos",
        allowNegative: "Permitir negativos",
        terms2: "2 términos",
        terms3: "3 términos",
        terms4: "4 términos",
        clickToStart: "Haz clic en \"Nuevo Problema\" para empezar",
        correctMsg: "¡Correcto!",
        wrongMsg: "¡Incorrecto! La respuesta era",
        selectOperation: "¡Por favor, selecciona al menos una operación!"
    }
};

var currentLang = 'en';
var currentProblem = null;
var stats = { correct: 0, wrong: 0, total: 0 };
var settings = {
    range: 100,
    terms: 2,
    allowNegative: false,
    operations: ['+', '-', '*']
};

var langSelector = document.getElementById('langSelector');
var titleEl = document.getElementById('title');
var subtitleEl = document.getElementById('subtitle');
var correctCountEl = document.getElementById('correctCount');
var totalCountEl = document.getElementById('totalCount');
var wrongCountEl = document.getElementById('wrongCount');
var correctLabelEl = document.getElementById('correctLabel');
var totalLabelEl = document.getElementById('totalLabel');
var wrongLabelEl = document.getElementById('wrongLabel');
var problemEl = document.getElementById('problem');
var answerInput = document.getElementById('answerInput');
var submitBtn = document.getElementById('submitBtn');
var newProblemBtn = document.getElementById('newProblemBtn');
var skipBtn = document.getElementById('skipBtn');
var resetBtn = document.getElementById('resetBtn');
var rangeSelect = document.getElementById('rangeSelect');
var termsSelect = document.getElementById('termsSelect');
var negativeSelect = document.getElementById('negativeSelect');
var rangeLabelEl = document.getElementById('rangeLabel');
var termsLabelEl = document.getElementById('termsLabel');
var negativeLabelEl = document.getElementById('negativeLabel');
var operationsLabelEl = document.getElementById('operationsLabel');
var opBtns = document.querySelectorAll('.op-btn');

function t(key) {
    if (translations[currentLang] && translations[currentLang][key]) {
        return translations[currentLang][key];
    }
    return key;
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function updateUI() {
    titleEl.textContent = t('title');
    subtitleEl.textContent = t('subtitle');
    correctLabelEl.textContent = t('correctLabel');
    totalLabelEl.textContent = t('totalLabel');
    wrongLabelEl.textContent = t('wrongLabel');
    answerInput.placeholder = t('yourAnswer');
    submitBtn.textContent = t('submit');
    newProblemBtn.textContent = t('newProblem');
    skipBtn.textContent = t('skip');
    resetBtn.textContent = t('reset');
    rangeLabelEl.textContent = t('rangeLabel');
    termsLabelEl.textContent = t('termsLabel');
    negativeLabelEl.textContent = t('negativeLabel');
    operationsLabelEl.textContent = t('operationsLabel');

    negativeSelect.options[0].textContent = t('positiveOnly');
    negativeSelect.options[1].textContent = t('allowNegative');
    termsSelect.options[0].textContent = t('terms2');
    termsSelect.options[1].textContent = t('terms3');
    termsSelect.options[2].textContent = t('terms4');

    document.documentElement.lang = currentLang;

    if (!currentProblem) {
        problemEl.textContent = t('clickToStart');
    }
}

function updateStatsDisplay() {
    correctCountEl.textContent = stats.correct;
    wrongCountEl.textContent = stats.wrong;
    totalCountEl.textContent = stats.total;
}

function readSettings() {
    settings.range = parseInt(rangeSelect.value, 10);
    settings.terms = parseInt(termsSelect.value, 10);
    settings.allowNegative = (negativeSelect.value === 'true');

    var activeOps = [];
    for (var i = 0; i < opBtns.length; i++) {
        if (opBtns[i].className.indexOf('active') !== -1) {
            activeOps.push(opBtns[i].getAttribute('data-op'));
        }
    }
    settings.operations = activeOps;
}

function generateProblem() {
    var nums = [];
    var ops = [];
    var numTerms = settings.terms;
    var rangeMax = settings.range;

    for (var i = 0; i < numTerms; i++) {
        var num = randomInt(1, rangeMax);
        if (settings.allowNegative && Math.random() < 0.3) {
            num = -num;
        }
        nums.push(num);
    }

    var opCount = numTerms - 1;
    var availableOps = settings.operations;
    var availLen = availableOps.length;
    for (var j = 0; j < opCount; j++) {
        ops.push(availableOps[randomInt(0, availLen - 1)]);
    }

    for (var k = 0; k < ops.length; k++) {
        if (ops[k] === '/') {
            var divisor = Math.abs(nums[k + 1]);
            if (divisor < 1) {
                divisor = 1;
            }
            var multiplier = randomInt(1, Math.floor(rangeMax / divisor));
            if (multiplier < 1) {
                multiplier = 1;
            }
            var sign = (nums[k] < 0) ? -1 : 1;
            nums[k] = divisor * multiplier * sign;
        }
    }

    var expression = '' + nums[0];
    var result = nums[0];

    for (var m = 0; m < ops.length; m++) {
        var opSymbol = ops[m];
        var nextNum = nums[m + 1];
        if (opSymbol === '*') {
            expression = expression + ' × ' + nextNum;
        } else if (opSymbol === '/') {
            expression = expression + ' ÷ ' + nextNum;
        } else {
            expression = expression + ' ' + opSymbol + ' ' + nextNum;
        }

        if (opSymbol === '+') {
            result = result + nextNum;
        } else if (opSymbol === '-') {
            result = result - nextNum;
        } else if (opSymbol === '*') {
            result = result * nextNum;
        } else if (opSymbol === '/') {
            result = result / nextNum;
        }
    }

    result = Math.round(result);

    return { expression: expression, result: result };
}

function newProblem() {
    readSettings();
    if (settings.operations.length === 0) {
        alert(t('selectOperation'));
        return;
    }
    currentProblem = generateProblem();
    problemEl.textContent = currentProblem.expression;
    problemEl.style.color = '#e6e6e6';
    answerInput.value = '';
    answerInput.focus();
}

function submitAnswer() {
    if (!currentProblem) {
        return;
    }
    var userAnswer = parseInt(answerInput.value, 10);
    if (isNaN(userAnswer)) {
        return;
    }

    stats.total = stats.total + 1;

    if (userAnswer === currentProblem.result) {
        stats.correct = stats.correct + 1;
        problemEl.textContent = t('correctMsg');
        problemEl.style.color = '#3fb950';
    } else {

        stats.wrong = stats.wrong + 1;
        problemEl.textContent = t('wrongMsg') + ' ' + currentProblem.result;
        problemEl.style.color = '#f85149';
    }

    updateStatsDisplay();

    setTimeout(function () {
        problemEl.style.color = '#e6e6e6';
        newProblem();
    }, 2000);
}
function skipProblem() {
    if (currentProblem) {
        newProblem();
    }
}

function resetStats() {
    stats.correct = 0;
    stats.wrong = 0;
    stats.total = 0;
    updateStatsDisplay();
    currentProblem = null;
    problemEl.textContent = t('clickToStart');
    problemEl.style.color = '#e6e6e6';
    answerInput.value = '';
}

function toggleOpBtn(btn) {
    if (btn.className.indexOf('active') !== -1) {
        btn.className = btn.className.replace('active', '');
    } else {
        btn.className = btn.className + ' active';
    }
    readSettings();
}
langSelector.addEventListener('change', function () {
    currentLang = langSelector.value;
    updateUI();
});

newProblemBtn.addEventListener('click', function () {
    newProblem();
});

submitBtn.addEventListener('click', function () {
    submitAnswer();
});

answerInput.addEventListener('keypress', function (e) {
    if (e.keyCode === 13 || e.key === 'Enter') {
        submitAnswer();
    }
});

skipBtn.addEventListener('click', function () {
    skipProblem();
});


resetBtn.addEventListener('click', function () {
    resetStats();
});

rangeSelect.addEventListener('change', function () {
    readSettings();
});
termsSelect.addEventListener('change', function () {
    readSettings();
});
negativeSelect.addEventListener('change', function () {
    readSettings();
});

for (var i = 0; i < opBtns.length; i++) {
    opBtns[i].addEventListener('click', function () {
        toggleOpBtn(this);
    });
}


updateUI();
updateStatsDisplay();
readSettings();