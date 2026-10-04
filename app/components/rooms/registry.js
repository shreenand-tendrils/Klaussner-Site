import {config as living} from './living-room/config';
import {config as bedroom} from './bedroom/config';
import {config as dining} from './dining-room/config';
import {config as recliners} from './recliners/config';
import {LivingRoomPage} from './living-room/LivingRoomPage';
import {BedroomPage} from './bedroom/BedroomPage';
import {DiningRoomPage} from './dining-room/DiningRoomPage';
import {ReclinersPage} from './recliners/ReclinersPage';

// OPTIONAL per-collection extras, keyed by Shopify collection handle. Any collection in the Shopify menu
// works without an entry here (generic RoomPage); add one only for custom coded blocks.
export const ROOM_PAGES = {
  'living-room': {config: living, Page: LivingRoomPage},
  bedroom: {config: bedroom, Page: BedroomPage},
  'dining-rooms': {config: dining, Page: DiningRoomPage},
  recliners: {config: recliners, Page: ReclinersPage},
};
