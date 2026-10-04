import {RoomPage} from '~/components/rooms/shared/RoomPage';
import {FeatureGrid} from '~/components/sections/FeatureGrid';
import {config} from './config';

// Room-specific blocks live here — change freely without touching other rooms.
const tips = [
  {icon: '🛋️', title: 'Measure first', text: 'Leave 30–36 inches for walkways around your seating.'},
  {icon: '🪵', title: 'Choose your frame', text: 'Kiln-dried hardwood frames are built to last decades.'},
  {icon: '🧵', title: 'Pick fabric for life', text: 'Performance fabrics resist stains for busy households.'},
];

export function LivingRoomPage({data}) {
  return <RoomPage config={config} data={data} extras={<FeatureGrid theme="sand" eyebrow="Good to know" heading="Planning your living room" items={tips} columns="3" />} />;
}
