package database

import (
	"log"
	"time"

	"github.com/fleettrack/backend/internal/model"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Seed populates the database with dummy data if empty
func Seed(db *gorm.DB) {
	var count int64
	db.Model(&model.Vehicle{}).Count(&count)
	if count > 0 {
		log.Println("Database already has data, skipping seed")
		return
	}

	vehicles := []model.Vehicle{
		{
			ID:           uuid.New(),
			LicensePlate: "B 1234 ABC",
			Name:         "Delivery Van 01",
			VehicleType:  model.TypeVan,
			DriverName:   "Ahmad Fauzi",
			Status:       model.StatusActive,
			Latitude:     -6.2088,
			Longitude:    106.8456,
			Description:  "Kendaraan operasional pengiriman wilayah Jakarta Pusat",
			CreatedAt:    time.Now(),
			UpdatedAt:    time.Now(),
		},
		{
			ID:           uuid.New(),
			LicensePlate: "B 5678 XYZ",
			Name:         "Truck Besar 01",
			VehicleType:  model.TypeTruck,
			DriverName:   "Budi Santoso",
			Status:       model.StatusIdle,
			Latitude:     -6.5971,
			Longitude:    106.7960,
			Description:  "Truk pengiriman barang berat wilayah Bogor",
			CreatedAt:    time.Now(),
			UpdatedAt:    time.Now(),
		},
		{
			ID:           uuid.New(),
			LicensePlate: "D 9012 DEF",
			Name:         "Pickup 01",
			VehicleType:  model.TypePickup,
			DriverName:   "Candra Wijaya",
			Status:       model.StatusOffline,
			Latitude:     -6.9175,
			Longitude:    107.6191,
			Description:  "Pickup untuk distribusi wilayah Bandung",
			CreatedAt:    time.Now(),
			UpdatedAt:    time.Now(),
		},
		{
			ID:           uuid.New(),
			LicensePlate: "B 2345 GHI",
			Name:         "Motor Kurir 01",
			VehicleType:  model.TypeMotorcycle,
			DriverName:   "Deni Hermawan",
			Status:       model.StatusActive,
			Latitude:     -6.3741,
			Longitude:    106.8296,
			Description:  "Motor kurir untuk pengiriman cepat wilayah Depok",
			CreatedAt:    time.Now(),
			UpdatedAt:    time.Now(),
		},
		{
			ID:           uuid.New(),
			LicensePlate: "B 3456 JKL",
			Name:         "Mobil Operasional 01",
			VehicleType:  model.TypeCar,
			DriverName:   "Eko Prasetyo",
			Status:       model.StatusActive,
			Latitude:     -6.2297,
			Longitude:    106.6891,
			Description:  "Mobil operasional divisi sales wilayah Tangerang",
			CreatedAt:    time.Now(),
			UpdatedAt:    time.Now(),
		},
		{
			ID:           uuid.New(),
			LicensePlate: "B 4567 MNO",
			Name:         "Van Ekspres 01",
			VehicleType:  model.TypeVan,
			DriverName:   "Fajar Nugraha",
			Status:       model.StatusIdle,
			Latitude:     -6.2615,
			Longitude:    106.9825,
			Description:  "Van ekspres wilayah Bekasi",
			CreatedAt:    time.Now(),
			UpdatedAt:    time.Now(),
		},
		{
			ID:           uuid.New(),
			LicensePlate: "B 7890 PQR",
			Name:         "Truck Sedang 02",
			VehicleType:  model.TypeTruck,
			DriverName:   "Gunawan Setiawan",
			Status:       model.StatusActive,
			Latitude:     -6.1751,
			Longitude:    106.8650,
			Description:  "Truk distribusi wilayah Jakarta Utara",
			CreatedAt:    time.Now(),
			UpdatedAt:    time.Now(),
		},
		{
			ID:           uuid.New(),
			LicensePlate: "F 1111 STU",
			Name:         "Pickup Karawang 01",
			VehicleType:  model.TypePickup,
			DriverName:   "Hendra Kusuma",
			Status:       model.StatusOffline,
			Latitude:     -6.3233,
			Longitude:    107.3381,
			Description:  "Pickup operasional wilayah Karawang",
			CreatedAt:    time.Now(),
			UpdatedAt:    time.Now(),
		},
		{
			ID:           uuid.New(),
			LicensePlate: "B 2222 VWX",
			Name:         "Motor Kurir 02",
			VehicleType:  model.TypeMotorcycle,
			DriverName:   "Irfan Maulana",
			Status:       model.StatusActive,
			Latitude:     -6.2615,
			Longitude:    106.7825,
			Description:  "Motor kurir Jakarta Barat",
			CreatedAt:    time.Now(),
			UpdatedAt:    time.Now(),
		},
		{
			ID:           uuid.New(),
			LicensePlate: "E 3333 YZA",
			Name:         "Mobil Operasional 02",
			VehicleType:  model.TypeCar,
			DriverName:   "Joko Widodo",
			Status:       model.StatusIdle,
			Latitude:     -7.2575,
			Longitude:    112.7521,
			Description:  "Mobil operasional wilayah Surabaya",
			CreatedAt:    time.Now(),
			UpdatedAt:    time.Now(),
		},
	}

	for _, v := range vehicles {
		if err := db.Create(&v).Error; err != nil {
			log.Printf("Failed to seed vehicle %s: %v", v.LicensePlate, err)
		}
	}

	log.Printf("Database seeded with %d vehicles", len(vehicles))
}
