try {
  const nextAuth = require('next-auth');
  console.log('next-auth loaded successfully');
} catch (e) {
  console.error('Failed to load next-auth:', e.message);
}
