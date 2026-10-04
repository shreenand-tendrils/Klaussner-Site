import {RoomPage} from '~/components/rooms/shared/RoomPage';
import {FeatureGrid} from '~/components/sections/FeatureGrid';
import {config} from './config';

// Room-specific blocks live here — change freely without touching other rooms.
const tips = [
  {icon: '📐', title: 'Wall-hugger or not', text: 'Wall-hugger recliners need only inches of clearance behind.'},
  {icon: '⚡', title: 'Power or manual', text: 'Power reclining adds easy, quiet adjustment at the touch of a button.'},
  {icon: '🧍', title: 'Fit your frame', text: 'Check seat depth and height so your feet rest flat.'},
];

export function ReclinersPage({data}) {
  return <RoomPage config={config} data={data} extras={<FeatureGrid theme="sand" eyebrow="Good to know" heading="Choosing a recliner" items={tips} columns="3" />} />;
}
