// ─── DOM refs ───
const heightInput = document.getElementById('height');
const weightInput = document.getElementById('weight');
const bmiValueEl = document.getElementById('bmiValue');
const bmiStatusEl = document.getElementById('bmiStatus');
const healthForm = document.getElementById('healthForm');

// ─── BMI Calculation ───
function calculateBMI() {
    const h = parseFloat(heightInput.value);
    const w = parseFloat(weightInput.value);
    if (h > 0 && w > 0) {
        const bmi = w / ((h / 100) ** 2);
        return Math.round(bmi * 10) / 10;
    }
    return null;
}

function getBMICategory(bmi) {
    if (bmi === null) return { label: '—', cls: '' };
    if (bmi < 18.5) return { label: 'Underweight', cls: 'underweight' };
    if (bmi < 25) return { label: 'Normal', cls: 'normal' };
    if (bmi < 30) return { label: 'Overweight', cls: 'overweight' };
    return { label: 'Obese', cls: 'obese' };
}

function updateBMI() {
    const bmi = calculateBMI();
    if (bmi !== null) {
        bmiValueEl.textContent = bmi.toFixed(1);
        const cat = getBMICategory(bmi);
        bmiStatusEl.textContent = cat.label;
        bmiStatusEl.className = 'bmi-status ' + cat.cls;
    } else {
        bmiValueEl.textContent = '—';
        bmiStatusEl.textContent = '—';
        bmiStatusEl.className = 'bmi-status';
    }
    updateMetrics(bmi);
    updateWaterIntake(bmi);
}

function updateMetrics(bmi) {
    let cal = 1840;
    if (bmi !== null) {
        if (bmi < 18.5) cal = 1700 + Math.round(Math.random() * 200);
        else if (bmi < 25) cal = 1840 + Math.round(Math.random() * 300);
        else if (bmi < 30) cal = 2000 + Math.round(Math.random() * 300);
        else cal = 2100 + Math.round(Math.random() * 400);
    }
    document.getElementById('metricCalories').textContent = cal.toLocaleString();

    let wo = 42;
    if (bmi !== null) {
        if (bmi < 18.5) wo = 30 + Math.round(Math.random() * 15);
        else if (bmi < 25) wo = 42 + Math.round(Math.random() * 18);
        else if (bmi < 30) wo = 48 + Math.round(Math.random() * 20);
        else wo = 35 + Math.round(Math.random() * 25);
    }
    document.getElementById('metricWorkout').textContent = wo + ' min';
    document.getElementById('metricBMI').textContent = bmi !== null ? bmi.toFixed(1) : '—';
}

function updateWaterIntake(bmi) {
    let water = '—';
    if (bmi !== null) {
        if (bmi < 18.5) water = '2.0 L';
        else if (bmi < 25) water = '2.2 L';
        else if (bmi < 30) water = '2.5 L';
        else water = '2.7 L';
    }
    document.getElementById('metricWater').textContent = water;
}

