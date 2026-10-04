import {useEffect, useState} from 'react';
import {useLoaderData} from 'react-router';
import StudioApp from '~/studio/Studio.client';
import {getEnv} from '~/lib/env';

// Sanity Studio lives at /studio (managed content: pages, sections, media). Browser-only, no site header/footer.
export const loader = ({context}) => ({
  projectId: getEnv(context, 'PUBLIC_SANITY_PROJECT_ID') ?? '',
  dataset: getEnv(context, 'PUBLIC_SANITY_DATASET') || 'production',
});
export const meta = () => [{title: 'Klaussner Studio'}, {name: 'robots', content: 'noindex'}];

export default function StudioRoute() {
  const {projectId, dataset} = useLoaderData();
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!projectId) return <p className="p-8">Set PUBLIC_SANITY_PROJECT_ID in .env and restart.</p>;
  return ready && StudioApp ? <div className="h-screen"><StudioApp projectId={projectId} dataset={dataset} /></div> : null;
}
