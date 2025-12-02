// User Types
export interface User {
  _id?: string;
  email: string;
  name: string;
  role: 'admin' | 'booth_owner' | 'visitor';
  createdAt?: Date;
  updatedAt?: Date;
}

// Exhibition Hall Types
export interface ExhibitionHall {
  _id?: string;
  name: string;
  description: string;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  createdBy: string;
  createdAt?: Date;
}

// Booth Types
export interface Booth {
  _id?: string;
  hallId: string;
  ownerId: string;
  name: string;
  size: 'small' | 'medium' | 'large';
  position: {
    x: number;
    y: number;
    z: number;
  };
  products: Product[];
  createdAt?: Date;
}

// Product Types
export interface Product {
  _id?: string;
  name: string;
  description: string;
  images: string[];
  documents: string[];
}

// 3D Position Types
export interface Position3D {
  x: number;
  y: number;
  z: number;
}

export interface Rotation3D {
  x: number;
  y: number;
  z: number;
}
