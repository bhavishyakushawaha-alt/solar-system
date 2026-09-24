// Full catalogue: the Sun, eight planets and seventeen major moons.
// tiers: standard = bundled textures, high = assets/hires/4k_, ultra = assets/hires/8k_
// Camera presets: default / lit / terminator / polar / limb / detail / nightside
// Layer actions (Earth only): clouds / atmo / night
import type { ProcSpec } from './procedural';

export const K = 1 / 8;

export interface Highlight {
  id: string;
  title: string;
  desc: string;
  camDir: string;
  layer?: 'clouds' | 'atmo' | 'night';
}

export interface Stat { k: string; v: string }

export interface BodyConfig {
  id: string;
  name: string;
  latin: string;          // secondary label (Latin / designation)
  type: string;
  kind: string;           // Star / Planet / Moon
  R: number;              // display radius
  orbitD?: number;        // display orbit radius
  T?: number;             // moon orbit animation period
  locked?: boolean;       // tidally locked (same face toward host)
  retrograde?: boolean;
  of?: string;            // host planet id, for moons
  dia: string;
  au: string;
  texStd?: string;        // bundled texture id
  proc?: ProcSpec;        // or a procedural surface
  tiers: string[];
  bump?: number;
  ring?: boolean;
  night?: string;
  clouds?: string;
  brief: string;
  intro: string;
  stats: Stat[];
  facts: string[];
  exploration: string[];
  highlights: Highlight[];
  sources: string[];
  more: { t: string; u: string }[];
}

export const POEM: Record<string, string> = {
  sun: 'The source of all light and heat.',
  mercury: 'Closest to the fire, and the loneliest.',
  venus: 'Beneath the clouds lies another inferno.',
  earth: 'The only blue home we know of.',
  moon: 'Every crater is a mark left by time.',
  mars: 'A red desert — and a frontier yet to come.',
  phobos: 'A doomed rock racing around Mars.',
  deimos: 'A quiet speck drifting far from the dust.',
  jupiter: 'Beneath its bands, storms have raged for centuries.',
  io: 'A world that never stops erupting.',
  europa: 'An ocean sealed under ice.',
  ganymede: 'The largest moon of them all.',
  callisto: 'A face unchanged for four billion years.',
  saturn: 'Its rings are a poem written in ice.',
  mimas: 'One crater almost split it in two.',
  enceladus: 'A small moon breathing water into space.',
  rhea: 'Bright ice, and nothing but craters.',
  titan: 'Rain, rivers and seas — none of them water.',
  iapetus: 'Half soot, half snow.',
  uranus: 'Tipped on its side, drifting slowly around the Sun.',
  miranda: 'As if shattered and reassembled by hand.',
  ariel: 'The brightest of the tilted family.',
  titania: 'Great canyons carved in dirty ice.',
  oberon: 'The outer sentinel, scarred and dark.',
  neptune: 'The farthest, deepest blue.',
  triton: 'A captured world, running backwards.',
};

/* ============================ THE SUN & PLANETS ============================ */

const SUN: BodyConfig = {
  id: 'sun', name: 'Sun', latin: 'Sol', type: 'star', kind: 'Star', R: 12, dia: '1,392,700 km', au: '—',
  texStd: 'sun', tiers: ['standard', 'high', 'ultra'],
  brief: 'The star holding about 99.86% of the Solar System’s mass.',
  intro: 'The Sun is a G-type main-sequence star and the only star in our Solar System. In its core, about 600 million tonnes of hydrogen fuse into helium every second, releasing the light and heat that drive every climate, orbit and season around it. Its visible surface, the photosphere, boils with granulation cells the size of continents, while a roughly 11-year magnetic cycle drives sunspots, flares and the solar wind that shapes the whole heliosphere.',
  stats: [
    { k: 'Classification', v: 'G2V main-sequence star' },
    { k: 'Radius', v: '695,700 km (109× Earth)' },
    { k: 'Mass', v: '1.989 × 10³⁰ kg (333,000× Earth)' },
    { k: 'Surface gravity', v: '274 m/s² (28× Earth)' },
    { k: 'Photosphere temp.', v: '~5,500 °C' },
    { k: 'Core temperature', v: '~15,000,000 °C' },
    { k: 'Rotation', v: '25 days (equator) to 35 days (poles)' },
    { k: 'Age', v: '~4.6 billion years' },
    { k: 'Composition', v: '~73% hydrogen, ~25% helium' },
  ],
  facts: [
    'It contains 99.86% of all the mass in the Solar System.',
    'Light from its surface takes 8 minutes 20 seconds to reach Earth.',
    'It rotates faster at the equator than at the poles — differential rotation.',
    'The corona is far hotter (over 1,000,000 °C) than the surface below it.',
    'In about 5 billion years it will swell into a red giant.',
  ],
  exploration: [
    'Parker Solar Probe (2018–) — first spacecraft to fly through the corona.',
    'Solar Orbiter (2020–) — close-up imaging and first views of the poles.',
    'Solar Dynamics Observatory (2010–) — continuous full-disc monitoring.',
  ],
  highlights: [
    { id: 'surface', title: 'Photosphere', desc: 'A close look at granulation and sunspot texture', camDir: 'detail' },
  ],
  sources: ['NASA Sun overview', 'SolarSystemScope textures (4K source)'],
  more: [{ t: 'NASA · Our Sun', u: 'https://science.nasa.gov/sun/' }],
};

const MERCURY: BodyConfig = {
  id: 'mercury', name: 'Mercury', latin: 'Mercurius', type: 'rocky', kind: 'Planet', R: 0.5, orbitD: 24, dia: '4,879 km', au: '0.39 AU',
  texStd: 'mercury', tiers: ['standard'], bump: 0.009,
  brief: 'The smallest planet and the closest to the Sun.',
  intro: 'Mercury is the smallest planet and the one closest to the Sun. With almost no atmosphere to trap heat or soften impacts, its ancient surface is saturated with craters and its temperature swings more violently than anywhere else in the Solar System. An oversized iron core fills about 85% of its radius, and despite the searing daytime heat, radar has found water ice hiding in permanently shadowed craters at its poles.',
  stats: [
    { k: 'Radius', v: '2,440 km (0.38× Earth)' },
    { k: 'Mass', v: '3.30 × 10²³ kg (0.055× Earth)' },
    { k: 'Surface gravity', v: '3.7 m/s² (0.38× Earth)' },
    { k: 'Distance from Sun', v: '57.9 million km (0.39 AU)' },
    { k: 'Day (solar)', v: '176 Earth days' },
    { k: 'Rotation (sidereal)', v: '58.6 Earth days' },
    { k: 'Year', v: '88 Earth days' },
    { k: 'Temperature', v: '−173 °C to +427 °C' },
    { k: 'Atmosphere', v: 'Trace exosphere (O, Na, H, He, K)' },
    { k: 'Moons', v: 'None' },
  ],
  facts: [
    'It spins exactly three times for every two orbits — a 3:2 spin–orbit resonance.',
    'The iron core makes up about 85% of the planet’s radius.',
    'Caloris Basin, an impact crater 1,550 km wide, dominates one hemisphere.',
    'Polar craters that never see sunlight hold deposits of water ice.',
    'The planet is shrinking — cooling has wrinkled the crust into long scarps.',
  ],
  exploration: [
    'Mariner 10 (1974–75) — first flybys, mapped about 45% of the surface.',
    'MESSENGER (2011–2015) — first orbiter, confirmed polar ice.',
    'BepiColombo (ESA/JAXA) — entering orbit in late 2026.',
  ],
  highlights: [
    { id: 'craters', title: 'Craters & terminator', desc: 'Long shadows and craters along the day–night line', camDir: 'terminator' },
    { id: 'lit', title: 'Full daylight', desc: 'The scorched, airless surface at noon', camDir: 'lit' },
  ],
  sources: ['NASA Mercury overview', 'SolarSystemScope textures (2K source)'],
  more: [{ t: 'NASA · Mercury', u: 'https://science.nasa.gov/mercury/' }],
};

