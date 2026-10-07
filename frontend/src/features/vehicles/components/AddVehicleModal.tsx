
import { Modal } from '../../../components/ui/Modal';
import { VehicleForm } from './VehicleForm';
import { useCreateVehicle } from '../hooks/useVehicles';
import { useAppStore } from '../../../store/appStore';
import type { VehicleFormValues } from '../schemas/vehicle.schema';

export function AddVehicleModal() {
  const { isAddModalOpen, setIsAddModalOpen, isPickingLocation, setIsPickingLocation, pickedLocation, setPickedLocation } = useAppStore();
  const createVehicle = useCreateVehicle();

  const handleClose = () => {
    setIsAddModalOpen(false);
    setIsPickingLocation(false);
    setPickedLocation(null);
  };

  const handleSubmit = async (values: VehicleFormValues) => {
    await createVehicle.mutateAsync({
      licensePlate: values.licensePlate,
      name: values.name,
      vehicleType: values.vehicleType,
      driverName: values.driverName,
      status: values.status,
      latitude: values.latitude,
      longitude: values.longitude,
      description: values.description || '',
    });
    handleClose();
  };

  const handleLocationPickerToggle = () => {
    setIsPickingLocation(!isPickingLocation);
  };

  return (
    <Modal
      isOpen={isAddModalOpen}
      onClose={handleClose}
      title="Add New Vehicle"
      size="lg"
    >
      <VehicleForm
        onSubmit={handleSubmit}
        onCancel={handleClose}
        isLoading={createVehicle.isPending}
        submitLabel="Add Vehicle"
        onLocationPickerToggle={handleLocationPickerToggle}
        selectedLocation={pickedLocation}
      />
    </Modal>
  );
}


