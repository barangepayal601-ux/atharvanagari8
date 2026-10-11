export type CameraMode = 'first-person' | 'third-person' | 'drone';

export type LightingMode = 'day' | 'golden' | 'night';

export type FloorFinish = 'marble' | 'wood' | 'vitrified';

export type KitchenFinish = 'walnut' | 'white' | 'charcoal';

export interface HotspotItem {
  id: string;
  title: string;
  category: 'Amenities' | 'Architecture' | 'Sample Flat' | 'Connectivity';
  position: [number, number, number];
  description: string;
  features: string[];
  specs?: string;
  image?: string;
}

export type ElevatorState =
  | 'IDLE_DOORS_CLOSED'
  | 'OPENING'
  | 'DOORS_OPEN'
  | 'CLOSING'
  | 'MOVING'
  | 'ARRIVED';

export interface LeadFormData {
  fullName: string;
  phone: string;
  email: string;
  configuration: '2 BHK' | '3 BHK' | 'Both / Undecided';
  visitDate: string;
  notes?: string;
}
