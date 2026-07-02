import React from 'react';
import { PanelLeft } from 'lucide-react';

import { SettingsMenu } from './SettingsMenu';

import './Controls.css';

interface ControlsProps {
    isLinkPanelLocked: boolean;
    onToggleLinkPanelLocked: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
    isLinkPanelLocked,
    onToggleLinkPanelLocked,
}) => (
    <>
        <div className='panel-lock-control'>
            <button
                className='panel-lock-trigger'
                type='button'
                aria-label={
                    isLinkPanelLocked
                        ? 'Unlock bookmark panel'
                        : 'Lock bookmark panel open'
                }
                aria-pressed={isLinkPanelLocked}
                onClick={onToggleLinkPanelLocked}
            >
                <PanelLeft className='icon' size={20} />
            </button>
        </div>
        <div className='controls'>
            <SettingsMenu />
        </div>
    </>
);
