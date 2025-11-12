// Onboarding data structure
const onboardingSteps = [
  {
    id: 0,
    type: 'welcome',
    title: 'Velkommen til Nutribot! 👋',
    subtitle: 'Din personlige ernæringsassistent 🥗',
    description: 'Jeg vil gjerne bli kjent med deg, slik at jeg kan gi deg råd som passer for deg.'
  },
  {
    id: 1,
    type: 'chat-intro',
    title: 'Det er enkelt å snakke med meg!',
    content: [
      { icon: 'send', text: 'Skriv inn et spørsmål om kosthold, ernæring eller matvaner.' },
      { icon: 'message', text: 'NutriBot gir deg svar med det du lurer på!' }
    ]
  },
  {
    id: 2,
    type: 'selection',
    title: 'Tilpass kostholdet ditt',
    subtitle: 'Har du noen allergier, intoleranser eller matvarer du ønsker å unngå?',
    sectionLabel: 'Andre allergier / intoleranser',
    options: [
      { emoji: '🌾', label: 'Glutenfri' },
      { emoji: '🥛', label: 'Laktosefri' },
      { emoji: '🥜', label: 'Nøtter' },
      { emoji: '🦐', label: 'Skalldyr' }
    ],
    hasOther: true
  },
  {
    id: 3,
    type: 'selection',
    title: 'Velg preferanser',
    subtitle: 'Har du noen matvarepreferanser jeg bør vite om?',
    sectionLabel: 'Andre preferanser',
    options: [
      { emoji: '🌱', label: 'Vegetar' },
      { emoji: '🥬', label: 'Vegansk' },
      { emoji: '🕌', label: 'Halal' },
      { emoji: '✡️', label: 'Kosher' }
    ],
    hasOther: true
  },
  {
    id: 4,
    type: 'selection',
    title: 'Helsetilstander',
    subtitle: 'Har du noen helseutfordringer jeg bør vite om?',
    sectionLabel: 'Andre helsetilstander',
    options: [
      { emoji: '🍬', label: 'Diabetes' },
      { emoji: '🫀', label: 'Kolestrol' },
      { emoji: '🩸', label: 'Blodtrykk' },
      { emoji: '⚖️', label: 'Overvekt' }
    ],
    hasOther: true
  },
  {
    id: 5,
    type: 'final-welcome',
    title: 'Det var alt!',
    subtitle: 'Flott! Nå vet jeg litt mer om deg, slik at jeg kan gi deg personlige og trygge kostholdsråd.',
    buttons: [
      { text: '✍️ Gå tilbake', variant: 'outline' },
      { text: 'Start samtale 💬', variant: 'solid' }
    ]
  },
];

// Preferences menu options
export const healthOptions = [
    { emoji: '🍬', label: 'Diabetes' },
    { emoji: '🫀', label: 'Kolesterol' },
    { emoji: '🩸', label: 'Blodtrykk' },
    { emoji: '⚖️', label: 'Overvekt' },
    { emoji: '😴', label: 'Lav energi' },
    { emoji: '🍽️', label: 'Fordøyelse' },
    { emoji: '🦴', label: 'Osteoporose' },
    { emoji: '💊', label: 'Medisiner' }
  ];

  // Allergy/intolerance options
export const allergyOptions = [
    { emoji: '🌾', label: 'Gluten' },
    { emoji: '🥛', label: 'Laktose' },
    { emoji: '🌰', label: 'Nøtter' },
    { emoji: '🥜', label: 'Peanøtter' },
    { emoji: '🦐', label: 'Skalldyr' },
    { emoji: '🐟', label: 'Fisk' },
    { emoji: '🥚', label: 'Egg' },
    { emoji: '🌱', label: 'Soya' }
  ];

  // Food preference options
export const foodPreferenceOptions = [
    { emoji: '🌱', label: 'Vegetar' },
    { emoji: '🥬', label: 'Vegansk' },
    { emoji: '🕌', label: 'Halal' },
    { emoji: '✡️', label: 'Kosher' },
    { emoji: '🍞', label: 'Lavkarbo' },
    { emoji: '🍬', label: 'Sukkerfri' },
    { emoji: '🧈', label: 'Lite fett' },
    { emoji: '🧂', label: 'Lite salt' },
  ];

export default onboardingSteps;