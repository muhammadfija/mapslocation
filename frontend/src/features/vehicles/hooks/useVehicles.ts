import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { vehicleApi } from '../api/vehicle.api';
import type { CreateVehiclePayload, UpdateVehiclePayload, VehicleFilter } from '../types/vehicle.types';

export const vehicleKeys = {
  all: ['vehicles'] as const,
  lists: () => [...vehicleKeys.all, 'list'] as const,
  list: (filter?: VehicleFilter) => [...vehicleKeys.lists(), filter] as const,
  details: () => [...vehicleKeys.all, 'detail'] as const,
  detail: (id: string) => [...vehicleKeys.details(), id] as const,
  summary: () => [...vehicleKeys.all, 'summary'] as const,
};

export function useVehicles(filter?: VehicleFilter) {
  return useQuery({
    queryKey: vehicleKeys.list(filter),
    queryFn: () => vehicleApi.getAll(filter),
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useVehicle(id: string) {
  return useQuery({
    queryKey: vehicleKeys.detail(id),
    queryFn: () => vehicleApi.getById(id),
    enabled: !!id,
  });
}

export function useVehicleSummary() {
  return useQuery({
    queryKey: vehicleKeys.summary(),
    queryFn: vehicleApi.getSummary,
    staleTime: 30 * 1000,
  });
}

export function useCreateVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateVehiclePayload) => vehicleApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.all });
      toast.success('Vehicle created successfully!');
    },
    onError: (error: any) => {
      const message = error?.error?.message || 'Failed to create vehicle';
      toast.error(message);
    },
  });
}

export function useUpdateVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateVehiclePayload }) =>
      vehicleApi.update(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.all });
      queryClient.invalidateQueries({ queryKey: vehicleKeys.detail(id) });
      toast.success('Vehicle updated successfully!');
    },
    onError: (error: any) => {
      const message = error?.error?.message || 'Failed to update vehicle';
      toast.error(message);
    },
  });
}

export function useDeleteVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => vehicleApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.all });
      toast.success('Vehicle deleted successfully!');
    },
    onError: (error: any) => {
      const message = error?.error?.message || 'Failed to delete vehicle';
      toast.error(message);
    },
  });
}
