import React from 'react';
import { HelpCircle } from 'lucide-react';

import 'components/Help.css';

export default function Help() {
    const keyboardNavInfo = [
        ['Open bookmark search bar', 'SPACE'],
        ['Close bookmark search bar', 'ESC'],
        ['Open bookmark panel', '1'],
        ['Close bookmark panel', 'ESC'],
        ['Select bookmark', '1-9'],
    ];
    return (
        <div className='help'>
            <button className='help-icon-btn' aria-label='Help'>
                <HelpCircle className='icon' size={24} />
            </button>

            <div className='help-dialog'>
                <div className='help-content'>
                    {keyboardNavInfo.map((info, index) => (
                        <div className='help-row' key={index}>
                            <span className='help-desc'>{info[0]}</span>
                            <code className='key'>{info[1]}</code>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
