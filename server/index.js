import express from 'express'
import cors from 'cors'
import Database from 'better-sqlite3'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs'

const here = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.resolve(here, '../data')
fs.mkdirSync(dataDir, { recursive: true })
const db = new Database(path.join(dataDir, 'portfolio.db'))
db.pragma('journal_mode = WAL')
db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    year TEXT NOT NULL,
    image TEXT NOT NULL,
    description TEXT NOT NULL,
    featured INTEGER NOT NULL DEFAULT 0,
    live_url TEXT
  );
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`)

const projectColumns = new Set(db.pragma('table_info(projects)').map((column) => column.name))
if (!projectColumns.has('live_url')) db.exec('ALTER TABLE projects ADD COLUMN live_url TEXT')

const count = db.prepare('SELECT COUNT(*) AS total FROM projects').get().total
if (count === 0) {
  const insert = db.prepare('INSERT INTO projects (title, category, year, image, description, featured, live_url) VALUES (?, ?, ?, ?, ?, ?, ?)')
  const seed = db.transaction((projects) => projects.forEach((project) => insert.run(...project)))
  seed([
    ['Online Shop Platform', 'E-Commerce Website', '2025', 'https://azadehahmadi080.github.io/azadehportfolio/onlineshop.png', 'An online store with product listings, a shopping cart, and secure checkout.', 1, 'https://onlinestore-pi-puce.vercel.app/'],
    ["Foodie’s Restaurant", 'Restaurant Website', '2025', 'https://azadehahmadi080.github.io/azadehportfolio/foodwebsite.png', 'A restaurant site featuring menus, chef specials, reservations, and a food gallery.', 1, 'https://azadehahmadi080.github.io/foodwebsit/'],
    ['Todo Task Manager', 'Productivity App', '2025', 'https://azadehahmadi080.github.io/azadehportfolio/todotask.png', 'A simple task manager for organizing daily activities and boosting productivity.', 1, 'https://azadehahmadi080.github.io/todoapp/'],
    ['Recipe Finder App', 'Recipe Finder App', '2025', 'https://azadehahmadi080.github.io/azadehportfolio/recepifinder.png', 'Browse, share, and discover recipes through a modern, user-friendly interface.', 1, 'https://azadehahmadi080.github.io/recepifinder/'],
    ['GitHub User Finder', 'GitHub Tool', '2025', 'https://azadehahmadi080.github.io/azadehportfolio/githubuserfinder.png', 'Search GitHub users and explore their profiles, repositories, and activity in a clean dashboard.', 1, null],
    ['QuiezApp', 'Quiz App', '2025', 'https://azadehahmadi080.github.io/azadehportfolio/quiezapp.png', 'An interactive quiz with multiple question types and instant feedback.', 1, 'https://azadehahmadi080.github.io/Quiezapp/'],
  ])
}

db.prepare('UPDATE projects SET live_url = ? WHERE title = ? AND live_url IS NULL')
  .run('https://azadehahmadi080.github.io/githubfinder/', 'GitHub User Finder')

const app = express()
app.use(cors())
app.use(express.json({ limit: '20kb' }))

app.get('/api/projects', (_req, res) => {
  res.json(db.prepare('SELECT * FROM projects ORDER BY featured DESC, year DESC, id ASC').all())
})

app.post('/api/messages', (req, res) => {
  const { name, email, message } = req.body ?? {}
  if (![name, email, message].every((value) => typeof value === 'string' && value.trim())) {
    return res.status(400).json({ error: 'Please complete all fields.' })
  }
  if (name.length > 120 || email.length > 254 || message.length > 5000 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Please check your details and try again.' })
  }
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return res.status(503).json({ error: 'Email delivery is not configured yet.' })

  const safeName = name.trim()
  const safeEmail = email.trim()
  const safeMessage = message.trim()
  const subjectName = safeName.replace(/[\r\n]+/g, ' ')

  fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.MAIL_FROM || 'Portfolio Contact <onboarding@resend.dev>',
      to: ['azadehahmadi080@gmail.com'],
      reply_to: safeEmail,
      subject: `Portfolio contact from ${subjectName}`,
      text: `Name: ${safeName}\nEmail: ${safeEmail}\n\n${safeMessage}`,
    }),
  }).then(async (emailResponse) => {
    if (!emailResponse.ok) {
      const providerError = await emailResponse.text()
      console.error('Email delivery failed:', providerError)
      return res.status(502).json({ error: 'Email could not be delivered. Please try again later.' })
    }

    const result = db.prepare('INSERT INTO messages (name, email, message) VALUES (?, ?, ?)').run(safeName, safeEmail, safeMessage)
    res.status(201).json({ ok: true, id: result.lastInsertRowid })
  }).catch((error) => {
    console.error('Email service request failed:', error)
    if (!res.headersSent) res.status(502).json({ error: 'Email service is unavailable. Please try again later.' })
  })
})

const distDir = path.resolve(here, '../dist')
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir))
  app.get('*', (_req, res) => res.sendFile(path.join(distDir, 'index.html')))
}

const port = Number(process.env.PORT || 3001)
app.listen(port, () => console.log(`Portfolio API listening on http://localhost:${port}`))
