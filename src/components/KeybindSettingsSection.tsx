import type { ReactElement } from 'react';
import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

import type { BookmarkControls } from '@/hooks/useBookmarks';
import { useKeybinds } from '@/hooks/useKeybinds';
import { useLocale } from '@/hooks/useLocale';
import { normalizeHotkey } from '@/utils/keybinds';
import type { Keybind } from '@/utils/keybinds';
import { getSearchItems, getSlashCommandResults } from '@/utils/search';

export const KeybindSettingsSection = ({
    bookmarkControls,
}: {
    bookmarkControls: BookmarkControls;
}): ReactElement => {
    const { t } = useLocale();
    const { keybinds, saveKeybinds } = useKeybinds();
    const [error, setError] = useState<{ id?: string; message: string }>();
    const bookmarks = getSearchItems(bookmarkControls.bookmarkTree);
    const commands = getSlashCommandResults('/');
    const save = (next: readonly Keybind[]) => {
        setError(
            saveKeybinds(next) ? undefined : { message: t.keybindSaveFailed }
        );
    };
    const update = (id: string, change: Partial<Keybind>) => {
        save(
            keybinds.map((binding) =>
                binding.id === id ? { ...binding, ...change } : binding
            )
        );
    };
    const setHotkey = (id: string, value: string) => {
        const key = normalizeHotkey(value);
        if (key === undefined) {
            setError({ id, message: t.keybindLetterRequired });
        } else if (
            key !== '' &&
            keybinds.some((binding) => binding.id !== id && binding.key === key)
        ) {
            setError({ id, message: t.keybindDuplicate });
        } else {
            update(id, { key });
        }
    };

    return (
        <section className='settings-page-section'>
            <div className='settings-section-heading'>
                <h2>{t.keybinds}</h2>
                <p>{t.keybindsDescription}</p>
            </div>
            <div className='settings-card'>
                {keybinds.length === 0 ? (
                    <p className='settings-row-description settings-keybind-empty'>
                        {t.keybindsEmpty}
                    </p>
                ) : undefined}
                {keybinds.map((binding, index) => {
                    const missingBookmark =
                        binding.target.startsWith('bookmark:') &&
                        !bookmarks.some(
                            (bookmark) =>
                                `bookmark:${bookmark.id}` === binding.target
                        );
                    return (
                        <div
                            className='settings-row settings-keybind-row'
                            key={binding.id}
                        >
                            <label className='bookmark-workspace-field'>
                                <span>
                                    {t.keybindAction} {index + 1}
                                </span>
                                <select
                                    value={binding.target}
                                    onChange={(event) => {
                                        update(binding.id, {
                                            target: event.target.value,
                                        });
                                    }}
                                >
                                    <option value=''>
                                        {t.keybindSelectAction}
                                    </option>
                                    <optgroup label={t.commands}>
                                        {commands.map((command) => (
                                            <option
                                                key={command.command}
                                                value={`command:${command.command}`}
                                            >
                                                {command.label}
                                            </option>
                                        ))}
                                    </optgroup>
                                    <optgroup label={t.bookmarks}>
                                        {bookmarks.map((bookmark) => (
                                            <option
                                                key={bookmark.id}
                                                value={`bookmark:${bookmark.id}`}
                                            >
                                                {bookmark.title} —{' '}
                                                {bookmark.pathLabel}
                                            </option>
                                        ))}
                                    </optgroup>
                                    {missingBookmark ? (
                                        <option value={binding.target} disabled>
                                            {t.keybindBookmarkUnavailable}
                                        </option>
                                    ) : undefined}
                                </select>
                            </label>
                            <label className='bookmark-workspace-field settings-hotkey-field'>
                                <span>{t.hotkey}</span>
                                <input
                                    type='text'
                                    value={binding.key.toUpperCase()}
                                    maxLength={1}
                                    autoComplete='off'
                                    autoCapitalize='off'
                                    spellCheck={false}
                                    placeholder='A–Z'
                                    aria-invalid={error?.id === binding.id}
                                    aria-describedby={
                                        error?.id === binding.id
                                            ? 'keybind-error'
                                            : undefined
                                    }
                                    onFocus={(event) => {
                                        event.currentTarget.select();
                                    }}
                                    onKeyDown={(event) => {
                                        if (
                                            !event.nativeEvent.isComposing &&
                                            !event.ctrlKey &&
                                            !event.metaKey &&
                                            !event.altKey &&
                                            event.key.length === 1
                                        ) {
                                            event.preventDefault();
                                            setHotkey(binding.id, event.key);
                                        }
                                    }}
                                    onPaste={(event) => {
                                        event.preventDefault();
                                        setHotkey(
                                            binding.id,
                                            event.clipboardData.getData('text')
                                        );
                                    }}
                                    onChange={(event) => {
                                        setHotkey(
                                            binding.id,
                                            event.target.value
                                        );
                                    }}
                                />
                            </label>
                            <button
                                className='bookmark-workspace-icon-button settings-keybind-remove'
                                type='button'
                                aria-label={`${t.removeKeybind} ${index + 1}`}
                                onClick={() => {
                                    save(
                                        keybinds.filter(
                                            (item) => item.id !== binding.id
                                        )
                                    );
                                }}
                            >
                                <Trash2 size={18} aria-hidden />
                            </button>
                        </div>
                    );
                })}
            </div>
            {error ? (
                <p
                    id='keybind-error'
                    className='bookmark-manager-error'
                    role='alert'
                >
                    {error.message}
                </p>
            ) : undefined}
            <div>
                <button
                    className='bookmark-workspace-primary-button'
                    type='button'
                    onClick={() => {
                        save([
                            ...keybinds,
                            {
                                id: globalThis.crypto.randomUUID(),
                                target: '',
                                key: '',
                            },
                        ]);
                    }}
                >
                    <Plus size={18} aria-hidden />
                    {t.addKeybind}
                </button>
            </div>
        </section>
    );
};
