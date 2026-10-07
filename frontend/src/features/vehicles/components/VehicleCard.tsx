import { cn } from '../../../lib/utils';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { VehicleTypeIcon } from '../../../components/vehicle/VehicleTypeIcon';
import { useAppStore } from '../../../store/appStore';
import type { Vehicle } from '../types/vehicle.types';
import { VEHICLE_TYPE_LABELS } from '../types/vehicle.types';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const { selectedVehicle, openVehicleDetail } = useAppStore();
  const isSelected = selectedVehicle?.id === vehicle.id;

  return (
    <button
      onClick={() => openVehicleDetail(vehicle)}
      className={cn(
        'w-full text-left px-4 py-3.5 border-b border-surface-100 last:border-0 transition-all duration-150 hover:bg-surface-50',
        isSelected && 'bg-primary-50 border-l-2 border-l-primary-500 hover:bg-primary-50'
      )}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className={cn(
            'w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors',
            isSelected ? 'bg-primary-100' : 'bg-surface-100'
          )}
        >
          <VehicleTypeIcon type={vehicle.vehicleType} size={17} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className={cn('text-sm font-semibold truncate', isSelected ? 'text-primary-700' : 'text-surface-900')}>
              {vehicle.licensePlate}
            </p>
            <StatusBadge status={vehicle.status} />
          </div>
          <p className="text-xs text-surface-500 mt-0.5 truncate">{vehicle.name}</p>
          <p className="text-xs text-surface-400 mt-0.5">{VEHICLE_TYPE_LABELS[vehicle.vehicleType]} · {vehicle.driverName}</p>
        </div>
      </div>
    </button>
  );
}
