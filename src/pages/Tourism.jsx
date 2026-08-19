import React from 'react';

const destinations = [
  { img: '/Places/Assam.jpg', title: 'Assam', desc: 'Journey through emerald tea gardens where the morning mist rolls like a slow river. Let the mighty Brahmaputra wash over your soul.' },
  { img: '/Places/Bangalore.jpg', title: 'Bangalore', desc: 'Where the pulse of tomorrow beats beneath ancient rain trees. A city of gardens that blooms with the energy of a billion dreams.' },
  { img: '/Places/Bhopal.jpg', title: 'Bhopal', desc: 'Twin lakes reflecting the whispers of bygone nawabs. Step into a city where history and nature dance an eternal waltz.' },
  { img: '/Places/Dal_Lake.jpg', title: 'Dal Lake', desc: 'A mirror of heaven reflecting the mighty Himalayas. Drift softly on wooden shikaras through a floating paradise of lotus blooms.' },
  { img: '/Places/Delhi.jpg', title: 'Delhi', desc: 'The beating heart of India, where empires have risen and fallen like the tides. Walk through centuries of history etched in sandstone.' },
  { img: '/Places/Gir.jpg', title: 'Gir National Park', desc: 'Into the wild domain of the majestic Asiatic lion. Feel the raw, untamed spirit of the forest awaken your primal senses.' },
  { img: '/Places/Goa.jpg', title: 'Goa', desc: 'Where golden sands meet the rhythmic crash of the Arabian Sea. Let the ocean breeze wash away your worries under a painted sunset.' },
  { img: '/Places/Gujarat.jpg', title: 'Gujarat', desc: 'A vibrant tapestry of color spread across the great white desert. Experience a land where ancient legends are spun in silk.' },
  { img: '/Places/Gulmarg.jpg', title: 'Gulmarg', desc: 'Meadows of flowers blanketed in pristine, untouched snow. Breathe the crisp mountain air at the very edge of the world.' },
  { img: '/Places/Hyderabad.jpg', title: 'Hyderabad', desc: 'Where the scent of biryani mingles with the echoes of the Charminar. A royal city where tradition glistens like rare pearls.' },
  { img: '/Places/Jaipur.jpg', title: 'Jaipur', desc: 'Step into a realm of sun-drenched palaces and timeless royal intrigue. The Pink City whispers legends of forgotten kings on the desert wind.' },
  { img: '/Places/Kashmir.jpg', title: 'Kashmir', desc: 'Paradise on earth, veiled in mist and emerald valleys. Let the song of the Chinar trees serenade your wandering spirit.' },
  { img: '/Places/Kerala.jpg', title: 'Kerala', desc: 'Drift through emerald waters under a canopy of ancient palms. Let the silent backwaters carry you to a world untouched by time.' },
  { img: '/Places/Kolkata.jpg', title: 'Kolkata', desc: 'The city of joy, echoing with the poetry of Tagore and colonial charm. Lose yourself in the soul-stirring rhythm of its vibrant streets.' },
  { img: '/Places/Ladakh.jpg', title: 'Ladakh', desc: 'A barren paradise crowning the roof of the world. Discover serene monasteries clinging to the edge of the sky.' },
  { img: '/Places/Meghalaya.jpg', title: 'Meghalaya', desc: 'The abode of clouds, where living root bridges cross rushing torrents. Enter a mystical land where rain paints the world a thousand shades of green.' },
  { img: '/Places/Mumbai.jpg', title: 'Mumbai', desc: 'The city of dreams that never sleeps, rising from the restless sea. Feel the electric pulse of a metropolis that defies the impossible.' },
  { img: '/Places/Mysore.jpg', title: 'Mysore', desc: 'A city draped in silk and illuminated by the glow of a thousand palace lights. Walk the paths of royalty surrounded by the scent of sandalwood.' },
  { img: '/Places/Ooty.jpg', title: 'Ooty', desc: 'Rolling hills blanketed in blue blooms and the aroma of eucalyptus. Escape to a mountain retreat that feels like a forgotten fairytale.' },
  { img: '/Places/Rajasthan.jpg', title: 'Rajasthan', desc: 'A land of golden dunes and invincible forts standing against time. Hear the ballads of valor carried on the desert wind.' },
  { img: '/Places/Shimla.jpg', title: 'Shimla', desc: 'A colonial gem nestled amidst snow-draped peaks. Wander through mist-laden pine forests where the air holds the chill of history.' },
  { img: '/Places/Sikkim.jpg', title: 'Sikkim', desc: 'A hidden kingdom of orchids and ancient Buddhist chants. Stand in the shadow of Kanchenjunga and feel the earth touch the heavens.' },
  { img: '/Places/Srinagar.jpg', title: 'Srinagar', desc: 'A summer capital cradled by mountains and shimmering waters. Experience the melancholic beauty of a city wrapped in eternal romance.' },
  { img: '/Places/Taj_Mahal.jpg', title: 'Taj Mahal', desc: "A monument of marble born from an emperor's undying love. Witness a timeless romance etched in stone at the edge of the Yamuna." },
  { img: '/Places/Tamil_Nadu.jpg', title: 'Tamil Nadu', desc: 'A glorious peninsula of towering temple gopurams and classical rhythms. Journey into the ancient soul of the Dravidian heartland.' },
  { img: '/Places/Varanasi.jpg', title: 'Varanasi', desc: "Where the sacred river meets the eternal fires of devotion. Experience the spiritual heart of the world at dawn's golden hour." },
  { img: '/Places/Vizag.jpg', title: 'Visakhapatnam', desc: 'Where the lush Eastern Ghats plunge into the azure Bay of Bengal. Discover a coastal jewel glistening with untold marine secrets.' }
];

export default function Tourism() {
  return (
    <div className="w-full bg-white">
      <div className="max-w-[1120px] mx-auto py-[4.75rem] px-6">
        
        {/* Header Section */}
        <section className="text-center mb-16 flex flex-col items-center">
          <p className="uppercase tracking-widest text-[0.8rem] text-[#0b2540] font-bold mb-3">
            Incredible India
          </p>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 mb-6">
            Travel & Tourism
          </h1>
          <p className="text-[1.15rem] text-text-secondary max-w-2xl leading-relaxed">
            Discover a land of striking contrasts and cinematic beauty. From the snow-capped peaks of the Himalayas to the sun-kissed beaches of the south, every journey tells a story.
          </p>
        </section>

        {/* Responsive destination gallery using CSS Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          {destinations.map((dest, i) => (
            <div 
              key={i} 
              className="group flex flex-col bg-white overflow-hidden transition-transform duration-500 hover:-translate-y-2 cursor-pointer"
              style={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            >
              {/* Image Container with poster aspect ratio */}
              <div className="w-full aspect-[3/4] overflow-hidden bg-gray-100">
                <img 
                  src={dest.img} 
                  alt={dest.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" 
                  loading="lazy" 
                />
              </div>
              
              {/* Text Container */}
              <div className="p-6 flex flex-col items-center text-center mt-2">
                <h3 className="text-[1.3rem] font-serif font-bold text-gray-900 mb-3">{dest.title}</h3>
                <p className="text-[0.95rem] text-text-secondary leading-relaxed line-clamp-2 italic font-serif">
                  "{dest.desc}"
                </p>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
}