// ─── Recommendations update only on form submit ───
function updateRecommendations(bmi) {
    const dietList = document.getElementById('dietList');
    const routineList = document.getElementById('routineList');
    let diet = [], routine = [];

    if (bmi !== null) {
        if (bmi < 18.5) {
            diet = ['Focus on nutrient-dense, calorie-rich foods like nuts, avocados, and whole grains.',
                'Eat 5–6 smaller meals throughout the day to boost intake.',
                'Include healthy fats and protein with every meal.',
                'Drink smoothies or shakes with added protein and fruits.'
            ];
            routine = ['Light resistance training to build muscle mass.',
                'Avoid excessive cardio; focus on strength and flexibility.',
                'Prioritize sleep and recovery — 8+ hours per night.',
                'Practice gentle yoga to reduce stress and improve appetite.'
            ];
        } else if (bmi >= 25 && bmi < 30) {
            diet = ['Reduce refined carbs and sugars; choose whole grains instead.',
                'Increase fiber intake with vegetables, legumes, and fruits.',
                'Control portion sizes and eat mindfully.',
                'Limit sugary drinks and alcohol.'
            ];
            routine = ['Aim for 45 minutes of moderate activity 5 days a week.',
                'Incorporate both cardio and strength training.',
                'Take the stairs, walk during breaks, stay active throughout the day.',
                'Try high-intensity interval training (HIIT) for efficiency.'
            ];
        } else if (bmi >= 30) {
            diet = ['Work with a healthcare provider for a safe weight-loss plan.',
                'Focus on whole, unprocessed foods with low glycemic index.',
                'Track your food intake to build awareness.',
                'Include plenty of water and fiber-rich vegetables.'
            ];
            routine = ['Start with low-impact activities like swimming or walking.',
                'Gradually increase activity duration and intensity.',
                'Include strength training to boost metabolism.',
                'Prioritize consistency over intensity — move daily.'
            ];
        } else {
            diet = ['Eat a balanced diet with plenty of vegetables and lean protein.',
                'Stay hydrated — aim for 2.5 L of water daily.',
                'Limit processed foods and added sugars.',
                'Include healthy fats like avocado, nuts, and olive oil.'
            ];
            routine = ['Start your day with 10 min of stretching or yoga.',
                'Get at least 30 minutes of moderate exercise daily.',
                'Take short breaks to walk and move throughout the day.',
                'Practice mindfulness or meditation for 5–10 minutes.'
            ];
        }
    } else {
        diet = ['Complete the assessment to see your personalized diet plan.'];
        routine = ['Complete the assessment to see your personalized routine.'];
    }

    dietList.innerHTML = diet.map(item => `<li>${item}</li>`).join('');
    routineList.innerHTML = routine.map(item => `<li>${item}</li>`).join('');
}

// ─── Form Submission ───
healthForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const bmi = calculateBMI();
    if (bmi === null) {
        alert('Please enter valid height and weight.');
        return;
    }
    updateRecommendations(bmi);
    document.getElementById('results').scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Save user profile (if logged in)
    if (currentUser) {
        const payload = {
            height: parseFloat(heightInput.value),
            weight: parseFloat(weightInput.value),
            gender: document.querySelector('input[name="gender"]:checked').value,
            bmi: bmi,
            full_name: document.getElementById('fullName').value || 'User'
        };
        fetch('/api/update-profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).then(res => res.json()).then(data => {
            console.log('Profile updated:', data);
        }).catch(err => console.error(err));
    }

    // Generate AI Wellness Plan
    const aiPlanCard = document.getElementById('aiPlanCard');
    const aiPlanText = document.getElementById('aiPlanText');
    aiPlanCard.style.display = 'block';
    aiPlanText.innerHTML = 'Generating personalized plan with AI... <i class="fas fa-spinner fa-spin"></i>';

    fetch('/api/wellness-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bmi: bmi })
    })
    .then(res => res.json())
    .then(data => {
        if (data.plan) {
            // Extra cleaning: remove any leftover * or #
            let cleaned = data.plan.replace(/[#*]/g, '');
            aiPlanText.textContent = cleaned;
        } else {
            aiPlanText.textContent = '⚠️ Could not generate plan. Please try again.';
        }
    })
    .catch(err => {
        aiPlanText.textContent = '⚠️ Connection error while generating plan.';
        console.error(err);
    });
});

heightInput.addEventListener('input', updateBMI);
weightInput.addEventListener('input', updateBMI);

// ─── Results Tab Switching ───
function switchResultTab(tab) {
    document.querySelectorAll('.results-tab-btn').forEach(btn => {
        const isTarget = tab === 'dash' ? btn.textContent.includes('Dashboard') : btn.textContent.includes('Assistant');
        btn.classList.toggle('active', isTarget);
    });
    document.getElementById('panelDashboard').style.display = tab === 'dash' ? 'flex' : 'none';
    document.getElementById('panelChat').style.display = tab === 'chat' ? 'block' : 'none';
    if (tab === 'chat') document.getElementById('embeddedChatInput').focus();
}

// ─── General Chat (Embedded) ───
const embeddedChatMessages = document.getElementById('embeddedChatMessages');
const embeddedChatInput = document.getElementById('embeddedChatInput');
const fileUploadInput = document.getElementById('fileUploadInput');
let generalChatHistory = [];
let generalChatSessionId = null;

function addEmbeddedChatMessage(sender, text) {
    const div = document.createElement('div');
    div.className = 'chat-msg ' + sender;
    div.textContent = text;
    embeddedChatMessages.appendChild(div);
    embeddedChatMessages.scrollTop = embeddedChatMessages.scrollHeight;
}

