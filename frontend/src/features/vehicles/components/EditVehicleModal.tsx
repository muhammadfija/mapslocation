
import { Modal } from '../../../components/ui/Modal';
import { VehicleForm } from './VehicleForm';
import { useUpdateVehicle } from '../hooks/useVehicles';
import { useAppStore } from '../../../store/appStore';
import type { VehicleFormValues } from '../schemas/vehicle.schema';

export function EditVehicleModal() {
  const {
    isEditModalOpen,
    setIsEditModalOpen,
    selectedVehicle,
    isPickingLocation,
    setIsPickingLocation,
    pickedLocation,
    setPickedLocation,
    openVehicleDetail,
  } = useAppStore();
  const updateVehicle = useUpdateVehicle();

  if (!selectedVehicle) return null;

  const handleClose = () => {
    setIsEditModalOpen(false);
    setIsPickingLocation(false);
    setPickedLocation(null);
  };

  const handleSubmit = async (values: VehicleFormValues) => {
    const updated = await updateVehicle.mutateAsync({
      id: selectedVehicle.id,
      payload: {
        licensePlate: values.licensePlate,
        name: values.name,
        vehicleType: values.vehicleType,
        driverName: values.driverName,
        status: values.status,
        latitude: values.latitude,
        longitude: values.longitude,
        description: values.description || '',
      },
    });
    handleClose();
    // Reopen detail panel with updated data
    openVehicleDetail({ ...selectedVehicle, ...updated });
  };

  const handleLocationPickerToggle = () => {
    setIsPickingLocation(!isPickingLocation);
  };

  return (
    <Modal
      isOpen={isEditModalOpen}
      onClose={handleClose}
      title="Edit Vehicle"
      size="lg"
    >
      <VehicleForm
        defaultValues={{
          licensePlate: selectedVehicle.licensePlate,
          name: selectedVehicle.name,
          vehicleType: selectedVehicle.vehicleType,
          driverName: selectedVehicle.driverName,
          status: selectedVehicle.status,
          latitude: selectedVehicle.latitude,
          longitude: selectedVehicle.longitude,
          description: selectedVehicle.description,
        }}
        onSubmit={handleSubmit}
        onCancel={handleClose}
        isLoading={updateVehicle.isPending}
        submitLabel="Save Changes"
        onLocationPickerToggle={handleLocationPickerToggle}
        selectedLocation={pickedLocation}
      />
    </Modal>
  );
}


