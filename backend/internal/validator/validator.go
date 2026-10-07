package validator

import (
	"fmt"

	govalidator "github.com/go-playground/validator/v10"
)

type ValidationError struct {
	Code    string            `json:"code"`
	Message string            `json:"message"`
	Fields  map[string]string `json:"fields,omitempty"`
}

var validate = govalidator.New()

func Validate(s interface{}) *ValidationError {
	err := validate.Struct(s)
	if err == nil {
		return nil
	}

	fields := make(map[string]string)
	for _, e := range err.(govalidator.ValidationErrors) {
		fields[lcFirst(e.Field())] = getErrorMessage(e)
	}

	return &ValidationError{
		Code:    "VALIDATION_ERROR",
		Message: "Invalid request",
		Fields:  fields,
	}
}

func lcFirst(s string) string {
	if len(s) == 0 {
		return s
	}
	return fmt.Sprintf("%c%s", s[0]+32, s[1:])
}

func getErrorMessage(e govalidator.FieldError) string {
	switch e.Tag() {
	case "required":
		return fmt.Sprintf("%s is required", e.Field())
	case "min":
		if e.Type().Kind().String() == "string" {
			return fmt.Sprintf("%s must be at least %s characters", e.Field(), e.Param())
		}
		return fmt.Sprintf("%s must be at least %s", e.Field(), e.Param())
	case "max":
		return fmt.Sprintf("%s must be at most %s", e.Field(), e.Param())
	case "oneof":
		return fmt.Sprintf("%s must be one of: %s", e.Field(), e.Param())
	default:
		return fmt.Sprintf("%s is invalid", e.Field())
	}
}
