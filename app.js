const baseURL = 'http://localhost:3000/goals';
const form = document.getElementById('goal-form');
const goalsList = document.getElementById('goals-list');

// Fetch and render goals
function fetchGoals() {
    fetch(baseURL)
    .then(res => res.json())
    .then(goals => {
        goalsList.innerHTML = '';
        goals.forEach(renderGoal);
    });
}

// Render a goal
function renderGoal(goal) {
    const div = document.createElement('div');
    div.className = 'goal-item';
    if (goal.achieved) {
        div.classList.add('achieved');
    }

    div.innerHTML = \`
        <strong>\${goal.category}</strong>: \${goal.description} (\${goal.repetitions})
        <button onclick="markAchieved(\${goal.id}, this)">Mark as Achieved</button>
    \`;

    goalsList.appendChild(div);
}

// Add new goal
form.addEventListener('submit', function(e) {
    e.preventDefault();

    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;
    const repetitions = document.getElementById('repetitions').value;

    if (!description || !category || !repetitions) return;

    const newGoal = {
        description,
        category,
        repetitions,
        achieved: false
    };

    fetch(baseURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGoal)
    })
    .then(res => res.json())
    .then(goal => {
        renderGoal(goal);
        form.reset();
    });
});

// Mark goal as achieved
function markAchieved(id, button) {
    fetch(\`\${baseURL}/\${id}\`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ achieved: true })
    })
    .then(res => res.json())
    .then(updatedGoal => {
        button.parentElement.classList.add('achieved');
    });
}

// Initial fetch
fetchGoals();
