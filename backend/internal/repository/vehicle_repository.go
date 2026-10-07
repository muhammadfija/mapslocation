package repository

import (
	"strings"

	"github.com/fleettrack/backend/internal/model"
	"gorm.io/gorm"
)

type VehicleRepository interface {
	FindAll(filter model.VehicleFilter) ([]model.Vehicle, error)
	FindByID(id string) (*model.Vehicle, error)
	Create(vehicle *model.Vehicle) error
	Update(vehicle *model.Vehicle) error
	Delete(id string) error
	GetSummary() (*model.VehicleSummary, error)
}

type vehicleRepository struct {
	db *gorm.DB
}

func NewVehicleRepository(db *gorm.DB) VehicleRepository {
	return &vehicleRepository{db: db}
}

func (r *vehicleRepository) FindAll(filter model.VehicleFilter) ([]model.Vehicle, error) {
	var vehicles []model.Vehicle
	query := r.db

	if filter.Search != "" {
		search := "%" + strings.ToLower(filter.Search) + "%"
		query = query.Where(
			"LOWER(license_plate) LIKE ? OR LOWER(name) LIKE ? OR LOWER(driver_name) LIKE ?",
			search, search, search,
		)
	}

	if filter.Status != "" {
		query = query.Where("status = ?", filter.Status)
	}

	if filter.VehicleType != "" {
		query = query.Where("vehicle_type = ?", filter.VehicleType)
	}

	result := query.Order("created_at DESC").Find(&vehicles)
	return vehicles, result.Error
}

func (r *vehicleRepository) FindByID(id string) (*model.Vehicle, error) {
	var vehicle model.Vehicle
	result := r.db.Where("id = ?", id).First(&vehicle)
	if result.Error != nil {
		return nil, result.Error
	}
	return &vehicle, nil
}

func (r *vehicleRepository) Create(vehicle *model.Vehicle) error {
	return r.db.Create(vehicle).Error
}

func (r *vehicleRepository) Update(vehicle *model.Vehicle) error {
	return r.db.Save(vehicle).Error
}

func (r *vehicleRepository) Delete(id string) error {
	result := r.db.Where("id = ?", id).Delete(&model.Vehicle{})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}

func (r *vehicleRepository) GetSummary() (*model.VehicleSummary, error) {
	var summary model.VehicleSummary

	r.db.Model(&model.Vehicle{}).Count(&summary.Total)
	r.db.Model(&model.Vehicle{}).Where("status = ?", model.StatusActive).Count(&summary.Active)
	r.db.Model(&model.Vehicle{}).Where("status = ?", model.StatusIdle).Count(&summary.Idle)
	r.db.Model(&model.Vehicle{}).Where("status = ?", model.StatusOffline).Count(&summary.Offline)

	return &summary, nil
}
