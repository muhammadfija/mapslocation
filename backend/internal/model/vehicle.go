package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type VehicleStatus string
type VehicleType string

const (
	StatusActive  VehicleStatus = "ACTIVE"
	StatusIdle    VehicleStatus = "IDLE"
	StatusOffline VehicleStatus = "OFFLINE"
)

const (
	TypeCar        VehicleType = "CAR"
	TypeVan        VehicleType = "VAN"
	TypeTruck      VehicleType = "TRUCK"
	TypePickup     VehicleType = "PICKUP"
	TypeMotorcycle VehicleType = "MOTORCYCLE"
)

type Vehicle struct {
	ID           uuid.UUID     `json:"id" gorm:"type:uuid;primary_key"`
	LicensePlate string        `json:"licensePlate" gorm:"column:license_plate;not null;uniqueIndex"`
	Name         string        `json:"name" gorm:"column:name;not null"`
	VehicleType  VehicleType   `json:"vehicleType" gorm:"column:vehicle_type;not null"`
	DriverName   string        `json:"driverName" gorm:"column:driver_name;not null"`
	Status       VehicleStatus `json:"status" gorm:"column:status;not null;default:'ACTIVE'"`
	Latitude     float64       `json:"latitude" gorm:"column:latitude;not null"`
	Longitude    float64       `json:"longitude" gorm:"column:longitude;not null"`
	Description  string        `json:"description" gorm:"column:description"`
	CreatedAt    time.Time     `json:"createdAt" gorm:"column:created_at;autoCreateTime"`
	UpdatedAt    time.Time     `json:"updatedAt" gorm:"column:updated_at;autoUpdateTime"`
}

func (v *Vehicle) BeforeCreate(tx *gorm.DB) error {
	if v.ID == uuid.Nil {
		v.ID = uuid.New()
	}
	return nil
}

// CreateVehicleRequest is used for creating a new vehicle
type CreateVehicleRequest struct {
	LicensePlate string        `json:"licensePlate" validate:"required,min=3"`
	Name         string        `json:"name" validate:"required,min=3"`
	VehicleType  VehicleType   `json:"vehicleType" validate:"required,oneof=CAR VAN TRUCK PICKUP MOTORCYCLE"`
	DriverName   string        `json:"driverName" validate:"required"`
	Status       VehicleStatus `json:"status" validate:"required,oneof=ACTIVE IDLE OFFLINE"`
	Latitude     float64       `json:"latitude" validate:"required,min=-90,max=90"`
	Longitude    float64       `json:"longitude" validate:"required,min=-180,max=180"`
	Description  string        `json:"description"`
}

// UpdateVehicleRequest is used for updating an existing vehicle
type UpdateVehicleRequest struct {
	LicensePlate string        `json:"licensePlate" validate:"required,min=3"`
	Name         string        `json:"name" validate:"required,min=3"`
	VehicleType  VehicleType   `json:"vehicleType" validate:"required,oneof=CAR VAN TRUCK PICKUP MOTORCYCLE"`
	DriverName   string        `json:"driverName" validate:"required"`
	Status       VehicleStatus `json:"status" validate:"required,oneof=ACTIVE IDLE OFFLINE"`
	Latitude     float64       `json:"latitude" validate:"required,min=-90,max=90"`
	Longitude    float64       `json:"longitude" validate:"required,min=-180,max=180"`
	Description  string        `json:"description"`
}

// VehicleFilter is used for filtering vehicles
type VehicleFilter struct {
	Search      string        `form:"search"`
	Status      VehicleStatus `form:"status"`
	VehicleType VehicleType   `form:"vehicleType"`
}

// VehicleSummary contains summary statistics
type VehicleSummary struct {
	Total   int64 `json:"total"`
	Active  int64 `json:"active"`
	Idle    int64 `json:"idle"`
	Offline int64 `json:"offline"`
}