const VENUS: BodyConfig = {
  id: 'venus', name: 'Venus', latin: 'Venus', type: 'rocky', kind: 'Planet', R: 0.95, orbitD: 32, dia: '12,104 km', au: '0.72 AU',
  texStd: 'venus_atmo', tiers: ['standard'],
  brief: 'An “inferno” world wrapped in thick clouds.',
  intro: 'Venus is almost exactly Earth’s size, yet it turned out utterly hostile. A runaway greenhouse effect has left it wrapped in carbon dioxide at 92 times Earth’s surface pressure, with clouds of sulfuric acid and a surface hot enough to melt lead. Those cloud tops race around the planet in just four days, while the solid planet itself turns backwards so slowly that a single Venusian day outlasts its year.',
  stats: [
    { k: 'Radius', v: '6,052 km (0.95× Earth)' },
    { k: 'Mass', v: '4.87 × 10²⁴ kg (0.815× Earth)' },
    { k: 'Surface gravity', v: '8.87 m/s² (0.90× Earth)' },
    { k: 'Distance from Sun', v: '108.2 million km (0.72 AU)' },
    { k: 'Rotation', v: '243 Earth days (retrograde)' },
    { k: 'Year', v: '225 Earth days' },
    { k: 'Surface temperature', v: '~465 °C (hottest planet)' },
    { k: 'Surface pressure', v: '92 bar (~900 m underwater)' },
    { k: 'Atmosphere', v: '96.5% CO₂, 3.5% N₂, sulfuric-acid clouds' },
    { k: 'Moons', v: 'None' },
  ],
  facts: [
    'Its day is longer than its year, and the Sun rises in the west.',
    'Surface pressure equals being 900 m deep in Earth’s ocean.',
    'The cloud tops super-rotate, lapping the planet every four days.',
    'Over 1,600 major volcanoes have been mapped; some may still be active.',
    'Soviet Venera landers survived only 23 to 127 minutes on the surface.',
  ],
  exploration: [
    'Venera 7 (1970) — first successful landing on another planet.',
    'Magellan (1990–94) — radar-mapped 98% of the surface through the clouds.',
    'Akatsuki (2015–) — Japanese climate orbiter studying the super-rotation.',
    'DAVINCI, VERITAS and EnVision — missions planned for the 2030s.',
  ],
  highlights: [
    { id: 'clouds', title: 'Cloud deck', desc: 'The creamy-yellow cloud tops on the sunlit side', camDir: 'lit' },
    { id: 'limb', title: 'Atmospheric limb', desc: 'The thick atmosphere seen edge-on', camDir: 'limb' },
  ],
  sources: ['NASA Venus overview', 'SolarSystemScope textures (2K source)'],
  more: [{ t: 'NASA · Venus', u: 'https://science.nasa.gov/venus/' }],
};

const EARTH: BodyConfig = {
  id: 'earth', name: 'Earth', latin: 'Terra', type: 'earth', kind: 'Planet', R: 1.0, orbitD: 42, dia: '12,742 km', au: '1.00 AU',
  texStd: 'earth_day', tiers: ['standard', 'high', 'ultra'], night: 'earth_night', clouds: 'earth_clouds',
  brief: 'The only planet known to host life.',
  intro: 'Earth is the only planet known to host life. Liquid water covers about 71% of its surface, a nitrogen–oxygen atmosphere shields the ground from radiation, and a molten iron core generates the magnetic field that deflects the solar wind. It is also the only planet with active plate tectonics, endlessly recycling its crust. From orbit the day side shows blue oceans and white weather systems, while the night side glitters with the lights of cities.',
  stats: [
    { k: 'Radius', v: '6,371 km' },
    { k: 'Mass', v: '5.97 × 10²⁴ kg' },
    { k: 'Surface gravity', v: '9.81 m/s²' },
    { k: 'Distance from Sun', v: '149.6 million km (1 AU)' },
    { k: 'Rotation', v: '23 h 56 min (sidereal day)' },
    { k: 'Year', v: '365.25 days' },
    { k: 'Axial tilt', v: '23.4° — the reason for seasons' },
    { k: 'Mean temperature', v: '~15 °C' },
    { k: 'Atmosphere', v: '78% N₂, 21% O₂, 1% Ar + trace gases' },
    { k: 'Moons', v: '1 (the Moon)' },
  ],
  facts: [
    'About 71% of the surface is ocean; 97% of all its water is salt water.',
    'The magnetic field deflects most of the solar wind, protecting the atmosphere.',
    'Plate tectonics continually recycles the crust — unique among known planets.',
    'The atmosphere’s free oxygen was produced by life itself.',
    'Earth is the densest planet in the Solar System at 5.51 g/cm³.',
  ],
  exploration: [
    'Continuous human presence aboard the ISS since November 2000.',
    'Thousands of Earth-observation satellites monitor climate and weather.',
    '“Earthrise” (Apollo 8, 1968) reshaped how we see our own world.',
  ],
  highlights: [
    { id: 'day', title: 'Daylight', desc: 'Oceans, continents and clouds on the sunlit side', camDir: 'lit' },
    { id: 'night', title: 'City lights', desc: 'Urban lights across the night hemisphere', camDir: 'nightside', layer: 'night' },
    { id: 'clouds', title: 'Cloud layer', desc: 'A separate cloud shell you can toggle', camDir: 'lit', layer: 'clouds' },
    { id: 'atmo', title: 'Atmospheric limb', desc: 'The blue glow of the atmosphere at the edge', camDir: 'limb', layer: 'atmo' },
  ],
  sources: ['NASA Visible Earth (8K source)', 'SolarSystemScope cloud texture'],
  more: [{ t: 'NASA · Earth', u: 'https://science.nasa.gov/earth/' }],
};

const MARS: BodyConfig = {
  id: 'mars', name: 'Mars', latin: 'Mars', type: 'rocky', kind: 'Planet', R: 0.6, orbitD: 54, dia: '6,779 km', au: '1.52 AU',
  texStd: 'mars', tiers: ['standard', 'high', 'ultra'], bump: 0.009,
  brief: 'The red desert planet, second home of our robotic explorers.',
  intro: 'Mars is a cold desert world coloured red by iron oxide dust. It holds the tallest volcano in the Solar System, Olympus Mons, rising 22 km above the plains, and Valles Marineris, a canyon system long enough to stretch across the United States. Dried river valleys, deltas and clay minerals show that liquid water once flowed here, which is why Mars has become the most intensively explored planet beyond our own.',
  stats: [
    { k: 'Radius', v: '3,390 km (0.53× Earth)' },
    { k: 'Mass', v: '6.42 × 10²³ kg (0.107× Earth)' },
    { k: 'Surface gravity', v: '3.72 m/s² (0.38× Earth)' },
    { k: 'Distance from Sun', v: '227.9 million km (1.52 AU)' },
    { k: 'Day (sol)', v: '24 h 37 min' },
    { k: 'Year', v: '687 Earth days' },
    { k: 'Axial tilt', v: '25.2° — Mars has seasons too' },
    { k: 'Mean temperature', v: '−63 °C' },
    { k: 'Atmosphere', v: '95% CO₂, ~6 mbar (0.6% of Earth’s)' },
    { k: 'Moons', v: '2 (Phobos, Deimos)' },
  ],
  facts: [
    'Olympus Mons is 22 km high — roughly two and a half times Everest.',
    'Valles Marineris runs over 4,000 km long and up to 7 km deep.',
    'Global dust storms can wrap the entire planet for weeks.',
    'Both polar caps contain water ice plus a seasonal layer of dry ice.',
    'Its thin air makes the sky butterscotch by day and blue at sunset.',
  ],
  exploration: [
    'Viking 1 & 2 (1976) — first successful landings and surface images.',
    'Curiosity (2012–) — confirmed an ancient habitable lake in Gale Crater.',
    'Perseverance (2021–) — caching samples for a future return mission.',
    'Ingenuity (2021–24) — first powered flight on another planet, 72 flights.',
  ],
  highlights: [
    { id: 'surface', title: 'Red surface', desc: 'Deserts and dark regions on the sunlit side', camDir: 'lit' },
    { id: 'polar', title: 'Polar region', desc: 'Looking down on the ice cap and terrain', camDir: 'polar' },
  ],
  sources: ['NASA Mars overview', 'SolarSystemScope textures (8K source)'],
  more: [{ t: 'NASA · Mars', u: 'https://science.nasa.gov/mars/' }],
};

const JUPITER: BodyConfig = {
  id: 'jupiter', name: 'Jupiter', latin: 'Iuppiter', type: 'gas', kind: 'Planet', R: 6.0, orbitD: 78, dia: '139,820 km', au: '5.20 AU',
  texStd: 'jupiter', tiers: ['standard', 'high', 'ultra'],
  brief: 'The largest planet, a giant of churning cloud bands.',
  intro: 'Jupiter is more massive than every other planet combined, twice over. It has no solid surface — the atmosphere simply thickens until hydrogen is squeezed into a metallic liquid that generates the strongest magnetic field of any planet. Its banded clouds are jet streams flowing in opposite directions, and between them swirl storms like the Great Red Spot, which has been raging for at least 190 years and is wide enough to swallow Earth.',
  stats: [
    { k: 'Radius', v: '69,911 km (11× Earth)' },
    { k: 'Mass', v: '1.90 × 10²⁷ kg (318× Earth)' },
    { k: 'Surface gravity', v: '24.79 m/s² (2.5× Earth)' },
    { k: 'Distance from Sun', v: '778.5 million km (5.2 AU)' },
    { k: 'Rotation', v: '9 h 56 min — fastest in the Solar System' },
    { k: 'Year', v: '11.9 Earth years' },
    { k: 'Cloud-top temp.', v: '−110 °C' },
    { k: 'Composition', v: '~90% hydrogen, ~10% helium' },
    { k: 'Moons', v: '95 confirmed' },
  ],
  facts: [
    'Its rapid spin flattens it visibly — the equator bulges by nearly 7%.',
    'The Great Red Spot is a storm wider than Earth, shrinking but centuries old.',
    'Jupiter has faint dust rings, discovered by Voyager 1 in 1979.',
    'Its magnetosphere is the largest structure in the Solar System after the heliosphere.',
    'It radiates more heat than it receives from the Sun, still slowly contracting.',
  ],
  exploration: [
    'Galileo (1995–2003) — first orbiter, dropped a probe into the atmosphere.',
    'Juno (2016–) — polar orbits revealing the deep interior and cyclone clusters.',
    'Europa Clipper (2024–) and ESA’s JUICE (2023–) arrive in the early 2030s.',
  ],
  highlights: [
    { id: 'bands', title: 'Cloud bands', desc: 'Layered bands along the terminator', camDir: 'terminator' },
    { id: 'surface', title: 'Great Red Spot', desc: 'Parallel bands and storms on the sunlit side', camDir: 'lit' },
  ],
  sources: ['NASA Jupiter overview', 'SolarSystemScope textures (4K source)'],
  more: [{ t: 'NASA · Jupiter', u: 'https://science.nasa.gov/jupiter/' }],
};

