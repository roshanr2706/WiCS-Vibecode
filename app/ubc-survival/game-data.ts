
export type Stat = 'survival' | 'serotonin' | 'chaos';

export interface Effect {
    stat: Stat;
    amount: number;
}

export interface Option {
    text: string;
    effects: Effect[];
    addFlags?: string[];
    removeFlags?: string[];
    responseMessage: string;
}

export interface GameEvent {
    id: string;
    title: string;
    description: string;
    options: Option[];
    conditions?: {
        flag?: string; // Event only appears if this flag is present
        notFlag?: string; // Event only appears if this flag is NOT present
        minStat?: { stat: Stat, value: number };
        maxStat?: { stat: Stat, value: number }; // New condition for low stats
    };
    weight?: number; // Higher weight = more likely to appear
}

export const FACULTIES = ['Science', 'Arts', 'Engineering', 'Sauder', 'Forestry', 'LFS', 'Kinesiology'];
export const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year+', 'Grad Student'];
export const VIBES = ['Keener', 'Party Animal', 'Ghost', 'Co-op Gremlin', 'Burnout', 'Intramural Legend'];

// Initial Stat Modifiers
export const FACULTY_MODIFIERS: Record<string, Partial<Record<Stat, number>>> = {
    'Science': { survival: -5, chaos: 5 },
    'Arts': { serotonin: 10, survival: -5 },
    'Engineering': { survival: 10, serotonin: -10, chaos: 5 },
    'Sauder': { chaos: 10, serotonin: 5 },
    'Forestry': { serotonin: 10, chaos: -5 },
    'LFS': { survival: 5, serotonin: 5 },
    'Kinesiology': { survival: 10, serotonin: 10 }
};

export const YEAR_MODIFIERS: Record<string, Partial<Record<Stat, number>>> = {
    '1st Year': { chaos: 10, survival: -5 },
    '2nd Year': { survival: -5 },
    '3rd Year': { survival: 5 },
    '4th Year': { survival: 10, serotonin: -5 },
    '5th Year+': { chaos: 5, serotonin: 5 },
    'Grad Student': { survival: 10, serotonin: -10, chaos: -5 }
};

export const VIBE_MODIFIERS: Record<string, Partial<Record<Stat, number>>> = {
    'Keener': { survival: 10, serotonin: -5 },
    'Party Animal': { serotonin: 10, chaos: 10, survival: -5 },
    'Ghost': { chaos: -10, serotonin: -5 },
    'Co-op Gremlin': { survival: 10, chaos: -5 },
    'Burnout': { survival: -10, serotonin: -10, chaos: 5 },
    'Intramural Legend': { survival: 5, serotonin: 10 }
};

