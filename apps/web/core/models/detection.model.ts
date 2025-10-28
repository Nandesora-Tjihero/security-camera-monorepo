export interface MLDetection {
  bbox: [number, number, number, number];
  class: string;
  score: number;
}

export interface DetectionRecord {
  timestamp: number;
  imageUrl: string;
}