const SATURN: BodyConfig = {
  id: 'saturn', name: 'Saturn', latin: 'Saturnus', type: 'gas', kind: 'Planet', R: 5.0, orbitD: 104, dia: '116,460 km', au: '9.58 AU',
  texStd: 'saturn', tiers: ['standard', 'high', 'ultra'], ring: true,
  brief: 'The lightweight giant famous for its icy rings.',
  intro: 'Saturn is the second-largest planet and by far the most striking. Its rings span more than 280,000 km yet are typically only about ten metres thick, made of countless chunks of nearly pure water ice. The planet itself is so light for its size that it would float in water, and its 27° tilt slowly swings the rings from wide open to edge-on over its 29-year orbit. A six-sided jet stream — the hexagon — circles its north pole.',
  stats: [
    { k: 'Radius', v: '58,232 km (9.4× Earth)' },
    { k: 'Mass', v: '5.68 × 10²⁶ kg (95× Earth)' },
    { k: 'Surface gravity', v: '10.44 m/s² (1.07× Earth)' },
    { k: 'Distance from Sun', v: '1.43 billion km (9.58 AU)' },
    { k: 'Rotation', v: '10 h 34 min' },
    { k: 'Year', v: '29.4 Earth years' },
    { k: 'Density', v: '0.69 g/cm³ — less dense than water' },
    { k: 'Cloud-top temp.', v: '−140 °C' },
    { k: 'Ring span', v: '~282,000 km wide, ~10 m thick' },
    { k: 'Moons', v: '274 confirmed (2025) — most of any planet' },
  ],
  facts: [
    'It is the only planet less dense than water.',
    'The rings are 99% water ice and may be younger than the dinosaurs.',
    'A hexagonal jet stream 30,000 km across surrounds the north pole.',
    'Winds near the equator reach 1,800 km/h.',
    'Saturn holds the largest moon collection in the Solar System.',
  ],
  exploration: [
    'Pioneer 11 (1979) and Voyager 1 & 2 (1980–81) — first close looks.',
    'Cassini–Huygens (2004–2017) — 13 years in orbit, ended in a planned dive.',
    'Huygens (2005) — landed on Titan, the most distant landing ever made.',
  ],
  highlights: [
    { id: 'rings', title: 'Ring system', desc: 'Edge-on view of ring layers and gaps', camDir: 'terminator' },
    { id: 'tilt', title: 'Ring tilt & pole', desc: 'The 27° tilted rings seen from above', camDir: 'polar' },
  ],
  sources: ['NASA Saturn overview', 'SolarSystemScope planet & ring textures (4K source)'],
  more: [{ t: 'NASA · Saturn', u: 'https://science.nasa.gov/saturn/' }],
};

const URANUS: BodyConfig = {
  id: 'uranus', name: 'Uranus', latin: 'Uranus', type: 'gas', kind: 'Planet', R: 2.5, orbitD: 130, dia: '50,724 km', au: '19.2 AU',
  texStd: 'uranus', tiers: ['standard'],
  brief: 'An ice giant that rolls around the Sun on its side.',
  intro: 'Uranus is tipped over by 98°, effectively rolling along its orbit, most likely knocked sideways by a giant impact early in its history. That extreme tilt gives each pole a 42-year day followed by a 42-year night. Beneath its bland, methane-tinted haze lies a hot, dense fluid mixture of water, ammonia and methane — the “ice” that gives ice giants their name. It remains the coldest planetary atmosphere ever measured.',
  stats: [
    { k: 'Radius', v: '25,362 km (4× Earth)' },
    { k: 'Mass', v: '8.68 × 10²⁵ kg (14.5× Earth)' },
    { k: 'Surface gravity', v: '8.87 m/s² (0.89× Earth)' },
    { k: 'Distance from Sun', v: '2.87 billion km (19.2 AU)' },
    { k: 'Rotation', v: '17 h 14 min (retrograde)' },
    { k: 'Year', v: '84 Earth years' },
    { k: 'Axial tilt', v: '97.8° — rotates on its side' },
    { k: 'Minimum temp.', v: '−224 °C — coldest planetary atmosphere' },
    { k: 'Atmosphere', v: 'H₂, He, ~2.3% methane (gives the cyan colour)' },
    { k: 'Moons', v: '28 confirmed' },
  ],
  facts: [
    'Each pole spends 42 years in continuous sunlight, then 42 in darkness.',
    'It was the first planet discovered with a telescope, by William Herschel in 1781.',
    'Its magnetic field is tilted 59° from the rotation axis and offset from the centre.',
    'There are 13 known narrow, dark rings.',
    'Its moons are named after Shakespeare and Alexander Pope characters.',
  ],
  exploration: [
    'Voyager 2 (1986) — the only spacecraft ever to visit, a single flyby.',
    'Hubble and JWST now track its seasons, storms and rings from afar.',
    'A dedicated Uranus orbiter is the top priority of the 2023 Decadal Survey.',
  ],
  highlights: [
    { id: 'axis', title: 'Sideways axis', desc: 'A side view of its nearly toppled tilt', camDir: 'limb' },
    { id: 'polar', title: 'Pole-on view', desc: 'Looking straight down a pole facing the Sun', camDir: 'polar' },
  ],
  sources: ['NASA Uranus overview', 'SolarSystemScope textures (2K source)'],
  more: [{ t: 'NASA · Uranus', u: 'https://science.nasa.gov/uranus/' }],
};

const NEPTUNE: BodyConfig = {
  id: 'neptune', name: 'Neptune', latin: 'Neptunus', type: 'gas', kind: 'Planet', R: 2.4, orbitD: 152, dia: '49,244 km', au: '30.1 AU',
  texStd: 'neptune', tiers: ['standard'],
  brief: 'The most distant planet, a deep-blue world of wind.',
  intro: 'Neptune is the farthest planet from the Sun, receiving barely a thousandth of the sunlight Earth does — and yet it is the windiest place in the Solar System, with storms clocked at 2,100 km/h. It was found in 1846 by mathematics rather than searching: astronomers predicted its position from irregularities in the orbit of Uranus, then pointed a telescope and found it almost immediately.',
  stats: [
    { k: 'Radius', v: '24,622 km (3.9× Earth)' },
    { k: 'Mass', v: '1.02 × 10²⁶ kg (17× Earth)' },
    { k: 'Surface gravity', v: '11.15 m/s² (1.14× Earth)' },
    { k: 'Distance from Sun', v: '4.5 billion km (30.1 AU)' },
    { k: 'Rotation', v: '16 h 6 min' },
    { k: 'Year', v: '164.8 Earth years' },
    { k: 'Cloud-top temp.', v: '−214 °C' },
    { k: 'Fastest winds', v: '~2,100 km/h — strongest known' },
    { k: 'Atmosphere', v: 'H₂, He, methane (deep blue colour)' },
    { k: 'Moons', v: '16 confirmed' },
  ],
  facts: [
    'It was discovered by mathematical prediction in 1846, not by chance.',
    'It completed its first full orbit since discovery only in 2011.',
    'The Great Dark Spot seen by Voyager 2 had vanished by 1994.',
    'It radiates 2.6 times more energy than it receives from the Sun.',
    'Sunlight there is about 1/900th as bright as at Earth.',
  ],
  exploration: [
    'Voyager 2 (1989) — the only visit, passing 4,950 km above the north pole.',
    'Hubble and JWST monitor its clouds, rings and shifting dark spots.',
  ],
  highlights: [
    { id: 'atmo', title: 'Blue atmosphere', desc: 'Deep blue hues and cloud streaks on the sunlit side', camDir: 'lit' },
    { id: 'limb', title: 'Limb view', desc: 'The outer edge of the deepest atmosphere', camDir: 'limb' },
  ],
  sources: ['NASA Neptune overview', 'SolarSystemScope textures (2K source)'],
  more: [{ t: 'NASA · Neptune', u: 'https://science.nasa.gov/neptune/' }],
};

