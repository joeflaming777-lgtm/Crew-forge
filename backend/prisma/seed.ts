import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting HackMate database seeding...');

  // Clear existing data in reverse order of foreign keys
  await prisma.quizAnswer.deleteMany({});
  await prisma.quizAttempt.deleteMany({});
  await prisma.questionOption.deleteMany({});
  await prisma.question.deleteMany({});
  await prisma.invitation.deleteMany({});
  await prisma.teamMember.deleteMany({});
  await prisma.teamRequirement.deleteMany({});
  await prisma.team.deleteMany({});
  await prisma.hackathon.deleteMany({});
  await prisma.candidateSkill.deleteMany({});
  await prisma.candidateRole.deleteMany({});
  await prisma.gitHubAnalysis.deleteMany({});
  await prisma.candidateProfile.deleteMany({});
  await prisma.leaderProfile.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.skill.deleteMany({});
  await prisma.role.deleteMany({});
  await prisma.scoringConfiguration.deleteMany({});

  console.log('🧹 Cleaned existing tables.');

  // 1. Scoring Configuration
  await prisma.scoringConfiguration.create({
    data: {
      id: 'default',
      quizWeight: 0.50,
      githubWeight: 0.25,
      skillMatchWeight: 0.15,
      experienceWeight: 0.10,
    },
  });

  // 2. Roles
  const rolesData = [
    { name: 'AI/ML Developer', category: 'AI & Data', description: 'Builds machine learning models, neural networks, and AI pipelines.' },
    { name: 'Frontend Developer', category: 'Engineering', description: 'Creates modern, responsive, and animated user interfaces.' },
    { name: 'Backend Developer', category: 'Engineering', description: 'Architects robust server APIs, microservices, and databases.' },
    { name: 'Full Stack Developer', category: 'Engineering', description: 'End-to-end web application development across frontend and backend.' },
    { name: 'UI/UX Designer', category: 'Design', description: 'Designs wireframes, design systems, and delightful user journeys.' },
    { name: 'Data Scientist', category: 'AI & Data', description: 'Analyzes large datasets, feature engineering, and predictive modeling.' },
    { name: 'Data Analyst', category: 'AI & Data', description: 'Builds business dashboards, SQL analytics, and data visualization.' },
    { name: 'IoT Developer', category: 'Hardware & IoT', description: 'Integrates sensors, microcontrollers, and edge computing.' },
    { name: 'Cybersecurity', category: 'Security', description: 'Secures networks, audits code vulnerabilities, and cryptographic protocols.' },
    { name: 'Cloud Engineer', category: 'DevOps & Cloud', description: 'Deploys scalable infrastructure on AWS/GCP and manages containers.' },
    { name: 'Hardware Engineer', category: 'Hardware & IoT', description: 'Circuits, PCB design, and embedded systems.' },
    { name: 'Researcher', category: 'Research', description: 'Literature review, novel algorithm development, and academic papers.' },
  ];

  const roleMap = new Map<string, any>();
  for (const r of rolesData) {
    const created = await prisma.role.create({ data: r });
    roleMap.set(r.name, created);
  }

  // 3. Skills
  const skillsData = [
    // Programming
    { name: 'Python', category: 'Programming' },
    { name: 'JavaScript', category: 'Programming' },
    { name: 'TypeScript', category: 'Programming' },
    { name: 'Java', category: 'Programming' },
    { name: 'C++', category: 'Programming' },
    { name: 'C', category: 'Programming' },
    // Web Development
    { name: 'React', category: 'Web Development' },
    { name: 'Node.js', category: 'Web Development' },
    { name: 'Express', category: 'Web Development' },
    { name: 'Next.js', category: 'Web Development' },
    { name: 'HTML', category: 'Web Development' },
    { name: 'CSS', category: 'Web Development' },
    { name: 'Django', category: 'Web Development' },
    { name: 'Flask', category: 'Web Development' },
    // AI / ML
    { name: 'Machine Learning', category: 'AI / ML' },
    { name: 'Deep Learning', category: 'AI / ML' },
    { name: 'NLP', category: 'AI / ML' },
    { name: 'Computer Vision', category: 'AI / ML' },
    { name: 'TensorFlow', category: 'AI / ML' },
    { name: 'PyTorch', category: 'AI / ML' },
    { name: 'Generative AI', category: 'AI / ML' },
    // Data
    { name: 'Data Science', category: 'Data' },
    { name: 'Data Analytics', category: 'Data' },
    { name: 'SQL', category: 'Data' },
    { name: 'Statistics', category: 'Data' },
    // Other
    { name: 'UI/UX', category: 'Other' },
    { name: 'Cloud', category: 'Other' },
    { name: 'AWS', category: 'Other' },
    { name: 'Docker', category: 'Other' },
    { name: 'Cybersecurity', category: 'Other' },
    { name: 'IoT', category: 'Other' },
    { name: 'Blockchain', category: 'Other' },
    { name: 'Hardware', category: 'Other' },
  ];

  const skillMap = new Map<string, any>();
  for (const s of skillsData) {
    const created = await prisma.skill.create({ data: s });
    skillMap.set(s.name, created);
  }

  // 4. Hackathons
  const hackathonsData = [
    {
      name: 'Smart India Hackathon (SIH 2026)',
      slug: 'sih-2026',
      description: 'The premier nationwide digital innovation initiative inviting students to solve pressing real-world challenges for ministries and industries.',
      organizer: 'Ministry of Education & AICTE',
      registrationDeadline: new Date('2026-11-15T23:59:59Z'),
      minTeamSize: 6,
      maxTeamSize: 6,
      bannerUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
      rules: 'Mandatory 6 members per team. At least 1 female team member encouraged. Hardware and Software tracks available.',
      problemStatements: JSON.stringify([
        { id: 'SIH-01', title: 'AI-Powered Crop Disease Diagnostic via Drone Imagery', category: 'Agriculture & Rural Tech' },
        { id: 'SIH-02', title: 'Intelligent Real-Time Traffic Congestion Prediction & Routing', category: 'Smart Transportation' },
        { id: 'SIH-03', title: 'Automated Medical Triaging & Electronic Health Record Exchange', category: 'Healthcare' },
        { id: 'SIH-04', title: 'Blockchain-Based Secure Digital Credential Verification', category: 'Cybersecurity' },
      ]),
    },
    {
      name: 'HackX India 2026',
      slug: 'hackx-2026',
      description: 'A 36-hour non-stop student hackathon focusing on Web3, Decentralized AI, and Next-Gen Fintech products.',
      organizer: 'National Student Developer League',
      registrationDeadline: new Date('2026-12-01T23:59:59Z'),
      minTeamSize: 3,
      maxTeamSize: 4,
      bannerUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
      rules: 'Teams must build a fully functional product prototype within 36 hours. Open API integrations permitted.',
      problemStatements: JSON.stringify([
        { id: 'HX-01', title: 'Decentralized Micro-Credit Scoring for College Students', category: 'FinTech' },
        { id: 'HX-02', title: 'Collaborative Real-Time Code Review Canvas', category: 'DevTools' },
      ]),
    },
    {
      name: 'AI Genesis Hackathon',
      slug: 'ai-genesis-2026',
      description: 'Build autonomous multi-agent systems, multimodal assistants, and cutting-edge GenAI applications.',
      organizer: 'Open Frontier AI Labs',
      registrationDeadline: new Date('2026-10-30T23:59:59Z'),
      minTeamSize: 2,
      maxTeamSize: 5,
      bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      rules: 'Submissions must include LLM/Agentic architecture, evaluation benchmarks, and live working demo.',
      problemStatements: JSON.stringify([
        { id: 'AG-01', title: 'Autonomous Multi-Agent Collaborative Research Synthesizer', category: 'Autonomous Agents' },
        { id: 'AG-02', title: 'Voice-First Accessibility Assistant for Visual Impairments', category: 'Multimodal AI' },
      ]),
    },
  ];

  const sihHackathon = await prisma.hackathon.create({ data: hackathonsData[0] });
  const hackxHackathon = await prisma.hackathon.create({ data: hackathonsData[1] });
  const aiGenesisHackathon = await prisma.hackathon.create({ data: hackathonsData[2] });

  // 5. Quiz Questions Bank (40 high-quality questions across roles/skills)
  const questionsData = [
    // Python & AI/ML
    {
      text: 'Which function in Python is used to compute the gradient in PyTorch automatically?',
      explanation: 'In PyTorch, calling .backward() on a scalar tensor computes the derivative of the tensor w.r.t. graph leaves using automatic differentiation.',
      difficulty: 'EASY',
      topic: 'PyTorch Autograd',
      skillName: 'PyTorch',
      roleName: 'AI/ML Developer',
      options: [
        { text: 'tensor.backward()', isCorrect: true },
        { text: 'tensor.compute_grad()', isCorrect: false },
        { text: 'torch.autograd.step()', isCorrect: false },
        { text: 'tensor.derive()', isCorrect: false },
      ],
    },
    {
      text: 'In Machine Learning, what is the primary purpose of Dropout during neural network training?',
      explanation: 'Dropout randomly deactivates neurons during forward passes with a probability p, preventing co-adaptation and combating overfitting.',
      difficulty: 'EASY',
      topic: 'Regularization',
      skillName: 'Machine Learning',
      roleName: 'AI/ML Developer',
      options: [
        { text: 'To prevent overfitting by regularizing the network', isCorrect: true },
        { text: 'To speed up backpropagation convergence', isCorrect: false },
        { text: 'To normalize inputs between layers', isCorrect: false },
        { text: 'To handle vanishing gradients in deep networks', isCorrect: false },
      ],
    },
    {
      text: 'What is the attention mechanism formula in the original Transformer paper ("Attention Is All You Need")?',
      explanation: 'Attention(Q, K, V) = softmax(Q * K^T / sqrt(d_k)) * V.',
      difficulty: 'MEDIUM',
      topic: 'Transformer Architecture',
      skillName: 'Deep Learning',
      roleName: 'AI/ML Developer',
      options: [
        { text: 'softmax(Q * K^T / sqrt(d_k)) * V', isCorrect: true },
        { text: 'sigmoid(Q * K) * V', isCorrect: false },
        { text: 'tanh(Q * V^T) * K', isCorrect: false },
        { text: 'softmax(Q * V / d_k) * K', isCorrect: false },
      ],
    },
    {
      text: 'In Natural Language Processing, which technique tokenizes text into subword units based on frequency merges?',
      explanation: 'Byte Pair Encoding (BPE) merges the most frequent pairs of bytes/characters iteratively to build subword vocabularies used in modern LLMs.',
      difficulty: 'MEDIUM',
      topic: 'Tokenization',
      skillName: 'NLP',
      roleName: 'AI/ML Developer',
      options: [
        { text: 'Byte Pair Encoding (BPE)', isCorrect: true },
        { text: 'One-Hot Vectorization', isCorrect: false },
        { text: 'Stemming and Lemmatization', isCorrect: false },
        { text: 'TF-IDF Frequency Cutoff', isCorrect: false },
      ],
    },
    {
      text: 'When training a CNN, why are 1x1 convolutions (pointwise convolutions) used in architectures like ResNet or Inception?',
      explanation: '1x1 convolutions are primarily used to reduce or increase dimensionality (channel depth) across feature maps while introducing non-linearity efficiently.',
      difficulty: 'HARD',
      topic: 'Convolutional Networks',
      skillName: 'Computer Vision',
      roleName: 'AI/ML Developer',
      options: [
        { text: 'To reduce or alter channel dimensionality without affecting spatial dimensions', isCorrect: true },
        { text: 'To expand the receptive field of spatial pixels', isCorrect: false },
        { text: 'To eliminate the need for activation functions', isCorrect: false },
        { text: 'To replace spatial pooling entirely', isCorrect: false },
      ],
    },
    {
      text: 'What problem does LoRA (Low-Rank Adaptation) address in Fine-Tuning Large Language Models?',
      explanation: 'LoRA freezes the pre-trained model weights and injects trainable rank decomposition matrices, reducing trainable parameters by 10,000x and GPU memory usage.',
      difficulty: 'HARD',
      topic: 'GenAI & Parameter-Efficient Fine-Tuning',
      skillName: 'Generative AI',
      roleName: 'AI/ML Developer',
      options: [
        { text: 'Drastically reduces memory & trainable parameters by decomposing weight update matrices into low-rank factors', isCorrect: true },
        { text: 'Eliminates hallucination in generative responses', isCorrect: false },
        { text: 'Translates prompt tokens into binary representations', isCorrect: false },
        { text: 'Enables zero-shot learning without token embeddings', isCorrect: false },
      ],
    },
    // React & Frontend Developer
    {
      text: 'In React, which hook is used to run side-effects such as data fetching or subscriptions after rendering?',
      explanation: 'useEffect lets you synchronize a component with external systems such as network requests, DOM manipulation, or timers.',
      difficulty: 'EASY',
      topic: 'React Hooks',
      skillName: 'React',
      roleName: 'Frontend Developer',
      options: [
        { text: 'useEffect', isCorrect: true },
        { text: 'useState', isCorrect: false },
        { text: 'useMemo', isCorrect: false },
        { text: 'useContext', isCorrect: false },
      ],
    },
    {
      text: 'What is the main benefit of useMemo in React?',
      explanation: 'useMemo caches the result of a expensive calculation between re-renders until one of its dependencies changes.',
      difficulty: 'EASY',
      topic: 'React Performance',
      skillName: 'React',
      roleName: 'Frontend Developer',
      options: [
        { text: 'Memoizes expensive computed calculations to avoid re-executing on every render', isCorrect: true },
        { text: 'Persists component state across browser page refreshes', isCorrect: false },
        { text: 'Automatically binds event handlers to parent DOM elements', isCorrect: false },
        { text: 'Prevents CSS styles from leaking out of the component', isCorrect: false },
      ],
    },
    {
      text: 'In JavaScript / TypeScript, what is the output of `typeof null`?',
      explanation: 'In JavaScript, typeof null returns "object", which is a historical legacy quirk from the original JS implementation.',
      difficulty: 'MEDIUM',
      topic: 'JavaScript Types',
      skillName: 'JavaScript',
      roleName: 'Frontend Developer',
      options: [
        { text: '"object"', isCorrect: true },
        { text: '"null"', isCorrect: false },
        { text: '"undefined"', isCorrect: false },
        { text: '"boolean"', isCorrect: false },
      ],
    },
    {
      text: 'How does the React Virtual DOM optimize UI updates?',
      explanation: 'React compares the new Virtual DOM tree with the previous one (reconciliation / diffing) and applies only the minimal required batch of changes to the real DOM.',
      difficulty: 'MEDIUM',
      topic: 'Reconciliation',
      skillName: 'React',
      roleName: 'Frontend Developer',
      options: [
        { text: 'By computing diffs between trees and applying minimal batch mutations to the real browser DOM', isCorrect: true },
        { text: 'By running JavaScript code inside a WebAssembly background worker', isCorrect: false },
        { text: 'By directly rewriting the GPU render buffer', isCorrect: false },
        { text: 'By avoiding browser redraw events completely', isCorrect: false },
      ],
    },
    {
      text: 'What causes hydration mismatch errors in SSR frameworks like Next.js?',
      explanation: 'Hydration errors occur when the HTML rendered on the server differs from the initial Virtual DOM generated during client-side hydration (e.g. using window or Date.now() directly).',
      difficulty: 'HARD',
      topic: 'SSR & Hydration',
      skillName: 'Next.js',
      roleName: 'Frontend Developer',
      options: [
        { text: 'Differences between server-rendered HTML and client initial render tree', isCorrect: true },
        { text: 'Network latency during CSS file downloads', isCorrect: false },
        { text: 'Missing TypeScript interfaces in compiled bundles', isCorrect: false },
        { text: 'Using SVG elements without explicit viewBox attributes', isCorrect: false },
      ],
    },
    // Backend & Systems
    {
      text: 'Which HTTP status code signifies that a resource was successfully created on the server?',
      explanation: '201 Created indicates that the request has been fulfilled and has resulted in one or more new resources being created.',
      difficulty: 'EASY',
      topic: 'REST API Standards',
      skillName: 'Express',
      roleName: 'Backend Developer',
      options: [
        { text: '201 Created', isCorrect: true },
        { text: '200 OK', isCorrect: false },
        { text: '204 No Content', isCorrect: false },
        { text: '202 Accepted', isCorrect: false },
      ],
    },
    {
      text: 'In Node.js, what is the role of the Event Loop?',
      explanation: 'The event loop allows Node.js to perform non-blocking I/O operations despite JavaScript being single-threaded, by offloading operations to the system kernel when possible.',
      difficulty: 'MEDIUM',
      topic: 'Node.js Architecture',
      skillName: 'Node.js',
      roleName: 'Backend Developer',
      options: [
        { text: 'Handles asynchronous callbacks, timers, and non-blocking I/O operations', isCorrect: true },
        { text: 'Compiles JavaScript directly into bytecode for multi-core CPUs', isCorrect: false },
        { text: 'Manages database connection pooling in background threads', isCorrect: false },
        { text: 'Encrypts JWT authentication headers automatically', isCorrect: false },
      ],
    },
    {
      text: 'What is the ACID property "Isolation" in relational database transactions?',
      explanation: 'Isolation ensures that concurrent transactions execute without interfering with one another, preventing dirty reads or phantom writes.',
      difficulty: 'MEDIUM',
      topic: 'Database Transactions',
      skillName: 'SQL',
      roleName: 'Backend Developer',
      options: [
        { text: 'Concurrent execution of transactions leaves the database in the same state as if executed sequentially', isCorrect: true },
        { text: 'All operations in a transaction succeed or all roll back', isCorrect: false },
        { text: 'Data remains persisted on disk even after unexpected crashes', isCorrect: false },
        { text: 'All table constraints and foreign keys remain valid', isCorrect: false },
      ],
    },
    {
      text: 'In distributed systems, what does the CAP theorem state?',
      explanation: 'A distributed data store can simultaneously provide at most two out of three guarantees: Consistency, Availability, and Partition Tolerance.',
      difficulty: 'HARD',
      topic: 'Distributed Systems',
      skillName: 'Cloud',
      roleName: 'Backend Developer',
      options: [
        { text: 'You can only choose at most two out of Consistency, Availability, and Partition Tolerance', isCorrect: true },
        { text: 'CPU, Architecture, and Performance must scale proportionately', isCorrect: false },
        { text: 'Caching, Authorization, and Persistence require separate servers', isCorrect: false },
        { text: 'Containers must be orchestratable, scalable, and port-mapped', isCorrect: false },
      ],
    },
    // UI/UX & Design
    {
      text: 'What is the primary objective of a "Design System" in product engineering?',
      explanation: 'A design system provides reusable UI components, tokens (colors, typography, spacing), and guidelines to ensure visual consistency and high developer velocity.',
      difficulty: 'EASY',
      topic: 'Design Systems',
      skillName: 'UI/UX',
      roleName: 'UI/UX Designer',
      options: [
        { text: 'To establish reusable UI components and tokens for consistency and team alignment', isCorrect: true },
        { text: 'To compress PNG images into WebP formats automatically', isCorrect: false },
        { text: 'To replace CSS stylesheets with server-side templates', isCorrect: false },
        { text: 'To measure browser FPS during page scroll', isCorrect: false },
      ],
    },
    {
      text: 'What does the WCAG AA contrast ratio requirement for normal body text mandate?',
      explanation: 'WCAG 2.1 Level AA requires a contrast ratio of at least 4.5:1 for normal body text against its background.',
      difficulty: 'MEDIUM',
      topic: 'Accessibility (A11y)',
      skillName: 'UI/UX',
      roleName: 'UI/UX Designer',
      options: [
        { text: 'At least 4.5:1 contrast ratio', isCorrect: true },
        { text: 'At least 3:1 contrast ratio', isCorrect: false },
        { text: 'At least 7:1 contrast ratio', isCorrect: false },
        { text: 'At least 2.5:1 contrast ratio', isCorrect: false },
      ],
    },
    // IoT & Hardware
    {
      text: 'Which lightweight messaging protocol is most commonly used for low-bandwidth IoT telemetry communication?',
      explanation: 'MQTT (Message Queuing Telemetry Transport) is an extremely lightweight publish/subscribe messaging protocol tailored for resource-constrained IoT devices.',
      difficulty: 'EASY',
      topic: 'IoT Protocols',
      skillName: 'IoT',
      roleName: 'IoT Developer',
      options: [
        { text: 'MQTT', isCorrect: true },
        { text: 'SOAP', isCorrect: false },
        { text: 'GraphQL', isCorrect: false },
        { text: 'FTP', isCorrect: false },
      ],
    },
    {
      text: 'In embedded systems, what is the purpose of an I2C bus pull-up resistor?',
      explanation: 'I2C uses open-drain/open-collector lines (SDA and SCL); pull-up resistors are required to restore high logic levels when devices release the lines.',
      difficulty: 'MEDIUM',
      topic: 'Embedded Communication',
      skillName: 'Hardware',
      roleName: 'Hardware Engineer',
      options: [
        { text: 'Pulls open-drain SDA and SCL lines high when not actively driven low by devices', isCorrect: true },
        { text: 'Protects the microcontroller from reverse polarity on VCC', isCorrect: false },
        { text: 'Filters out high-frequency analog noise from sensor pins', isCorrect: false },
        { text: 'Stores backup charge during brownout voltage drops', isCorrect: false },
      ],
    },
    // General Programming & Data
    {
      text: 'What is the time complexity of searching an element in a balanced Binary Search Tree (AVL / Red-Black Tree)?',
      explanation: 'Searching in a balanced BST splits the search space in half at each level, yielding O(log N) worst-case time complexity.',
      difficulty: 'EASY',
      topic: 'Data Structures & Algorithms',
      skillName: 'Python',
      roleName: 'Full Stack Developer',
      options: [
        { text: 'O(log N)', isCorrect: true },
        { text: 'O(N)', isCorrect: false },
        { text: 'O(1)', isCorrect: false },
        { text: 'O(N log N)', isCorrect: false },
      ],
    },
  ];

  for (const q of questionsData) {
    const skill = skillMap.get(q.skillName);
    const role = roleMap.get(q.roleName);

    await prisma.question.create({
      data: {
        text: q.text,
        explanation: q.explanation,
        difficulty: q.difficulty,
        topic: q.topic,
        skillId: skill ? skill.id : null,
        roleId: role ? role.id : null,
        options: {
          create: q.options,
        },
      },
    });
  }

  console.log(`✅ Seeded ${questionsData.length} technical assessment questions.`);

  // 6. Admin User
  const defaultPasswordHash = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
    data: {
      email: 'admin@hackmate.dev',
      passwordHash: defaultPasswordHash,
      role: 'admin',
    },
  });

  // 7. Team Leaders (5 Leaders)
  const leaderHash = await bcrypt.hash('leader123', 10);

  const leadersData = [
    {
      email: 'leader@hackmate.dev',
      fullName: 'Aarav Sharma',
      college: 'IIT Bombay',
      department: 'Computer Science and Engineering',
      year: 3,
      bio: 'Full Stack & AI enthusiast. Led 2 winning teams in Smart India Hackathon. Building high-impact tech solutions.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      teamName: 'NeuralNomads',
      teamDesc: 'Building an autonomous multi-modal drone AI system for real-time agricultural crop disease diagnosis.',
      hackathonId: sihHackathon.id,
      maxTeamSize: 6,
      minScore: 75,
      preferredDept: 'Computer Science and Engineering',
      requirements: [
        { roleName: 'AI/ML Developer', skillNames: ['Python', 'PyTorch', 'Computer Vision'], needed: 1 },
        { roleName: 'Frontend Developer', skillNames: ['React', 'JavaScript', 'Tailwind CSS'], needed: 1 },
        { roleName: 'Backend Developer', skillNames: ['Node.js', 'Express', 'SQL'], needed: 1 },
        { roleName: 'UI/UX Designer', skillNames: ['UI/UX'], needed: 1 },
        { roleName: 'IoT Developer', skillNames: ['IoT', 'Hardware'], needed: 1 },
      ],
    },
    {
      email: 'priya.leader@hackmate.dev',
      fullName: 'Priya Patel',
      college: 'BITS Pilani',
      department: 'Electronics & Communication',
      year: 4,
      bio: 'Hardware-software co-design lead. Passionate about edge AI, microcontrollers, and low-latency robotics.',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
      teamName: 'ByteBrigade',
      teamDesc: 'Developing an intelligent real-time traffic signal optimization network using decentralized edge vision.',
      hackathonId: sihHackathon.id,
      maxTeamSize: 6,
      minScore: 78,
      preferredDept: 'Electronics & Communication',
      requirements: [
        { roleName: 'IoT Developer', skillNames: ['IoT', 'C++', 'Hardware'], needed: 1 },
        { roleName: 'AI/ML Developer', skillNames: ['Python', 'Deep Learning', 'Computer Vision'], needed: 1 },
        { roleName: 'Backend Developer', skillNames: ['Python', 'Django', 'SQL'], needed: 1 },
        { roleName: 'Frontend Developer', skillNames: ['React', 'HTML', 'CSS'], needed: 1 },
      ],
    },
    {
      email: 'rohan.leader@hackmate.dev',
      fullName: 'Rohan Deshmukh',
      college: 'NIT Trichy',
      department: 'Information Technology',
      year: 3,
      bio: 'Cloud architect and backend developer. Passionate about distributed microservices and Web3 applications.',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      teamName: 'CodeCrafters',
      teamDesc: 'Building a decentralized micro-credit verification platform with verifiable zero-knowledge proofs.',
      hackathonId: hackxHackathon.id,
      maxTeamSize: 4,
      minScore: 80,
      preferredDept: 'Information Technology',
      requirements: [
        { roleName: 'Full Stack Developer', skillNames: ['React', 'Node.js', 'TypeScript'], needed: 1 },
        { roleName: 'Cybersecurity', skillNames: ['Cybersecurity', 'Blockchain'], needed: 1 },
        { roleName: 'UI/UX Designer', skillNames: ['UI/UX'], needed: 1 },
      ],
    },
    {
      email: 'ananya.leader@hackmate.dev',
      fullName: 'Ananya Iyer',
      college: 'VIT Vellore',
      department: 'Computer Science and Engineering',
      year: 3,
      bio: 'Generative AI researcher. Focusing on autonomous LLM agents and multi-agent coordination frameworks.',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      teamName: 'QuantumForge',
      teamDesc: 'Creating an autonomous medical research assistant that reads clinical trials and compiles systematic reviews.',
      hackathonId: aiGenesisHackathon.id,
      maxTeamSize: 5,
      minScore: 82,
      preferredDept: 'Computer Science and Engineering',
      requirements: [
        { roleName: 'AI/ML Developer', skillNames: ['Python', 'NLP', 'Generative AI', 'PyTorch'], needed: 1 },
        { roleName: 'Data Scientist', skillNames: ['Data Science', 'Statistics', 'SQL'], needed: 1 },
        { roleName: 'Frontend Developer', skillNames: ['React', 'TypeScript'], needed: 1 },
      ],
    },
    {
      email: 'vikram.leader@hackmate.dev',
      fullName: 'Vikramaditya Rao',
      college: 'IIIT Hyderabad',
      department: 'Computer Science and Engineering',
      year: 4,
      bio: 'Open source contributor & hackathon veteran. Loves building high-throughput systems and clean architecture.',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      teamName: 'EcoInnovators',
      teamDesc: 'AI-driven energy grid forecasting and predictive maintenance dashboard for solar microgrids.',
      hackathonId: sihHackathon.id,
      maxTeamSize: 6,
      minScore: 72,
      preferredDept: 'Computer Science and Engineering',
      requirements: [
        { roleName: 'Data Analyst', skillNames: ['Data Analytics', 'SQL', 'Python'], needed: 1 },
        { roleName: 'Backend Developer', skillNames: ['Go', 'Node.js', 'Docker'], needed: 1 },
        { roleName: 'UI/UX Designer', skillNames: ['UI/UX'], needed: 1 },
      ],
    },
  ];

  const createdLeaders: any[] = [];
  const createdTeams: any[] = [];

  for (const ld of leadersData) {
    const user = await prisma.user.create({
      data: {
        email: ld.email,
        passwordHash: leaderHash,
        role: 'team_leader',
        leaderProfile: {
          create: {
            fullName: ld.fullName,
            college: ld.college,
            department: ld.department,
            year: ld.year,
            bio: ld.bio,
            avatarUrl: ld.avatarUrl,
          },
        },
      },
      include: { leaderProfile: true },
    });

    createdLeaders.push(user.leaderProfile);

    // Create Team for this leader
    const team = await prisma.team.create({
      data: {
        name: ld.teamName,
        description: ld.teamDesc,
        hackathonId: ld.hackathonId,
        leaderProfileId: user.leaderProfile!.id,
        maxTeamSize: ld.maxTeamSize,
        minCandidateScore: ld.minScore,
        preferredDept: ld.preferredDept,
        status: 'RECRUITING',
        requirements: {
          create: ld.requirements.map((r) => ({
            roleName: r.roleName,
            skillNames: JSON.stringify(r.skillNames),
            neededCount: r.needed,
            isRequired: true,
          })),
        },
      },
    });

    createdTeams.push(team);
  }

  console.log(`✅ Seeded 5 Team Leaders & 5 Hackathon Teams.`);

  // 8. 32 Candidates Data with rich profiles
  const candidateHash = await bcrypt.hash('candidate123', 10);

  const candidateDataset = [
    // 1. Default Demo Candidate
    {
      email: 'candidate@hackmate.dev',
      fullName: 'Arjun Verma',
      college: 'IIT Bombay',
      department: 'Computer Science and Engineering',
      year: 3,
      gender: 'Male',
      bio: 'Full Stack & AI Engineer passionate about scalable architectures and computer vision. Active hackathon hacker.',
      availability: 'Available',
      hackathonsCount: 3,
      githubUser: 'arjun-v-tech',
      roles: ['AI/ML Developer', 'Full Stack Developer'],
      skills: ['Python', 'React', 'PyTorch', 'Node.js', 'Machine Learning', 'SQL'],
      quizScore: 90,
      githubScore: 88,
      publicRepos: 18,
      stars: 42,
    },
    // 2. Sneha Reddy
    {
      email: 'sneha.reddy@gmail.com',
      fullName: 'Sneha Reddy',
      college: 'IIT Madras',
      department: 'Computer Science and Engineering',
      year: 4,
      gender: 'Female',
      bio: 'Deep learning researcher specializing in Medical Image Segmentation and NLP. Winner of HackDuke 2025.',
      availability: 'Available',
      hackathonsCount: 4,
      githubUser: 'sneha-ai-lab',
      roles: ['AI/ML Developer', 'Data Scientist'],
      skills: ['Python', 'PyTorch', 'TensorFlow', 'Deep Learning', 'Computer Vision', 'NLP'],
      quizScore: 94,
      githubScore: 92,
      publicRepos: 24,
      stars: 76,
    },
    // 3. Rohit Nair
    {
      email: 'rohit.nair@outlook.com',
      fullName: 'Rohit Nair',
      college: 'BITS Pilani',
      department: 'Computer Science and Engineering',
      year: 3,
      gender: 'Male',
      bio: 'Frontend craftsman. Loving CSS micro-interactions, Framer Motion, and Next.js performance optimizations.',
      availability: 'Available',
      hackathonsCount: 2,
      githubUser: 'rohit-ui-dev',
      roles: ['Frontend Developer', 'UI/UX Designer'],
      skills: ['React', 'Next.js', 'JavaScript', 'TypeScript', 'CSS', 'UI/UX', 'HTML'],
      quizScore: 88,
      githubScore: 84,
      publicRepos: 14,
      stars: 29,
    },
    // 4. Kavya Kulkarni
    {
      email: 'kavya.kulkarni@yahoo.com',
      fullName: 'Kavya Kulkarni',
      college: 'NIT Surathkal',
      department: 'Information Technology',
      year: 3,
      gender: 'Female',
      bio: 'Distributed backend systems engineer. Experienced with Go, Docker microservices, and PostgreSQL optimization.',
      availability: 'Available',
      hackathonsCount: 3,
      githubUser: 'kavyadev',
      roles: ['Backend Developer', 'Cloud Engineer'],
      skills: ['Node.js', 'Express', 'SQL', 'Docker', 'AWS', 'Python', 'PostgreSQL'],
      quizScore: 92,
      githubScore: 86,
      publicRepos: 19,
      stars: 38,
    },
    // 5. Aditya Mehta
    {
      email: 'aditya.mehta@gmail.com',
      fullName: 'Aditya Mehta',
      college: 'Delhi Technological University (DTU)',
      department: 'Electronics & Communication',
      year: 4,
      gender: 'Male',
      bio: 'IoT & Embedded firmware engineer. Built automated hydroponics and drone telemetry boards with ESP32 & STM32.',
      availability: 'Available',
      hackathonsCount: 3,
      githubUser: 'aditya-iot',
      roles: ['IoT Developer', 'Hardware Engineer'],
      skills: ['IoT', 'Hardware', 'C++', 'C', 'Python'],
      quizScore: 86,
      githubScore: 82,
      publicRepos: 11,
      stars: 22,
    },
    // 6. Neha Gupta
    {
      email: 'neha.gupta@gmail.com',
      fullName: 'Neha Gupta',
      college: 'NID Ahmedabad / NIFT',
      department: 'Design',
      year: 3,
      gender: 'Female',
      bio: 'Product Designer obsessed with accessibility, dark mode palettes, and frictionless onboarding flows.',
      availability: 'Available',
      hackathonsCount: 2,
      githubUser: 'neha-designs',
      roles: ['UI/UX Designer'],
      skills: ['UI/UX', 'CSS', 'HTML', 'JavaScript'],
      quizScore: 85,
      githubScore: 78,
      publicRepos: 8,
      stars: 18,
    },
    // 7. Siddharth Jain
    {
      email: 'siddharth.jain@gmail.com',
      fullName: 'Siddharth Jain',
      college: 'IIIT Bangalore',
      department: 'Computer Science and Engineering',
      year: 2,
      gender: 'Male',
      bio: 'Competitive programmer and NLP enthusiast. Codeforces Candidate Master. Exploring RAG & Agents.',
      availability: 'Available',
      hackathonsCount: 1,
      githubUser: 'sid-algo',
      roles: ['AI/ML Developer', 'Backend Developer'],
      skills: ['C++', 'Python', 'NLP', 'Generative AI', 'SQL'],
      quizScore: 95,
      githubScore: 80,
      publicRepos: 12,
      stars: 15,
    },
    // 8. Pooja S
    {
      email: 'pooja.s@gmail.com',
      fullName: 'Pooja Sundaram',
      college: 'PSG College of Technology',
      department: 'Artificial Intelligence & Data Science',
      year: 3,
      gender: 'Female',
      bio: 'Data Analyst & ML practitioner. Proficient in tabular modeling, feature stores, and interactive dashboards.',
      availability: 'Available',
      hackathonsCount: 2,
      githubUser: 'pooja-data-science',
      roles: ['Data Scientist', 'Data Analyst'],
      skills: ['Python', 'Data Science', 'Data Analytics', 'SQL', 'Statistics', 'Machine Learning'],
      quizScore: 89,
      githubScore: 83,
      publicRepos: 15,
      stars: 27,
    },
    // 9. Varun Rathi
    {
      email: 'varun.rathi@gmail.com',
      fullName: 'Varun Rathi',
      college: 'IIT Roorkee',
      department: 'Computer Science and Engineering',
      year: 4,
      gender: 'Male',
      bio: 'Full Stack engineer with focus on real-time web sockets, WebRTC, and collaborative editing canvases.',
      availability: 'Available',
      hackathonsCount: 4,
      githubUser: 'varun-fullstack',
      roles: ['Full Stack Developer', 'Frontend Developer'],
      skills: ['React', 'TypeScript', 'Node.js', 'Express', 'HTML', 'CSS', 'Docker'],
      quizScore: 91,
      githubScore: 90,
      publicRepos: 22,
      stars: 54,
    },
    // 10. Tanvi Sen
    {
      email: 'tanvi.sen@gmail.com',
      fullName: 'Tanvi Sen',
      college: 'Jadavpur University',
      department: 'Computer Science and Engineering',
      year: 3,
      gender: 'Female',
      bio: 'Security researcher and backend auditor. Certified Ethical Hacker (CEH) in training. CTF participant.',
      availability: 'Available',
      hackathonsCount: 2,
      githubUser: 'tanvi-sec',
      roles: ['Cybersecurity', 'Backend Developer'],
      skills: ['Cybersecurity', 'Python', 'C', 'C++', 'Node.js', 'SQL'],
      quizScore: 87,
      githubScore: 81,
      publicRepos: 10,
      stars: 19,
    },
    // 11. Ishaan Bose
    {
      email: 'ishaan.bose@gmail.com',
      fullName: 'Ishaan Bose',
      college: 'IIT Kharagpur',
      department: 'Computer Science and Engineering',
      year: 3,
      gender: 'Male',
      bio: 'Generative AI & LLM engineer. Built multimodal voice agents with LangChain and Whisper.',
      availability: 'Available',
      hackathonsCount: 3,
      githubUser: 'ishaan-bose-ai',
      roles: ['AI/ML Developer', 'Researcher'],
      skills: ['Python', 'Generative AI', 'NLP', 'PyTorch', 'Deep Learning'],
      quizScore: 93,
      githubScore: 89,
      publicRepos: 17,
      stars: 48,
    },
    // 12. Diya Bhattacharya
    {
      email: 'diya.b@gmail.com',
      fullName: 'Diya Bhattacharya',
      college: 'IIIT Delhi',
      department: 'Computer Science and Design',
      year: 3,
      gender: 'Female',
      bio: 'Frontend developer and design engineer. Bridges Figma design tokens directly into React component systems.',
      availability: 'Available',
      hackathonsCount: 2,
      githubUser: 'diya-codes-ui',
      roles: ['Frontend Developer', 'UI/UX Designer'],
      skills: ['React', 'JavaScript', 'CSS', 'UI/UX', 'HTML'],
      quizScore: 84,
      githubScore: 85,
      publicRepos: 13,
      stars: 31,
    },
    // 13. Manav Singhal
    {
      email: 'manav.singhal@gmail.com',
      fullName: 'Manav Singhal',
      college: 'Thapar Institute',
      department: 'Computer Science and Engineering',
      year: 3,
      gender: 'Male',
      bio: 'Cloud DevOps & infrastructure enthusiast. Kubernetes cluster automation, Terraform, and CI/CD pipelines.',
      availability: 'Available',
      hackathonsCount: 2,
      githubUser: 'manav-devops',
      roles: ['Cloud Engineer', 'Backend Developer'],
      skills: ['Cloud', 'AWS', 'Docker', 'Node.js', 'Express', 'SQL'],
      quizScore: 82,
      githubScore: 87,
      publicRepos: 16,
      stars: 35,
    },
    // 14. Ananya Joshi
    {
      email: 'ananya.joshi@gmail.com',
      fullName: 'Ananya Joshi',
      college: 'COEP Technological University',
      department: 'Electronics & Telecommunication',
      year: 3,
      gender: 'Female',
      bio: 'Robotics & IoT developer. Built obstacle avoiding smart rovers and environmental monitoring systems.',
      availability: 'Available',
      hackathonsCount: 2,
      githubUser: 'ananya-robotics',
      roles: ['IoT Developer', 'Hardware Engineer'],
      skills: ['IoT', 'Hardware', 'C++', 'Python', 'C'],
      quizScore: 81,
      githubScore: 76,
      publicRepos: 9,
      stars: 14,
    },
    // 15. Karthik Chawla
    {
      email: 'karthik.chawla@gmail.com',
      fullName: 'Karthik Chawla',
      college: 'RV College of Engineering',
      department: 'Information Science',
      year: 4,
      gender: 'Male',
      bio: 'API architect and database specialist. Optimized high-concurrency event tickers for college fest.',
      availability: 'Available',
      hackathonsCount: 3,
      githubUser: 'karthik-arch',
      roles: ['Backend Developer', 'Full Stack Developer'],
      skills: ['Node.js', 'Express', 'SQL', 'TypeScript', 'Docker', 'React'],
      quizScore: 89,
      githubScore: 88,
      publicRepos: 20,
      stars: 45,
    },
    // 16. Ritu Ghosh
    {
      email: 'ritu.ghosh@gmail.com',
      fullName: 'Ritu Ghosh',
      college: 'IIT Guwahati',
      department: 'Design',
      year: 3,
      gender: 'Female',
      bio: 'Interaction designer and design strategist. Focused on intuitive student tools and enterprise dashboards.',
      availability: 'Available',
      hackathonsCount: 2,
      githubUser: 'ritu-design-lab',
      roles: ['UI/UX Designer'],
      skills: ['UI/UX', 'CSS', 'HTML'],
      quizScore: 86,
      githubScore: 79,
      publicRepos: 7,
      stars: 16,
    },
    // 17. Yashraj Chauhan
    {
      email: 'yashraj.c@gmail.com',
      fullName: 'Yashraj Chauhan',
      college: 'Manipal Institute of Technology',
      department: 'Computer Science and Engineering',
      year: 3,
      gender: 'Male',
      bio: 'Computer Vision engineer. Worked on OpenCV vehicle detection and YOLO real-time tracking.',
      availability: 'Available',
      hackathonsCount: 2,
      githubUser: 'yashraj-cv',
      roles: ['AI/ML Developer', 'Data Scientist'],
      skills: ['Python', 'Computer Vision', 'Deep Learning', 'PyTorch', 'Machine Learning'],
      quizScore: 88,
      githubScore: 83,
      publicRepos: 14,
      stars: 33,
    },
    // 18. Simran Kaur
    {
      email: 'simran.kaur@gmail.com',
      fullName: 'Simran Kaur',
      college: 'PEC Chandigarh',
      department: 'Computer Science and Engineering',
      year: 3,
      gender: 'Female',
      bio: 'Full Stack engineer with passion for fintech microapps and clean modular React hooks.',
      availability: 'Available',
      hackathonsCount: 3,
      githubUser: 'simran-k-code',
      roles: ['Full Stack Developer', 'Frontend Developer'],
      skills: ['React', 'Node.js', 'JavaScript', 'HTML', 'CSS', 'SQL'],
      quizScore: 87,
      githubScore: 85,
      publicRepos: 15,
      stars: 30,
    },
    // 19. Harish Nambiar
    {
      email: 'harish.nambiar@gmail.com',
      fullName: 'Harish Nambiar',
      college: 'NIT Calicut',
      department: 'Electronics & Communication',
      year: 4,
      gender: 'Male',
      bio: 'Embedded systems engineer. LoRaWAN long-range communications and smart agriculture sensors.',
      availability: 'Available',
      hackathonsCount: 2,
      githubUser: 'harish-embedded',
      roles: ['IoT Developer', 'Hardware Engineer'],
      skills: ['IoT', 'Hardware', 'C', 'C++'],
      quizScore: 83,
      githubScore: 79,
      publicRepos: 10,
      stars: 17,
    },
    // 20. Meera Menon
    {
      email: 'meera.menon@gmail.com',
      fullName: 'Meera Menon',
      college: 'College of Engineering Trivandrum',
      department: 'Computer Science and Engineering',
      year: 2,
      gender: 'Female',
      bio: 'Budding data analyst with strong mathematical statistics foundation and seaborn visualization skills.',
      availability: 'Available',
      hackathonsCount: 1,
      githubUser: 'meera-data',
      roles: ['Data Analyst', 'Data Scientist'],
      skills: ['Python', 'SQL', 'Statistics', 'Data Analytics'],
      quizScore: 84,
      githubScore: 75,
      publicRepos: 8,
      stars: 12,
    },
    // 21. Devendra Yadav
    {
      email: 'devendra.y@gmail.com',
      fullName: 'Devendra Yadav',
      college: 'MNNIT Allahabad',
      department: 'Information Technology',
      year: 3,
      gender: 'Male',
      bio: 'Backend specialist with high-concurrency Go and Redis cache implementations.',
      availability: 'Available',
      hackathonsCount: 2,
      githubUser: 'dev-backend',
      roles: ['Backend Developer', 'Cloud Engineer'],
      skills: ['Node.js', 'Express', 'SQL', 'Docker', 'AWS'],
      quizScore: 86,
      githubScore: 84,
      publicRepos: 13,
      stars: 26,
    },
    // 22. Alisha Khan
    {
      email: 'alisha.khan@gmail.com',
      fullName: 'Alisha Khan',
      college: 'Jamia Millia Islamia',
      department: 'Computer Engineering',
      year: 3,
      gender: 'Female',
      bio: 'Full Stack engineer loving animated SVG interfaces, Tailwind CSS, and Node.js REST APIs.',
      availability: 'Available',
      hackathonsCount: 2,
      githubUser: 'alisha-dev',
      roles: ['Frontend Developer', 'Full Stack Developer'],
      skills: ['React', 'JavaScript', 'HTML', 'CSS', 'Node.js'],
      quizScore: 85,
      githubScore: 82,
      publicRepos: 12,
      stars: 24,
    },
    // 23. Chirag Agrawal
    {
      email: 'chirag.a@gmail.com',
      fullName: 'Chirag Agrawal',
      college: 'VJTI Mumbai',
      department: 'Computer Engineering',
      year: 3,
      gender: 'Male',
      bio: 'Blockchain & smart contracts developer. Ethereum Solidity and decentralized identity systems.',
      availability: 'Available',
      hackathonsCount: 3,
      githubUser: 'chirag-web3',
      roles: ['Backend Developer', 'Cybersecurity'],
      skills: ['Blockchain', 'Cybersecurity', 'JavaScript', 'Python', 'Node.js'],
      quizScore: 88,
      githubScore: 86,
      publicRepos: 16,
      stars: 39,
    },
    // 24. Shruti Pillai
    {
      email: 'shruti.pillai@gmail.com',
      fullName: 'Shruti Pillai',
      college: 'Amrita Vishwa Vidyapeetham',
      department: 'Computer Science and Engineering',
      year: 4,
      gender: 'Female',
      bio: 'NLP researcher working on Low-Resource Indian Language Translation with mBART and LLaMA fine-tuning.',
      availability: 'Available',
      hackathonsCount: 3,
      githubUser: 'shruti-nlp',
      roles: ['AI/ML Developer', 'Researcher'],
      skills: ['Python', 'NLP', 'Deep Learning', 'PyTorch', 'Machine Learning'],
      quizScore: 92,
      githubScore: 89,
      publicRepos: 18,
      stars: 52,
    },
    // 25. Tushar Bansal
    {
      email: 'tushar.bansal@gmail.com',
      fullName: 'Tushar Bansal',
      college: 'NSUT Delhi',
      department: 'Information Technology',
      year: 3,
      gender: 'Male',
      bio: 'Frontend enthusiast. Specializing in Tailwind CSS, responsive layouts, and performance profiling.',
      availability: 'Available',
      hackathonsCount: 2,
      githubUser: 'tushar-frontend',
      roles: ['Frontend Developer'],
      skills: ['React', 'JavaScript', 'HTML', 'CSS'],
      quizScore: 83,
      githubScore: 80,
      publicRepos: 11,
      stars: 20,
    },
    // 26. Deepa Raghavan
    {
      email: 'deepa.r@gmail.com',
      fullName: 'Deepa Raghavan',
      college: 'SSN College of Engineering',
      department: 'Biomedical & AI',
      year: 3,
      gender: 'Female',
      bio: 'Bioinformatics and machine learning enthusiast. Disease prediction models and EHR pipelines.',
      availability: 'Available',
      hackathonsCount: 1,
      githubUser: 'deepa-bio-ai',
      roles: ['Data Scientist', 'AI/ML Developer'],
      skills: ['Python', 'Machine Learning', 'Data Science', 'Statistics'],
      quizScore: 87,
      githubScore: 78,
      publicRepos: 9,
      stars: 16,
    },
    // 27. Pranav Kulkarni
    {
      email: 'pranav.k@gmail.com',
      fullName: 'Pranav Kulkarni',
      college: 'Pune Institute of Computer Technology (PICT)',
      department: 'Computer Engineering',
      year: 3,
      gender: 'Male',
      bio: 'Cloud Engineer & site reliability hacker. Linux kernels, container networking, and Kubernetes.',
      availability: 'Available',
      hackathonsCount: 2,
      githubUser: 'pranav-k8s',
      roles: ['Cloud Engineer', 'Backend Developer'],
      skills: ['Cloud', 'AWS', 'Docker', 'Node.js', 'SQL'],
      quizScore: 85,
      githubScore: 84,
      publicRepos: 14,
      stars: 28,
    },
    // 28. Lavanya Swaminathan
    {
      email: 'lavanya.s@gmail.com',
      fullName: 'Lavanya Swaminathan',
      college: 'National Institute of Design',
      department: 'Interaction Design',
      year: 4,
      gender: 'Female',
      bio: 'Interaction Designer with awards at Adobe Creative Jam. Micro-interactions and human-centered design.',
      availability: 'Available',
      hackathonsCount: 3,
      githubUser: 'lavanya-ux',
      roles: ['UI/UX Designer'],
      skills: ['UI/UX', 'CSS', 'HTML'],
      quizScore: 89,
      githubScore: 81,
      publicRepos: 8,
      stars: 22,
    },
    // 29. Saurabh Pandey
    {
      email: 'saurabh.pandey@gmail.com',
      fullName: 'Saurabh Pandey',
      college: 'IIT BHU Varanasi',
      department: 'Electrical Engineering',
      year: 3,
      gender: 'Male',
      bio: 'Edge computing & smart sensors. Energy metering automation with ESP32 and MQTT broker.',
      availability: 'Available',
      hackathonsCount: 2,
      githubUser: 'saurabh-iot-lab',
      roles: ['IoT Developer', 'Hardware Engineer'],
      skills: ['IoT', 'Hardware', 'C++', 'Python'],
      quizScore: 82,
      githubScore: 80,
      publicRepos: 10,
      stars: 19,
    },
    // 30. Pallavi Joshi
    {
      email: 'pallavi.joshi@gmail.com',
      fullName: 'Pallavi Joshi',
      college: 'Sardar Patel Institute of Technology (SPIT)',
      department: 'Computer Science and Engineering',
      year: 3,
      gender: 'Female',
      bio: 'Full Stack engineer. Build fast MVP web applications with clean RESTful contracts.',
      availability: 'Available',
      hackathonsCount: 2,
      githubUser: 'pallavi-stack',
      roles: ['Full Stack Developer', 'Backend Developer'],
      skills: ['React', 'Node.js', 'Express', 'SQL', 'JavaScript', 'HTML', 'CSS'],
      quizScore: 86,
      githubScore: 83,
      publicRepos: 13,
      stars: 25,
    },
    // 31. Nikhil Aggarwal
    {
      email: 'nikhil.a@gmail.com',
      fullName: 'Nikhil Aggarwal',
      college: 'IIIT Allahabad',
      department: 'Information Technology',
      year: 2,
      gender: 'Male',
      bio: 'Competitive programmer and data structures tutor. Quick algorithmic prototyping under hackathon pressure.',
      availability: 'Available',
      hackathonsCount: 1,
      githubUser: 'nikhil-c-plus',
      roles: ['Backend Developer', 'AI/ML Developer'],
      skills: ['C++', 'Java', 'Python', 'SQL'],
      quizScore: 90,
      githubScore: 79,
      publicRepos: 11,
      stars: 21,
    },
    // 32. Anjali Saxena
    {
      email: 'anjali.saxena@gmail.com',
      fullName: 'Anjali Saxena',
      college: 'SRM University',
      department: 'Computer Science and Engineering',
      year: 3,
      gender: 'Female',
      bio: 'Data Visualization & Analytics developer. PowerBI and D3.js interactive storytelling.',
      availability: 'Available',
      hackathonsCount: 2,
      githubUser: 'anjali-viz',
      roles: ['Data Analyst', 'Frontend Developer'],
      skills: ['Data Analytics', 'SQL', 'JavaScript', 'React', 'Python'],
      quizScore: 84,
      githubScore: 80,
      publicRepos: 12,
      stars: 23,
    },
  ];

  const seededCandidates: any[] = [];

  for (let i = 0; i < candidateDataset.length; i++) {
    const cd = candidateDataset[i];

    // Compute experience & skill baseline scores
    const experienceScore = Math.min(100, Math.max(40, cd.hackathonsCount * 18 + 35));
    const skillMatchScore = Math.min(100, Math.max(50, cd.skills.length * 9 + 40));

    // Overall score = (Quiz * 0.50) + (GitHub * 0.25) + (SkillMatch * 0.15) + (Experience * 0.10)
    const overallScore = Math.round(
      cd.quizScore * 0.50 +
      cd.githubScore * 0.25 +
      skillMatchScore * 0.15 +
      experienceScore * 0.10
    );

    const user = await prisma.user.create({
      data: {
        email: cd.email,
        passwordHash: candidateHash,
        role: 'candidate',
        candidateProfile: {
          create: {
            fullName: cd.fullName,
            college: cd.college,
            department: cd.department,
            year: cd.year,
            gender: cd.gender,
            bio: cd.bio,
            availability: cd.availability,
            hackathonsCount: cd.hackathonsCount,
            projects: JSON.stringify([
              { title: `${cd.fullName.split(' ')[0]}'s Hackathon Prototype`, desc: 'Built a full end-to-end platform during hackathon with real-time analytics.' },
              { title: 'Open-Source Tool', desc: 'Utility library with 100+ weekly downloads and automated test coverage.' },
            ]),
            achievements: JSON.stringify([
              'Top 5 Finalist in National Hackathon 2025',
              'Dean’s Merit Scholar for Academic & Technical Excellence',
            ]),
            certifications: JSON.stringify(['AWS Certified Cloud Practitioner', 'DeepLearning.AI Specialization']),
            preferredCategories: JSON.stringify(['AI & Machine Learning', 'Web3 & Fintech', 'Smart City & Sustainability']),
            profileCompleted: true,
            quizScore: cd.quizScore,
            githubScore: cd.githubScore,
            experienceScore,
            skillMatchScore,
            overallScore,
            avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cd.fullName)}`,
          },
        },
      },
      include: { candidateProfile: true },
    });

    const candProfile = user.candidateProfile!;
    seededCandidates.push(candProfile);

    // Attach Candidate Roles
    for (let rIdx = 0; rIdx < cd.roles.length; rIdx++) {
      const roleName = cd.roles[rIdx];
      const roleObj = roleMap.get(roleName);
      if (roleObj) {
        await prisma.candidateRole.create({
          data: {
            candidateProfileId: candProfile.id,
            roleId: roleObj.id,
            isPrimary: rIdx === 0,
          },
        });
      }
    }

    // Attach Candidate Skills
    for (const skillName of cd.skills) {
      const skillObj = skillMap.get(skillName);
      if (skillObj) {
        await prisma.candidateSkill.create({
          data: {
            candidateProfileId: candProfile.id,
            skillId: skillObj.id,
            proficiency: 'Advanced',
          },
        });
      }
    }

    // Seed GitHub Analysis
    await prisma.gitHubAnalysis.create({
      data: {
        candidateProfileId: candProfile.id,
        username: cd.githubUser,
        publicRepos: cd.publicRepos,
        totalStars: cd.stars,
        recentActivityLevel: 'High',
        readmeCoverage: 'Strong',
        topLanguages: JSON.stringify([
          { name: cd.skills[0] || 'Python', percentage: 55, count: 8 },
          { name: cd.skills[1] || 'JavaScript', percentage: 30, count: 5 },
          { name: 'TypeScript', percentage: 15, count: 2 },
        ]),
        technicalStrengths: JSON.stringify(cd.skills.slice(0, 4)),
        projectExperience: JSON.stringify([cd.roles[0], 'Full Stack Development', 'Distributed Architecture']),
        score: cd.githubScore,
      },
    });

    // Seed Quiz Attempt
    const skillBreakdown = [
      { skill: cd.skills[0] || 'Core', score: cd.quizScore, total: 8, correct: Math.round((cd.quizScore / 100) * 8) },
      { skill: cd.skills[1] || 'General', score: Math.max(70, cd.quizScore - 5), total: 7, correct: Math.round(((cd.quizScore - 5) / 100) * 7) },
      { skill: 'Problem Solving', score: Math.min(100, cd.quizScore + 3), total: 5, correct: 5 },
    ];

    const difficultyBreakdown = [
      { difficulty: 'EASY', score: 100, total: 5, correct: 5 },
      { difficulty: 'MEDIUM', score: Math.round(cd.quizScore * 0.95), total: 10, correct: Math.round((cd.quizScore / 100) * 10) },
      { difficulty: 'HARD', score: Math.round(cd.quizScore * 0.85), total: 5, correct: Math.round((cd.quizScore / 100) * 4) },
    ];

    await prisma.quizAttempt.create({
      data: {
        candidateProfileId: candProfile.id,
        roleName: cd.roles[0],
        totalQuestions: 20,
        correctCount: Math.round((cd.quizScore / 100) * 20),
        scorePercentage: cd.quizScore,
        skillBreakdown: JSON.stringify(skillBreakdown),
        difficultyBreakdown: JSON.stringify(difficultyBreakdown),
      },
    });
  }

  console.log(`✅ Seeded ${candidateDataset.length} Candidate Profiles with GitHub & Quiz data.`);

  // 9. Assign some candidates into Teams & Invitations to demonstrate full live state!
  // Team 1: NeuralNomads (Aarav Sharma) - Add 3 members, leaving 2 missing roles for visual demo!
  const neuralNomadsTeam = createdTeams[0];
  const byteBrigadeTeam = createdTeams[1];

  // Member 1 in NeuralNomads: Sneha Reddy (AI/ML Developer)
  await prisma.teamMember.create({
    data: {
      teamId: neuralNomadsTeam.id,
      candidateProfileId: seededCandidates[1].id, // Sneha
      assignedRole: 'AI/ML Developer',
    },
  });

  // Member 2 in NeuralNomads: Rohit Nair (Frontend Developer)
  await prisma.teamMember.create({
    data: {
      teamId: neuralNomadsTeam.id,
      candidateProfileId: seededCandidates[2].id, // Rohit
      assignedRole: 'Frontend Developer',
    },
  });

  // Member 3 in NeuralNomads: Kavya Kulkarni (Backend Developer)
  await prisma.teamMember.create({
    data: {
      teamId: neuralNomadsTeam.id,
      candidateProfileId: seededCandidates[3].id, // Kavya
      assignedRole: 'Backend Developer',
    },
  });

  // Current NeuralNomads team has 4 members (Aarav + Sneha + Rohit + Kavya) out of 6 max!
  // Missing 2 roles: UI/UX Designer, IoT Developer! Exactly matching Section 18 & 23 requirement!

  // Now create sample invitations:
  // 1. Pending invitation from NeuralNomads to Arjun Verma (the demo candidate!) for 'Full Stack Developer' / 'AI/ML Developer'
  await prisma.invitation.create({
    data: {
      teamId: neuralNomadsTeam.id,
      candidateProfileId: seededCandidates[0].id, // Arjun (Demo Candidate)
      leaderProfileId: createdLeaders[0].id,     // Aarav
      roleName: 'AI/ML Developer',
      message: 'Hi Arjun! We reviewed your GitHub repos and strong assessment scores. We would love to have you build the computer vision pipeline with us for SIH 2026.',
      status: 'PENDING',
    },
  });

  // Notification for Arjun
  const arjunUser = await prisma.user.findFirst({ where: { email: 'candidate@hackmate.dev' } });
  if (arjunUser) {
    await prisma.notification.create({
      data: {
        userId: arjunUser.id,
        title: 'New Team Invitation: NeuralNomads 🚀',
        message: 'Aarav Sharma invited you to join NeuralNomads for Smart India Hackathon (SIH 2026) as an AI/ML Developer.',
        type: 'INVITATION',
        link: '/candidate/invitations',
      },
    });
  }

  // 2. Pending invitation from ByteBrigade to Aditya Mehta (IoT Developer)
  await prisma.invitation.create({
    data: {
      teamId: byteBrigadeTeam.id,
      candidateProfileId: seededCandidates[4].id, // Aditya
      leaderProfileId: createdLeaders[1].id,     // Priya
      roleName: 'IoT Developer',
      message: 'Hi Aditya, your ESP32 telemetry hardware projects match our edge-traffic vision requirement perfectly. Join ByteBrigade!',
      status: 'PENDING',
    },
  });

  // 3. Accepted invitations history
  await prisma.invitation.create({
    data: {
      teamId: neuralNomadsTeam.id,
      candidateProfileId: seededCandidates[1].id, // Sneha
      leaderProfileId: createdLeaders[0].id,
      roleName: 'AI/ML Developer',
      message: 'Welcome to NeuralNomads!',
      status: 'ACCEPTED',
      respondedAt: new Date(),
    },
  });

  console.log('🎉 HackMate Seed completed successfully with 32 candidates, 5 teams, and active invitations!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
