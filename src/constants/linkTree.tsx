import type { ReactElement } from 'react';
import {
    BookOpenText,
    Brush,
    CodeXml,
    // Gamepad2,
    LayoutGrid,
    MessagesSquare,
    MonitorPlay,
    ToolCase,
} from 'lucide-react';

import type { LinkName } from '@/constants/links';

export type CategoryData = {
    category: string;
    icon?: ReactElement;
    links: LinkName[];
};

export const linkTree: CategoryData[] = [
    {
        category: 'Study',
        icon: <BookOpenText className='icon' />,
        links: [
            'eeclass',
            'elearn',
            'ccxp',
            'DB',
            'GitLab',
            'Past Exam',
            'Presentation',
            'NotebookLM',
            'SSTM',
        ],
    },
    {
        category: 'SNS',
        icon: <MessagesSquare className='icon' />,
        links: ['Messenger', 'Instagram', 'Twitter', 'Facebook', 'Discord'],
    },
    {
        category: 'Media',
        icon: <MonitorPlay className='icon' />,
        links: ['YouTube', 'Anigamer', 'Spotify', 'Utaten', 'Dam'],
    },
    // { category: 'Game', icon: <Gamepad2 className='icon' />, links: ['Tetr.io', 'maimai'], },
    {
        category: 'Dev',
        icon: <CodeXml className='icon' />,
        links: [
            'GitHub',
            'Crx',
            'Colab',
            'React dev',
            'Vercel',
            'Lucide',
            'Font',
            'Squoosh',
            'Coolor',
            'Haikei',
            'Motion',
            'LeetCode',
        ],
    },
    {
        category: 'Art',
        icon: <Brush className='icon' />,
        links: [
            'Pinterest',
            'Head Ref',
            'Pose Ref',
            'Pixiv',
            'Line of Action',
            'Quickposes',
            'Hololive Ref',
        ],
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
            'Flowchart',
            'Overleaf',
        ],
    },
    {
        category: 'GSuite',
        icon: <LayoutGrid className='icon' />,
        links: ['Maps', 'Drive', 'Calendar', 'Doc', 'Sheet', 'Slide', 'Gmail'],
    },
];
