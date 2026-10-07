export type VehicleStatus = 'ACTIVE' | 'IDLE' | 'OFFLINE';
export type VehicleType = 'CAR' | 'VAN' | 'TRUCK' | 'PICKUP' | 'MOTORCYCLE';

export interface Vehicle {
  id: string;
  licensePlate: string;
  name: string;
  vehicleType: VehicleType;
  driverName: string;
  status: VehicleStatus;
  latitude: number;
  longitude: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleSummary {
  total: number;
  active: number;
  idle: number;
  offline: number;
}

export interface CreateVehiclePayload {
  licensePlate: string;
  name: string;
  vehicleType: VehicleType;
  driverName: string;
  status: VehicleStatus;
  latitude: number;
  longitude: number;
  description: string;
}

export type UpdateVehiclePayload = CreateVehiclePayload;

export interface VehicleFilter {
  search?: string;
  status?: VehicleStatus | '';
  vehicleType?: VehicleType | '';
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    fields?: Record<string, string>;
  };
}

export const VEHICLE_STATUS_LABELS: Record<VehicleStatus, string> = {
  ACTIVE: 'Active',
  IDLE: 'Idle',
  OFFLINE: 'Offline',
};

export const VEHICLE_TYPE_LABELS: Record<VehicleType, string> = {
  CAR: 'Car',
  VAN: 'Van',
  TRUCK: 'Truck',
  PICKUP: 'Pickup',
  MOTORCYCLE: 'Motorcycle',
};

export const VEHICLE_STATUS_OPTIONS: { value: VehicleStatus; label: string }[] = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'IDLE', label: 'Idle' },
  { value: 'OFFLINE', label: 'Offline' },
];

export const VEHICLE_TYPE_OPTIONS: { value: VehicleType; label: string }[] = [
  { value: 'CAR', label: 'Car' },
  { value: 'VAN', label: 'Van' },
  { value: 'TRUCK', label: 'Truck' },
  { value: 'PICKUP', label: 'Pickup' },
  { value: 'MOTORCYCLE', label: 'Motorcycle' },
];
