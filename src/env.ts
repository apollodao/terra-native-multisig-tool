import path from 'path';
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

type Environment = { [key in typeof envKeys[number]]: string };
const envKeys = ['KEY_NAME'] as const;

function hasAllEnv(env: Environment) {
  return envKeys.every((key) => env[key] !== '');
}

const env = envKeys.reduce(
  (env, key) => ((env[key] = process.env[key] || ''), env),
  <Environment>{}
);

if (!hasAllEnv(env)) {
  console.log('Environment variables not found!');
  console.log('Process env: ', process.env);
  process.exit(1);
}

export default env;
