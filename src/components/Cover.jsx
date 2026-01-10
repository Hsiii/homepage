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
import { Mountains } from 'components';
import { useHideLinks, useTime } from 'hooks';
import { Search } from 'lucide-react';

import 'components/Cover.css';

const Links = lazy(() => import('components/Links'));

export default function Cover() {
    const inputRef = useRef(null);
    const { time } = useTime();
    const { hideLinks } = useHideLinks();
    const [inputFocused, setInputFocused] = useState(false);

    const [searchValue, setSearchValue] = useState('');

    const match = useMemo(() => {
        if (!searchValue) return null;
        let currentSearch = searchValue.toLowerCase();
        while (currentSearch.length > 0) {
            for (let i = 0; i < linkTree.length; i++) {
                const category = linkTree[i];
                for (const link of category.links) {
                    if (link.toLowerCase().startsWith(currentSearch)) {
                        return { link, categoryIndex: i + 1 };
                    }
                }
            }
            currentSearch = currentSearch.slice(0, -1);
        }
        return null;
    }, [searchValue]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key == ' ' && !inputFocused) {
                e.preventDefault();
                inputRef.current.focus();
            }
            if (e.key === 'Escape' && inputFocused) {
                e.preventDefault();
                inputRef.current.value = '';
                inputRef.current.blur();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [inputFocused]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (match?.link && links[match.link]) {
            window.location.href = links[match.link];
        }
    };

    const handleClearSearch = useCallback(() => {
        if (inputRef.current) {
            inputRef.current.blur();
        }
    }, []);

    return (
        <section className='cover'>
            <Mountains />
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
                        onBlur={() => {
                            setInputFocused(false);
                            setSearchValue('');
                            inputRef.current.value = '';
                        }}
                    />
                </form>
            </div>
            <p className='hint'>[SPACE]</p>

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