async function sendEmbeddedChat() {
    const msg = embeddedChatInput.value.trim();
    if (!msg) return;
    addEmbeddedChatMessage('user', msg);
    embeddedChatInput.value = '';

    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-msg bot typing';
    typingDiv.textContent = 'Thinking...';
    embeddedChatMessages.appendChild(typingDiv);
    embeddedChatMessages.scrollTop = embeddedChatMessages.scrollHeight;

    try {
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: msg,
                history: generalChatHistory,
                session_id: generalChatSessionId
            })
        });
        const data = await res.json();
        embeddedChatMessages.removeChild(typingDiv);
        if (data.response) {
            let cleaned = data.response.replace(/[#*]/g, '');
            addEmbeddedChatMessage('bot', cleaned);
            generalChatHistory.push({ role: 'user', content: msg });
            generalChatHistory.push({ role: 'assistant', content: cleaned });
            generalChatSessionId = data.session_id || generalChatSessionId;
        } else {
            addEmbeddedChatMessage('bot', '⚠️ Sorry, I could not process that request.');
        }
    } catch (err) {
        if (typingDiv.parentNode) embeddedChatMessages.removeChild(typingDiv);
        addEmbeddedChatMessage('bot', '⚠️ Connection error. Please try again.');
    }
}

function newGeneralChat() {
    embeddedChatMessages.innerHTML = '<div class="chat-msg bot">👋 Welcome! I\'m MedGuide AI. Ask me any health question.</div>';
    generalChatHistory = [];
    generalChatSessionId = null;
}

function deleteGeneralChat() {
    if (confirm('Delete this chat session?')) {
        newGeneralChat();
        if (generalChatSessionId) {
            fetch('/api/delete-chat/' + generalChatSessionId, { method: 'DELETE' });
            generalChatSessionId = null;
        }
    }
}

embeddedChatInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') sendEmbeddedChat();
});

