import { StrictMode } from 'react';
import { Main } from 'components';
import { createRoot } from 'react-dom/client';

import './index.css';

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');
createRoot(root).render(
    <StrictMode>
        <Main />
    </StrictMode>
);
