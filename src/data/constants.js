export const BUILDERS = {
  habeeb: {
    src: 'https://media.licdn.com/dms/image/v2/D5603AQG4hoYU-ehL-Q/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1718268749172?e=2147483647&v=beta&t=gE2RhsvETU0RvRMLNJDCNgFx0bPc8KBCrOwSy3ZML_Q',
    alt: 'Habeeb',
    name: 'Habeeb',
  },
  aravind: {
    src: 'https://res.cloudinary.com/startup-grind/image/upload/c_fill,dpr_2,f_auto,g_center,q_auto:good/v1/gcs/platform-data-goog/avatars/aravind_p_K3OzNMC.jpg',
    alt: 'Aravind',
    name: 'Aravind',
  },
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
];

export const INITIAL_PAINS = [
  { id: 1, text: '"Too many browser tabs open, I lose everything"', status: 'solved', votes: 74, toolName: 'Linkspaces', toolUrl: 'https://linkspaces.me/', toolDescription: 'Organise all your links across multiple workspaces.' },
  { id: 2, text: '"I keep forgetting which Figma frame I saved my work in"', status: 'solved', votes: 61, toolName: 'SaveFrame', toolUrl: 'https://www.figma.com/community/plugin/1500778509486639308', toolDescription: 'Manage and save custom Figma frames easily.' },
  { id: 3, text: '"Creating QR codes for events is painful and ugly"', status: 'solved', votes: 48, toolName: 'MakeQR', toolUrl: 'https://www.makeqr.site/', toolDescription: 'Create custom, beautiful QR codes.' },
  { id: 4, text: '"Billboards in my city are just noise pollution"', status: 'solved', votes: 39, toolName: 'The Billboard', toolUrl: 'https://thebillboard.site', toolDescription: 'Meaningful digital billboards for communities.' },
  { id: 5, text: '"I can\'t figure out which variables are detached in my Figma file"', status: 'building', votes: 55 },
  { id: 6, text: '"My design handoffs always have ruler/guide chaos"', status: 'building', votes: 42 },
  { id: 7, text: '"I lose context every time I switch between projects in Figma"', status: 'open', votes: 53 },
];
