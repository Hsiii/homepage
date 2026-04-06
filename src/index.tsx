import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { Main } from './components/Main';

import './index.css';

const animationStorageKey = 'animation-mode';
const skipAnimationMode = 'skip';
const normalAnimationMode = 'normal';

const savedAnimationMode = globalThis.localStorage.getItem(animationStorageKey);
globalThis.document.documentElement.dataset.animationMode =
    savedAnimationMode === skipAnimationMode
        ? skipAnimationMode
        : normalAnimationMode;

const root = document.querySelector('#root');
if (!root) {
    throw new Error('Root element not found');
}
createRoot(root).render(
    <StrictMode>
        <Main />
    </StrictMode>
);