export const EVENTS: GameEvent[] = [
    // --- ORIGINAL EVENTS ---
    {
        id: 'rain-bus',
        title: 'The 99 B-Line Betrayal',
        description: 'You missed the 99 B-Line by 5 seconds in the pouring rain. The next one is "full" (it has space for 10 more people).',
        options: [
            {
                text: 'Wait in the rain',
                effects: [{ stat: 'survival', amount: -5 }, { stat: 'serotonin', amount: -10 }],
                responseMessage: 'You are soaked. Your laptop might be wet. Sadness ensues.'
            },
            {
                text: 'Uber home ($45)',
                effects: [{ stat: 'survival', amount: 5 }, { stat: 'chaos', amount: -5 }],
                responseMessage: 'Your wallet cries, but you are dry and warm.'
            },
            {
                text: 'Walk to campus (45 mins)',
                effects: [{ stat: 'survival', amount: 10 }, { stat: 'serotonin', amount: 5 }, { stat: 'chaos', amount: 5 }],
                responseMessage: 'You feel like a main character in a sad music video.'
            }
        ]
    },
    {
        id: 'canvas-quiz',
        title: 'Surprise Canvas Notification',
        description: 'Canvas just posted: "Quiz 1 grades released". The class average was 42%.',
        options: [
            {
                text: 'Check immediately',
                effects: [{ stat: 'serotonin', amount: -20 }, { stat: 'chaos', amount: 10 }],
                responseMessage: 'You got 43%. Above average! ...But still failing.'
            },
            {
                text: 'Ignore it until finals',
                effects: [{ stat: 'serotonin', amount: 10 }, { stat: 'survival', amount: -10 }],
                responseMessage: 'Ignorance is bliss. Until it isn\'t.'
            },
            {
                text: 'Drop the course',
                effects: [{ stat: 'survival', amount: 5 }, { stat: 'chaos', amount: -10 }],
                responseMessage: 'Problem solved. W status secured.'
            }
        ]
    },
    {
        id: 'printer-down',
        title: 'ICICS Printers Down',
        description: 'You have an assignment due in 10 minutes. The printers in ICICS are all displaying "PC LOAD LETTER".',
        options: [
            {
                text: 'Run to the library',
                effects: [{ stat: 'survival', amount: -5 }, { stat: 'chaos', amount: 10 }],
                responseMessage: 'You made it with 30 seconds to spare. You are sweating profusely.'
            },
            {
                text: 'Submit online only and pray',
                effects: [{ stat: 'survival', amount: -20 }, { stat: 'chaos', amount: 20 }],
                responseMessage: 'The TA did not accept it. 0%.'
            },
            {
                text: 'Fix the printer yourself',
                effects: [{ stat: 'survival', amount: 10 }, { stat: 'serotonin', amount: 10 }],
                responseMessage: 'You are a tech god. The printer works. Everyone claps.'
            }
        ]
    },
    {
        id: 'blue-chip',
        title: 'Blue Chip Cookie Temptation',
        description: 'You are studying in the Nest. The smell of Blue Chip cookies is wafting towards you.',
        options: [
            {
                text: 'Buy a Marbelous cookie',
                effects: [{ stat: 'serotonin', amount: 15 }, { stat: 'survival', amount: 5 }],
                responseMessage: 'Delicious. Worth every penny.'
            },
            {
                text: 'Resist and eat your sad apple',
                effects: [{ stat: 'serotonin', amount: -5 }, { stat: 'survival', amount: 5 }],
                responseMessage: 'Health +1. Happiness -10.'
            },
            {
                text: 'Buy cookies for the whole table',
                effects: [{ stat: 'chaos', amount: 10 }, { stat: 'serotonin', amount: 20 }],
                addFlags: ['popular'],
                responseMessage: 'You are now the most popular person in the Nest.'
            }
        ]
    },
    {
        id: 'construction',
        title: 'Construction detour',
        description: 'Your usual path to class is blocked by construction. Again.',
        options: [
            {
                text: 'Take the long way',
                effects: [{ stat: 'survival', amount: -5 }, { stat: 'chaos', amount: -5 }],
                responseMessage: 'You are late, but safe.'
            },
            {
                text: 'Cut through the construction site',
                effects: [{ stat: 'survival', amount: -20 }, { stat: 'chaos', amount: 20 }],
                responseMessage: 'You fell in a hole. But you found a cool hard hat.'
            },
            {
                text: 'Go back to bed',
                effects: [{ stat: 'serotonin', amount: 10 }, { stat: 'survival', amount: -10 }],
                responseMessage: 'Class is overrated anyway.'
            }
        ]
    },
    {
        id: 'wreck-beach',
        title: 'Wreck Beach Stairs',
        description: 'Your friends want to go to Wreck Beach. You remember the stairs.',
        options: [
            {
                text: 'Go for it (Leg Day)',
                effects: [{ stat: 'survival', amount: 10 }, { stat: 'serotonin', amount: 10 }],
                responseMessage: 'Your legs are jelly, but the sunset was nice.'
            },
            {
                text: 'Refuse',
                effects: [{ stat: 'serotonin', amount: -5 }, { stat: 'survival', amount: 5 }],
                addFlags: ['boring'],
                responseMessage: 'You stayed home and watched Netflix. FOMO sets in.'
            },
            {
                text: 'Roll down the hill',
                effects: [{ stat: 'survival', amount: -50 }, { stat: 'chaos', amount: 50 }],
                responseMessage: 'Do not recommend. You are covered in dirt and regret.'
            }
        ]
    },
    {
        id: 'buchanan-tower',
        title: 'Buchanan Tower Elevator',
        description: 'You are in Buchanan Tower. The elevator is making a suspicious noise.',
        options: [
            {
                text: 'Take the stairs (12 floors)',
                effects: [{ stat: 'survival', amount: 5 }, { stat: 'serotonin', amount: -10 }],
                responseMessage: 'You arrive sweaty and out of breath. But alive.'
            },
            {
                text: 'Risk the elevator',
                effects: [{ stat: 'chaos', amount: 10 }, { stat: 'survival', amount: -5 }],
                responseMessage: 'It got stuck for 5 minutes. You contemplated your existence.'
            },
            {
                text: 'Just leave',
                effects: [{ stat: 'serotonin', amount: 5 }, { stat: 'survival', amount: 0 }],
                responseMessage: 'You went to a cafe instead. Good choice.'
            }
        ]
    },
    {
        id: 'nitobe-garden',
        title: 'Nitobe Garden Peace',
        description: 'You stumble upon Nitobe Garden. It is incredibly peaceful.',
        options: [
            {
                text: 'Meditate',
                effects: [{ stat: 'serotonin', amount: 20 }, { stat: 'chaos', amount: -10 }],
                responseMessage: 'Zen achieved. You forgot about your midterms for 10 minutes.'
            },
            {
                text: 'Take Instagram photos',
                effects: [{ stat: 'serotonin', amount: 5 }, { stat: 'chaos', amount: 5 }],
                responseMessage: 'The aesthetic is immaculate. Your followers are impressed.'
            },
            {
                text: 'Sneak in without paying',
                effects: [{ stat: 'chaos', amount: 10 }, { stat: 'survival', amount: -5 }],
                addFlags: ['criminal'],
                responseMessage: 'You got caught. Shame on you.'
            }
        ]
    },
    {
        id: 'snow-day',
        title: 'Vancouver Snow Day',
        description: 'It is snowing. 2cm of snow has fallen. The city is in chaos.',
        options: [
            {
                text: 'Skip class (Bus might crash)',
                effects: [{ stat: 'survival', amount: 10 }, { stat: 'serotonin', amount: 10 }],
                responseMessage: 'Smart move. The 99 B-Line is sideways on a hill.'
            },
            {
                text: 'Trek to campus anyway',
                effects: [{ stat: 'survival', amount: -10 }, { stat: 'chaos', amount: 5 }],
                responseMessage: 'Class was cancelled when you arrived. You are frozen.'
            },
            {
                text: 'Build a snowman on Main Mall',
                effects: [{ stat: 'serotonin', amount: 15 }, { stat: 'chaos', amount: 5 }],
                responseMessage: 'He is beautiful. You named him "Tuition Fee".'
            }
        ]
    },
    {
        id: 'raccoon-encounter',
        title: 'Raccoon Encounter',
        description: 'You encounter a raccoon near the garbage bins. It looks at you with intelligent eyes.',
        options: [
            {
                text: 'Offer it a snack',
                effects: [{ stat: 'survival', amount: -10 }, { stat: 'chaos', amount: 15 }],
                addFlags: ['raccoon_friend'],
                responseMessage: 'It bit you... gently? You think you are friends now.'
            },
            {
                text: 'Back away slowly',
                effects: [{ stat: 'survival', amount: 5 }, { stat: 'chaos', amount: -5 }],
                responseMessage: 'Mutual respect established.'
            },
            {
                text: 'Challenge it to a duel',
                effects: [{ stat: 'survival', amount: -20 }, { stat: 'chaos', amount: 20 }],
                addFlags: ['raccoon_enemy'],
                responseMessage: 'You lost. Badly.'
            }
        ]
    },
    {
        id: 'tuition-due',
        title: 'Tuition Deadline',
        description: 'You forgot tuition was due today. The website is crashing.',
        options: [
            {
                text: 'Refresh frantically',
                effects: [{ stat: 'serotonin', amount: -10 }, { stat: 'chaos', amount: 10 }],
                responseMessage: 'It worked! But you paid twice by accident.'
            },
            {
                text: 'Call the registrar',
                effects: [{ stat: 'serotonin', amount: -15 }, { stat: 'chaos', amount: 5 }],
                responseMessage: 'You were on hold for 4 hours. You aged 10 years.'
            },
            {
                text: 'Accept the late fee',
                effects: [{ stat: 'survival', amount: -5 }, { stat: 'serotonin', amount: 5 }],
                addFlags: ['broke'],
                responseMessage: '$35 gone. But you kept your sanity.'
            }
        ]
    },
    {
        id: 'group-project',
        title: 'The Group Project from Hell',
        description: 'Your group members are ghosting you. The project is due tomorrow.',
        options: [
            {
                text: 'Do it all yourself',
                effects: [{ stat: 'survival', amount: -10 }, { stat: 'serotonin', amount: -10 }],
                responseMessage: 'You got an A. But at what cost?'
            },
            {
                text: 'Snitch to the prof',
                effects: [{ stat: 'chaos', amount: 15 }, { stat: 'survival', amount: 5 }],
                addFlags: ['snitch'],
                responseMessage: 'The prof didn\'t care. Your group hates you now.'
            },
            {
                text: 'Do nothing and fail together',
                effects: [{ stat: 'chaos', amount: 20 }, { stat: 'survival', amount: -10 }],
                responseMessage: 'Some men just want to watch the world burn.'
            }
        ]
    },
    {
        id: 'free-pizza',
        title: 'Free Pizza Event',
        description: 'A club is giving away free pizza on the plaza. The line is long.',
        options: [
            {
                text: 'Wait in line (30 mins)',
                effects: [{ stat: 'survival', amount: 5 }, { stat: 'serotonin', amount: 5 }],
                responseMessage: 'It was cold. But free is free.'
            },
            {
                text: 'Cut the line',
                effects: [{ stat: 'chaos', amount: 10 }, { stat: 'serotonin', amount: 10 }],
                addFlags: ['hated'],
                responseMessage: 'You got pizza fast. Everyone glared at you.'
            },
            {
                text: 'Buy your own lunch',
                effects: [{ stat: 'survival', amount: -5 }, { stat: 'chaos', amount: -5 }],
                responseMessage: 'You have dignity. And a warm meal.'
            }
        ]
    },
    {
        id: 'fire-alarm',
        title: '3AM Fire Alarm',
        description: 'The residence fire alarm goes off at 3 AM. It is raining.',
        options: [
            {
                text: 'Evacuate properly',
                effects: [{ stat: 'survival', amount: 5 }, { stat: 'serotonin', amount: -10 }],
                responseMessage: 'You are cold and tired. It was a false alarm.'
            },
            {
                text: 'Hide under the covers',
                effects: [{ stat: 'survival', amount: -20 }, { stat: 'chaos', amount: 10 }],
                responseMessage: 'Dangerous. But you stayed warm.'
            },
            {
                text: 'Bring your gaming setup outside',
                effects: [{ stat: 'chaos', amount: 20 }, { stat: 'serotonin', amount: 10 }],
                responseMessage: 'Legendary behavior. You went viral on TikTok.'
            }
        ]
    },
    {
        id: 'cherry-blossoms',
        title: 'Cherry Blossom Season',
        description: 'The cherry blossoms are blooming. Campus is beautiful.',
        options: [
            {
                text: 'Take a nice walk',
                effects: [{ stat: 'serotonin', amount: 15 }, { stat: 'survival', amount: 5 }],
                responseMessage: 'Nature heals. You feel refreshed.'
            },
            {
                text: 'Study inside anyway',
                effects: [{ stat: 'survival', amount: 5 }, { stat: 'serotonin', amount: -5 }],
                responseMessage: 'The grind never stops. Even for beauty.'
            },
            {
                text: 'Shake a tree for photos',
                effects: [{ stat: 'chaos', amount: 10 }, { stat: 'serotonin', amount: 5 }],
                responseMessage: 'You got petals everywhere. A gardener yelled at you.'
            }
        ]
    },

    // --- SOCIAL & CONDITIONAL EVENTS ---
    {
        id: 'party-invite',
        title: 'Frat Party Invite',
        description: 'A random guy in a backwards hat invites you to a party.',
        options: [
            {
                text: 'Accept invite',
                effects: [{ stat: 'serotonin', amount: 10 }, { stat: 'survival', amount: -5 }],
                addFlags: ['party_animal'],
                responseMessage: 'You are on the list. Prepare your liver.'
            },
            {
                text: 'Decline politely',
                effects: [{ stat: 'survival', amount: 5 }],
                addFlags: ['boring'],
                responseMessage: 'He calls you a "narpy" whatever that means.'
            },
            {
                text: 'Ask if there is food',
                effects: [{ stat: 'chaos', amount: 5 }],
                responseMessage: 'He says "maybe chips". You are unconvinced.'
            }
        ]
    },
    {
        id: 'party-consequence',
        title: 'The Morning After',
        description: 'You wake up with a headache. You vaguely remember dancing on a table.',
        conditions: { flag: 'party_animal' },
        options: [
            {
                text: 'Drink water and sleep',
                effects: [{ stat: 'survival', amount: 10 }, { stat: 'chaos', amount: -5 }],
                responseMessage: 'Recovery mode initiated.'
            },
            {
                text: 'Check your texts',
                effects: [{ stat: 'serotonin', amount: -10 }, { stat: 'chaos', amount: 10 }],
                responseMessage: 'You sent some risky texts. Oh no.'
            }
        ]
    },
    {
        id: 'lonely-night',
        title: 'Friday Night Alone',
        description: 'Everyone is out. You are in your room.',
        conditions: { flag: 'boring' },
        options: [
            {
                text: 'Study ahead',
                effects: [{ stat: 'survival', amount: 10 }, { stat: 'serotonin', amount: 5 }],
                responseMessage: 'Productive. But lonely.'
            },
            {
                text: 'Stare at the wall',
                effects: [{ stat: 'serotonin', amount: -10 }],
                responseMessage: 'The wall stares back.'
            }
        ]
    },
    {
        id: 'raccoon-gift',
        title: 'Raccoon Gift',
        description: 'The raccoon you befriended returns! It offers you a gift.',
        conditions: { flag: 'raccoon_friend' },
        options: [
            {
                text: 'Accept the shiny trash',
                effects: [{ stat: 'serotonin', amount: 20 }, { stat: 'chaos', amount: 10 }],
                responseMessage: 'It is a half-eaten bagel wrapper. You tear up.'
            },
            {
                text: 'Politely decline',
                effects: [{ stat: 'chaos', amount: -5 }],
                removeFlags: ['raccoon_friend'],
                responseMessage: 'The raccoon looks betrayed and leaves.'
            }
        ]
    },
    {
        id: 'raccoon-revenge',
        title: 'Raccoon Revenge',
        description: 'The raccoon you fought is back. And it brought friends.',
        conditions: { flag: 'raccoon_enemy' },
        options: [
            {
                text: 'Run for your life',
                effects: [{ stat: 'survival', amount: -10 }, { stat: 'chaos', amount: 10 }],
                responseMessage: 'You escaped. But you dropped your student ID.'
            },
            {
                text: 'Fight them all',
                effects: [{ stat: 'survival', amount: -30 }, { stat: 'chaos', amount: 30 }],
                responseMessage: 'You are overwhelmed. Raccoons rule this campus now.'
            }
        ]
    },
    {
        id: 'popular-perks',
        title: 'Campus Celebrity',
        description: 'People recognize you from the cookie incident. Someone offers you their notes.',
        conditions: { flag: 'popular' },
        options: [
            {
                text: 'Take the notes',
                effects: [{ stat: 'survival', amount: 15 }, { stat: 'serotonin', amount: 5 }],
                responseMessage: 'These notes are gold. Easy A.'
            },
            {
                text: 'Sign an autograph',
                effects: [{ stat: 'chaos', amount: 10 }, { stat: 'serotonin', amount: 10 }],
                responseMessage: 'You are letting this go to your head.'
            }
        ]
    },
    {
        id: 'hated-consequence',
        title: 'Social Pariah',
        description: 'You walk into a lecture hall. Everyone stops talking and stares at you.',
        conditions: { flag: 'hated' },
        options: [
            {
                text: 'Sit in the front row',
                effects: [{ stat: 'chaos', amount: 10 }, { stat: 'serotonin', amount: -5 }],
                responseMessage: 'Bold move. The tension is palpable.'
            },
            {
                text: 'Leave immediately',
                effects: [{ stat: 'survival', amount: -5 }, { stat: 'serotonin', amount: -5 }],
                responseMessage: 'You hid in the bathroom for an hour.'
            }
        ]
    },
    {
        id: 'club-fair',
        title: 'Club Fair Chaos',
        description: 'It is club fair day. You are bombarded by flyers.',
        options: [
            {
                text: 'Join the Knitting Club',
                effects: [{ stat: 'serotonin', amount: 10 }, { stat: 'chaos', amount: -5 }],
                addFlags: ['knitter'],
                responseMessage: 'Wholesome vibes only.'
            },
            {
                text: 'Join the Skydiving Club',
                effects: [{ stat: 'chaos', amount: 15 }, { stat: 'survival', amount: -5 }],
                addFlags: ['daredevil'],
                responseMessage: 'You signed a waiver. Hope you read it.'
            },
            {
                text: 'Collect free pens and leave',
                effects: [{ stat: 'survival', amount: 5 }],
                responseMessage: 'You now have 15 pens. Success.'
            }
        ]
    },

    // --- NEW ARCS & DEATH EVENTS ---
    {
        id: 'academic-probation',
        title: 'Academic Probation Warning',
        description: 'You receive a very serious email from the Dean.',
        conditions: { maxStat: { stat: 'survival', value: 20 } },
        weight: 10,
        options: [
            {
                text: 'Panic study',
                effects: [{ stat: 'survival', amount: 15 }, { stat: 'serotonin', amount: -15 }],
                responseMessage: 'You pulled 3 all-nighters. You are alive, but barely.'
            },
            {
                text: 'Give up',
                effects: [{ stat: 'survival', amount: -10 }, { stat: 'serotonin', amount: 5 }],
                responseMessage: 'You accepted your fate.'
            }
        ]
    },
    {
        id: 'mental-breakdown',
        title: 'Mid-Semester Crisis',
        description: 'You are crying in the middle of Main Mall. People are watching.',
        conditions: { maxStat: { stat: 'serotonin', value: 15 } },
        weight: 10,
        options: [
            {
                text: 'Call mom',
                effects: [{ stat: 'serotonin', amount: 20 }, { stat: 'survival', amount: 5 }],
                responseMessage: 'Mom made it better. She sent money.'
            },
            {
                text: 'Scream into the void',
                effects: [{ stat: 'chaos', amount: 10 }, { stat: 'serotonin', amount: 5 }],
                responseMessage: 'The void screamed back.'
            }
        ]
    },
    {
        id: 'chaos-reign',
        title: 'Agent of Chaos',
        description: 'You have caused so much chaos that you are now a campus legend/menace.',
        conditions: { minStat: { stat: 'chaos', value: 80 } },
        weight: 10,
        options: [
            {
                text: 'Start a revolution',
                effects: [{ stat: 'chaos', amount: 20 }, { stat: 'survival', amount: -10 }],
                addFlags: ['revolutionary'],
                responseMessage: 'You occupied the fountain. Police were called.'
            },
            {
                text: 'Calm down',
                effects: [{ stat: 'chaos', amount: -20 }, { stat: 'serotonin', amount: -5 }],
                responseMessage: 'You retired from your life of crime.'
            }
        ]
    },
    {
        id: 'knitting-circle',
        title: 'Knitting Circle Drama',
        description: 'The knitting club is tearing itself apart over yarn choices.',
        conditions: { flag: 'knitter' },
        options: [
            {
                text: 'Mediate the conflict',
                effects: [{ stat: 'serotonin', amount: 10 }, { stat: 'chaos', amount: -5 }],
                responseMessage: 'Peace restored. You knitted a scarf.'
            },
            {
                text: 'Stab someone with a needle',
                effects: [{ stat: 'chaos', amount: 20 }, { stat: 'survival', amount: -10 }],
                addFlags: ['violent_knitter'],
                responseMessage: 'It was an accident! (It wasn\'t).'
            }
        ]
    },
    {
        id: 'skydiving-accident',
        title: 'Skydiving Trip',
        description: 'The club is going skydiving. You are in the plane.',
        conditions: { flag: 'daredevil' },
        options: [
            {
                text: 'Jump!',
                effects: [{ stat: 'serotonin', amount: 50 }, { stat: 'survival', amount: -10 }],
                responseMessage: 'BEST. FEELING. EVER.'
            },
            {
                text: 'Chicken out',
                effects: [{ stat: 'survival', amount: 5 }, { stat: 'serotonin', amount: -20 }],
                removeFlags: ['daredevil'],
                responseMessage: 'You rode the plane down. Shameful.'
            }
        ]
    },
    // --- RECOVERY EVENTS ---
    {
        id: 'care-package',
        title: 'Care Package from Home',
        description: 'Your parents sent a box of snacks and vitamins. Just in time.',
        conditions: { maxStat: { stat: 'survival', value: 30 } },
        weight: 15,
        options: [
            {
                text: 'Devour everything',
                effects: [{ stat: 'survival', amount: 20 }, { stat: 'serotonin', amount: 10 }],
                responseMessage: 'You feel loved and nourished.'
            },
            {
                text: 'Share with roommates',
                effects: [{ stat: 'survival', amount: 10 }, { stat: 'serotonin', amount: 15 }],
                responseMessage: 'Sharing is caring. Good vibes.'
            }
        ]
    },
    {
        id: 'good-sleep',
        title: 'A Rare Good Sleep',
        description: 'You accidentally fell asleep at 9 PM and woke up at 8 AM. A miracle.',
        conditions: { maxStat: { stat: 'survival', value: 40 } },
        weight: 15,
        options: [
            {
                text: 'Enjoy the energy',
                effects: [{ stat: 'survival', amount: 15 }, { stat: 'serotonin', amount: 10 }],
                responseMessage: 'You feel like a new person.'
            },
            {
                text: 'Go back to sleep',
                effects: [{ stat: 'survival', amount: 5 }, { stat: 'serotonin', amount: 5 }],
                responseMessage: 'Why not? It is the weekend.'
            }
        ]
    },
    {
        id: 'found-money',
        title: 'Found Money',
        description: 'You found a $20 bill on the sidewalk. No one is around.',
        weight: 5,
        options: [
            {
                text: 'Buy a good meal',
                effects: [{ stat: 'survival', amount: 10 }, { stat: 'serotonin', amount: 10 }],
                responseMessage: 'Real food! Not instant noodles!'
            },
            {
                text: 'Save it',
                effects: [{ stat: 'survival', amount: 5 }],
                responseMessage: 'Responsible. Boring, but responsible.'
            }
        ]
    }
];
