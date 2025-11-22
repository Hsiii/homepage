import React from 'react';
import {
    BookOpenText,
    CodeXml,
    ToolCase,
    Youtube,
    Brush,
    MessageSquare,
    Gamepad2,
} from 'lucide-react';

export const linkTree = [
    {
        category: 'School', 
        icon: <BookOpenText className='icon' />,
        links: [
            'eeclass',
            'elearn',
            'ccxp',
            'Past Exam',
            'Presentation',
            'SSTM'
        ]
    }, 
    {
        category: 'SNS',
        icon: <MessageSquare className='icon' />,
        links: [
            'Twitter',
            'Facebook',
            'Messenger',
            'Instagram',
            'Discord',
            'Gmail',
        ]
    },  
    {
        category: 'Tools', 
        icon: <ToolCase className='icon' />,
        links: [
            'HackMD',
            'Gemini',
            'Mathpix',
            'OJAD',
            'Famiport',
            'Train',
            'G-Maps',
            'G-Drive',
            'G-Doc',
            'G-Sheet',
            'G-Slide',
            'G-Calendar',
            'Flowchart',
            'Overleaf',
        ]
    }, 
    {
        category: 'Code',
        icon: <CodeXml className='icon' />,
        links: [
            'GitHub',
            'React dev',
            'Colab',
            'Luicide',
            'G-Font',
            'Squoosh',
            'Coolor',
            'Haikei',
            'Stylish',
            'LeetCode',
        ]
    },
    {
        category: 'Media', 
        icon: <Youtube className='icon' />,
        links: [
            'Anigamer',
            'YouTube',
            'Spotify',
            'Utaten',
            'Dam',
        ]
    },
    {
        category: 'Art',
        icon: <Brush className='icon' />,
        links: [
            'Pinterest',
            'Pixiv',
            'Line of Action',
            'Quickposes',
            'Hololive'
        ]
    },
    {
        category: 'Game',
        icon: <Gamepad2 className='icon' />,
        links: [
            'Tetr.io',
            'maimai',
        ]
    },
];