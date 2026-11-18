// Seed data. Due dates are relative to the first launch so the overdue
// highlighting and "due soon" hints always have something to show.
const DAY = 24 * 60 * 60 * 1000

const toLocalInput = (ms) => {
  const d = new Date(ms)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:00`
}

export function buildSeed(now = Date.now()) {
  const users = [
    { id: 'a1', name: 'Prof. Meera Nair', role: 'admin', email: 'meera.nair@college.edu' },
    { id: 'a2', name: 'Prof. Arjun Menon', role: 'admin', email: 'arjun.menon@college.edu' },
    { id: 's1', name: 'Anjali Das', role: 'student', email: 'anjali.das@college.edu' },
    { id: 's2', name: 'Rohit Varma', role: 'student', email: 'rohit.varma@college.edu' },
    { id: 's3', name: 'Fathima Noor', role: 'student', email: 'fathima.noor@college.edu' },
    { id: 's4', name: 'Kiran Pillai', role: 'student', email: 'kiran.pillai@college.edu' },
    { id: 's5', name: 'Sneha Joseph', role: 'student', email: 'sneha.joseph@college.edu' },
  ]

  const assignments = [
    {
      id: 'as1', createdBy: 'a1', assignTo: 'all',
      title: 'Data Structures: Linked List Report',
      description: 'Implement singly and doubly linked lists and write a two-page report comparing insertion and deletion costs.',
      dueDate: toLocalInput(now - 2 * DAY),
      driveLink: 'https://drive.google.com/drive/folders/linked-list-report',
    },
    {
      id: 'as2', createdBy: 'a1', assignTo: 'all',
      title: 'Operating Systems: Scheduling Simulation',
      description: 'Simulate FCFS, SJF and Round Robin scheduling for the provided process set and report average waiting times.',
      dueDate: toLocalInput(now + 2 * DAY),
      driveLink: 'https://drive.google.com/drive/folders/os-scheduling',
    },
    {
      id: 'as3', createdBy: 'a1', assignTo: ['s1', 's2', 's3'],
      title: 'Algorithms: Dynamic Programming Problem Set',
      description: 'Solve problems 1 to 6 from the set. Show the recurrence and complexity for each solution.',
      dueDate: toLocalInput(now + 6 * DAY),
      driveLink: 'https://drive.google.com/drive/folders/dp-problem-set',
    },
    {
      id: 'as4', createdBy: 'a2', assignTo: 'all',
      title: 'Databases: ER Diagram for a Library',
      description: 'Design an ER diagram for a college library system and convert it into relational tables up to 3NF.',
      dueDate: toLocalInput(now + 1 * DAY),
      driveLink: 'https://drive.google.com/drive/folders/library-er',
    },
    {
      id: 'as5', createdBy: 'a2', assignTo: ['s2', 's4', 's5'],
      title: 'Networks: Wireshark Packet Analysis',
      description: 'Capture a short HTTP session and annotate the TCP handshake, request and response headers.',
      dueDate: toLocalInput(now - 1 * DAY),
      driveLink: 'https://drive.google.com/drive/folders/wireshark-analysis',
    },
    {
      id: 'as6', createdBy: 'a2', assignTo: 'all',
      title: 'Web Technologies: Portfolio Page',
      description: 'Build a responsive one-page portfolio using semantic HTML and CSS. Host it and share the link in the PDF.',
      dueDate: toLocalInput(now + 9 * DAY),
      driveLink: 'https://drive.google.com/drive/folders/portfolio-page',
    },
  ]

  const at = (days) => new Date(now + days * DAY).toISOString()
  const submissions = {
    as1: { s1: at(-3), s2: at(-2.5), s4: at(-2.2) },
    as2: { s1: at(-0.5) },
    as3: { s2: at(-1) },
    as4: { s1: at(-0.2), s3: at(-0.4), s5: at(-0.3) },
    as5: { s2: at(-1.5), s4: at(-1.2) },
    as6: {},
  }

  return { users, assignments, submissions }
}
