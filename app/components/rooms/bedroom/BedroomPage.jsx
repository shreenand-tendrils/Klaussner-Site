import {RoomPage} from '~/components/rooms/shared/RoomPage';
import {FeatureGrid} from '~/components/sections/FeatureGrid';
import {config} from './config';

// Room-specific blocks live here — change freely without touching other rooms.
const tips = [
  {icon: '🛏️', title: 'Right-size the bed', text: 'Leave at least 24 inches on each side for easy movement.'},
  {icon: '🌙', title: 'Layer the light', text: 'Mix ambient and bedside lighting for a restful space.'},
  {icon: '🧺', title: 'Plan storage', text: 'Dressers and nightstands keep the room clear and calm.'},
];

export function BedroomPage({data}) {
  return <RoomPage config={config} data={data} extras={<FeatureGrid theme="sand" eyebrow="Good to know" heading="Planning your bedroom" items={tips} columns="3" />} />;
}
