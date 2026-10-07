import { useState } from 'react';
import { AlertCircle, RefreshCw, Truck } from 'lucide-react';
import { VehicleCard } from '../features/vehicles/components/VehicleCard';
import { VehicleFilters } from '../features/vehicles/components/VehicleFilters';
import { VehicleCardSkeleton, SummaryCardSkeleton } from '../components/ui/Skeleton';
import { FleetMap } from '../components/map/FleetMap';
import { AddVehicleModal } from '../features/vehicles/components/AddVehicleModal';
import { EditVehicleModal } from '../features/vehicles/components/EditVehicleModal';
import { DeleteVehicleDialog } from '../features/vehicles/components/DeleteVehicleDialog';
import { VehicleDetailPanel } from '../features/vehicles/components/VehicleDetailPanel';
import { useVehicles, useVehicleSummary } from '../features/vehicles/hooks/useVehicles';
import { useAppStore } from '../store/appStore';
import type { VehicleFilter } from '../features/vehicles/types/vehicle.types';

export function DashboardPage() {
  const [filter, setFilter] = useState<VehicleFilter>({ search: '', status: '', vehicleType: '' });

  const { setIsAddModalOpen, isPickingLocation, setIsPickingLocation, setPickedLocation } = useAppStore();

  const { data: vehicles, isLoading, isError, refetch } = useVehicles(filter);
  const { data: summary, isLoading: summaryLoading } = useVehicleSummary();

  const handleLocationPick = (lat: number, lng: number) => {
    setPickedLocation({ lat, lng });
    setIsPickingLocation(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="flex-shrink-0 bg-white border-b border-surface-200 px-4 py-3 flex items-center justify-between gap-4 z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <Truck size={17} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-surface-900 leading-tight">FleetTrack</h1>
            <p className="text-xs text-surface-400 hidden sm:block">Fleet Management Dashboard</p>
          </div>
        </div>

        {/* Summary cards */}
        <div className="hidden md:flex items-center gap-3">
          {summaryLoading ? (
            <>
              <SummaryCardSkeleton />
              <SummaryCardSkeleton />
              <SummaryCardSkeleton />
              <SummaryCardSkeleton />
            </>
          ) : summary ? (
            <>
              <SummaryCard label="Total" value={summary.total} color="text-surface-700" />
              <SummaryCard label="Active" value={summary.active} color="text-emerald-600" dot="bg-emerald-500" />
              <SummaryCard label="Idle" value={summary.idle} color="text-amber-600" dot="bg-amber-500" />
              <SummaryCard label="Offline" value={summary.offline} color="text-red-500" dot="bg-red-500" />
            </>
          ) : null}
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary gap-2 flex-shrink-0"
          id="add-vehicle-btn"
        >
          <span className="text-lg leading-none">+</span>
          <span className="hidden sm:inline">Add Vehicle</span>
        </button>
      </header>

      {/* Mobile summary */}
      {summary && (
        <div className="md:hidden flex gap-2 px-3 py-2 bg-white border-b border-surface-100 overflow-x-auto">
          <MobileSummaryChip label="Total" value={summary.total} color="bg-surface-100 text-surface-700" />
          <MobileSummaryChip label="Active" value={summary.active} color="bg-emerald-50 text-emerald-700" />
          <MobileSummaryChip label="Idle" value={summary.idle} color="bg-amber-50 text-amber-700" />
          <MobileSummaryChip label="Offline" value={summary.offline} color="bg-red-50 text-red-600" />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden flex-col md:flex-row">
        {/* Vehicle List Sidebar */}
        <aside className="flex flex-col bg-white border-r border-surface-200 md:w-72 lg:w-80 flex-shrink-0 md:h-full h-64 overflow-hidden">
          <VehicleFilters filter={filter} onChange={setFilter} />

          <div className="flex-1 overflow-y-auto">
            {isLoading && (
              <div>
                {Array.from({ length: 6 }).map((_, i) => (
                  <VehicleCardSkeleton key={i} />
                ))}
              </div>
            )}

            {isError && (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <AlertCircle className="text-red-400 mb-3" size={32} />
                <p className="text-sm font-medium text-surface-700 mb-1">Failed to load vehicles</p>
                <p className="text-xs text-surface-400 mb-4">Please check your connection and try again.</p>
                <button onClick={() => refetch()} className="btn-secondary btn-sm gap-2">
                  <RefreshCw size={13} />
                  Retry
                </button>
              </div>
            )}

            {!isLoading && !isError && vehicles?.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="w-14 h-14 bg-surface-100 rounded-2xl flex items-center justify-center mb-4">
                  <Truck size={24} className="text-surface-400" />
                </div>
                <p className="text-sm font-medium text-surface-700 mb-1">No vehicles found</p>
                <p className="text-xs text-surface-400 mb-4">
                  {filter.search || filter.status || filter.vehicleType
                    ? 'Try adjusting your filters.'
                    : 'Add your first vehicle to get started.'}
                </p>
                {!filter.search && !filter.status && !filter.vehicleType && (
                  <button onClick={() => setIsAddModalOpen(true)} className="btn-primary btn-sm">
                    + Add Vehicle
                  </button>
                )}
              </div>
            )}

            {!isLoading && !isError && vehicles?.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>

          {vehicles && vehicles.length > 0 && (
            <div className="px-4 py-2 border-t border-surface-100 text-xs text-surface-400">
              {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''} shown
            </div>
          )}
        </aside>

        {/* Map */}
        <main className="flex-1 relative overflow-hidden">
          <FleetMap
            vehicles={vehicles || []}
            onLocationPick={isPickingLocation ? handleLocationPick : undefined}
          />
        </main>
      </div>

      {/* Modals & Panels */}
      <AddVehicleModal />
      <EditVehicleModal />
      <DeleteVehicleDialog />
      <VehicleDetailPanel />
    </div>
  );
}

function SummaryCard({
  label,
  value,
  color,
  dot,
}: {
  label: string;
  value: number;
  color: string;
  dot?: string;
}) {
  return (
    <div className="text-center px-3 py-1.5 bg-surface-50 rounded-lg min-w-[60px]">
      <div className={`text-lg font-bold ${color} flex items-center justify-center gap-1.5`}>
        {dot && <span className={`w-2 h-2 rounded-full ${dot} flex-shrink-0`} />}
        {value}
      </div>
      <div className="text-xs text-surface-400">{label}</div>
    </div>
  );
}

function MobileSummaryChip({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${color}`}>
      <span className="font-bold">{value}</span>
      <span>{label}</span>
    </div>
  );
}