/* ================================= MOONS ================================= */

const MOON: BodyConfig = {
  id: 'moon', name: 'Moon', latin: 'Luna', type: 'moon', kind: 'Moon', of: 'earth',
  R: 0.27, orbitD: 2.4, T: 9, locked: true, dia: '3,474 km', au: '384,400 km from Earth',
  texStd: 'moon', tiers: ['standard', 'high', 'ultra'], bump: 0.009,
  brief: 'Earth’s only natural satellite, always showing the same face.',
  intro: 'The Moon is the only world beyond Earth that humans have walked on. It most likely formed when a Mars-sized body struck the young Earth and the debris coalesced in orbit. Tidal locking means its rotation matches its orbit, so the same face always points our way. The dark maria are vast basalt plains flooded by ancient lava; the bright highlands are older crust saturated with craters. Its gravity drives our tides and steadies Earth’s axial tilt.',
  stats: [
    { k: 'Radius', v: '1,737 km (0.27× Earth)' },
    { k: 'Mass', v: '7.35 × 10²² kg (0.012× Earth)' },
    { k: 'Surface gravity', v: '1.62 m/s² (0.17× Earth)' },
    { k: 'Distance from Earth', v: '384,400 km average' },
    { k: 'Orbital period', v: '27.3 days (sidereal month)' },
    { k: 'Rotation', v: 'Tidally locked — same face always toward Earth' },
    { k: 'Temperature', v: '−173 °C to +127 °C' },
    { k: 'Atmosphere', v: 'Essentially none (thin exosphere)' },
  ],
  facts: [
    'It is drifting away from Earth by about 3.8 cm per year.',
    'The largest crater, the South Pole–Aitken basin, is 2,500 km across.',
    'Water ice sits in permanently shadowed craters at both poles.',
    'Moonquakes can last up to an hour — there is no water to damp them.',
    'Its gravity stabilises Earth’s tilt, keeping our climate relatively steady.',
  ],
  exploration: [
    'Luna 2 (1959) — first human object to reach another world.',
    'Apollo 11 (1969) — first crewed landing; 12 people walked here in total.',
    'Chang’e 4 (2019) — first landing on the far side; Chang’e 6 returned far-side samples in 2024.',
    'Artemis — NASA’s programme to return astronauts, targeting the south pole.',
  ],
  highlights: [
    { id: 'maria', title: 'Maria (sunlit side)', desc: 'The dark lunar plains in full sunlight', camDir: 'lit' },
    { id: 'craters', title: 'Crater detail', desc: 'A close look at crater textures', camDir: 'detail' },
    { id: 'terminator', title: 'Terminator', desc: 'Long-shadowed craters along the day–night line', camDir: 'terminator' },
  ],
  sources: ['NASA Moon overview', 'LRO/LOLA lunar texture (8K source)'],
  more: [{ t: 'NASA · Moon', u: 'https://science.nasa.gov/moon/' }],
};

const PHOBOS: BodyConfig = {
  id: 'phobos', name: 'Phobos', latin: 'Mars I', type: 'moon', kind: 'Moon', of: 'mars',
  R: 0.075, orbitD: 1.15, T: 0.9, locked: true, dia: '22.5 km (27 × 22 × 18 km)', au: '9,376 km from Mars',
  proc: { style: 'cratered', base: '#7d7168', accent: '#3a332c', craters: 200, seed: 5501 }, tiers: ['standard'],
  brief: 'A doomed potato-shaped rock racing around Mars.',
  intro: 'Phobos is the larger and closer of Mars’ two tiny moons, orbiting just 6,000 km above the surface — closer than any other moon in the Solar System. It circles Mars three times a day, so from the ground it rises in the west and sets in the east twice daily. Tidal forces are dragging it inward by about 1.8 cm a year, and in roughly 50 million years it will either crash into Mars or be torn apart into a ring.',
  stats: [
    { k: 'Mean diameter', v: '22.5 km (irregular)' },
    { k: 'Mass', v: '1.06 × 10¹⁶ kg' },
    { k: 'Surface gravity', v: '0.0057 m/s² (~1/1700 Earth)' },
    { k: 'Distance from Mars', v: '9,376 km (centre to centre)' },
    { k: 'Orbital period', v: '7 h 39 min' },
    { k: 'Rotation', v: 'Tidally locked' },
    { k: 'Discovery', v: 'Asaph Hall, 1877' },
  ],
  facts: [
    'It orbits faster than Mars rotates — rising in the west, twice a day.',
    'Stickney crater is 9 km wide, nearly half the width of the moon itself.',
    'Escape velocity is only about 41 km/h — you could almost jump off.',
    'Long grooves across its surface may be stress fractures from tidal strain.',
    'It will break apart or impact Mars within about 50 million years.',
  ],
  exploration: [
    'Mariner 9 (1971) — first detailed images.',
    'Mars Express has made repeated close flybys since 2004.',
    'JAXA’s MMX mission plans to land and return a sample in the 2030s.',
  ],
  highlights: [
    { id: 'craters', title: 'Stickney crater', desc: 'The huge impact scar and grooved terrain', camDir: 'detail' },
    { id: 'lit', title: 'Sunlit side', desc: 'The irregular, unrounded shape in full light', camDir: 'lit' },
  ],
  sources: ['NASA Phobos overview', 'Procedural surface (illustrative)'],
  more: [{ t: 'NASA · Phobos', u: 'https://science.nasa.gov/mars/moons/phobos/' }],
};

const DEIMOS: BodyConfig = {
  id: 'deimos', name: 'Deimos', latin: 'Mars II', type: 'moon', kind: 'Moon', of: 'mars',
  R: 0.05, orbitD: 1.75, T: 2.3, locked: true, dia: '12.4 km (15 × 12 × 11 km)', au: '23,463 km from Mars',
  proc: { style: 'cratered', base: '#8a7d70', accent: '#463c33', craters: 120, seed: 7703 }, tiers: ['standard'],
  brief: 'The smaller, smoother and more distant Martian moon.',
  intro: 'Deimos is the outer and much smaller of Mars’ moons, only about 12 km across. Unlike the heavily grooved Phobos, its surface looks smoother because a thick blanket of dust and regolith has partially buried its craters. Seen from the Martian surface it is barely brighter than Venus appears from Earth, and it takes over two days to drift across the sky.',
  stats: [
    { k: 'Mean diameter', v: '12.4 km (irregular)' },
    { k: 'Mass', v: '1.5 × 10¹⁵ kg' },
    { k: 'Surface gravity', v: '0.003 m/s²' },
    { k: 'Distance from Mars', v: '23,463 km' },
    { k: 'Orbital period', v: '30.3 hours' },
    { k: 'Rotation', v: 'Tidally locked' },
    { k: 'Discovery', v: 'Asaph Hall, 1877 (days before Phobos)' },
  ],
  facts: [
    'Its name means “dread” — Phobos means “fear”, both sons of Ares.',
    'Regolith up to 100 m thick smooths over most of its craters.',
    'It is slowly spiralling outward, away from Mars.',
    'From Mars it looks like a bright star, not a disc.',
    'Both Martian moons may be captured asteroids — or impact debris.',
  ],
  exploration: [
    'Viking 2 (1977) — first close-up images.',
    'Mars Reconnaissance Orbiter captured colour views in 2009.',
    'UAE’s Hope orbiter made close observations in 2023.',
  ],
  highlights: [
    { id: 'lit', title: 'Smooth regolith', desc: 'The dust-blanketed, softened surface', camDir: 'lit' },
    { id: 'detail', title: 'Close approach', desc: 'A close pass over the small, irregular body', camDir: 'detail' },
  ],
  sources: ['NASA Deimos overview', 'Procedural surface (illustrative)'],
  more: [{ t: 'NASA · Deimos', u: 'https://science.nasa.gov/mars/moons/deimos/' }],
};

