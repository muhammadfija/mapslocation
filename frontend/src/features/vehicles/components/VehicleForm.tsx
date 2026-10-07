import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, MapPin } from 'lucide-react';
import { vehicleSchema, type VehicleFormValues } from '../schemas/vehicle.schema';
import { VEHICLE_TYPE_OPTIONS, VEHICLE_STATUS_OPTIONS } from '../types/vehicle.types';
import { useAppStore } from '../../../store/appStore';
import { cn } from '../../../lib/utils';

interface VehicleFormProps {
  defaultValues?: Partial<VehicleFormValues>;
  onSubmit: (values: VehicleFormValues) => void;
  isLoading?: boolean;
  onCancel: () => void;
  submitLabel?: string;
  onLocationPickerToggle?: () => void;
  selectedLocation?: { lat: number; lng: number } | null;
}

export function VehicleForm({
  defaultValues,
  onSubmit,
  isLoading,
  onCancel,
  submitLabel = 'Save',
  onLocationPickerToggle,
  selectedLocation,
}: VehicleFormProps) {
  const { isPickingLocation } = useAppStore();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      licensePlate: '',
      name: '',
      vehicleType: undefined,
      driverName: '',
      status: 'ACTIVE',
      latitude: 0,
      longitude: 0,
      description: '',
      ...defaultValues,
    },
  });

  // Update form values when location is picked from map
  useEffect(() => {
    if (selectedLocation) {
      setValue('latitude', parseFloat(selectedLocation.lat.toFixed(6)));
      setValue('longitude', parseFloat(selectedLocation.lng.toFixed(6)));
    }
  }, [selectedLocation, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* License Plate */}
      <div>
        <label className="label" htmlFor="licensePlate">
          License Plate <span className="text-red-500">*</span>
        </label>
        <input
          id="licensePlate"
          {...register('licensePlate')}
          className={cn('input', errors.licensePlate && 'input-error')}
          placeholder="e.g. B 1234 ABC"
        />
        {errors.licensePlate && (
          <p className="error-text">{errors.licensePlate.message}</p>
        )}
      </div>

      {/* Vehicle Name */}
      <div>
        <label className="label" htmlFor="name">
          Vehicle Name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          {...register('name')}
          className={cn('input', errors.name && 'input-error')}
          placeholder="e.g. Delivery Van 01"
        />
        {errors.name && <p className="error-text">{errors.name.message}</p>}
      </div>

      {/* Vehicle Type + Status side by side */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label" htmlFor="vehicleType">
            Vehicle Type <span className="text-red-500">*</span>
          </label>
          <select
            id="vehicleType"
            {...register('vehicleType')}
            className={cn('select', errors.vehicleType && 'input-error')}
          >
            <option value="">Select type</option>
            {VEHICLE_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {errors.vehicleType && (
            <p className="error-text">{errors.vehicleType.message}</p>
          )}
        </div>

        <div>
          <label className="label" htmlFor="status">
            Status <span className="text-red-500">*</span>
          </label>
          <select
            id="status"
            {...register('status')}
            className={cn('select', errors.status && 'input-error')}
          >
            {VEHICLE_STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {errors.status && <p className="error-text">{errors.status.message}</p>}
        </div>
      </div>

      {/* Driver Name */}
      <div>
        <label className="label" htmlFor="driverName">
          Driver Name <span className="text-red-500">*</span>
        </label>
        <input
          id="driverName"
          {...register('driverName')}
          className={cn('input', errors.driverName && 'input-error')}
          placeholder="e.g. Ahmad Fauzi"
        />
        {errors.driverName && (
          <p className="error-text">{errors.driverName.message}</p>
        )}
      </div>

      {/* Location */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="label mb-0">
            Location <span className="text-red-500">*</span>
          </label>
          {onLocationPickerToggle && (
            <button
              type="button"
              onClick={onLocationPickerToggle}
              className={cn(
                'flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg transition-all',
                isPickingLocation
                  ? 'bg-primary-600 text-white'
                  : 'text-primary-600 hover:bg-primary-50'
              )}
            >
              <MapPin size={12} />
              {isPickingLocation ? 'Picking...' : 'Pick from map'}
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Controller
              name="latitude"
              control={control}
              render={({ field }) => (
                <input
                  id="latitude"
                  type="number"
                  step="any"
                  value={field.value}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  className={cn('input', errors.latitude && 'input-error')}
                  placeholder="Latitude"
                />
              )}
            />
            {errors.latitude && (
              <p className="error-text">{errors.latitude.message}</p>
            )}
          </div>
          <div>
            <Controller
              name="longitude"
              control={control}
              render={({ field }) => (
                <input
                  id="longitude"
                  type="number"
                  step="any"
                  value={field.value}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  className={cn('input', errors.longitude && 'input-error')}
                  placeholder="Longitude"
                />
              )}
            />
            {errors.longitude && (
              <p className="error-text">{errors.longitude.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="label" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          {...register('description')}
          className="input resize-none"
          rows={2}
          placeholder="Optional description..."
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary flex-1"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button type="submit" className="btn-primary flex-1" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Saving...
            </>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  );
}
