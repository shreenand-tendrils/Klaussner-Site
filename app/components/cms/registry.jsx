import {Hero} from '~/components/sections/Hero';
import {ImageTextSection} from '~/components/sections/ImageTextSection';
import {FeatureGrid} from '~/components/sections/FeatureGrid';
import {Faq} from '~/components/sections/Faq';
import {MediaGallery} from '~/components/sections/MediaGallery';
import {VideoSection} from '~/components/sections/VideoSection';
import {Testimonials} from '~/components/sections/Testimonials';
import {Stats} from '~/components/sections/Stats';
import {RichText} from '~/components/sections/RichText';
import {Banner} from '~/components/sections/Banner';
import {Spacer} from '~/components/sections/Spacer';
import {DesignYourRoomCTA} from '~/components/sections/DesignYourRoomCTA';
import {Newsletter} from '~/components/sections/Newsletter';
import {CollectionShelf} from '~/components/sections/CollectionShelf';
import {ProductShelf} from '~/components/sections/ProductShelf';
import {ThreeColumnSection} from '~/components/sections/ThreeColumnSection';
import {SplitMediaSection} from '~/components/sections/SplitMediaSection';
import {ImageBanner} from '~/components/sections/ImageBanner';
import {ButtonsContext} from '~/components/ui/SectionShell';

// Sanity block `_type` → React section. Add a block: create the component, add it here AND in app/studio/schema/blocks.js.
const withButtons = (C) => function WithButtons(props) {
  return <ButtonsContext.Provider value={props.buttons}><C {...props} /></ButtonsContext.Provider>;
};

export const cmsComponents = {
  Hero, ImageBanner, Banner, Spacer, DesignYourRoomCTA,
  ImageTextSection: withButtons(ImageTextSection),
  FeatureGrid: withButtons(FeatureGrid),
  FAQ: withButtons(Faq),
  MediaGallery: withButtons(MediaGallery),
  VideoSection: withButtons(VideoSection),
  Testimonials: withButtons(Testimonials),
  Stats: withButtons(Stats),
  RichText: withButtons(RichText),
  Newsletter: withButtons(Newsletter),
  CollectionShelf: withButtons(CollectionShelf),
  ProductShelf: withButtons(ProductShelf),
  ThreeColumnSection: withButtons(ThreeColumnSection),
  SplitMediaSection: withButtons(SplitMediaSection),
};
