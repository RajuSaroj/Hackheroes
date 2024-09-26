const syllabusData = [
    // ... (same as your original data)
];

const questionTemplates = [
    // ... (same as your original templates)
];

let currentQuestion = {};
let userResponses = [];
let correctAnswersCount = 0;

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function generateRandomQuestion() {
    let shuffledTopics = shuffle([...syllabusData]);
    let shuffledTemplates = shuffle([...questionTemplates]);

    const topicData = shuffledTopics[0];
    const template = shuffledTemplates[0];

    const question = template.replace('X', topicData.topic);

    currentQuestion = { question, answer: topicData.answer };
    return currentQuestion;
}

function nextQuestion() {
    const { question } = generateRandomQuestion();
    document.getElementById('question').innerText = question;
    document.getElementById('answer-box').style.display = 'none';
    document.getElementById('answer').innerText = "";
}

function showAnswer() {
    document.getElementById('answer').innerText = currentQuestion.answer;
    document.getElementById('answer-box').style.display = 'block';
}

function recordResponse(isCorrect) {
    userResponses.push(isCorrect);
    if (isCorrect) correctAnswersCount++;
    if (userResponses.length === syllabusData.length) {
        showResults();
    }
}

function showResults() {
    document.getElementById('results').style.display = 'block';
    const totalQuestions = userResponses.length;
    const correctPercentage = (correctAnswersCount / totalQuestions) * 100;
    const incorrectPercentage = 100 - correctPercentage;

    const ctx = document.getElementById('performance-chart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Correct', 'Incorrect'],
            datasets: [{
                data: [correctPercentage, incorrectPercentage],
                backgroundColor: ['#4CAF50', '#F44336']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return tooltipItem.label + ': ' + Math.round(tooltipItem.raw) + '%';
                        }
                    }
                }
            }
        }
    });

    const strengths = correctAnswersCount > totalQuestions / 2 ? 'Strong' : 'Weak';
    document.getElementById('results-summary').innerText = 'You answered ${correctAnswersCount} out of ${totalQuestions} questions correctly. Your performance is: ${strengths}.';
}

// Event listeners
document.getElementById('show-answer-btn').addEventListener('click', showAnswer);
document.getElementById('next-question-btn').addEventListener('click', nextQuestion);

// Initialize the first question
nextQuestion();