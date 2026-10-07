package handler

import (
	"net/http"

	"github.com/fleettrack/backend/internal/model"
	"github.com/fleettrack/backend/internal/service"
	"github.com/fleettrack/backend/internal/validator"
	"github.com/gin-gonic/gin"
)

type VehicleHandler struct {
	service service.VehicleService
}

func NewVehicleHandler(service service.VehicleService) *VehicleHandler {
	return &VehicleHandler{service: service}
}

// GetVehicles godoc
// GET /api/v1/vehicles
func (h *VehicleHandler) GetVehicles(c *gin.Context) {
	var filter model.VehicleFilter
	if err := c.ShouldBindQuery(&filter); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": gin.H{
				"code":    "BAD_REQUEST",
				"message": err.Error(),
			},
		})
		return
	}

	vehicles, err := h.service.GetAll(filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": gin.H{
				"code":    "INTERNAL_ERROR",
				"message": "Failed to fetch vehicles",
			},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": vehicles,
	})
}

// GetVehicle godoc
// GET /api/v1/vehicles/:id
func (h *VehicleHandler) GetVehicle(c *gin.Context) {
	id := c.Param("id")

	vehicle, err := h.service.GetByID(id)
	if err != nil {
		if err.Error() == "vehicle not found" {
			c.JSON(http.StatusNotFound, gin.H{
				"error": gin.H{
					"code":    "NOT_FOUND",
					"message": "Vehicle not found",
				},
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": gin.H{
				"code":    "INTERNAL_ERROR",
				"message": "Failed to fetch vehicle",
			},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": vehicle,
	})
}

// CreateVehicle godoc
// POST /api/v1/vehicles
func (h *VehicleHandler) CreateVehicle(c *gin.Context) {
	var req model.CreateVehicleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": gin.H{
				"code":    "BAD_REQUEST",
				"message": "Invalid request body",
			},
		})
		return
	}

	if validErr := validator.Validate(req); validErr != nil {
		c.JSON(http.StatusUnprocessableEntity, gin.H{
			"error": validErr,
		})
		return
	}

	vehicle, err := h.service.Create(&req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": gin.H{
				"code":    "INTERNAL_ERROR",
				"message": "Failed to create vehicle",
			},
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"data":    vehicle,
		"message": "Vehicle created successfully",
	})
}

// UpdateVehicle godoc
// PUT /api/v1/vehicles/:id
func (h *VehicleHandler) UpdateVehicle(c *gin.Context) {
	id := c.Param("id")

	var req model.UpdateVehicleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": gin.H{
				"code":    "BAD_REQUEST",
				"message": "Invalid request body",
			},
		})
		return
	}

	if validErr := validator.Validate(req); validErr != nil {
		c.JSON(http.StatusUnprocessableEntity, gin.H{
			"error": validErr,
		})
		return
	}

	vehicle, err := h.service.Update(id, &req)
	if err != nil {
		if err.Error() == "vehicle not found" {
			c.JSON(http.StatusNotFound, gin.H{
				"error": gin.H{
					"code":    "NOT_FOUND",
					"message": "Vehicle not found",
				},
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": gin.H{
				"code":    "INTERNAL_ERROR",
				"message": "Failed to update vehicle",
			},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":    vehicle,
		"message": "Vehicle updated successfully",
	})
}

// DeleteVehicle godoc
// DELETE /api/v1/vehicles/:id
func (h *VehicleHandler) DeleteVehicle(c *gin.Context) {
	id := c.Param("id")

	if err := h.service.Delete(id); err != nil {
		if err.Error() == "vehicle not found" {
			c.JSON(http.StatusNotFound, gin.H{
				"error": gin.H{
					"code":    "NOT_FOUND",
					"message": "Vehicle not found",
				},
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": gin.H{
				"code":    "INTERNAL_ERROR",
				"message": "Failed to delete vehicle",
			},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Vehicle deleted successfully",
	})
}

// GetSummary godoc
// GET /api/v1/vehicles/summary
func (h *VehicleHandler) GetSummary(c *gin.Context) {
	summary, err := h.service.GetSummary()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": gin.H{
				"code":    "INTERNAL_ERROR",
				"message": "Failed to fetch summary",
			},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": summary,
	})
}
