import ChecklistClient from './ChecklistClient';

export async function generateStaticParams() {
    return [{ onboardingId: 'dummy' }];
}

export default function Page() {
    return <ChecklistClient />;
}
