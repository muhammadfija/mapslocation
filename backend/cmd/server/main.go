package main

import (
	"log"

	"github.com/fleettrack/backend/internal/config"
	"github.com/fleettrack/backend/internal/database"
	"github.com/fleettrack/backend/internal/handler"
	"github.com/fleettrack/backend/internal/middleware"
	"github.com/fleettrack/backend/internal/repository"
	"github.com/fleettrack/backend/internal/service"
	"github.com/gin-gonic/gin"
)

func main() {
	// Load config
	cfg := config.Load()

	// Connect to database
	db := database.Connect(cfg.DatabaseURL)

	// Run migrations
	database.Migrate(db)

	// Seed data if empty
	database.Seed(db)

	// Initialize layers
	vehicleRepo := repository.NewVehicleRepository(db)
	vehicleService := service.NewVehicleService(vehicleRepo)
	vehicleHandler := handler.NewVehicleHandler(vehicleService)

	// Setup Gin
	if cfg.Environment == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	r := gin.New()
	r.Use(middleware.ErrorHandler())
	r.Use(middleware.RequestLogger())
	r.Use(middleware.CORS())
	r.NoRoute(middleware.NotFound())

	// API routes
	v1 := r.Group("/api/v1")
	{
		vehicles := v1.Group("/vehicles")
		{
			vehicles.GET("", vehicleHandler.GetVehicles)
			vehicles.GET("/summary", vehicleHandler.GetSummary)
			vehicles.GET("/:id", vehicleHandler.GetVehicle)
			vehicles.POST("", vehicleHandler.CreateVehicle)
			vehicles.PUT("/:id", vehicleHandler.UpdateVehicle)
			vehicles.DELETE("/:id", vehicleHandler.DeleteVehicle)
		}
	}

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	log.Printf("FleetTrack API running on port %s", cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