fileUploadInput.addEventListener('change', async function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    addEmbeddedChatMessage('user', `📎 Uploaded: ${file.name}`);

    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-msg bot typing';
    typingDiv.textContent = 'Analyzing file...';
    embeddedChatMessages.appendChild(typingDiv);
    embeddedChatMessages.scrollTop = embeddedChatMessages.scrollHeight;

    try {
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();
        embeddedChatMessages.removeChild(typingDiv);
        if (data.analysis) {
            let cleaned = data.analysis.replace(/[#*]/g, '');
            addEmbeddedChatMessage('bot', cleaned);
            generalChatHistory.push({ role: 'user', content: `Uploaded file: ${file.name}` });
            generalChatHistory.push({ role: 'assistant', content: cleaned });
        } else {
            addEmbeddedChatMessage('bot', '⚠️ File analysis failed.');
        }
    } catch (err) {
        if (typingDiv.parentNode) embeddedChatMessages.removeChild(typingDiv);
        addEmbeddedChatMessage('bot', '⚠️ Error uploading file.');
    }
    fileUploadInput.value = '';
});

// ─── Local Topic Chats (no auto-reply) ───
const localChatModal = document.getElementById('localChatModal');
const localChatOverlay = document.getElementById('localChatOverlay');
const localChatTitle = document.getElementById('localChatTitle');
const localChatMessages = document.getElementById('localChatMessages');
const localChatInput = document.getElementById('localChatInput');

let currentLocalTopic = '';
let localChatHistories = {};

const TOPIC_CONFIGS = {
    diet: {
        title: '🍎 Diet & Nutrition AI',
        welcome: 'Hello! I\'m your Diet & Nutrition AI. How can I help you with your meal planning, nutrient choices, or hydration?',
        prompt: 'You are a Diet & Nutrition AI. Help the user with meal planning, nutrient choices, hydration, and calories. Format your replies with clear headings (use ALL CAPS) and bullet points (use - ). Avoid special characters like *, #, @. Give detailed advice (at least 7 sentences).',
        endpoint: null
    },
    routine: {
        title: '⏰ Daily Routine & Exercise AI',
        welcome: 'Hello! I\'m your Daily Routine & Exercise AI. Ask me how to structure your day, add movement, or improve habits.',
        prompt: 'You are a Daily Routine & Exercise AI. Help the user structure their day, add stretching, manage time, and improve lifestyle habits. Use headings (ALL CAPS) and bullet points (-). No special characters. Give detailed advice (at least 7 sentences).',
        endpoint: null
    },
    recipes: {
        title: '🍲 Healthy Recipes AI',
        welcome: 'Hi! I\'m your Healthy Recipes AI. Tell me your dietary preferences, and I\'ll suggest a delicious, healthy recipe.',
        prompt: 'You are a Healthy Recipes AI. Help the user find recipes, substitute ingredients, and explain healthy cooking steps. Use headings (ALL CAPS) and bullet points (-). No special characters. Give detailed advice (at least 7 sentences).',
        endpoint: '/api/recipes',
        responseKey: 'recipes'
    },
    workout: {
        title: '💪 Adaptive Workouts AI',
        welcome: 'Welcome! I\'m your Adaptive Workouts AI. Tell me your fitness level (beginner, intermediate, advanced) or specific goals.',
        prompt: 'You are a Fitness Trainer AI. Provide workouts, exercise instructions, safety advice, and recovery guidance. Use headings (ALL CAPS) and bullet points (-). No special characters. Give detailed advice (at least 7 sentences).',
        endpoint: '/api/workouts',
        responseKey: 'workout',
        defaultPayload: { level: 'beginner' }
    },
    mental: {
        title: '🧠 Mental Wellness AI',
        welcome: 'Hello. I\'m your Mental Wellness AI coach. Ask me for stress relief tips, mindfulness exercises, or coping techniques.',
        prompt: 'You are a Mental Wellness AI. Provide supportive advice on mindfulness, stress reduction, meditation, and healthy coping. Use headings (ALL CAPS) and bullet points (-). No special characters. Give detailed advice (at least 7 sentences).',
        endpoint: '/api/mental-wellness',
        responseKey: 'tips'
    },
    sleep: {
        title: '🌙 Sleep Optimization AI',
        welcome: 'Hello! I\'m your Sleep Optimization AI. Ask me about improving your sleep schedule, bedroom environment, or relaxation techniques.',
        prompt: 'You are a Sleep Optimization AI. Offer evidence-based sleep hygiene tips, bedtime routines, and relaxation advice. Use headings (ALL CAPS) and bullet points (-). No special characters. Give detailed advice (at least 7 sentences).',
        endpoint: '/api/sleep-optimization',
        responseKey: 'tips'
    }
};

function addLocalChatMessage(sender, text) {
    const div = document.createElement('div');
    div.className = 'chat-msg ' + sender;
    div.textContent = text;
    localChatMessages.appendChild(div);
    localChatMessages.scrollTop = localChatMessages.scrollHeight;
}

async function openLocalChat(topic) {
    currentLocalTopic = topic;
    const config = TOPIC_CONFIGS[topic];
    localChatTitle.innerHTML = `<i class="fas fa-robot"></i> ${config.title}`;

    localChatOverlay.style.display = 'block';
    localChatModal.style.display = 'flex';
    setTimeout(() => { localChatModal.classList.add('open'); }, 10);
    localChatInput.focus();

    // Reset chat – no auto-reply, just the welcome message.
    localChatMessages.innerHTML = '';
    localChatHistories[topic] = [];
    addLocalChatMessage('bot', config.welcome);
    // No auto-trigger; user must type.
}

async function sendLocalChat() {
    const msg = localChatInput.value.trim();
    if (!msg || !currentLocalTopic) return;
    addLocalChatMessage('user', msg);
    localChatInput.value = '';

    const config = TOPIC_CONFIGS[currentLocalTopic];
    localChatHistories[currentLocalTopic].push({ role: 'user', content: msg });

    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-msg bot typing';
    typingDiv.textContent = 'Thinking...';
    localChatMessages.appendChild(typingDiv);
    localChatMessages.scrollTop = localChatMessages.scrollHeight;

    try {
        // If the topic has a direct endpoint, we can call it, but we still use the general chat with a system prompt.
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: msg,
                history: localChatHistories[currentLocalTopic],
                system_prompt: config.prompt,
                topic: currentLocalTopic
            })
        });
        const data = await res.json();
        localChatMessages.removeChild(typingDiv);
        if (data.response) {
            let cleaned = data.response.replace(/[#*]/g, '');
            addLocalChatMessage('bot', cleaned);
            localChatHistories[currentLocalTopic].push({ role: 'assistant', content: cleaned });
        } else {
            addLocalChatMessage('bot', '⚠️ Sorry, I could not process that request.');
        }
    } catch (err) {
        if (typingDiv.parentNode) localChatMessages.removeChild(typingDiv);
        addLocalChatMessage('bot', '⚠️ Connection error. Please try again.');
    }
}

