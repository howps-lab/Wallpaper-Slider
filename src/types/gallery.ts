export interface GalleryItem {
  id: string;
  indexStr: string;
  title: string;
  subtitle: string;
  category: string;
  image: string;
  video: string;
  accentColor: string;
  secondaryColor: string;
  description: string;
  specs: {
    sector: string;
    coordinates: string;
    clearance: string;
    bandwidth: string;
    resolution: string;
    audioFreq: string;
  };
}
