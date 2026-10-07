import { z } from 'zod';

export const vehicleSchema = z.object({
  licensePlate: z
    .string()
    .min(1, 'License plate is required')
    .min(3, 'License plate must be at least 3 characters'),
  name: z
    .string()
    .min(1, 'Vehicle name is required')
    .min(3, 'Vehicle name must be at least 3 characters'),
  vehicleType: z.enum(['CAR', 'VAN', 'TRUCK', 'PICKUP', 'MOTORCYCLE'] as const, {
    error: 'Vehicle type is required',
  }),
  driverName: z.string().min(1, 'Driver name is required'),
  status: z.enum(['ACTIVE', 'IDLE', 'OFFLINE'] as const, {
    error: 'Status is required',
  }),
  latitude: z
    .number({ error: 'Latitude must be a number' })
    .min(-90, 'Latitude must be between -90 and 90')
    .max(90, 'Latitude must be between -90 and 90'),
  longitude: z
    .number({ error: 'Longitude must be a number' })
    .min(-180, 'Longitude must be between -180 and 180')
    .max(180, 'Longitude must be between -180 and 180'),
  description: z.string().optional(),
});

export type VehicleFormValues = z.infer<typeof vehicleSchema>;
