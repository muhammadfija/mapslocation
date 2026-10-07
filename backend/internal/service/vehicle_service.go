package service

import (
	"errors"
	"time"

	"github.com/fleettrack/backend/internal/model"
	"github.com/fleettrack/backend/internal/repository"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type VehicleService interface {
	GetAll(filter model.VehicleFilter) ([]model.Vehicle, error)
	GetByID(id string) (*model.Vehicle, error)
	Create(req *model.CreateVehicleRequest) (*model.Vehicle, error)
	Update(id string, req *model.UpdateVehicleRequest) (*model.Vehicle, error)
	Delete(id string) error
	GetSummary() (*model.VehicleSummary, error)
}

type vehicleService struct {
	repo repository.VehicleRepository
}

func NewVehicleService(repo repository.VehicleRepository) VehicleService {
	return &vehicleService{repo: repo}
}

func (s *vehicleService) GetAll(filter model.VehicleFilter) ([]model.Vehicle, error) {
	return s.repo.FindAll(filter)
}

func (s *vehicleService) GetByID(id string) (*model.Vehicle, error) {
	vehicle, err := s.repo.FindByID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("vehicle not found")
		}
		return nil, err
	}
	return vehicle, nil
}

func (s *vehicleService) Create(req *model.CreateVehicleRequest) (*model.Vehicle, error) {
	vehicle := &model.Vehicle{
		ID:           uuid.New(),
		LicensePlate: req.LicensePlate,
		Name:         req.Name,
		VehicleType:  req.VehicleType,
		DriverName:   req.DriverName,
		Status:       req.Status,
		Latitude:     req.Latitude,
		Longitude:    req.Longitude,
		Description:  req.Description,
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}

	if err := s.repo.Create(vehicle); err != nil {
		return nil, err
	}

	return vehicle, nil
}

func (s *vehicleService) Update(id string, req *model.UpdateVehicleRequest) (*model.Vehicle, error) {
	vehicle, err := s.repo.FindByID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("vehicle not found")
		}
		return nil, err
	}

	vehicle.LicensePlate = req.LicensePlate
	vehicle.Name = req.Name
	vehicle.VehicleType = req.VehicleType
	vehicle.DriverName = req.DriverName
	vehicle.Status = req.Status
	vehicle.Latitude = req.Latitude
	vehicle.Longitude = req.Longitude
	vehicle.Description = req.Description
	vehicle.UpdatedAt = time.Now()

	if err := s.repo.Update(vehicle); err != nil {
		return nil, err
	}

	return vehicle, nil
}

func (s *vehicleService) Delete(id string) error {
	_, err := s.repo.FindByID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("vehicle not found")
		}
		return err
	}
	return s.repo.Delete(id)
}

func (s *vehicleService) GetSummary() (*model.VehicleSummary, error) {
	return s.repo.GetSummary()
}
