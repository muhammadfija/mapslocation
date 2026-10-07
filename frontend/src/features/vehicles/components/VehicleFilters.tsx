import { Search, Filter, X } from 'lucide-react';
import { useState } from 'react';
import type { VehicleFilter, VehicleStatus, VehicleType } from '../types/vehicle.types';
import { VEHICLE_TYPE_OPTIONS } from '../types/vehicle.types';
import { cn } from '../../../lib/utils';

interface VehicleFiltersProps {
  filter: VehicleFilter;
  onChange: (filter: VehicleFilter) => void;
}

export function VehicleFilters({ filter, onChange }: VehicleFiltersProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const hasActiveFilters = filter.status || filter.vehicleType;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filter, search: e.target.value });
  };

  const handleStatusChange = (status: VehicleStatus | '') => {
    onChange({ ...filter, status });
    setIsFilterOpen(false);
  };

  const handleTypeChange = (vehicleType: VehicleType | '') => {
    onChange({ ...filter, vehicleType });
    setIsFilterOpen(false);
  };

  const clearFilters = () => {
    onChange({ search: filter.search, status: '', vehicleType: '' });
  };

  return (
    <div className="p-3 border-b border-surface-100 space-y-2">
      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
        <input
          type="text"
          placeholder="Search vehicles..."
          value={filter.search || ''}
          onChange={handleSearchChange}
          className="input pl-9 pr-3 text-sm h-9"
        />
      </div>

      {/* Filter row */}
      <div className="flex items-center gap-2">
        <div className="flex gap-2 flex-1 overflow-x-auto pb-0.5">
          {/* Status filter chips */}
          <button
            onClick={() => handleStatusChange('')}
            className={cn(
              'text-xs px-2.5 py-1 rounded-full border transition-all flex-shrink-0',
              !filter.status
                ? 'bg-primary-600 text-white border-primary-600'
                : 'bg-white text-surface-600 border-surface-200 hover:border-surface-300'
            )}
          >
            All Status
          </button>
          <button
            onClick={() => handleStatusChange('ACTIVE')}
            className={cn(
              'text-xs px-2.5 py-1 rounded-full border transition-all flex-shrink-0',
              filter.status === 'ACTIVE'
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white text-surface-600 border-surface-200 hover:border-surface-300'
            )}
          >
            Active
          </button>
          <button
            onClick={() => handleStatusChange('IDLE')}
            className={cn(
              'text-xs px-2.5 py-1 rounded-full border transition-all flex-shrink-0',
              filter.status === 'IDLE'
                ? 'bg-amber-600 text-white border-amber-600'
                : 'bg-white text-surface-600 border-surface-200 hover:border-surface-300'
            )}
          >
            Idle
          </button>
          <button
            onClick={() => handleStatusChange('OFFLINE')}
            className={cn(
              'text-xs px-2.5 py-1 rounded-full border transition-all flex-shrink-0',
              filter.status === 'OFFLINE'
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-white text-surface-600 border-surface-200 hover:border-surface-300'
            )}
          >
            Offline
          </button>
        </div>

        {/* Type filter */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={cn(
              'flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border transition-all',
              filter.vehicleType
                ? 'bg-primary-600 text-white border-primary-600'
                : 'bg-white text-surface-600 border-surface-200 hover:border-surface-300'
            )}
          >
            <Filter size={11} />
            {filter.vehicleType || 'Type'}
          </button>
          {isFilterOpen && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-surface-200 rounded-lg shadow-panel z-10 min-w-[120px]">
              <button
                onClick={() => handleTypeChange('')}
                className="w-full text-left px-3 py-2 text-xs text-surface-700 hover:bg-surface-50"
              >
                All Types
              </button>
              {VEHICLE_TYPE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleTypeChange(opt.value)}
                  className={cn(
                    'w-full text-left px-3 py-2 text-xs hover:bg-surface-50',
                    filter.vehicleType === opt.value ? 'text-primary-600 font-medium' : 'text-surface-700'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Clear filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex-shrink-0 p-1.5 text-surface-400 hover:text-surface-600 hover:bg-surface-100 rounded-lg transition-colors"
            title="Clear filters"
          >
            <X size={13} />
          </button>
        )}
      </div>
    </div>
  );
}
