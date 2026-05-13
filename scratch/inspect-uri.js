const uri = process.env.MONGODB_URI;
if (uri) {
  const match = uri.match(/:\/\/[^:]+:([^@]+)@/);
  if (match) {
    const password = match[1];
    console.log('Password length:', password.length);
    console.log('First 2 chars:', password.substring(0, 2));
    console.log('Last 2 chars:', password.substring(password.length - 2));
    console.log('Contains $: ', password.includes('$'));
  } else {
    console.log('Could not parse password from URI');
  }
} else {
  console.log('MONGODB_URI is not set');
}
