export const upcomingWalk = {
  title: 'September Shutter Expedition: See You at 10',
  tag: 'UPCOMING EXPEDITION • SEP 26',
  date: 'SATURDAY, SEP 26 • 10:00 AM - 14:00',
  location: 'OBSCURA CREATIVE BASE',
  description:
    'Join the Obscura collective for an exclusive morning street and portrait expedition on September 26. We assemble at 10:00 AM sharp to capture golden morning light, architectural geometry, and cinematic street frames with our team.',
  image: '/assets/images/photowalk_26_sep.webp',
  targetDate: '2026-09-26T10:00:00',
  stats: [
    { icon: '🚶', title: 'DISTANCE', val: '3.8 KM Urban Loop' },
    { icon: '👥', title: 'CAPACITY', val: '45 Spots (12 Remaining)' },
    { icon: '☀️', title: 'WEATHER', val: '22°C • Clear Golden Light' },
    { icon: '🏆', title: 'CHALLENGE PRIZE', val: '$500 B&H Gift Card' }
  ],
  routeSteps: [
    { id: 1, name: '1. Obscura Base Rendezvous (Briefing & Gear Check)', time: '10:00 AM' },
    { id: 2, name: '2. Sunlit Architecture & Contrast Alley', time: '10:45 AM' },
    { id: 3, name: '3. Urban Street & Portrait Direction Session', time: '11:45 AM' },
    { id: 4, name: '4. Rooftop Lounge (Raw File Exchange & Coffee)', time: '13:00 PM' }
  ],
  gearItems: [
    { id: 1, label: 'Fast Prime Lens (35mm or 50mm f/1.4-f/1.8)', checked: true },
    { id: 2, label: 'Extra Batteries (Low temp drain)', checked: true },
    { id: 3, label: 'Lens Cloth / Rain Shield', checked: true },
    { id: 4, label: 'Portable Tripod / Monopod', checked: false },
    { id: 5, label: 'Mist / CineBloom Filter', checked: false }
  ]
};

export const pastWalks = [
  {
    id: 1,
    date: 'AUGUST 18, 2026',
    title: "Humayun's Tomb Heritage Photowalk",
    tag: 'HERITAGE ARCHIVE',
    description:
      'Captured Mughal architectural symmetry, sandstone arches, intricate marble lattices, and dramatic monsoon morning shadows.',
    stats: {
      attendees: '58 Attendees',
      submissions: '480 Photos Submitted'
    }
  },
  {
    id: 2,
    date: 'JULY 24, 2026',
    title: 'Chandni Chowk & Red Fort Street Photowalk',
    tag: 'REEL HIGHLIGHT',
    description:
      'Explored the vibrant bustling alleys of Old Delhi, street portraiture in historic bazaars, and monumental red sandstone facades.',
    stats: {
      attendees: '72 Attendees',
      submissions: '620 Photos Submitted'
    },
    reel: {
      embedUrl: 'https://www.instagram.com/reel/DQj6Sj8kmbE/embed/',
      watchUrl: 'https://www.instagram.com/reel/DQj6Sj8kmbE/?stkn=YXF6OTEwZ3V1Mzdi'
    }
  }
];
