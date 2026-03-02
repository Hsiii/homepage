import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { Main } from './components/Main';

import './index.css';

const root = document.querySelector('#root');
if (!root) {
    throw new Error('Root element not found');
}
createRoot(root).render(
    <StrictMode>
        <Main />
    </StrictMode>
);
