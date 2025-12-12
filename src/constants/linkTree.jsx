import React from 'react';

import {
    BookOpenText,
    CodeXml,
    ToolCase,
    Youtube,
    Brush,
    MessageSquare,
    Gamepad2,
    LoaderCircle
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
            'Messenger',
            'Instagram',
            'Twitter',
            'Facebook',
            'Discord',
            'Gmail',
        ]
    },  
    {
        category: 'Media', 
        icon: <Youtube className='icon' />,
        links: [
            'YouTube',
            'Anigamer',
            'Spotify',
            'Utaten',
            'Dam',
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
    {
        category: 'Tools', 
        icon: <ToolCase className='icon' />,
        links: [
            'HackMD',
            'Gemini',
            'NotebookLM',
            'Mathpix',
            'OJAD',
            'Famiport',
            'Train',
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
            'Lucide',
            'Font',
            'Squoosh',
            'Coolor',
            'Haikei',
            'Stylish',
            'LeetCode',
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
        category: 'Google',
        icon: <LoaderCircle className='icon' />,
        links: [
            'Gemini',
            'Maps',
            'Drive',
            'Calendar',
            'Doc',
            'Sheet',
            'Slide',
            'Gmail',
        ]
    }
];