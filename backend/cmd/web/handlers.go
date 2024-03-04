package main

import (
	"encoding/json"
	"fmt"
	"github.com/go-ozzo/ozzo-validation/v4"
	"kazakh-aliexpress/backend/pkg/models"
	"net/http"
)

func (app *application) home(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Home page"))
}

func (app *application) signupEmail(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Email string `json:"email"`
	}

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		app.clientError(w, http.StatusBadRequest)
		return
	}

	err = validation.ValidateStruct(&req,
		validation.Field(&req.Email, validation.Required, validation.Length(5, 100)),
	)

	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	err = app.users.SignUpEmail(req.Email)
	if err != nil {
		if err == models.ErrDuplicateEmail {
			w.WriteHeader(http.StatusConflict)
			json.NewEncoder(w).Encode(map[string]string{"error": "Email already in use"})
		} else {
			app.serverError(w, err)
		}
		return
	}
}

func (app *application) loginUser(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "Authenticate and login the user...")
}
func (app *application) logoutUser(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "Logout the user...")
}
