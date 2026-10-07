import { create } from 'zustand';
import type { Vehicle } from '../features/vehicles/types/vehicle.types';

interface AppState {
  // Selected vehicle
  selectedVehicle: Vehicle | null;
  setSelectedVehicle: (vehicle: Vehicle | null) => void;

  // Modal states
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;

  isEditModalOpen: boolean;
  setIsEditModalOpen: (open: boolean) => void;

  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: (open: boolean) => void;

  isDetailPanelOpen: boolean;
  setIsDetailPanelOpen: (open: boolean) => void;

  // Map location picker
  isPickingLocation: boolean;
  setIsPickingLocation: (picking: boolean) => void;
  pickedLocation: { lat: number; lng: number } | null;
  setPickedLocation: (loc: { lat: number; lng: number } | null) => void;

  // Convenience actions
  openVehicleDetail: (vehicle: Vehicle) => void;
  openEditModal: (vehicle: Vehicle) => void;
  openDeleteModal: (vehicle: Vehicle) => void;
  closeAll: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedVehicle: null,
  setSelectedVehicle: (vehicle) => set({ selectedVehicle: vehicle }),

  isAddModalOpen: false,
  setIsAddModalOpen: (open) => set({ isAddModalOpen: open }),

  isEditModalOpen: false,
  setIsEditModalOpen: (open) => set({ isEditModalOpen: open }),

  isDeleteModalOpen: false,
  setIsDeleteModalOpen: (open) => set({ isDeleteModalOpen: open }),

  isDetailPanelOpen: false,
  setIsDetailPanelOpen: (open) => set({ isDetailPanelOpen: open }),

  isPickingLocation: false,
  setIsPickingLocation: (picking) => set({ isPickingLocation: picking }),
  pickedLocation: null,
  setPickedLocation: (loc) => set({ pickedLocation: loc }),

  openVehicleDetail: (vehicle) =>
    set({
      selectedVehicle: vehicle,
      isDetailPanelOpen: true,
      isEditModalOpen: false,
      isDeleteModalOpen: false,
    }),

  openEditModal: (vehicle) =>
    set({
      selectedVehicle: vehicle,
      isEditModalOpen: true,
      isDetailPanelOpen: false,
      isDeleteModalOpen: false,
    }),

  openDeleteModal: (vehicle) =>
    set({
      selectedVehicle: vehicle,
      isDeleteModalOpen: true,
    }),

  closeAll: () =>
    set({
      isAddModalOpen: false,
      isEditModalOpen: false,
      isDeleteModalOpen: false,
      isDetailPanelOpen: false,
      isPickingLocation: false,
      pickedLocation: null,
    }),
}));
