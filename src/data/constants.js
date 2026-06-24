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
    href: 'https://linkspaces.me/',
    large: true,
  },
  {
    id: 2,
    type: 'tool',
    title: 'Chatglider',
    description: 'Makes chatbot flows actually understandable. Less friction, better conversations.',
    builders: [BUILDERS.habeeb],
    href: 'https://chromewebstore.google.com/detail/chat-glider/fhkgjkddpccbplckbgljgofbmppdkmpc',
  },
  {
    id: 3,
    type: 'tool',
    title: 'MakeQR',
    description: 'Create custom beautiful QR codes.',
    builders: [BUILDERS.aravind, BUILDERS.habeeb],
    href: 'https://www.makeqr.site/',
  },
  {
    id: 4,
    type: 'plugin',
    title: 'Instagram Carousel',
    description: 'Figma plugin to create carousels effortlessly — no manual sizing or copy-paste.',
    builders: [BUILDERS.habeeb],
    href: 'https://www.figma.com/community/plugin/1513044148483173528',
  },
  {
    id: 5,
    type: 'plugin',
    title: 'Guide & Ruler Manager',
    description: 'Found it hard to manage rulers in Figma — so we built this.',
    builders: [BUILDERS.habeeb],
    href: 'https://www.figma.com/community/plugin/1554522426584190886',
  },
  {
    id: 6,
    type: 'plugin',
    title: 'Variable Detacher',
    description: 'Found it hard to detach variables in Figma — so we built this.',
    builders: [BUILDERS.habeeb],
    href: 'https://www.figma.com/community/plugin/1512513514263053398',
  },
  {
    id: 7,
    type: 'plugin',
    title: 'SaveFrame',
    description: 'Managing and saving custom frames was impossible in Figma — until now.',
    builders: [BUILDERS.habeeb],
    href: 'https://www.figma.com/community/plugin/1500778509486639308',
  },
  {
    id: 8,
    type: 'product',
    title: 'The Billboard',
    description: 'Built because annoying billboards in cities felt like a pain worth solving.',
    builders: [BUILDERS.aravind, BUILDERS.habeeb],
    href: 'https://thebillboard.site',
  },
  {
    id: 9,
    type: 'tool',
    title: 'Jugaad',
    description: 'A calendar integration for the Hub app of TinkerHub.',
    builders: [BUILDERS.aravind, BUILDERS.habeeb],
    href: 'https://jugadhub.vercel.app/',
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
