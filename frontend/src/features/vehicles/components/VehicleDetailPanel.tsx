import { X, Edit2, Trash2, User, Calendar, FileText, Navigation } from 'lucide-react';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { VehicleTypeIcon } from '../../../components/vehicle/VehicleTypeIcon';
import { useAppStore } from '../../../store/appStore';
import { cn, formatDate, formatCoordinate } from '../../../lib/utils';
import { VEHICLE_TYPE_LABELS } from '../types/vehicle.types';

export function VehicleDetailPanel() {
  const {
    selectedVehicle,
    isDetailPanelOpen,
    setIsDetailPanelOpen,
    openEditModal,
    openDeleteModal,
  } = useAppStore();

  if (!selectedVehicle) return null;

  return (
    <>
      {/* Overlay for mobile */}
      {isDetailPanelOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={() => setIsDetailPanelOpen(false)}
        />
      )}

      {/* Panel */}
      <div
        className={cn(
          'fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-40 flex flex-col transition-transform duration-300',
          isDetailPanelOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-surface-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-surface-100 rounded-xl flex items-center justify-center">
              <VehicleTypeIcon type={selectedVehicle.vehicleType} size={20} />
            </div>
            <div>
              <h3 className="font-bold text-surface-900 text-base leading-tight">
                {selectedVehicle.licensePlate}
              </h3>
              <p className="text-xs text-surface-500 mt-0.5">
                {VEHICLE_TYPE_LABELS[selectedVehicle.vehicleType]}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsDetailPanelOpen(false)}
            className="p-1.5 text-surface-400 hover:text-surface-600 hover:bg-surface-100 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 animate-fade-in">
          {/* Status */}
          <div>
            <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">Status</p>
            <StatusBadge status={selectedVehicle.status} className="text-sm px-3 py-1" />
          </div>

          {/* Vehicle Info */}
          <div>
            <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">Vehicle</p>
            <p className="text-sm font-medium text-surface-900">{selectedVehicle.name}</p>
          </div>

          {/* Driver */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <User size={15} className="text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-surface-400 mb-0.5">Driver</p>
              <p className="text-sm font-medium text-surface-900">{selectedVehicle.driverName}</p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <Navigation size={15} className="text-emerald-500" />
            </div>
            <div>
              <p className="text-xs text-surface-400 mb-0.5">Location</p>
              <p className="text-sm font-mono text-surface-900">
                {formatCoordinate(selectedVehicle.latitude)}, {formatCoordinate(selectedVehicle.longitude)}
              </p>
            </div>
          </div>

          {/* Description */}
          {selectedVehicle.description && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText size={15} className="text-purple-500" />
              </div>
              <div>
                <p className="text-xs text-surface-400 mb-0.5">Description</p>
                <p className="text-sm text-surface-700 leading-relaxed">{selectedVehicle.description}</p>
              </div>
            </div>
          )}

          {/* Last Updated */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <Calendar size={15} className="text-amber-500" />
            </div>
            <div>
              <p className="text-xs text-surface-400 mb-0.5">Last Updated</p>
              <p className="text-sm text-surface-700">{formatDate(selectedVehicle.updatedAt)}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-5 border-t border-surface-100 flex gap-3">
          <button
            onClick={() => openEditModal(selectedVehicle)}
            className="btn-secondary flex-1 gap-2"
          >
            <Edit2 size={15} />
            Edit
          </button>
          <button
            onClick={() => openDeleteModal(selectedVehicle)}
            className="btn flex-1 gap-2 bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 focus:ring-red-400"
          >
            <Trash2 size={15} />
            Delete
          </button>
        </div>
      </div>
    </>
  );
}