function closeLocalChat() {
    localChatModal.classList.remove('open');
    setTimeout(() => {
        localChatModal.style.display = 'none';
        localChatOverlay.style.display = 'none';
    }, 300);
}

localChatInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') sendLocalChat();
});

// ─── Authentication ────────────────────────────────────────────────

let currentUser = null;

// Check session on load
async function checkSession() {
    try {
        const res = await fetch('/api/me');
        const data = await res.json();
        if (data.user) {
            currentUser = data.user;
            document.getElementById('authLinks').querySelectorAll('.btn').forEach(el => el.style.display = 'none');
            document.getElementById('profileBtn').style.display = 'inline-flex';
            document.getElementById('logoutLi').style.display = 'inline-block';
            // Load user data into assessment form
            const user = data.user;
            document.getElementById('fullName').value = user.full_name || '';
            // Fetch full profile
            loadProfileData();
        } else {
            document.getElementById('authLinks').querySelectorAll('.btn').forEach(el => el.style.display = 'inline-flex');
            document.getElementById('profileBtn').style.display = 'none';
            document.getElementById('logoutLi').style.display = 'none';
        }
    } catch (err) { console.error(err); }
}

async function loadProfileData() {
    try {
        const res = await fetch('/api/me');
        const data = await res.json();
        if (data.user) {
            // We don't have full profile from /api/me, so fetch from /api/state or similar.
            // For simplicity, we'll use the assessment form values.
            // We'll also load from the database via a separate endpoint.
            // Since we don't have a dedicated profile endpoint, we'll use the assessment form.
        }
    } catch (err) {}
}

function openLoginModal() {
    document.getElementById('loginModal').classList.add('open');
}

function closeLoginModal() {
    document.getElementById('loginModal').classList.remove('open');
}

let isLoginMode = false;

function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    const title = document.getElementById('authTitle');
    const sub = document.getElementById('authSub');
    const nameGroup = document.getElementById('nameGroup');
    const btn = document.getElementById('authBtn');
    const toggleLink = document.getElementById('authToggleLink');

    if (isLoginMode) {
        title.innerHTML = '<i class="fas fa-sign-in-alt" style="color:var(--primary);"></i> Log In';
        sub.textContent = 'Enter your credentials to access your account.';
        nameGroup.style.display = 'none';
        btn.innerHTML = '<i class="fas fa-arrow-right"></i> Log In';
        toggleLink.textContent = "Don't have an account? Register";
    } else {
        title.innerHTML = '<i class="fas fa-user-plus" style="color:var(--primary);"></i> Create Account';
        sub.textContent = 'Register to save your health data and get personalized AI insights.';
        nameGroup.style.display = 'block';
        btn.innerHTML = '<i class="fas fa-arrow-right"></i> Register';
        toggleLink.textContent = 'Already have an account? Log In';
    }
}

async function submitAuth() {
    const email = document.getElementById('authEmail').value.trim();
    const password = document.getElementById('authPassword').value.trim();
    
    // Only grab the name if we are registering
    let name = "";
    if (!isLoginMode) {
        name = document.getElementById('authName').value.trim();
    }

    if (!email || !password || (!isLoginMode && !name)) { 
        alert('Please fill in all required fields.'); 
        return; 
    }

    const endpoint = isLoginMode ? '/api/login' : '/api/register';
    const payload = isLoginMode ? { email, password } : { full_name: name, email, password };

    try {
        const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        
        if (data.success) {
            currentUser = data.user;
            closeLoginModal();
            alert(isLoginMode ? 'Logged in successfully!' : 'Account created successfully!');
            location.reload(); // Refreshes the page to update the UI
        } else {
            alert('Authentication failed: ' + (data.error || 'Unknown error'));
        }
    } catch (err) { 
        console.error("Auth Error:", err);
        alert('Server connection error.'); 
    }
}