const IO: BodyConfig = {
  id: 'io', name: 'Io', latin: 'Jupiter I', type: 'moon', kind: 'Moon', of: 'jupiter',
  R: 0.26, orbitD: 7.3, T: 3, locked: true, dia: '3,643 km', au: '421,700 km from Jupiter',
  texStd: 'io', tiers: ['standard'],
  brief: 'The most volcanically active world in the Solar System.',
  intro: 'Io is squeezed relentlessly between Jupiter’s enormous gravity and the tug of Europa and Ganymede, and that tidal kneading melts its interior. The result is over 400 active volcanoes, some throwing plumes 300 km into space, and a surface repaved so often by sulfur compounds that it has essentially no impact craters. Its lava reaches 1,600 °C, hotter than anything erupting on Earth today.',
  stats: [
    { k: 'Diameter', v: '3,643 km (slightly larger than our Moon)' },
    { k: 'Mass', v: '8.93 × 10²² kg' },
    { k: 'Surface gravity', v: '1.80 m/s²' },
    { k: 'Distance from Jupiter', v: '421,700 km' },
    { k: 'Orbital period', v: '1.77 Earth days' },
    { k: 'Rotation', v: 'Tidally locked' },
    { k: 'Surface temp.', v: '−143 °C (lava up to 1,600 °C)' },
    { k: 'Discovery', v: 'Galileo Galilei, 1610' },
  ],
  facts: [
    'More than 400 active volcanoes make it the most geologically active body known.',
    'Tidal flexing raises its solid surface by up to 100 metres.',
    'Loki Patera is a lava lake roughly 200 km across.',
    'It loses a tonne of material to space every second, feeding a plasma torus.',
    'Its yellow-orange colours come from sulfur and sulfur dioxide frost.',
  ],
  exploration: [
    'Voyager 1 (1979) — discovered active volcanism, the first seen off Earth.',
    'Galileo orbiter made repeated close flybys in the 1990s.',
    'Juno flew within 1,500 km in December 2023, returning the sharpest images yet.',
  ],
  highlights: [
    { id: 'volcanoes', title: 'Volcanic surface', desc: 'Sulfur plains and dark volcanic vents', camDir: 'lit' },
    { id: 'detail', title: 'Close pass', desc: 'Surface detail from close range', camDir: 'detail' },
  ],
  sources: ['NASA Io overview', 'SolarSystemScope texture'],
  more: [{ t: 'NASA · Io', u: 'https://science.nasa.gov/jupiter/moons/io/' }],
};

const EUROPA: BodyConfig = {
  id: 'europa', name: 'Europa', latin: 'Jupiter II', type: 'moon', kind: 'Moon', of: 'jupiter',
  R: 0.22, orbitD: 8.2, T: 4, locked: true, dia: '3,122 km', au: '671,000 km from Jupiter',
  texStd: 'europa', tiers: ['standard'],
  brief: 'A cracked ice shell hiding a global ocean.',
  intro: 'Europa is the smoothest solid body in the Solar System, wrapped in an ice shell criss-crossed by reddish fractures. Beneath that crust lies a salty ocean perhaps 100 km deep, holding roughly twice as much liquid water as all of Earth’s oceans combined. With water, chemistry and tidal heat all present, it is one of the most promising places to search for life beyond Earth.',
  stats: [
    { k: 'Diameter', v: '3,122 km (slightly smaller than our Moon)' },
    { k: 'Mass', v: '4.80 × 10²² kg' },
    { k: 'Surface gravity', v: '1.31 m/s²' },
    { k: 'Distance from Jupiter', v: '671,000 km' },
    { k: 'Orbital period', v: '3.55 Earth days' },
    { k: 'Rotation', v: 'Tidally locked' },
    { k: 'Surface temp.', v: '−160 °C to −220 °C' },
    { k: 'Discovery', v: 'Galileo Galilei, 1610' },
  ],
  facts: [
    'Its subsurface ocean may hold twice the water of all Earth’s oceans.',
    'The ice shell is estimated to be 15–25 km thick.',
    'Almost no craters — the surface is under 100 million years old.',
    'Hubble has spotted possible water vapour plumes venting from the south.',
    'Reddish streaks are probably salts irradiated by Jupiter’s radiation belts.',
  ],
  exploration: [
    'Galileo (1995–2003) — magnetometer data revealed the buried ocean.',
    'Europa Clipper (launched Oct 2024) — arrives 2030 for ~49 close flybys.',
    'ESA’s JUICE will also study Europa before settling at Ganymede.',
  ],
  highlights: [
    { id: 'lineae', title: 'Ice fractures', desc: 'The web of reddish cracks across the shell', camDir: 'lit' },
    { id: 'detail', title: 'Chaos terrain', desc: 'Broken and refrozen blocks of ice up close', camDir: 'detail' },
  ],
  sources: ['NASA Europa overview', 'SolarSystemScope texture'],
  more: [{ t: 'NASA · Europa', u: 'https://science.nasa.gov/jupiter/moons/europa/' }],
};

const GANYMEDE: BodyConfig = {
  id: 'ganymede', name: 'Ganymede', latin: 'Jupiter III', type: 'moon', kind: 'Moon', of: 'jupiter',
  R: 0.38, orbitD: 9.3, T: 6, locked: true, dia: '5,268 km', au: '1,070,400 km from Jupiter',
  texStd: 'ganymede', tiers: ['standard'],
  brief: 'The largest moon in the Solar System — bigger than Mercury.',
  intro: 'Ganymede is the biggest and most massive moon in the Solar System, larger than the planet Mercury. It is also the only moon known to generate its own magnetic field, produced by a molten iron core, which creates shimmering aurorae over its poles. Its surface mixes dark, ancient cratered ground with younger bright terrain carved into long grooves, and a salty ocean is thought to lie roughly 150 km down.',
  stats: [
    { k: 'Diameter', v: '5,268 km — larger than Mercury' },
    { k: 'Mass', v: '1.48 × 10²³ kg' },
    { k: 'Surface gravity', v: '1.43 m/s²' },
    { k: 'Distance from Jupiter', v: '1,070,400 km' },
    { k: 'Orbital period', v: '7.15 Earth days' },
    { k: 'Rotation', v: 'Tidally locked' },
    { k: 'Surface temp.', v: '−163 °C average' },
    { k: 'Discovery', v: 'Galileo Galilei, 1610' },
  ],
  facts: [
    'It is the only moon with its own internally generated magnetic field.',
    'If it orbited the Sun directly, it would qualify as a planet.',
    'A subsurface saltwater ocean may lie about 150 km beneath the ice.',
    'Grooved terrain records ancient tectonic stretching of the crust.',
    'It has a thin oxygen exosphere, far too sparse to breathe.',
  ],
  exploration: [
    'Voyager 1 & 2 (1979) — first detailed views.',
    'Galileo (1996) — discovered its magnetic field.',
    'ESA’s JUICE arrives in 2031 and will orbit Ganymede from 2034.',
  ],
  highlights: [
    { id: 'grooves', title: 'Grooved terrain', desc: 'Bright ridged bands cutting through dark crust', camDir: 'lit' },
    { id: 'detail', title: 'Surface detail', desc: 'Craters and ridges from close range', camDir: 'detail' },
  ],
  sources: ['NASA Ganymede overview', 'SolarSystemScope texture'],
  more: [{ t: 'NASA · Ganymede', u: 'https://science.nasa.gov/jupiter/moons/ganymede/' }],
};

const CALLISTO: BodyConfig = {
  id: 'callisto', name: 'Callisto', latin: 'Jupiter IV', type: 'moon', kind: 'Moon', of: 'jupiter',
  R: 0.34, orbitD: 10.7, T: 9, locked: true, dia: '4,821 km', au: '1,882,700 km from Jupiter',
  texStd: 'callisto', tiers: ['standard'],
  brief: 'The most heavily cratered object known.',
  intro: 'Callisto is the outermost Galilean moon and the most thoroughly cratered world ever surveyed — its surface is so saturated with impacts that new craters can only erase old ones. Almost no geological activity has resurfaced it in four billion years, making it a preserved record of the early Solar System. Orbiting beyond the worst of Jupiter’s radiation belts, it is often proposed as the safest base for future crewed missions in the Jovian system.',
  stats: [
    { k: 'Diameter', v: '4,821 km (about 99% of Mercury)' },
    { k: 'Mass', v: '1.08 × 10²³ kg' },
    { k: 'Surface gravity', v: '1.24 m/s²' },
    { k: 'Distance from Jupiter', v: '1,882,700 km' },
    { k: 'Orbital period', v: '16.7 Earth days' },
    { k: 'Rotation', v: 'Tidally locked' },
    { k: 'Surface temp.', v: '−139 °C average' },
    { k: 'Discovery', v: 'Galileo Galilei, 1610' },
  ],
  facts: [
    'Its surface is the oldest and most cratered in the Solar System.',
    'Valhalla is a multi-ring impact structure about 3,800 km across.',
    'It sits outside Jupiter’s harshest radiation, unlike the inner moons.',
    'It is the only Galilean moon not locked in the Laplace resonance.',
    'A subsurface ocean may exist beneath roughly 100 km of ice.',
  ],
  exploration: [
    'Voyager flybys (1979) mapped much of the surface.',
    'Galileo made eight close passes between 1996 and 2001.',
    'JUICE will perform 21 flybys in the 2030s.',
  ],
  highlights: [
    { id: 'valhalla', title: 'Impact scars', desc: 'The saturated, ancient cratered surface', camDir: 'lit' },
    { id: 'terminator', title: 'Terminator', desc: 'Craters thrown into relief at the day–night line', camDir: 'terminator' },
  ],
  sources: ['NASA Callisto overview', 'SolarSystemScope texture'],
  more: [{ t: 'NASA · Callisto', u: 'https://science.nasa.gov/jupiter/moons/callisto/' }],
};

