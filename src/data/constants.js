export const BUILDERS = {
  habeeb: { src: 'assets/habeeb.png', alt: 'Habeeb' },
  aravind: { src: 'assets/aravind.png', alt: 'Aravind' },
};

export const PROJECTS = [
  {
    id: 1,
    type: 'product',
    title: 'Linkspaces',
    description: 'Organise all your links across multiple workspaces.',
    usage: 'Used by many',
    builders: [BUILDERS.aravind, BUILDERS.habeeb],
    large: true,
  },
  {
    id: 2,
    type: 'tool',
    title: 'Chatglider',
    description: 'Makes chatbot flows actually understandable. Less friction, better conversations.',
    builders: [BUILDERS.habeeb],
  },
  {
    id: 3,
    type: 'tool',
    title: 'MakeQR',
    description: 'Create custom beautiful qr.',
    builders: [BUILDERS.aravind, BUILDERS.habeeb],
  },
  {
    id: 4,
    type: 'tool',
    title: 'Instagram carousel',
    description: 'Figma plugin to create carousels effortlessly in figma.',
    builders: [BUILDERS.habeeb],
  },
  {
    id: 5,
    type: 'tool',
    title: 'Jugaad',
    description: 'A calendar integration for the Hub app of TinkerHub',
    builders: [BUILDERS.aravind, BUILDERS.habeeb],
  },
];

export const BLOGS = [
  { id: 'building-for-public-welfare-1', slug: 'building-for-public-welfare', title: 'Building for public welfare', date: 'January 2026', author: 'Habeeb' },
  { id: 'building-for-public-welfare-2', slug: 'building-for-public-welfare', title: 'Building for public welfare', date: 'January 2026', author: 'Habeeb' },
  { id: 'building-for-public-welfare-3', slug: 'building-for-public-welfare', title: 'Building for public welfare', date: 'January 2026', author: 'Habeeb' },
  { id: 'building-for-public-welfare-4', slug: 'building-for-public-welfare', title: 'Building for public welfare', date: 'January 2026', author: 'Habeeb' },
];

export const INITIAL_PAINS = [
  { id: 1, text: '“Too many browser tabs open, I lose everything”', status: 'open', votes: 74 },
  { 
    id: 2, 
    text: '“Too many browser tabs open, I lose everything”', 
    status: 'solved', 
    votes: 74,
    toolName: 'Linkspaces',
    toolUrl: 'https://linkspaces.ark.build',
    toolDescription: 'Organise all your links across multiple workspaces.'
  },
  { id: 3, text: '“Too many browser tabs open, I lose everything”', status: 'open', votes: 74 },
  { id: 4, text: '“Too many browser tabs open, I lose everything”', status: 'open', votes: 74 },
  { id: 5, text: '“Too many browser tabs open, I lose everything”', status: 'open', votes: 74 },
  { id: 6, text: '“Too many browser tabs open, I lose everything”', status: 'open', votes: 74 },
  { id: 7, text: '“Too many browser tabs open, I lose everything”', status: 'building', votes: 74 },
];