function openProfileModal() {
    // Load current user data into modal
    const user = currentUser;
    if (!user) return;
    document.getElementById('profileName').value = user.full_name || '';
    document.getElementById('profileEmail').value = user.email || '';
    // Load height/weight from assessment if available
    const h = document.getElementById('height').value;
    const w = document.getElementById('weight').value;
    document.getElementById('profileHeight').value = h || '';
    document.getElementById('profileWeight').value = w || '';
    const gender = document.querySelector('input[name="gender"]:checked');
    if (gender) {
        document.querySelectorAll('input[name="profileGender"]').forEach(r => r.checked = r.value === gender.value);
    }
    const bmi = calculateBMI();
    document.getElementById('profileBMI').textContent = bmi !== null ? bmi.toFixed(1) : '—';
    document.getElementById('profileModal').classList.add('open');
}

function closeProfileModal() {
    document.getElementById('profileModal').classList.remove('open');
}

async function saveProfile() {
    const payload = {
        full_name: document.getElementById('profileName').value.trim(),
        height: parseFloat(document.getElementById('profileHeight').value),
        weight: parseFloat(document.getElementById('profileWeight').value),
        gender: document.querySelector('input[name="profileGender"]:checked')?.value || '',
        bmi: calculateBMI()
    };
    try {
        const res = await fetch('/api/update-profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
            alert('Profile updated successfully.');
            // Update assessment form
            document.getElementById('fullName').value = payload.full_name;
            document.getElementById('height').value = payload.height;
            document.getElementById('weight').value = payload.weight;
            document.querySelectorAll('input[name="gender"]').forEach(r => r.checked = r.value === payload.gender);
            updateBMI();
            closeProfileModal();
        } else {
            alert('Update failed.');
        }
    } catch (err) { alert('Error saving profile.'); }
}

async function logoutUser() {
    await fetch('/api/logout', { method: 'POST' });
    currentUser = null;
    location.reload();
}

// ─── Notification ──────────────────────────────────────────────────

function showNotification(title, message) {
    const toast = document.getElementById('notificationToast');
    const content = document.getElementById('notificationContent');
    content.innerHTML = `<strong>${title}</strong><br>${message}`;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 8000);
}

// Check for medication/appointment reminders on load
async function checkReminders() {
    try {
        const res = await fetch('/api/medications');
        const data = await res.json();
        if (data.medications && data.medications.length > 0) {
            const now = new Date();
            const today = now.toDateString();
            const upcoming = data.medications.filter(m => {
                // Simple: remind if the time is within the next hour
                // For demo, we'll just show all.
                return true;
            });
            if (upcoming.length > 0) {
                const names = upcoming.map(m => m.name).join(', ');
                showNotification('Medication Reminder', `Don't forget to take: ${names}`);
            }
        }
    } catch (err) {}
    try {
        const res = await fetch('/api/appointments');
        const data = await res.json();
        if (data.appointments && data.appointments.length > 0) {
            const today = new Date().toISOString().split('T')[0];
            const upcoming = data.appointments.filter(a => a.date === today);
            if (upcoming.length > 0) {
                const titles = upcoming.map(a => a.title).join(', ');
                showNotification('Appointment Reminder', `You have appointments today: ${titles}`);
            }
        }
    } catch (err) {}
}

// ─── Initialization ───
checkSession();
updateBMI();

// Auto-fetch health tip
fetch('/api/health-tips')
    .then(res => res.json())
    .then(data => {
        if (data.tip) {
            const tipsList = document.getElementById('tipsList');
            const aiTipLi = document.createElement('li');
            aiTipLi.style.fontWeight = '600';
            aiTipLi.style.color = 'var(--primary-dark)';
            aiTipLi.style.borderBottom = '1px solid var(--primary-light)';
            aiTipLi.style.paddingBottom = '8px';
            aiTipLi.innerHTML = `<i class="fas fa-sparkles text-yellow-500 mr-2"></i>AI Tip: ${data.tip}`;
            tipsList.insertBefore(aiTipLi, tipsList.firstChild);
        }
    })
    .catch(err => console.error(err));

// Check reminders after login
setTimeout(checkReminders, 1000);

console.log('MedGuide AI frontend loaded.');