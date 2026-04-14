const readline = require('readline');
const bcrypt = require('bcryptjs');
const db = require('./db');

function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(question, (ans) => { rl.close(); resolve(ans); }));
}

async function main() {
  try {
    const args = process.argv.slice(2);
    let username = args[0];
    let password = args[1];

    if (!username) {
      username = (await ask('Username: ')).trim();
    }
    if (!password) {
      password = (await ask('Password: ')).trim();
    }

    if (!username || !password) {
      console.error('username and password are required');
      process.exit(1);
    }

    const hash = bcrypt.hashSync(password, 10);
    try {
      const res = await db.run('INSERT INTO users (username, password_hash) VALUES (?, ?)', [username, hash]);
      console.log('User created with id', res.id);
      process.exit(0);
    } catch (e) {
      if (e && e.message && e.message.includes('UNIQUE')) {
        console.error('Username already exists');
        process.exit(2);
      }
      console.error('Failed to create user', e);
      process.exit(3);
    }
  } catch (e) {
    console.error(e);
    process.exit(4);
  }
}

main();