const MIMAS: BodyConfig = {
  id: 'mimas', name: 'Mimas', latin: 'Saturn I', type: 'moon', kind: 'Moon', of: 'saturn',
  R: 0.10, orbitD: 12.0, T: 2.2, locked: true, dia: '396 km', au: '185,500 km from Saturn',
  proc: { style: 'cratered', base: '#c3c6c9', accent: '#5d6166', craters: 240, seed: 2211 }, tiers: ['standard'],
  brief: 'The small icy moon with one enormous crater.',
  intro: 'Mimas is dominated by Herschel, an impact crater 130 km wide — a third of the moon’s own diameter — with a central peak as tall as Everest. The impact that made it very nearly shattered the moon, and fractures on the far side may be shockwaves from the same event. The resemblance to a certain fictional battle station is entirely coincidental, though unmistakable. Recent analysis of its wobble suggests a young ocean may lie beneath the ice.',
  stats: [
    { k: 'Diameter', v: '396 km' },
    { k: 'Mass', v: '3.75 × 10¹⁹ kg' },
    { k: 'Surface gravity', v: '0.064 m/s²' },
    { k: 'Distance from Saturn', v: '185,500 km' },
    { k: 'Orbital period', v: '22.6 hours' },
    { k: 'Rotation', v: 'Tidally locked' },
    { k: 'Surface temp.', v: '−200 °C' },
    { k: 'Discovery', v: 'William Herschel, 1789' },
  ],
  facts: [
    'Herschel crater is 130 km wide — a third of the moon’s diameter.',
    'It is the smallest known body rounded by its own gravity.',
    'A 2024 study suggests a liquid ocean only 5–15 million years old.',
    'Its gravity carves the Cassini Division in Saturn’s rings.',
    'It is made almost entirely of water ice.',
  ],
  exploration: [
    'Voyager 1 (1980) — discovered the giant Herschel crater.',
    'Cassini imaged it repeatedly, closest pass 9,500 km in 2010.',
  ],
  highlights: [
    { id: 'herschel', title: 'Herschel crater', desc: 'The vast crater and its central peak', camDir: 'lit' },
    { id: 'terminator', title: 'Terminator', desc: 'Deep shadows along the day–night line', camDir: 'terminator' },
  ],
  sources: ['NASA Mimas overview', 'Procedural surface (illustrative)'],
  more: [{ t: 'NASA · Mimas', u: 'https://science.nasa.gov/saturn/moons/mimas/' }],
};

const ENCELADUS: BodyConfig = {
  id: 'enceladus', name: 'Enceladus', latin: 'Saturn II', type: 'moon', kind: 'Moon', of: 'saturn',
  R: 0.115, orbitD: 12.6, T: 2.8, locked: true, dia: '504 km', au: '238,000 km from Saturn',
  proc: { style: 'icy', base: '#eef1f4', accent: '#9aa6b2', craters: 70, seed: 3312 }, tiers: ['standard'],
  brief: 'A tiny moon venting water into space.',
  intro: 'Enceladus is barely 500 km across, yet it is one of the most exciting places in the Solar System. From four great fractures near its south pole — the “tiger stripes” — more than a hundred geysers blast water vapour and ice grains hundreds of kilometres into space, feeding Saturn’s E ring. Cassini flew directly through those plumes and tasted the ocean below, finding salts, silica and organic molecules, plus phosphates essential for life as we know it.',
  stats: [
    { k: 'Diameter', v: '504 km' },
    { k: 'Mass', v: '1.08 × 10²⁰ kg' },
    { k: 'Surface gravity', v: '0.113 m/s²' },
    { k: 'Distance from Saturn', v: '238,000 km' },
    { k: 'Orbital period', v: '1.37 Earth days' },
    { k: 'Rotation', v: 'Tidally locked' },
    { k: 'Surface temp.', v: '−201 °C' },
    { k: 'Discovery', v: 'William Herschel, 1789' },
  ],
  facts: [
    'It is the most reflective body in the Solar System, bouncing back ~90% of light.',
    'Over 100 geysers erupt from the south polar “tiger stripes”.',
    'Its plumes create and replenish Saturn’s faint E ring.',
    'A global ocean lies beneath 20–25 km of ice.',
    'Cassini detected phosphates — a key ingredient for life — in the plume.',
  ],
  exploration: [
    'Voyager flybys (1980–81) revealed a strangely smooth, bright surface.',
    'Cassini (2005–2017) discovered the plumes and flew through them repeatedly.',
    'An Enceladus orbiter/lander is a high priority for future missions.',
  ],
  highlights: [
    { id: 'tiger', title: 'South polar terrain', desc: 'The fractured region feeding the geysers', camDir: 'polar' },
    { id: 'lit', title: 'Brilliant ice', desc: 'The most reflective surface in the Solar System', camDir: 'lit' },
  ],
  sources: ['NASA Enceladus overview', 'Procedural surface (illustrative)'],
  more: [{ t: 'NASA · Enceladus', u: 'https://science.nasa.gov/saturn/moons/enceladus/' }],
};

const RHEA: BodyConfig = {
  id: 'rhea', name: 'Rhea', latin: 'Saturn V', type: 'moon', kind: 'Moon', of: 'saturn',
  R: 0.19, orbitD: 13.4, T: 4.2, locked: true, dia: '1,527 km', au: '527,000 km from Saturn',
  proc: { style: 'cratered', base: '#d2d5d8', accent: '#6b7076', craters: 260, seed: 4413 }, tiers: ['standard'],
  brief: 'Saturn’s second-largest moon — a battered ball of ice.',
  intro: 'Rhea is a dirty snowball roughly three quarters water ice and one quarter rock, and its ancient surface is crowded with craters. Bright wispy streaks across its trailing hemisphere turned out to be networks of ice cliffs, not frost. It carries an extremely thin oxygen and carbon-dioxide exosphere, created as Saturn’s radiation belts sputter molecules off the icy ground.',
  stats: [
    { k: 'Diameter', v: '1,527 km' },
    { k: 'Mass', v: '2.31 × 10²¹ kg' },
    { k: 'Surface gravity', v: '0.264 m/s²' },
    { k: 'Distance from Saturn', v: '527,000 km' },
    { k: 'Orbital period', v: '4.52 Earth days' },
    { k: 'Rotation', v: 'Tidally locked' },
    { k: 'Surface temp.', v: '−174 °C to −220 °C' },
    { k: 'Discovery', v: 'Giovanni Cassini, 1672' },
  ],
  facts: [
    'It is about three-quarters water ice by mass.',
    'The bright “wispy” markings are tectonic ice cliffs, some 4 km high.',
    'It has a tenuous oxygen–carbon dioxide exosphere.',
    'Hints of a faint ring system around Rhea remain unconfirmed.',
    'Its heavily cratered surface suggests little geological activity.',
  ],
  exploration: [
    'Voyager 1 (1980) — first close images.',
    'Cassini made several targeted flybys, closest 100 km in 2005.',
  ],
  highlights: [
    { id: 'wisps', title: 'Ice cliffs', desc: 'Bright fracture walls on the trailing side', camDir: 'lit' },
    { id: 'terminator', title: 'Crater relief', desc: 'Craters in sharp relief at the terminator', camDir: 'terminator' },
  ],
  sources: ['NASA Rhea overview', 'Procedural surface (illustrative)'],
  more: [{ t: 'NASA · Rhea', u: 'https://science.nasa.gov/saturn/moons/rhea/' }],
};

const TITAN: BodyConfig = {
  id: 'titan', name: 'Titan', latin: 'Saturn VI', type: 'moon', kind: 'Moon', of: 'saturn',
  R: 0.36, orbitD: 14.6, T: 7, locked: true, dia: '5,150 km', au: '1,221,900 km from Saturn',
  proc: { style: 'haze', base: '#d9a54e', accent: '#7d4a1c', seed: 6614 }, tiers: ['standard'],
  brief: 'The only moon with a thick atmosphere — and liquid seas.',
  intro: 'Titan is the second-largest moon in the Solar System and the only one with a substantial atmosphere: a nitrogen haze 50% denser at the surface than Earth’s air. It is the only world besides Earth where stable liquid pools on the surface — not water, but lakes and seas of liquid methane and ethane, fed by rain and drained by rivers. Beneath its icy crust lies a water ocean, making it a target for both chemistry and astrobiology.',
  stats: [
    { k: 'Diameter', v: '5,150 km — larger than Mercury' },
    { k: 'Mass', v: '1.35 × 10²³ kg' },
    { k: 'Surface gravity', v: '1.35 m/s²' },
    { k: 'Distance from Saturn', v: '1,221,900 km' },
    { k: 'Orbital period', v: '15.95 Earth days' },
    { k: 'Rotation', v: 'Tidally locked' },
    { k: 'Surface temp.', v: '−179 °C' },
    { k: 'Surface pressure', v: '1.45 bar (1.45× Earth)' },
    { k: 'Atmosphere', v: '95% nitrogen, 5% methane' },
    { k: 'Discovery', v: 'Christiaan Huygens, 1655' },
  ],
  facts: [
    'It is the only moon with a dense atmosphere, and it is nitrogen-rich like ours.',
    'Kraken Mare is a methane sea larger than the Caspian Sea.',
    'It rains liquid methane, carving rivers and filling lakes.',
    'Low gravity plus thick air means a human could fly by flapping wings.',
    'A subsurface water ocean likely lies beneath about 100 km of ice.',
  ],
  exploration: [
    'Huygens probe (14 Jan 2005) — the most distant landing ever achieved.',
    'Cassini mapped the surface by radar through the haze, 2004–2017.',
    'Dragonfly — a NASA rotorcraft due to launch in 2028 and arrive in 2034.',
  ],
  highlights: [
    { id: 'haze', title: 'Orange haze', desc: 'The thick photochemical smog layer', camDir: 'lit' },
    { id: 'limb', title: 'Atmospheric limb', desc: 'Haze layers stacked above the limb', camDir: 'limb' },
  ],
  sources: ['NASA Titan overview', 'Procedural surface (illustrative)'],
  more: [{ t: 'NASA · Titan', u: 'https://science.nasa.gov/saturn/moons/titan/' }],
};

