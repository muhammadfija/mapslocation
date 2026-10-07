package validator

import (
	"testing"
)

type TestStruct struct {
	Name     string  `validate:"required,min=3"`
	Age      int     `validate:"min=18"`
	Status   string  `validate:"required,oneof=ACTIVE IDLE"`
	Latitude float64 `validate:"required,min=-90,max=90"`
}

func TestValidate(t *testing.T) {
	tests := []struct {
		name          string
		input         TestStruct
		expectedError bool
		expectedMsg   string
	}{
		{
			name: "Valid input",
			input: TestStruct{
				Name:     "Test Name",
				Age:      20,
				Status:   "ACTIVE",
				Latitude: 0,
			},
			expectedError: false,
		},
		{
			name: "Missing required field",
			input: TestStruct{
				Age:      20,
				Status:   "ACTIVE",
				Latitude: 0,
			},
			expectedError: true,
			expectedMsg:   "Name is required",
		},
		{
			name: "Value too short",
			input: TestStruct{
				Name:     "ab",
				Age:      20,
				Status:   "ACTIVE",
				Latitude: 0,
			},
			expectedError: true,
			expectedMsg:   "Name must be at least 3 characters",
		},
		{
			name: "Invalid enum",
			input: TestStruct{
				Name:     "Test Name",
				Age:      20,
				Status:   "INVALID",
				Latitude: 0,
			},
			expectedError: true,
			expectedMsg:   "Status must be one of: ACTIVE IDLE",
		},
		{
			name: "Latitude out of range",
			input: TestStruct{
				Name:     "Test Name",
				Age:      20,
				Status:   "ACTIVE",
				Latitude: 95,
			},
			expectedError: true,
			expectedMsg:   "Latitude must be at most 90",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := Validate(tt.input)

			if tt.expectedError && err == nil {
				t.Errorf("expected validation error, got nil")
			}

			if !tt.expectedError && err != nil {
				t.Errorf("expected no error, got %v", err)
			}

			if tt.expectedError && err != nil {
				// Check if the specific error message we expected is in any of the fields
				found := false
				for _, msg := range err.Fields {
					if msg == tt.expectedMsg {
						found = true
						break
					}
				}
				if !found {
					t.Errorf("expected error message '%s' not found in fields: %v", tt.expectedMsg, err.Fields)
				}
			}
		})
	}
}
