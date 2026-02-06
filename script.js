const form = document.getElementById('registration-form');
const fields = Array.from(form.querySelectorAll('input[required], select[required], textarea[required]'));
const statusEl = document.getElementById('form-status');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');

const validators = {
  fullName: (value) =>
    value.trim().length >= 3 ? '' : 'Please enter your full name (at least 3 characters).',
  email: (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? '' : 'Enter a valid email address.',
  phone: (value) =>
    /^\d{10}$/.test(value.replace(/\D/g, '')) ? '': 'Enter a valid 10-digit phone number.',
  year: (value) => (value ? '' : 'Please select your academic year.'),
  motivation: (value) =>
    value.trim().length >= 12 ? '' : 'Please share at least 12 characters about your motivation.'
};

function validateField(field) {
  const rule = validators[field.name];
  if (!rule) return true;

  const message = rule(field.value);
  const errorEl = field.parentElement.querySelector('.error-message');
  errorEl.textContent = message;

  field.classList.toggle('invalid', Boolean(message));
  field.classList.toggle('valid', !message && field.value.trim().length > 0);

  return !message;
}

function updateProgress() {
  const validCount = fields.reduce((count, field) => count + (validateField(field) ? 1 : 0), 0);
  const percentage = Math.round((validCount / fields.length) * 100);
  progressBar.style.width = `${percentage}%`;
  progressText.textContent = `${percentage}% complete`;
}

fields.forEach((field) => {
  field.addEventListener('input', () => {
    validateField(field);
    updateProgress();
  });
  field.addEventListener('blur', () => validateField(field));
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const allValid = fields.every((field) => validateField(field));
  updateProgress();

  if (!allValid) {
    statusEl.textContent = 'Please correct highlighted fields before submitting.';
    statusEl.className = 'form-status';
    return;
  }

  statusEl.textContent = '✅ Registration successful! Check your email for confirmation details.';
  statusEl.className = 'form-status success';
  form.reset();
  fields.forEach((field) => field.classList.remove('valid', 'invalid'));
  updateProgress();
});

const eventDate = new Date('2026-03-12T09:30:00');

function updateCountdown() {
  const now = new Date();
  const diff = eventDate - now;

  if (diff <= 0) {
    document.getElementById('countdown').innerHTML = '<p>The event is live now!</p>';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  document.getElementById('days').textContent = String(days).padStart(2, '0');
  document.getElementById('hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

updateProgress();
updateCountdown();
setInterval(updateCountdown, 1000);
