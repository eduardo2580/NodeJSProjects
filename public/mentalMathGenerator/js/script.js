        // Translations
        const translations = {
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
                correct: "Correct! ✓",
                wrong: "Wrong! The answer was",
                selectOperation: "Please select at least one operation!",
                pageTitle: "Mental Math Generator",
                pageDescription: "Practice mental math with random problems. Available in English, Portuguese, and Spanish."
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
                correct: "Correto! ✓",
                wrong: "Errado! A resposta era",
                selectOperation: "Por favor, selecione pelo menos uma operação!",
                pageTitle: "Gerador de Matemática Mental",
                pageDescription: "Pratique matemática mental com problemas aleatórios. Disponível em Inglês, Português e Espanhol."
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
                correct: "¡Correcto! ✓",
                wrong: "¡Incorrecto! La respuesta era",
                selectOperation: "¡Por favor, selecciona al menos una operación!",
                pageTitle: "Generador de Matemáticas Mentales",
                pageDescription: "Practica matemáticas mentales con problemas aleatorios. Disponible en Inglés, Portugués y Español."
            }
        };

        // App state
        let currentLang = 'en';
        let currentProblem = null;
        let stats = { correct: 0, wrong: 0, total: 0 };
        let settings = {
            range: 100,
            terms: 2,
            allowNegative: false,
            operations: ['+', '-', '*']
        };

        // DOM elements
        const elements = {
            langSelector: document.getElementById('langSelector'),
            title: document.getElementById('title'),
            subtitle: document.getElementById('subtitle'),
            correctCount: document.getElementById('correctCount'),
            totalCount: document.getElementById('totalCount'),
            wrongCount: document.getElementById('wrongCount'),
            correctLabel: document.getElementById('correctLabel'),
            totalLabel: document.getElementById('totalLabel'),
            wrongLabel: document.getElementById('wrongLabel'),
            problem: document.getElementById('problem'),
            answerInput: document.getElementById('answerInput'),
            submitBtn: document.getElementById('submitBtn'),
            newProblemBtn: document.getElementById('newProblemBtn'),
            skipBtn: document.getElementById('skipBtn'),
            resetBtn: document.getElementById('resetBtn'),
            rangeSelect: document.getElementById('rangeSelect'),
            termsSelect: document.getElementById('termsSelect'),
            negativeSelect: document.getElementById('negativeSelect'),
            rangeLabel: document.getElementById('rangeLabel'),
            termsLabel: document.getElementById('termsLabel'),
            negativeLabel: document.getElementById('negativeLabel'),
            operationsLabel: document.getElementById('operationsLabel'),
            opBtns: document.querySelectorAll('.op-btn')
        };

        // Utility functions
        function t(key) {
            return translations[currentLang][key] || key;
        }

        function random(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        function updateUI() {
            // Update page title and meta description
            document.title = t('pageTitle');
            document.querySelector('meta[name="description"]').content = t('pageDescription');
            
            elements.title.textContent = t('title');
            elements.subtitle.textContent = t('subtitle');
            elements.correctLabel.textContent = t('correctLabel');
            elements.totalLabel.textContent = t('totalLabel');
            elements.wrongLabel.textContent = t('wrongLabel');
            elements.answerInput.placeholder = t('yourAnswer');
            elements.submitBtn.textContent = t('submit');
            elements.newProblemBtn.textContent = t('newProblem');
            elements.skipBtn.textContent = t('skip');
            elements.resetBtn.textContent = t('reset');
            elements.rangeLabel.textContent = t('rangeLabel');
            elements.termsLabel.textContent = t('termsLabel');
            elements.negativeLabel.textContent = t('negativeLabel');
            elements.operationsLabel.textContent = t('operationsLabel');

            // Update select options
            elements.negativeSelect.options[0].textContent = t('positiveOnly');
            elements.negativeSelect.options[1].textContent = t('allowNegative');
            elements.termsSelect.options[0].textContent = t('terms2');
            elements.termsSelect.options[1].textContent = t('terms3');
            elements.termsSelect.options[2].textContent = t('terms4');

            if (!currentProblem) {
                elements.problem.textContent = t('clickToStart');
            }
        }

        function updateStats() {
            elements.correctCount.textContent = stats.correct;
            elements.wrongCount.textContent = stats.wrong;
            elements.totalCount.textContent = stats.total;
        }

        function generateProblem() {
            const nums = [];
            const ops = [];
            
            // Generate numbers
            for (let i = 0; i < settings.terms; i++) {
                let num = random(1, settings.range);
                if (settings.allowNegative && Math.random() < 0.3) {
                    num = -num;
                }
                nums.push(num);
            }

            // Generate operations
            for (let i = 0; i < settings.terms - 1; i++) {
                ops.push(settings.operations[random(0, settings.operations.length - 1)]);
            }

            // Handle division to ensure integer results
            for (let i = 0; i < ops.length; i++) {
                if (ops[i] === '/') {
                    const divisor = Math.max(1, Math.abs(nums[i + 1]));
                    const multiplier = random(1, Math.floor(settings.range / divisor));
                    nums[i] = divisor * multiplier * (nums[i] < 0 ? -1 : 1);
                }
            }

            // Build expression and calculate result
            let expression = nums[0].toString();
            let result = nums[0];

            for (let i = 0; i < ops.length; i++) {
                const op = ops[i];
                const num = nums[i + 1];
                expression += ` ${op === '*' ? '×' : op === '/' ? '÷' : op} ${num}`;
                
                switch (op) {
                    case '+': result += num; break;
                    case '-': result -= num; break;
                    case '*': result *= num; break;
                    case '/': result /= num; break;
                }
            }

            return { expression, result: Math.round(result) };
        }

        function newProblem() {
            if (settings.operations.length === 0) {
                alert(t('selectOperation'));
                return;
            }

            currentProblem = generateProblem();
            elements.problem.textContent = currentProblem.expression;
            elements.answerInput.value = '';
            elements.answerInput.focus();
        }

        function submitAnswer() {
            if (!currentProblem) return;

            const userAnswer = parseInt(elements.answerInput.value);
            if (isNaN(userAnswer)) return;

            stats.total++;
            
            if (userAnswer === currentProblem.result) {
                stats.correct++;
                elements.problem.textContent = t('correct');
                elements.problem.style.color = '#10b981';
            } else {
                stats.wrong++;
                elements.problem.textContent = `${t('wrong')}: ${currentProblem.result}`;
                elements.problem.style.color = '#ef4444';
            }

            updateStats();
            
            setTimeout(() => {
                elements.problem.style.color = '#f8fafc';
                newProblem();
            }, 2000);
        }

        function skipProblem() {
            if (currentProblem) {
                newProblem();
            }
        }

        function resetStats() {
            stats = { correct: 0, wrong: 0, total: 0 };
            updateStats();
            currentProblem = null;
            elements.problem.textContent = t('clickToStart');
        }

        function updateSettings() {
            settings.range = parseInt(elements.rangeSelect.value);
            settings.terms = parseInt(elements.termsSelect.value);
            settings.allowNegative = elements.negativeSelect.value === 'true';
            
            settings.operations = Array.from(elements.opBtns)
                .filter(btn => btn.classList.contains('active'))
                .map(btn => btn.dataset.op);
        }

        // Event listeners
        elements.langSelector.addEventListener('change', (e) => {
            currentLang = e.target.value;
            // Update HTML lang attribute
            document.documentElement.lang = currentLang;
            updateUI();
        });

        elements.newProblemBtn.addEventListener('click', () => {
            updateSettings();
            newProblem();
        });

        elements.submitBtn.addEventListener('click', submitAnswer);

        elements.answerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                submitAnswer();
            }
        });

        elements.skipBtn.addEventListener('click', skipProblem);
        elements.resetBtn.addEventListener('click', resetStats);

        elements.rangeSelect.addEventListener('change', updateSettings);
        elements.termsSelect.addEventListener('change', updateSettings);
        elements.negativeSelect.addEventListener('change', updateSettings);

        elements.opBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                btn.classList.toggle('active');
                updateSettings();
            });
        });

        // Initialize
        updateUI();
        updateStats();