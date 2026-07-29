import { Suspense } from 'react';
import ChecklistClient from './ChecklistClient';

export default function Page() {
    return (
        <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>Loading...</div>}>
            <ChecklistClient />
        </Suspense>
    );
}
