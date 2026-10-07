import { apiClient } from '../../../lib/api-client';
import type {
  ApiResponse,
  CreateVehiclePayload,
  UpdateVehiclePayload,
  Vehicle,
  VehicleFilter,
  VehicleSummary,
} from '../types/vehicle.types';

export const vehicleApi = {
  getAll: async (filter?: VehicleFilter): Promise<Vehicle[]> => {
    const params = new URLSearchParams();
    if (filter?.search) params.set('search', filter.search);
    if (filter?.status) params.set('status', filter.status);
    if (filter?.vehicleType) params.set('vehicleType', filter.vehicleType);

    const response = await apiClient.get<ApiResponse<Vehicle[]>>(`/vehicles?${params}`);
    return response.data.data;
  },

  getById: async (id: string): Promise<Vehicle> => {
    const response = await apiClient.get<ApiResponse<Vehicle>>(`/vehicles/${id}`);
    return response.data.data;
  },

  create: async (payload: CreateVehiclePayload): Promise<Vehicle> => {
    const response = await apiClient.post<ApiResponse<Vehicle>>('/vehicles', payload);
    return response.data.data;
  },

  update: async (id: string, payload: UpdateVehiclePayload): Promise<Vehicle> => {
    const response = await apiClient.put<ApiResponse<Vehicle>>(`/vehicles/${id}`, payload);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/vehicles/${id}`);
  },

  getSummary: async (): Promise<VehicleSummary> => {
    const response = await apiClient.get<ApiResponse<VehicleSummary>>('/vehicles/summary');
    return response.data.data;
  },
};