const IAPETUS: BodyConfig = {
  id: 'iapetus', name: 'Iapetus', latin: 'Saturn VIII', type: 'moon', kind: 'Moon', of: 'saturn',
  R: 0.185, orbitD: 16.2, T: 12, locked: true, dia: '1,469 km', au: '3,560,800 km from Saturn',
  proc: { style: 'twotone', base: '#cfd2d6', accent: '#4a3a2c', craters: 170, seed: 8815 }, tiers: ['standard'],
  brief: 'Half soot-black, half snow-white — and ridged like a walnut.',
  intro: 'Iapetus has puzzled astronomers since 1671, when Cassini noticed it vanished on one side of its orbit. One hemisphere is as dark as coal, the other as bright as snow. The dark material is dust swept up from the outer moon Phoebe, which warms that side enough for its ice to sublimate away. Stranger still, a ridge of mountains up to 20 km high runs almost exactly along its equator, giving the moon a walnut-like profile.',
  stats: [
    { k: 'Diameter', v: '1,469 km' },
    { k: 'Mass', v: '1.81 × 10²¹ kg' },
    { k: 'Surface gravity', v: '0.223 m/s²' },
    { k: 'Distance from Saturn', v: '3,560,800 km' },
    { k: 'Orbital period', v: '79.3 Earth days' },
    { k: 'Rotation', v: 'Tidally locked' },
    { k: 'Orbital inclination', v: '15.5° — unusually tilted' },
    { k: 'Discovery', v: 'Giovanni Cassini, 1671' },
  ],
  facts: [
    'Its leading side reflects ~4% of light; its trailing side ~60%.',
    'An equatorial ridge up to 20 km tall circles most of the moon.',
    'Cassini deduced its two-tone nature from its changing brightness in 1671.',
    'The dark coating is dust spiralling in from the distant moon Phoebe.',
    'It orbits far outside Saturn’s other major moons, on a tilted path.',
  ],
  exploration: [
    'Voyager 2 (1981) — first resolved images of the two-tone surface.',
    'Cassini flew 1,600 km above it in 2007, revealing the equatorial ridge.',
  ],
  highlights: [
    { id: 'twotone', title: 'Two-tone surface', desc: 'The boundary between dark and bright hemispheres', camDir: 'lit' },
    { id: 'ridge', title: 'Equatorial ridge', desc: 'The walnut ridge seen edge-on', camDir: 'limb' },
  ],
  sources: ['NASA Iapetus overview', 'Procedural surface (illustrative)'],
  more: [{ t: 'NASA · Iapetus', u: 'https://science.nasa.gov/saturn/moons/iapetus/' }],
};

const MIRANDA: BodyConfig = {
  id: 'miranda', name: 'Miranda', latin: 'Uranus V', type: 'moon', kind: 'Moon', of: 'uranus',
  R: 0.085, orbitD: 3.7, T: 2.4, locked: true, dia: '471 km', au: '129,900 km from Uranus',
  proc: { style: 'icy', base: '#b8bcc2', accent: '#4f545b', craters: 120, seed: 9916 }, tiers: ['standard'],
  brief: 'A jumbled patchwork world with the tallest known cliff.',
  intro: 'Miranda is the smallest of Uranus’ five major moons and by far the strangest-looking. Its surface is a chaotic collage of grooved ovals, fault scarps and terrains that appear to have been torn apart and stitched back together. Verona Rupes, a cliff face up to 20 km high, is the tallest known precipice in the Solar System — an object dropped from the top would fall for about twelve minutes.',
  stats: [
    { k: 'Diameter', v: '471 km' },
    { k: 'Mass', v: '6.59 × 10¹⁹ kg' },
    { k: 'Surface gravity', v: '0.079 m/s²' },
    { k: 'Distance from Uranus', v: '129,900 km' },
    { k: 'Orbital period', v: '1.41 Earth days' },
    { k: 'Rotation', v: 'Tidally locked' },
    { k: 'Surface temp.', v: '−187 °C' },
    { k: 'Discovery', v: 'Gerard Kuiper, 1948' },
  ],
  facts: [
    'Verona Rupes is up to 20 km tall — the highest known cliff anywhere.',
    'Its surface mixes terrain types that look violently mismatched.',
    'It may have been shattered by impact and reassembled in orbit.',
    'Giant grooved ovals called coronae span up to 300 km.',
    'Voyager 2 came within 29,000 km of it in 1986.',
  ],
  exploration: [
    'Voyager 2 (1986) — the only spacecraft ever to image it closely.',
  ],
  highlights: [
    { id: 'chaos', title: 'Patchwork terrain', desc: 'Mismatched surface regions side by side', camDir: 'lit' },
    { id: 'cliff', title: 'Verona Rupes', desc: 'The towering cliff seen near the limb', camDir: 'limb' },
  ],
  sources: ['NASA Miranda overview', 'Procedural surface (illustrative)'],
  more: [{ t: 'NASA · Miranda', u: 'https://science.nasa.gov/uranus/moons/miranda/' }],
};

const ARIEL: BodyConfig = {
  id: 'ariel', name: 'Ariel', latin: 'Uranus I', type: 'moon', kind: 'Moon', of: 'uranus',
  R: 0.14, orbitD: 4.3, T: 3.2, locked: true, dia: '1,158 km', au: '190,900 km from Uranus',
  proc: { style: 'icy', base: '#cdd2d7', accent: '#5a6067', craters: 150, seed: 1017 }, tiers: ['standard'],
  brief: 'The brightest and youngest-looking Uranian moon.',
  intro: 'Ariel has the brightest and apparently youngest surface of Uranus’ major moons. Broad rift valleys hundreds of kilometres long cut across it, their floors flooded by what may once have been flows of icy slush. Relatively few large craters survive, implying that internal activity resurfaced it long after it formed — possibly driven by tidal heating during an earlier orbital resonance.',
  stats: [
    { k: 'Diameter', v: '1,158 km' },
    { k: 'Mass', v: '1.25 × 10²¹ kg' },
    { k: 'Surface gravity', v: '0.269 m/s²' },
    { k: 'Distance from Uranus', v: '190,900 km' },
    { k: 'Orbital period', v: '2.52 Earth days' },
    { k: 'Rotation', v: 'Tidally locked' },
    { k: 'Surface temp.', v: '−213 °C' },
    { k: 'Discovery', v: 'William Lassell, 1851' },
  ],
  facts: [
    'It reflects more light than any other major moon of Uranus.',
    'Huge canyons, or chasmata, stretch for hundreds of kilometres.',
    'Its scarcity of large craters points to relatively recent resurfacing.',
    'Carbon dioxide ice concentrates on its trailing hemisphere.',
    'It is named after a spirit in Shakespeare’s The Tempest.',
  ],
  exploration: [
    'Voyager 2 (1986) — imaged roughly 35% of the surface, the only close look.',
  ],
  highlights: [
    { id: 'canyons', title: 'Rift valleys', desc: 'Long canyon systems across the icy crust', camDir: 'lit' },
    { id: 'terminator', title: 'Terminator', desc: 'Relief along the day–night boundary', camDir: 'terminator' },
  ],
  sources: ['NASA Ariel overview', 'Procedural surface (illustrative)'],
  more: [{ t: 'NASA · Ariel', u: 'https://science.nasa.gov/uranus/moons/ariel/' }],
};

