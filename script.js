const confessionsKey = 'confessions';

function loadConfessions() {
  const confessions = JSON.parse(localStorage.getItem(confessionsKey)) || [];
  const confessionsList = document.getElementById('confessionsList');
  confessionsList.innerHTML = ''; 

  // Sort confessions by upvotes
  confessions.sort((a, b) => b.upvotes - a.upvotes);

  confessions.forEach((confession, index) => {
    const confessionDiv = document.createElement('div');
    confessionDiv.classList.add('confession');
    
    // Calculate time ago
    const timeAgo = getTimeAgo(confession.timestamp);
    
    confessionDiv.innerHTML = `
      <p><strong>${confession.nickname || 'Anonymous'}</strong> (${timeAgo})</p>
      <p class="category">Category: ${confession.category}</p>
      <p>${confession.text}</p>
      <div class="reaction-container">
        <span class="upvote" onclick="vote(${index}, 'upvote')">👍 ${confession.upvotes}</span>
        <span class="downvote" onclick="vote(${index}, 'downvote')">👎 ${confession.downvotes}</span>
      </div>
    `;
    confessionsList.appendChild(confessionDiv);
  });

  document.getElementById('confessionCounter').innerText = `Total Confessions: ${confessions.length}`;
}

function postConfession() {
  const confessionInput = document.getElementById('confessionInput');
  const nicknameInput = document.getElementById('nickname');
  const categorySelect = document.getElementById('category');
  const confessionText = confessionInput.value.trim();
  const nickname = nicknameInput.value.trim();
  const category = categorySelect.value;

  if (confessionText) {
    const confessions = JSON.parse(localStorage.getItem(confessionsKey)) || [];
    const newConfession = {
      text: confessionText,
      upvotes: 0,
      downvotes: 0,
      nickname: nickname || 'Anonymous',
      category: category,
      timestamp: Date.now()
    };
    confessions.push(newConfession);
    localStorage.setItem(confessionsKey, JSON.stringify(confessions));
    confessionInput.value = '';
    loadConfessions();
    confetti();  // Trigger confetti animation
  }
}

function getTimeAgo(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
}

function vote(index, type) {
  const confessions = JSON.parse(localStorage.getItem(confessionsKey)) || [];
  if (type === 'upvote') {
    confessions[index].upvotes++;
  } else if (type === 'downvote') {
    confessions[index].downvotes++;
  }
  localStorage.setItem(confessionsKey, JSON.stringify(confessions));
  loadConfessions();
}

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}

function addEmoji(emoji) {
  const confessionInput = document.getElementById('confessionInput');
  confessionInput.value += emoji;
}

loadConfessions();
