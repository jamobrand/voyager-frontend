export interface Room {
    id: number;
    number: number;
    type: 'SINGLE' | 'DOUBLE' | 'SUITE' | 'DELUXE' | 'EXECUTIVE';
    capacity: number;
    price: number;
    floor?: number;
    description?: string;
    amenities: string[];
    available: boolean;
    maintenanceMode: boolean;
  }

  export interface Chalet {
    id: number;
    name: string;
    chaletType: string;
    capacity: number;
    price: number;
    description?: string;
    chaletImage?: string;
    amenities?: string[];
    available: boolean;
    maintenanceMode: boolean;
  }