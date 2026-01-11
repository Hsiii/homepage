import React, {
    lazy,
    Suspense,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { links, linkTree } from 'constants';
import { Help, Mountains } from 'components';
import Fuse from 'fuse.js';
import { useHideLinks, useTime } from 'hooks';
import { Search } from 'lucide-react';

import 'components/Cover.css';

const Links = lazy(() => import('components/Links'));

interface LinkItem {
    link: string;
    categoryIndex: number;
}

export default function Cover() {
    const inputRef = useRef<HTMLInputElement>(null);
    const { time } = useTime();
    const { hideLinks } = useHideLinks();
    const [inputFocused, setInputFocused] = useState(false);

    const [searchValue, setSearchValue] = useState('');

    const flattenedLinks = useMemo<LinkItem[]>(() => {
        return linkTree.flatMap((category, categoryIndex) =>
            category.links.map((link) => ({
                link,
                categoryIndex: categoryIndex + 1,
            })),
        );
    }, []);

    const fuse = useMemo(() => {
        return new Fuse(flattenedLinks, {
            keys: ['link'],
            threshold: 0.4,
        });
    }, [flattenedLinks]);

    const match = useMemo(() => {
        if (!searchValue) return null;
        const results = fuse.search(searchValue);
        return results.length > 0 ? results[0].item : null;
    }, [searchValue, fuse]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key == ' ' && !inputFocused) {
                e.preventDefault();
                inputRef.current?.focus();
            }
            if (e.key === 'Escape' && inputFocused) {
                e.preventDefault();
                if (inputRef.current) {
                    inputRef.current.value = '';
                    inputRef.current.blur();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [inputFocused]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (match?.link && links[match.link]) {
            window.location.href = links[match.link];
        }
    };

    const handleClearSearch = () => {
        if (inputRef.current) {
            inputRef.current.blur();
        }
    };

    const handleSearchBlur = () => {
        setInputFocused(false);
        setSearchValue('');
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    return (
        <section className='cover'>
            <Mountains />
            <Help />
            <div className='cover-content'>
                <span className='title'>{time}</span>
                <div className='search'>
                    <form className='search-form' onSubmit={handleSubmit}>
                        <div className='search-icon'>
                            <Search className='icon' size={24} />
                        </div>
                        <input
                            className='search-input'
                            type='text'
                            placeholder='Search bookmarks'
                            autoComplete='off'
                            ref={inputRef}
                            onChange={(e) => setSearchValue(e.target.value)}
                            onFocus={() => setInputFocused(true)}
                            onBlur={handleSearchBlur}
                        />
                    </form>
                </div>
            </div>

            <Suspense fallback={null}>
                {
                    <Links
                        hidden={hideLinks}
                        keyboardNavEnabled={!inputFocused}
                        highlightedLink={match?.link}
                        highlightedCategoryIdx={match?.categoryIndex}
                        onClearSearch={handleClearSearch}
                    />
                }
            </Suspense>
        </section>
    );
}
