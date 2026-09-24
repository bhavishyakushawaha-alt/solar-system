// "At a glance" profiles used by the quick info card:
// a short summary, temperature, and an interior cross-section for every body.

export interface Layer {
  name: string;
  r: number;       // outer radius of this layer as a fraction of the body's radius
  color: string;
  note: string;
}

export interface Temperature {
  min: number;     // °C
  max: number;     // °C
  mean: number;    // °C
  where: string;   // what is being measured (surface, cloud tops…)
  note?: string;
  core?: string;
}

export interface Profile {
  type: string;
  glance: string;
  build: string;
  surface: string;   // body colour used for the cutaway
  temp: Temperature;
  gravity: string;
  day: string;
  year: string;
  layers: Layer[];   // ordered inside → outside
}

/* Shared layer colours so the diagrams read consistently */
const C = {
  innerCore: '#f7d774',
  ironCore: '#e8923a',
  rockCore: '#8a6a4a',
  mantle: '#b5532e',
  rockMantle: '#9a6a4f',
  ocean: '#2f6fb0',
  deepIce: '#a9c6dc',
  metallicH: '#7c6fae',
};

export const PROFILES: Record<string, Profile> = {
  sun: {
    type: 'Yellow dwarf star (G2V)',
    glance: 'A giant ball of hot plasma held together by its own gravity. Nuclear fusion in the core turns hydrogen into helium and powers the whole Solar System.',
    build: 'Energy made in the core takes up to ~170,000 years to crawl outward as light, then boils up to the surface by convection.',
    surface: '#f6b24a',
    temp: { min: 5500, max: 5500, mean: 5500, where: 'Photosphere (visible surface)', core: '~15 million °C in the core', note: 'The thin outer corona is even hotter — 1 to 3 million °C.' },
    gravity: '274 m/s² (28× Earth)',
    day: '25–35 days (varies by latitude)',
    year: '~230 million years around the galaxy',
    layers: [
      { name: 'Core', r: 0.25, color: '#fff3b0', note: 'Fusion furnace at ~15 million °C' },
      { name: 'Radiative zone', r: 0.7, color: '#ffcf5a', note: 'Light bounces outward for millennia' },
      { name: 'Convective zone', r: 1.0, color: '#f39a2e', note: 'Plasma rises and sinks like boiling water' },
    ],
  },
  mercury: {
    type: 'Terrestrial (rocky) planet',
    glance: 'A small, dense, airless world covered in craters. With no atmosphere to hold heat, it bakes by day and freezes by night.',
    build: 'Mostly metal: a giant iron core fills most of the planet, wrapped in a thin rocky mantle and crust.',
    surface: '#9a8f86',
    temp: { min: -173, max: 427, mean: 167, where: 'Surface', note: 'The biggest day–night temperature swing of any planet.' },
    gravity: '3.7 m/s² (0.38× Earth)',
    day: '176 Earth days (sunrise to sunrise)',
    year: '88 Earth days',
    layers: [
      { name: 'Solid inner core', r: 0.41, color: C.innerCore, note: 'Solid iron–nickel' },
      { name: 'Liquid outer core', r: 0.83, color: C.ironCore, note: 'Molten iron, makes a weak magnetic field' },
      { name: 'Rocky mantle', r: 0.98, color: C.mantle, note: 'Silicate rock ~400 km thick' },
      { name: 'Crust', r: 1.0, color: '#7d6a5c', note: 'Cratered rock, 25–35 km' },
    ],
  },
  venus: {
    type: 'Terrestrial (rocky) planet',
    glance: 'Earth’s near-twin in size, smothered by a crushing carbon-dioxide atmosphere. A runaway greenhouse effect makes it the hottest planet.',
    build: 'Built much like Earth — an iron core, rocky mantle and basalt crust — but without moving tectonic plates.',
    surface: '#d9b36a',
    temp: { min: 440, max: 480, mean: 464, where: 'Surface', note: 'Almost the same day and night, pole to equator — the thick air spreads the heat everywhere.' },
    gravity: '8.87 m/s² (0.90× Earth)',
    day: '117 Earth days (sunrise to sunrise)',
    year: '225 Earth days',
    layers: [
      { name: 'Iron core', r: 0.5, color: C.ironCore, note: 'Iron–nickel, ~3,000 km radius' },
      { name: 'Rocky mantle', r: 0.99, color: C.mantle, note: 'Hot silicate rock' },
      { name: 'Crust', r: 1.0, color: '#8a6a4a', note: 'Volcanic basalt plains' },
    ],
  },
  earth: {
    type: 'Terrestrial (rocky) planet',
    glance: 'A rocky world with liquid water, a breathable atmosphere and life. Its magnetic field and mild climate make it uniquely habitable.',
    build: 'Four main layers: a solid iron inner core, a liquid outer core, a thick rocky mantle and a thin crust broken into moving plates.',
    surface: '#3b6fb0',
    temp: { min: -89, max: 57, mean: 15, where: 'Surface (record extremes)', core: '~5,200 °C in the inner core', note: 'Record low −89 °C in Antarctica; record high 57 °C in Death Valley.' },
    gravity: '9.81 m/s²',
    day: '24 hours',
    year: '365.25 days',
    layers: [
      { name: 'Inner core', r: 0.19, color: C.innerCore, note: 'Solid iron–nickel, as hot as the Sun’s surface' },
      { name: 'Outer core', r: 0.55, color: C.ironCore, note: 'Liquid iron — its flow makes the magnetic field' },
      { name: 'Mantle', r: 0.99, color: C.mantle, note: 'Slowly flowing hot rock, ~2,900 km thick' },
      { name: 'Crust', r: 1.0, color: '#6b8f4e', note: 'Thin rocky skin, 5–70 km' },
    ],
  },
  moon: {
    type: 'Rocky moon',
    glance: 'An airless, cratered ball of rock that always shows Earth the same face. Its gravity drives our ocean tides.',
    build: 'Layered like a small planet: a tiny iron core, a thick rocky mantle and a pale crust of anorthosite rock.',
    surface: '#a7a39d',
    temp: { min: -247, max: 127, mean: -20, where: 'Surface', note: 'Coldest inside permanently shadowed craters near the poles.' },
    gravity: '1.62 m/s² (0.17× Earth)',
    day: '29.5 Earth days (lunar day)',
    year: '27.3 days around Earth',
    layers: [
      { name: 'Iron core', r: 0.2, color: C.ironCore, note: 'Small, partly molten, ~350 km' },
      { name: 'Partial-melt zone', r: 0.28, color: '#c46a3a', note: 'Soft, partly molten rock' },
      { name: 'Rocky mantle', r: 0.97, color: '#8f6f5a', note: 'Silicate rock' },
      { name: 'Crust', r: 1.0, color: '#bdb8b0', note: 'Bright highlands and dark basalt maria' },
    ],
  },
  mars: {
    type: 'Terrestrial (rocky) planet',
    glance: 'A cold, dusty desert with a thin carbon-dioxide atmosphere. Ancient river valleys show it once had liquid water.',
    build: 'A large liquid iron core, a rocky mantle that once fed giant volcanoes, and a basalt crust coated in rusty dust.',
    surface: '#c1532e',
    temp: { min: -153, max: 20, mean: -63, where: 'Surface', note: 'A summer afternoon at the equator can reach 20 °C; the poles fall to −153 °C.' },
    gravity: '3.72 m/s² (0.38× Earth)',
    day: '24 h 40 min',
    year: '687 Earth days',
    layers: [
      { name: 'Liquid iron core', r: 0.54, color: C.ironCore, note: 'Iron, nickel and sulfur, ~1,830 km radius' },
      { name: 'Mantle', r: 0.985, color: '#b0482a', note: 'Silicate rock, now mostly inactive' },
      { name: 'Crust', r: 1.0, color: '#d06a3c', note: 'Basalt under iron-oxide dust' },
    ],
  },
  phobos: {
    type: 'Small irregular moon',
    glance: 'A lumpy, dark moon only 22 km across that circles Mars three times a day — and is slowly spiralling inward.',
    build: 'Probably a porous “rubble pile”: loosely packed rock with plenty of empty space, under a layer of fine dust.',
    surface: '#7d7168',
    temp: { min: -112, max: -4, mean: -40, where: 'Surface' },
    gravity: '0.0057 m/s² (~1/1700 Earth)',
    day: '7 h 39 min (tidally locked)',
    year: '7 h 39 min around Mars',
    layers: [
      { name: 'Porous rubble', r: 0.95, color: '#6e6259', note: 'Loose rock, ~30% empty space' },
      { name: 'Regolith', r: 1.0, color: '#8f8378', note: 'Fine dust up to ~100 m deep' },
    ],
  },
  deimos: {
    type: 'Small irregular moon',
    glance: 'Mars’ smaller, outer moon, just 12 km across. A thick blanket of dust smooths over its craters.',
    build: 'Like Phobos, most likely a porous pile of carbon-rich rock buried under deep regolith.',
    surface: '#8a7d70',
    temp: { min: -110, max: -20, mean: -40, where: 'Surface (approx.)' },
    gravity: '0.003 m/s²',
    day: '30.3 hours (tidally locked)',
    year: '30.3 hours around Mars',
    layers: [
      { name: 'Porous rock', r: 0.9, color: '#77695c', note: 'Carbon-rich, loosely bound rock' },
      { name: 'Regolith', r: 1.0, color: '#9a8c7e', note: 'Dust blanket up to ~100 m thick' },
    ],
  },
  jupiter: {
    type: 'Gas giant',
    glance: 'The biggest planet: a vast ball of hydrogen and helium with no solid surface, streaked with cloud bands and giant storms.',
    build: 'Hydrogen gas gradually turns to liquid, then to metallic hydrogen, around a fuzzy core of rock and ice.',
    surface: '#c9a57c',
    temp: { min: -160, max: -110, mean: -145, where: 'Cloud tops', core: '~24,000 °C at the centre', note: 'Temperature and pressure climb steadily the deeper you go.' },
    gravity: '24.8 m/s² (2.5× Earth)',
    day: '9 h 56 min',
    year: '11.9 Earth years',
    layers: [
      { name: 'Dilute core', r: 0.2, color: C.rockCore, note: 'Rock and ice mixed with hydrogen' },
      { name: 'Metallic hydrogen', r: 0.78, color: C.metallicH, note: 'Hydrogen crushed into a conducting liquid' },
      { name: 'Liquid hydrogen', r: 0.98, color: '#c2a37a', note: 'Molecular hydrogen and helium' },
      { name: 'Atmosphere', r: 1.0, color: '#e7d2ab', note: 'Ammonia clouds in coloured bands' },
    ],
  },
  io: {
    type: 'Volcanic rocky moon',
    glance: 'The most volcanic place in the Solar System, with hundreds of active volcanoes. Tides from Jupiter keep its insides molten.',
    build: 'An iron core inside a partly molten rocky mantle, capped by a thin crust of lava and sulfur.',
    surface: '#d9c35a',
    temp: { min: -183, max: -130, mean: -143, where: 'Surface', note: 'Volcanic vents reach 1,600 °C — hotter than any lava on Earth today.' },
    gravity: '1.80 m/s²',
    day: '1.77 days (tidally locked)',
    year: '1.77 days around Jupiter',
    layers: [
      { name: 'Iron core', r: 0.52, color: C.ironCore, note: 'Iron and iron sulfide' },
      { name: 'Molten mantle', r: 0.97, color: '#c2482a', note: 'Rock heated by tides, partly molten' },
      { name: 'Sulfur crust', r: 1.0, color: '#e6cf6a', note: 'Lava and sulfur frost, ~30 km' },
    ],
  },
  europa: {
    type: 'Icy ocean moon',
    glance: 'A smooth, ice-covered moon hiding a salty ocean beneath — one of the best places to search for life.',
    build: 'A metal core and rocky mantle, surrounded by a deep liquid-water ocean sealed under a cracked ice shell.',
    surface: '#d8cbb5',
    temp: { min: -220, max: -160, mean: -171, where: 'Surface', note: 'The hidden ocean is thought to sit close to 0 °C.' },
    gravity: '1.31 m/s²',
    day: '3.55 days (tidally locked)',
    year: '3.55 days around Jupiter',
    layers: [
      { name: 'Metal core', r: 0.4, color: C.ironCore, note: 'Iron and nickel' },
      { name: 'Rocky mantle', r: 0.92, color: C.rockMantle, note: 'Silicate rock' },
      { name: 'Liquid ocean', r: 0.987, color: C.ocean, note: 'Salty water, ~60–150 km deep' },
      { name: 'Ice shell', r: 1.0, color: '#e9e2d4', note: 'Frozen crust, ~15–25 km' },
    ],
  },
  ganymede: {
    type: 'Icy moon (largest moon)',
    glance: 'Bigger than Mercury and the only moon with its own magnetic field. A buried ocean may lie deep beneath the ice.',
    build: 'Layered like an onion: iron core, rocky mantle, then thick shells of ice sandwiching a saltwater ocean.',
    surface: '#9b9186',
    temp: { min: -203, max: -121, mean: -163, where: 'Surface' },
    gravity: '1.43 m/s²',
    day: '7.15 days (tidally locked)',
    year: '7.15 days around Jupiter',
    layers: [
      { name: 'Iron core', r: 0.25, color: C.ironCore, note: 'Liquid iron — powers the magnetic field' },
      { name: 'Rocky mantle', r: 0.6, color: C.rockMantle, note: 'Silicate rock' },
      { name: 'Deep ice', r: 0.8, color: C.deepIce, note: 'High-pressure ice' },
      { name: 'Ocean', r: 0.94, color: C.ocean, note: 'Salty water ~150 km down' },
      { name: 'Ice crust', r: 1.0, color: '#cfc6b8', note: 'Dark old ice and bright grooved ice' },
    ],
  },
  callisto: {
    type: 'Icy rocky moon',
    glance: 'An ancient, dark moon covered wall-to-wall in craters. Its surface has barely changed in 4 billion years.',
    build: 'Only partly separated: rock and ice mixed throughout, with a possible ocean beneath a thick icy crust.',
    surface: '#6f665c',
    temp: { min: -193, max: -108, mean: -139, where: 'Surface' },
    gravity: '1.24 m/s²',
    day: '16.7 days (tidally locked)',
    year: '16.7 days around Jupiter',
    layers: [
      { name: 'Rock–ice mix', r: 0.88, color: '#7d6f63', note: 'Compressed rock and ice, poorly separated' },
      { name: 'Possible ocean', r: 0.93, color: C.ocean, note: 'Suspected salty layer' },
      { name: 'Ice crust', r: 1.0, color: '#8a8074', note: 'Heavily cratered ice, ~100 km' },
    ],
  },
  saturn: {
    type: 'Gas giant',
    glance: 'A giant of hydrogen and helium famous for its bright rings. It is so light for its size it would float in water.',
    build: 'Like Jupiter: a gaseous atmosphere over liquid and metallic hydrogen, surrounding a dense rocky core.',
    surface: '#d8c08a',
    temp: { min: -185, max: -122, mean: -178, where: 'Cloud tops', core: '~11,700 °C at the centre' },
    gravity: '10.4 m/s² (1.07× Earth)',
    day: '10 h 34 min',
    year: '29.4 Earth years',
    layers: [
      { name: 'Rocky core', r: 0.2, color: C.rockCore, note: 'Rock and ice, several Earth masses' },
      { name: 'Metallic hydrogen', r: 0.5, color: C.metallicH, note: 'Conducting liquid hydrogen' },
      { name: 'Liquid hydrogen', r: 0.98, color: '#d1b27d', note: 'Molecular hydrogen and helium' },
      { name: 'Atmosphere', r: 1.0, color: '#ecdcb0', note: 'Pale ammonia clouds' },
    ],
  },
  mimas: {
    type: 'Small icy moon',
    glance: 'A small ice moon dominated by one enormous crater. It may hide a surprisingly young ocean.',
    build: 'Mostly water ice around a small rocky core, possibly with a thin ocean deep beneath the crust.',
    surface: '#c3c6c9',
    temp: { min: -209, max: -181, mean: -200, where: 'Surface' },
    gravity: '0.064 m/s²',
    day: '22.6 hours (tidally locked)',
    year: '22.6 hours around Saturn',
    layers: [
      { name: 'Rocky core', r: 0.4, color: '#8a7a6a', note: 'Small silicate core' },
      { name: 'Ice mantle', r: 0.75, color: C.deepIce, note: 'Water ice' },
      { name: 'Possible young ocean', r: 0.87, color: C.ocean, note: 'Suggested by its wobble (2024)' },
      { name: 'Ice shell', r: 1.0, color: '#d8dbde', note: 'Water ice, ~20–30 km' },
    ],
  },
  enceladus: {
    type: 'Icy ocean moon',
    glance: 'A bright, tiny ice moon spraying geysers of water into space from an ocean hidden inside.',
    build: 'A large, porous rocky core wrapped in a global salty ocean, under an ice shell that thins at the south pole.',
    surface: '#eef1f4',
    temp: { min: -240, max: -128, mean: -201, where: 'Surface', note: 'The south-pole “tiger stripe” vents are far warmer, around −93 °C.' },
    gravity: '0.113 m/s²',
    day: '1.37 days (tidally locked)',
    year: '1.37 days around Saturn',
    layers: [
      { name: 'Rocky core', r: 0.75, color: '#7d6a5a', note: 'Porous rock, warmed by tides' },
      { name: 'Global ocean', r: 0.9, color: C.ocean, note: 'Salty water ~10 km deep' },
      { name: 'Ice shell', r: 1.0, color: '#f2f5f8', note: '~20–25 km, thinner at the south pole' },
    ],
  },
  rhea: {
    type: 'Icy moon',
    glance: 'Saturn’s second-largest moon — a heavily cratered ball of ice with a little rock mixed in.',
    build: 'Mostly an even blend of ice and rock, with only a slight concentration of rock toward the centre.',
    surface: '#d2d5d8',
    temp: { min: -220, max: -174, mean: -195, where: 'Surface' },
    gravity: '0.264 m/s²',
    day: '4.52 days (tidally locked)',
    year: '4.52 days around Saturn',
    layers: [
      { name: 'Rock–ice interior', r: 0.9, color: '#9ea3a8', note: '~25% rock mixed through ice' },
      { name: 'Ice crust', r: 1.0, color: '#dde0e3', note: 'Cratered water ice' },
    ],
  },
  titan: {
    type: 'Moon with a thick atmosphere',
    glance: 'The only moon with a dense atmosphere and lakes on its surface — filled with liquid methane, not water.',
    build: 'A rocky core under high-pressure ice and a buried water ocean, capped by an ice crust and orange nitrogen haze.',
    surface: '#d9a54e',
    temp: { min: -183, max: -176, mean: -179, where: 'Surface', note: 'Cold enough for methane to fall as rain and fill seas.' },
    gravity: '1.35 m/s²',
    day: '15.9 days (tidally locked)',
    year: '15.9 days around Saturn',
    layers: [
      { name: 'Rocky core', r: 0.64, color: C.rockCore, note: 'Hydrated silicate rock' },
      { name: 'High-pressure ice', r: 0.8, color: C.deepIce, note: 'Exotic, dense ice' },
      { name: 'Water ocean', r: 0.93, color: C.ocean, note: 'Salty, possibly ammonia-rich' },
      { name: 'Ice crust', r: 1.0, color: '#c8a060', note: 'Ice with methane lakes and dunes' },
    ],
  },
  iapetus: {
    type: 'Icy moon',
    glance: 'A two-faced moon: one side coal-black, the other snow-white, with a mountain ridge running around its equator.',
    build: 'A low-density mix of ice and some rock, dusted on its leading side with dark material from another moon.',
    surface: '#cfd2d6',
    temp: { min: -183, max: -143, mean: -163, where: 'Surface', note: 'The dark side soaks up more sunlight and is noticeably warmer.' },
    gravity: '0.223 m/s²',
    day: '79.3 days (tidally locked)',
    year: '79.3 days around Saturn',
    layers: [
      { name: 'Rock–ice interior', r: 0.93, color: '#a4a7ab', note: 'Mostly ice, some rock' },
      { name: 'Two-tone crust', r: 1.0, color: '#4a3a2c', note: 'Bright ice with a dark dust coating' },
    ],
  },
  uranus: {
    type: 'Ice giant',
    glance: 'A cold, pale-blue giant that spins on its side. Its colour comes from methane gas.',
    build: 'A small rocky core inside a thick, hot, slushy mantle of water, ammonia and methane, under a hydrogen–helium atmosphere.',
    surface: '#9fd6dc',
    temp: { min: -224, max: -190, mean: -197, where: 'Cloud tops', core: '~5,000 °C at the centre', note: 'The coldest planetary atmosphere measured in the Solar System.' },
    gravity: '8.87 m/s² (0.89× Earth)',
    day: '17 h 14 min',
    year: '84 Earth years',
    layers: [
      { name: 'Rocky core', r: 0.2, color: C.rockCore, note: 'Rock and iron' },
      { name: 'Icy mantle', r: 0.75, color: '#3f8fa8', note: 'Hot fluid water, ammonia and methane' },
      { name: 'Atmosphere', r: 1.0, color: '#a8dde2', note: 'Hydrogen, helium and methane' },
    ],
  },
  miranda: {
    type: 'Small icy moon',
    glance: 'A strange patchwork moon with the tallest known cliff in the Solar System.',
    build: 'Mostly ice with some rock — it may have been shattered and pieced back together long ago.',
    surface: '#b8bcc2',
    temp: { min: -213, max: -180, mean: -187, where: 'Surface' },
    gravity: '0.079 m/s²',
    day: '1.41 days (tidally locked)',
    year: '1.41 days around Uranus',
    layers: [
      { name: 'Rock–ice interior', r: 0.85, color: '#8f959c', note: 'Silicate rock mixed with ice' },
      { name: 'Ice crust', r: 1.0, color: '#c7cbd0', note: 'Jumbled, faulted terrain' },
    ],
  },
  ariel: {
    type: 'Icy moon',
    glance: 'The brightest of Uranus’ large moons, cut by long rift valleys.',
    build: 'A rocky core inside an icy mantle and crust, with signs of past internal activity.',
    surface: '#cdd2d7',
    temp: { min: -233, max: -189, mean: -213, where: 'Surface (approx.)' },
    gravity: '0.269 m/s²',
    day: '2.52 days (tidally locked)',
    year: '2.52 days around Uranus',
    layers: [
      { name: 'Rocky core', r: 0.64, color: '#8a7a6a', note: 'Silicate rock' },
      { name: 'Ice mantle', r: 0.96, color: '#b6c7d3', note: 'Water ice' },
      { name: 'Crust', r: 1.0, color: '#dde2e6', note: 'Bright ice with rift valleys' },
    ],
  },
  titania: {
    type: 'Icy moon',
    glance: 'Uranus’ largest moon, split by canyons longer than Europe is wide.',
    build: 'About half rock and half ice: a rocky core, an icy mantle and possibly a thin liquid layer between them.',
    surface: '#bfc2c6',
    temp: { min: -223, max: -184, mean: -203, where: 'Surface (approx.)' },
    gravity: '0.367 m/s²',
    day: '8.71 days (tidally locked)',
    year: '8.71 days around Uranus',
    layers: [
      { name: 'Rocky core', r: 0.66, color: '#8a7a6a', note: '~520 km radius' },
      { name: 'Possible liquid layer', r: 0.7, color: C.ocean, note: 'Suspected thin ocean' },
      { name: 'Ice mantle', r: 0.97, color: '#aebdc9', note: 'Water ice' },
      { name: 'Crust', r: 1.0, color: '#cfd2d6', note: 'Cratered, faulted ice' },
    ],
  },
  oberon: {
    type: 'Icy moon',
    glance: 'The outermost large moon of Uranus — old, dark and heavily cratered.',
    build: 'A rocky core and icy mantle, with dark material welling up onto its crater floors.',
    surface: '#a8a49f',
    temp: { min: -223, max: -187, mean: -203, where: 'Surface (approx.)' },
    gravity: '0.346 m/s²',
    day: '13.5 days (tidally locked)',
    year: '13.5 days around Uranus',
    layers: [
      { name: 'Rocky core', r: 0.63, color: '#7d6d5d', note: 'Silicate rock' },
      { name: 'Ice mantle', r: 0.97, color: '#9fa8b0', note: 'Water ice' },
      { name: 'Crust', r: 1.0, color: '#aaa59f', note: 'Ancient cratered ice' },
    ],
  },
  neptune: {
    type: 'Ice giant',
    glance: 'The windiest planet: a deep-blue ice giant with storms faster than the speed of sound.',
    build: 'Like Uranus: a rocky core, a hot mantle of water, ammonia and methane “ices”, and a hydrogen–helium atmosphere.',
    surface: '#3d6fd6',
    temp: { min: -218, max: -200, mean: -214, where: 'Cloud tops', core: '~5,100 °C at the centre', note: 'Oddly, it gives off 2.6× more heat than it receives from the Sun.' },
    gravity: '11.2 m/s² (1.14× Earth)',
    day: '16 h 6 min',
    year: '164.8 Earth years',
    layers: [
      { name: 'Rocky core', r: 0.25, color: C.rockCore, note: 'Rock and iron, about Earth’s mass' },
      { name: 'Icy mantle', r: 0.75, color: '#2f5fa8', note: 'Hot fluid water, ammonia and methane' },
      { name: 'Atmosphere', r: 1.0, color: '#5b86e0', note: 'Hydrogen, helium and methane' },
    ],
  },
  triton: {
    type: 'Captured icy moon',
    glance: 'A frozen world orbiting backwards — most likely a captured Kuiper Belt object, with geysers of nitrogen.',
    build: 'A large rocky core under an icy mantle that may hide an ocean, topped with a crust of frozen nitrogen.',
    surface: '#d8cfc4',
    temp: { min: -238, max: -233, mean: -235, where: 'Surface', note: 'One of the coldest surfaces ever measured.' },
    gravity: '0.779 m/s²',
    day: '5.88 days (tidally locked)',
    year: '5.88 days around Neptune (backwards)',
    layers: [
      { name: 'Rocky core', r: 0.7, color: '#8a7a6a', note: 'Rock and metal, ~2/3 of its mass' },
      { name: 'Ice mantle', r: 0.93, color: '#8fb4cc', note: 'Water ice, maybe liquid below' },
      { name: 'Nitrogen crust', r: 1.0, color: '#e6ddd2', note: 'Frozen nitrogen and methane' },
    ],
  },
};
