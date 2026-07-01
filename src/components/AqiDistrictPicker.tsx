import React, { useEffect, useRef, useState } from 'react';
import { Settings } from 'lucide-react';

import { useAqi } from '@/hooks/useAqi';

export const AqiDistrictPicker: React.FC = () => {
    const { isSitesLoading, selectedSiteName, selectSiteName, siteOptions } =
        useAqi();
    const [isOpen, setIsOpen] = useState(false);
    const pickerRef = useRef<HTMLDivElement>(null);
    const selectedSite = siteOptions.find(
        (site) => site.siteName === selectedSiteName
    );

    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        const onClickOutside = (e: MouseEvent) => {
            if (pickerRef.current?.contains(e.target as Node) === false) {
                setIsOpen(false);
            }
        };

        globalThis.document.addEventListener('click', onClickOutside);
        return () => {
            globalThis.document.removeEventListener('click', onClickOutside);
        };
    }, [isOpen]);

    return (
        <div className={`aqi-control ${isOpen ? 'open' : ''}`} ref={pickerRef}>
            <button
                className='theme-icon-btn'
                type='button'
                aria-label='AQI district'
                aria-expanded={isOpen}
                title='AQI district'
                onClick={(event) => {
                    event.stopPropagation();
                    setIsOpen(!isOpen);
                }}
            >
                <Settings className='icon' />
            </button>
            <div className='aqi-menu' role='dialog' aria-label='AQI district'>
                <label className='aqi-label' htmlFor='aqi-district-picker'>
                    AQI District
                </label>
                <select
                    className='aqi-select'
                    id='aqi-district-picker'
                    value={selectedSiteName}
                    disabled={isSitesLoading}
                    onClick={(event) => {
                        event.stopPropagation();
                    }}
                    onChange={(event) => {
                        selectSiteName(event.target.value);
                    }}
                >
                    {siteOptions.map((site) => (
                        <option
                            key={site.siteId || site.siteName}
                            value={site.siteName}
                        >
                            {site.county} {site.siteName}
                        </option>
                    ))}
                </select>
                <span className='aqi-current'>
                    {selectedSite?.county ?? ''} {selectedSiteName}
                </span>
            </div>
        </div>
    );
};
