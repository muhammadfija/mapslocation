import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { useDeleteVehicle } from '../hooks/useVehicles';
import { useAppStore } from '../../../store/appStore';

export function DeleteVehicleDialog() {
  const {
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    selectedVehicle,
    setSelectedVehicle,
    setIsDetailPanelOpen,
  } = useAppStore();
  const deleteVehicle = useDeleteVehicle();

  if (!selectedVehicle) return null;

  const handleConfirm = async () => {
    await deleteVehicle.mutateAsync(selectedVehicle.id);
    setIsDeleteModalOpen(false);
    setIsDetailPanelOpen(false);
    setSelectedVehicle(null);
  };

  return (
    <ConfirmDialog
      isOpen={isDeleteModalOpen}
      onClose={() => setIsDeleteModalOpen(false)}
      onConfirm={handleConfirm}
      title="Delete Vehicle?"
      message={`Are you sure you want to delete "${selectedVehicle.licensePlate}"? This action cannot be undone.`}
      confirmLabel="Delete"
      isLoading={deleteVehicle.isPending}
      variant="danger"
    />
  );
}
