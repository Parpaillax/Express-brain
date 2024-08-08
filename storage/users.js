import {v4 as uuid} from 'uuid';

const users = [
  {
    uuid: uuid(),
    email: 'admin@express-brains.local',
    password:
      '$argon2id$v=19$m=65536,t=3,p=4$QrMXiyCxsLjv700OAZzDkQ$abhVv5mq+rZ4gS9koYTSS7MXdWWOBU+eAJY/oZ56wsw',
    role: 'admin',
  },
  {
    uuid: uuid(),
    email: 'user@express-brains.local',
    password:
      '$argon2id$v=19$m=65536,t=3,p=4$jzQB9YoLnTyZpL66ZxWcYA$KaL4B8QM0Ni87d8bhK1bRM8O1lwU1f9H/SPSX9S4rlQ',
    role: 'user',
  },
]

export function addUser(email, password) {
  users.push({ uuid: uuid(), email: email, password: password, role: 'user' })
}

export function findByEmail(email) {
  return users.find((user) => user.email === email)
}

export function findAll() {
  return users
}