const TITANIA: BodyConfig = {
  id: 'titania', name: 'Titania', latin: 'Uranus III', type: 'moon', kind: 'Moon', of: 'uranus',
  R: 0.19, orbitD: 5.0, T: 5, locked: true, dia: '1,578 km', au: '435,900 km from Uranus',
  proc: { style: 'cratered', base: '#bfc2c6', accent: '#585c61', craters: 200, seed: 1118 }, tiers: ['standard'],
  brief: 'The largest moon of Uranus, scarred by immense canyons.',
  intro: 'Titania is the largest of Uranus’ moons, a mix of roughly equal parts ice and rock. Its most dramatic feature is Messina Chasmata, a canyon system running some 1,500 km — comparable in length to the distance across Europe. Fault scarps and relatively few large craters suggest the crust was stretched and partly resurfaced after an early period of heavy bombardment.',
  stats: [
    { k: 'Diameter', v: '1,578 km' },
    { k: 'Mass', v: '3.40 × 10²¹ kg' },
    { k: 'Surface gravity', v: '0.367 m/s²' },
    { k: 'Distance from Uranus', v: '435,900 km' },
    { k: 'Orbital period', v: '8.71 Earth days' },
    { k: 'Rotation', v: 'Tidally locked' },
    { k: 'Surface temp.', v: '−203 °C' },
    { k: 'Discovery', v: 'William Herschel, 1787' },
  ],
  facts: [
    'Messina Chasmata stretches roughly 1,500 km across the surface.',
    'It is the eighth-largest moon in the Solar System.',
    'Its interior may hold a thin liquid-water layer at the core boundary.',
    'A tenuous carbon-dioxide atmosphere may come and go seasonally.',
    'Named after the queen of the fairies in A Midsummer Night’s Dream.',
  ],
  exploration: [
    'Voyager 2 (1986) — the single flyby that mapped its southern hemisphere.',
  ],
  highlights: [
    { id: 'chasma', title: 'Messina Chasmata', desc: 'The vast canyon system across the crust', camDir: 'lit' },
    { id: 'detail', title: 'Surface detail', desc: 'Craters and fault scarps up close', camDir: 'detail' },
  ],
  sources: ['NASA Titania overview', 'Procedural surface (illustrative)'],
  more: [{ t: 'NASA · Titania', u: 'https://science.nasa.gov/uranus/moons/titania/' }],
};

const OBERON: BodyConfig = {
  id: 'oberon', name: 'Oberon', latin: 'Uranus IV', type: 'moon', kind: 'Moon', of: 'uranus',
  R: 0.18, orbitD: 5.7, T: 6.4, locked: true, dia: '1,523 km', au: '583,500 km from Uranus',
  proc: { style: 'cratered', base: '#a8a49f', accent: '#4a423a', craters: 250, seed: 1219 }, tiers: ['standard'],
  brief: 'The outermost major Uranian moon, dark and ancient.',
  intro: 'Oberon is the outermost of Uranus’ five large moons and the most heavily cratered, its surface preserved almost unchanged since the era of heavy bombardment. Many of its craters have unusually dark floors, probably material that welled up from below after the impacts. A lone mountain about 11 km high was caught in silhouette on the limb by Voyager 2.',
  stats: [
    { k: 'Diameter', v: '1,523 km' },
    { k: 'Mass', v: '3.08 × 10²¹ kg' },
    { k: 'Surface gravity', v: '0.346 m/s²' },
    { k: 'Distance from Uranus', v: '583,500 km' },
    { k: 'Orbital period', v: '13.46 Earth days' },
    { k: 'Rotation', v: 'Tidally locked' },
    { k: 'Surface temp.', v: '−203 °C' },
    { k: 'Discovery', v: 'William Herschel, 1787' },
  ],
  facts: [
    'It is the most heavily cratered of the Uranian moons.',
    'Dark deposits line the floors of many large craters.',
    'An 11 km mountain was spotted on its limb by Voyager 2.',
    'It is the second-largest and second-most-massive moon of Uranus.',
    'Named after the king of the fairies in A Midsummer Night’s Dream.',
  ],
  exploration: [
    'Voyager 2 (1986) — the only spacecraft to observe it up close.',
  ],
  highlights: [
    { id: 'craters', title: 'Dark crater floors', desc: 'Ancient craters with dark deposits', camDir: 'lit' },
    { id: 'terminator', title: 'Terminator', desc: 'Crater rims catching the low sun', camDir: 'terminator' },
  ],
  sources: ['NASA Oberon overview', 'Procedural surface (illustrative)'],
  more: [{ t: 'NASA · Oberon', u: 'https://science.nasa.gov/uranus/moons/oberon/' }],
};

const TRITON: BodyConfig = {
  id: 'triton', name: 'Triton', latin: 'Neptune I', type: 'moon', kind: 'Moon', of: 'neptune',
  R: 0.22, orbitD: 4.4, T: 4.5, locked: true, retrograde: true, dia: '2,707 km', au: '354,800 km from Neptune',
  proc: { style: 'streaked', base: '#d8cfc4', accent: '#8a7f72', seed: 1320 }, tiers: ['standard'],
  brief: 'A captured world orbiting backwards, with nitrogen geysers.',
  intro: 'Triton is the only large moon in the Solar System that orbits backwards relative to its planet’s spin — powerful evidence that Neptune captured it from the Kuiper Belt rather than forming it in place. At −235 °C its surface is among the coldest ever measured, yet it is far from dead: Voyager 2 photographed plumes of nitrogen gas shooting 8 km high, and its “cantaloupe” terrain shows signs of repeated resurfacing.',
  stats: [
    { k: 'Diameter', v: '2,707 km' },
    { k: 'Mass', v: '2.14 × 10²² kg' },
    { k: 'Surface gravity', v: '0.779 m/s²' },
    { k: 'Distance from Neptune', v: '354,800 km' },
    { k: 'Orbital period', v: '5.88 Earth days (retrograde)' },
    { k: 'Rotation', v: 'Tidally locked' },
    { k: 'Surface temp.', v: '−235 °C — among the coldest known' },
    { k: 'Atmosphere', v: 'Thin nitrogen, ~14 microbar' },
    { k: 'Discovery', v: 'William Lassell, 1846 (17 days after Neptune)' },
  ],
  facts: [
    'It is the only large moon with a retrograde orbit — almost certainly captured.',
    'Nitrogen geysers vent 8 km above the surface, streaking the ground downwind.',
    'Its wrinkled “cantaloupe terrain” appears nowhere else.',
    'It holds 99.5% of all the mass orbiting Neptune.',
    'Tidal drag is pulling it inward; it may break into a ring in ~3.6 billion years.',
  ],
  exploration: [
    'Voyager 2 (1989) — imaged about 40% of the surface, discovering the geysers.',
    'Proposed missions such as Trident would revisit it, none yet approved.',
  ],
  highlights: [
    { id: 'cantaloupe', title: 'Cantaloupe terrain', desc: 'The dimpled, wrinkled icy crust', camDir: 'lit' },
    { id: 'polar', title: 'Polar cap', desc: 'The bright nitrogen frost cap', camDir: 'polar' },
  ],
  sources: ['NASA Triton overview', 'Procedural surface (illustrative)'],
  more: [{ t: 'NASA · Triton', u: 'https://science.nasa.gov/neptune/moons/triton/' }],
};

/* Catalogue order walks outward from the Sun, each planet followed by its moons */
export const BODIES: BodyConfig[] = [
  SUN,
  MERCURY,
  VENUS,
  EARTH, MOON,
  MARS, PHOBOS, DEIMOS,
  JUPITER, IO, EUROPA, GANYMEDE, CALLISTO,
  SATURN, MIMAS, ENCELADUS, RHEA, TITAN, IAPETUS,
  URANUS, MIRANDA, ARIEL, TITANIA, OBERON,
  NEPTUNE, TRITON,
];

export const TILTS: Record<string, number> = { venus: 3, earth: 23.4, mars: 25, jupiter: 3, saturn: 27, uranus: 82, neptune: 28 };
export const SPIN_T: Record<string, number> = { mercury: 24, venus: -30, earth: 10, mars: 10.5, jupiter: 4, saturn: 4.4, uranus: -6, neptune: 5.6, sun: 60 };
export const ORBIT_T: Record<string, number> = { mercury: 10, venus: 15, earth: 20, mars: 25, jupiter: 60, saturn: 80, uranus: 96, neptune: 110 };

export const BODIES_BY_ID: Record<string, BodyConfig> = Object.fromEntries(BODIES.map((b) => [b.id, b]));
export const ORDER = BODIES.map((b) => b.id);
export const PLANET_IDS = BODIES.filter((b) => b.kind === 'Planet').map((b) => b.id);
export const MOONS_OF: Record<string, BodyConfig[]> = BODIES.reduce((acc, b) => {
  if (b.of) (acc[b.of] ||= []).push(b);
  return acc;
}, {} as Record<string, BodyConfig[]>);

/* Selector groups: star, planets, then each planet's moons */
export const GROUPS: [string, string[]][] = [
  ['STAR', ['sun']],
  ['PLANETS', PLANET_IDS],
  ...PLANET_IDS
    .filter((p) => MOONS_OF[p]?.length)
    .map((p) => [
      `MOONS OF ${BODIES_BY_ID[p].name.toUpperCase()}`,
      MOONS_OF[p].map((m) => m.id),
    ] as [string, string[]]),
];
