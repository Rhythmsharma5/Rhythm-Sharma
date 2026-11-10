const commandInput = document.getElementById('commandInput');
const sendBtn = document.getElementById('sendBtn');
const chatLog = document.getElementById('chatLog');
const voiceToggle = document.getElementById('voiceToggle');
const statusText = document.getElementById('statusText');
const greeting = document.getElementById('greeting');

let isListening = false;
let recognition;

function addMessage(role, text) {
  const message = document.createElement('div');
  message.className = `message ${role}`;

  const label = document.createElement('span');
  label.className = 'label';
  label.textContent = role === 'user' ? 'YOU' : 'JARVIS';

  const content = document.createElement('p');
  content.textContent = text;

  message.append(label, content);
  chatLog.appendChild(message);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function getCurrentTime() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getCurrentDate() {
  const now = new Date();
  return now.toLocaleDateString([], {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

function systemStatus() {
  return `All primary systems are online. Power grid stable at 97%, communication uplink active, and diagnostic sweep is clear.`;
}

function weatherReply() {
  const conditions = ['clear skies', 'light cloud cover', 'moderate storm activity', 'warm and sunny'];
  const value = conditions[Math.floor(Math.random() * conditions.length)];
  return `Environmental scan indicates ${value} with a comfortable temperature range and no major anomalies.`;
}

function taskReply() {
  return 'Current tasks: 1) Review system telemetry, 2) Prepare deployment report, 3) Monitor communications, 4) Maintain defense layers.';
}

function respondToCommand(command) {
  const normalized = command.trim().toLowerCase();
  if (!normalized) return 'Awaiting input.';

  if (normalized.includes('hello') || normalized.includes('hi')) {
    return 'Good evening, Sir. JARVIS is online and ready to assist.';
  }

  if (normalized.includes('status')) {
    return systemStatus();
  }

  if (normalized.includes('time')) {
    return `Current time is ${getCurrentTime()} and the date is ${getCurrentDate()}.`;
  }

  if (normalized.includes('weather')) {
    return weatherReply();
  }

  if (normalized.includes('task') || normalized.includes('todo')) {
    return taskReply();
  }

  if (normalized.includes('launch') || normalized.includes('open')) {
    return 'Launching a secure operational window. All systems remain stable.';
  }

  if (normalized.includes('shutdown')) {
    return 'Stand by. Shutdown sequence initialized in safe mode.';
  }

  return 'Command acknowledged. Additional guidance or system diagnostics can be activated with a follow-up request.';
}

function performCommand() {
  const value = commandInput.value.trim();
  if (!value) return;

  addMessage('user', value);
  const response = respondToCommand(value);
  addMessage('assistant', response);
  commandInput.value = '';
  commandInput.focus();
}

sendBtn.addEventListener('click', performCommand);
commandInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    performCommand();
  }
});

document.querySelectorAll('.quick-btn').forEach((button) => {
  button.addEventListener('click', () => {
    const command = button.dataset.command;
    commandInput.value = command;
    performCommand();
  });
});

function updateGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) {
    greeting.textContent = 'Good morning. Systems online.';
  } else if (hour < 18) {
    greeting.textContent = 'Good afternoon. Systems online.';
  } else {
    greeting.textContent = 'Good evening. Systems online.';
  }
}

function updateSystemMetrics() {
  const cpu = 58 + Math.round(Math.random() * 28);
  const memory = 62 + Math.round(Math.random() * 20);
  document.getElementById('cpuLoad').textContent = `${cpu}%`;
  document.getElementById('memoryLoad').textContent = `${memory}%`;

  const now = new Date();
  const seconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  const uptime = new Date(seconds * 1000).toISOString().slice(11, 19);
  document.getElementById('uptime').textContent = uptime;
}

function activateVoice() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    addMessage('assistant', 'Voice recognition is not supported in this browser. Keyboard input remains available.');
    return;
  }

  if (!isListening) {
    recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      isListening = true;
      statusText.textContent = 'Listening';
      voiceToggle.textContent = 'Stop Voice';
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      commandInput.value = transcript;
      addMessage('user', transcript);
      addMessage('assistant', respondToCommand(transcript));
      commandInput.value = '';
    };

    recognition.onerror = () => {
      addMessage('assistant', 'Voice capture interrupted. Please try again.');
      isListening = false;
      statusText.textContent = 'Standby';
      voiceToggle.textContent = 'Activate Voice';
    };

    recognition.onend = () => {
      isListening = false;
      statusText.textContent = 'Standby';
      voiceToggle.textContent = 'Activate Voice';
    };

    recognition.start();
  } else {
    recognition.stop();
    isListening = false;
    statusText.textContent = 'Standby';
    voiceToggle.textContent = 'Activate Voice';
  }
}

voiceToggle.addEventListener('click', activateVoice);

updateGreeting();
updateSystemMetrics();
setInterval(updateSystemMetrics, 3000);

statusText.textContent = 'Standby';
