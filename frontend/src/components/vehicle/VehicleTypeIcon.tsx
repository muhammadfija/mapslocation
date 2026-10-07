import { Car, Truck, Bike, Package } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { VehicleType } from '../../features/vehicles/types/vehicle.types';

interface VehicleTypeIconProps {
  type: VehicleType;
  className?: string;
  size?: number;
}

const typeConfig: Record<VehicleType, { icon: React.ElementType; color: string }> = {
  CAR: { icon: Car, color: 'text-blue-500' },
  VAN: { icon: Package, color: 'text-purple-500' },
  TRUCK: { icon: Truck, color: 'text-orange-500' },
  PICKUP: { icon: Truck, color: 'text-teal-500' },
  MOTORCYCLE: { icon: Bike, color: 'text-pink-500' },
};

export function VehicleTypeIcon({ type, className, size = 18 }: VehicleTypeIconProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return <Icon size={size} className={cn(config.color, className)} />;
}
