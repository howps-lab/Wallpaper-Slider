import { GalleryItem } from '../types/gallery';

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'neon-city-streets',
    indexStr: '01',
    title: 'NEO-TOKYO SECTOR 07',
    subtitle: 'Rain-slicked autonomous corridor',
    category: 'NEON CITY STREETS',
    image: '/assets/aistudio/urban_neon_tokyo_61783842.jpg',
    video: '/assets/aistudio/urban_neon_tokyo_dreamina_cropped_e04d0c39.mp4',
    accentColor: '#00E5FF',
    secondaryColor: '#00FF85',
    description: 'Autonomous cybernetic law enforcement spinners patrolling the nocturnal rain-slicked thoroughfares of Upper Shinjuku. Volumetric neon billboards cast deep cyan and hot magenta refractions across wet composite pavement.',
    specs: {
      sector: 'SECTOR-07 / SUB-DECK 4',
      coordinates: '35.6895° N, 139.6917° E',
      clearance: 'LEVEL-04 LAW ENFORCEMENT',
      bandwidth: '128.4 TB/S TELEMETRY',
      resolution: '4K DCI // 60 FPS',
      audioFreq: '110 Hz RESONANCE'
    }
  },
  {
    id: 'futuristic-supercars',
    indexStr: '02',
    title: 'APEX VORTEX INTERCEPTOR',
    subtitle: 'Kinetic carbon-fiber hyper-chassis',
    category: 'FUTURISTIC SUPERCARS',
    image: '/images/futuristic_supercars.jpg',
    video: '/videos/futuristic_supercars.mp4',
    accentColor: '#FF9D4D',
    secondaryColor: '#00E5FF',
    description: 'Experimental aerodynamic prototype equipped with active plasma edge runners and magnetic levitation dampeners. Designed for supersonic highway transit through underground pressurized mag-tubes.',
    specs: {
      sector: 'TEST MATRIX // HANGAR 12',
      coordinates: '37.7749° N, 122.4194° W',
      clearance: 'CLASSIFIED PROTOTYPE',
      bandwidth: '256.0 TB/S SENSOR FEED',
      resolution: '4K DCI // 60 FPS',
      audioFreq: '82 Hz LOW RUMBLE'
    }
  },
  {
    id: 'abstract-energy-forms',
    indexStr: '03',
    title: 'CHRONO PLASMA REACTOR',
    subtitle: 'Self-stabilizing quantum confinement',
    category: 'ABSTRACT ENERGY FORMS',
    image: '/images/abstract_energy_forms.jpg',
    video: '/videos/abstract_energy_forms.mp4',
    accentColor: '#00FF85',
    secondaryColor: '#8B5CFF',
    description: 'Zero-point magnetic torus capturing high-energy antimatter plasma. The fluctuating helical filament streams create instantaneous temporal dilation pockets across the magnetic containment cage.',
    specs: {
      sector: 'DEEP LAB // CRADLE-9',
      coordinates: '46.2044° N, 06.1432° E',
      clearance: 'OMEGA ZERO POINT',
      bandwidth: '1.2 PB/S FLUX ARRAY',
      resolution: '4K DCI // 60 FPS',
      audioFreq: '146 Hz PLASMA HUM'
    }
  },
  {
    id: 'cybernetic-architecture',
    indexStr: '04',
    title: 'ARC-7 BRUTALIST MEGASTRUCTURE',
    subtitle: 'Atmospheric terraforming arcology',
    category: 'CYBERNETIC ARCHITECTURE',
    image: '/images/cybernetic_arch.jpg',
    video: '/videos/cybernetic_architecture.mp4',
    accentColor: '#8B5CFF',
    secondaryColor: '#FF3CAC',
    description: 'A 2.4-kilometer high brutalist monolith housing over five million cybernetic citizens. High-altitude skyways connect suspended corporate observation pods piercing through the smog-shrouded stratosphere.',
    specs: {
      sector: 'ARCOLOGY COMPLEX // ZONE 3',
      coordinates: '22.3193° N, 114.1694° E',
      clearance: 'CIVIC STRUCTURAL ENG',
      bandwidth: '512.8 TB/S GRID LOAD',
      resolution: '4K DCI // 60 FPS',
      audioFreq: '98 Hz WIND SHEAR'
    }
  },
  {
    id: 'digital-landscapes',
    indexStr: '05',
    title: 'QUANTUM AURORA EXPANSE',
    subtitle: 'Crystallized lattice topography',
    category: 'DIGITAL LANDSCAPES',
    image: '/images/digital_landscape.jpg',
    video: '/videos/digital_landscapes.mp4',
    accentColor: '#00E5FF',
    secondaryColor: '#FF3CAC',
    description: 'Infinite synthesized frontier generated inside a Dyson neural net. Prismatic bismuth spires refract electromagnetic auroras across undulating grid plateaus of solid photon structures.',
    specs: {
      sector: 'SYNTHETIC VALLEYS // GRID-X',
      coordinates: '64.9631° N, 19.0208° W',
      clearance: 'NEURAL EXPLORER ALPHA',
      bandwidth: '940.2 TB/S TOPOLOGY',
      resolution: '4K DCI // 60 FPS',
      audioFreq: '130 Hz IONIC DRIFT'
    }
  },
  {
    id: 'experimental-motion-graphics',
    indexStr: '06',
    title: 'KINETIC NEURAL STREAMS',
    subtitle: 'Hyper-spatial vector displacement',
    category: 'EXPERIMENTAL MOTION GRAPHICS',
    image: '/images/motion_graphics.jpg',
    video: '/videos/experimental_motion_graphics.mp4',
    accentColor: '#FF3CAC',
    secondaryColor: '#FF9D4D',
    description: 'High-frequency holographic data conduits streaming cognitive impulses across orbital relay nodes. Visualizes real-time cryptographic handshakes rendered as multidimensional light bands.',
    specs: {
      sector: 'DATA RELAY // ORBIT-8',
      coordinates: '00.0000° N, 00.0000° E',
      clearance: 'CYBER-SPACE OPERATOR',
      bandwidth: '2.4 PB/S OPTICAL BURST',
      resolution: '4K DCI // 60 FPS',
      audioFreq: '164 Hz DATA CHIRP'
    }
  }
];
