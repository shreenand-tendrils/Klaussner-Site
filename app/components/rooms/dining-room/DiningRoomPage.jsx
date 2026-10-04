import {RoomPage} from '~/components/rooms/shared/RoomPage';
import {FeatureGrid} from '~/components/sections/FeatureGrid';
import {config} from './config';

// Room-specific blocks live here — change freely without touching other rooms.
const tips = [
  {icon: '🍽️', title: 'Seat everyone', text: 'Allow about 24 inches of table width per person.'},
  {icon: '📏', title: 'Mind the clearance', text: 'Keep 36 inches between table edge and wall or sideboard.'},
  {icon: '🪑', title: 'Comfort counts', text: 'Upholstered chairs invite guests to stay a little longer.'},
];

export function DiningRoomPage({data}) {
  return <RoomPage config={config} data={data} extras={<FeatureGrid theme="sand" eyebrow="Good to know" heading="Planning your dining room" items={tips} columns="3" />} />;
}
