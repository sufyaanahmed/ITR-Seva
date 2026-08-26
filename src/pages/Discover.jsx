import React from 'react';
import Page from '../ui/Page.jsx';
import { ExternalLink } from '../ui/Button.jsx';
import { usePrefs } from '../state/prefs.jsx';

const PHOTOGRAPHS = [
  {
    id: 'thathera', className: 'notebook-photo--wide',
    src: '/india-notebook/thathera-workshop-1280.webp', small: '/india-notebook/thathera-workshop-640.webp',
    width: 1024, height: 768,
    alt: 'The working floor and hand tools inside a Thathera brass workshop in Jandiala Guru.',
    label: 'Jandiala Guru, Punjab · Thathera workshop',
    author: 'Harvinder Chandigarh', license: 'CC BY 4.0',
    url: 'https://commons.wikimedia.org/wiki/File:Tools_of_brass_utensil_making_in_workshop_of_Thathera_market_of_Jandiala_Guru._06.jpg',
  },
  {
    id: 'longpi', className: 'notebook-photo--compact',
    src: '/india-notebook/longpi-pottery-1280.webp', small: '/india-notebook/longpi-pottery-640.webp',
    width: 1024, height: 768,
    alt: 'An assortment of hand-shaped black Longpi pottery vessels.',
    label: 'Longpi, Manipur · black pottery',
    author: 'Sumita Roy Dutta', license: 'CC BY-SA 4.0',
    url: 'https://commons.wikimedia.org/wiki/File:Longpi_pottery_of_Thankul_Naga_tribes_DSCN1244_03.jpg',
  },
  {
    id: 'tasar', className: 'notebook-photo--portrait',
    src: '/india-notebook/tasar-yarn-960.webp', small: '/india-notebook/tasar-yarn-480.webp',
    width: 768, height: 1152,
    alt: 'Tasar silk cocoons, golden yarn and a reeling machine at the Odisha Crafts Museum.',
    label: 'Bhubaneswar, Odisha · tasar yarn',
    author: 'Kritzolina', license: 'CC BY-SA 4.0',
    url: 'https://commons.wikimedia.org/wiki/File:Silk_and_weaving_at_the_Odisha_Crafts_Museum_03.jpg',
  },
  {
    id: 'dhokra', className: 'notebook-photo--landscape',
    src: '/india-notebook/dhokra-casting-1200.webp', small: '/india-notebook/dhokra-casting-640.webp',
    width: 1024, height: 683,
    alt: 'An artisan shaping a Dhokra cast by hand in Odisha.',
    label: 'Odisha · Dhokra casting',
    author: 'Government of Odisha', license: 'CC BY 4.0',
    url: 'https://commons.wikimedia.org/wiki/File:A_Dhokra_cast_being_made_by_a_Dharua_tribal_woman.jpg',
  },
  {
    id: 'ajrakh', className: 'notebook-photo--tall',
    src: '/india-notebook/ajrakh-artisan-960.webp', small: '/india-notebook/ajrakh-artisan-480.webp',
    width: 768, height: 1024,
    alt: 'An Ajrakh artisan in Kutch holding a large indigo and madder block-printed cloth.',
    label: 'Kutch, Gujarat · Ajrakh',
    author: 'Visdaviva', license: 'CC BY-SA 3.0',
    url: 'https://commons.wikimedia.org/wiki/File:Ajrak_Craft_artisan.jpeg',
  },
  {
    id: 'athangudi', className: 'notebook-photo--wide',
    src: '/india-notebook/athangudi-tiles-1280.webp', small: '/india-notebook/athangudi-tiles-640.webp',
    width: 1024, height: 683,
    alt: 'Rows of handmade Athangudi cement tiles curing in water at a workshop.',
    label: 'Athangudi, Tamil Nadu · tile workshop',
    author: 'Rainer Halama', license: 'CC BY-SA 4.0',
    url: 'https://commons.wikimedia.org/wiki/File:Chettinad-Manufacturing_Athangudi_Tiles-WUS-04332.jpg',
  },
];

export default function Discover() {
  const { imagesSuppressed } = usePrefs();

  return (
    <Page
      routeId="discover"
      eyebrow="India notebook"
      title="India, up close"
      lede="Six real photographs. Six specific places. No single Indian aesthetic."
      width="dashboard"
    >
      <ol className="notebook-grid">
        {PHOTOGRAPHS.map((photo, index) => (
          <li key={photo.id} className={`notebook-photo ${photo.className}`}>
            <figure>
              {imagesSuppressed ? (
                <div className="notebook-photo__paused">Image not loaded in Data Saver mode. {photo.alt}</div>
              ) : (
                <picture>
                  <source media="(max-width: 50rem)" srcSet={photo.small} type="image/webp" />
                  <img src={photo.src} width={photo.width} height={photo.height} alt={photo.alt} loading="lazy" decoding="async" />
                </picture>
              )}
              <figcaption>
                <strong><span className="numeric">0{index + 1}</span> {photo.label}</strong>
                <span>Photo: <ExternalLink href={photo.url}>{photo.author}</ExternalLink> · {photo.license}</span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ol>
    </Page>
  );
}
