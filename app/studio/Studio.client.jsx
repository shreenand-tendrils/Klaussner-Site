// `.client` file: never bundled into the server (Oxygen) build — Studio runs in the browser only.
import {useMemo} from 'react';
import {Studio, defineConfig} from 'sanity';
import {structureTool} from 'sanity/structure';
import {visionTool} from '@sanity/vision';
import {schemaTypes} from './schema';

export default function StudioApp({projectId, dataset}) {
  const config = useMemo(() => defineConfig({
    name: 'klaussner', title: 'Klaussner CMS', basePath: '/studio', projectId, dataset,
    plugins: [structureTool(), visionTool()],
    schema: {types: schemaTypes},
  }), [projectId, dataset]);
  return <Studio config={config} />;
}
