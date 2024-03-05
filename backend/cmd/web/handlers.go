package main

import (
	"encoding/json"
	"github.com/go-ozzo/ozzo-validation/v4"
	"github.com/go-ozzo/ozzo-validation/v4/is"
	"kazakh-aliexpress/backend/pkg/models"
	"net/http"
	"regexp"
)

func (app *application) home(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Home page"))
}

func (app *application) showAllCategories(w http.ResponseWriter, r *http.Request) {
	c, err := app.categories.GetAll()

	if err != nil {
		app.serverError(w, err)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	err = json.NewEncoder(w).Encode(c)
	if err != nil {
		app.serverError(w, err)
		return
	}
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
		validation.Field(&req.Email, validation.Required, validation.Length(5, 100), is.Email),
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

	tokenString, err := app.generateJWTsignUp(req.Email)
	if err != nil {
		app.serverError(w, err)
		return
	}

	w.WriteHeader(http.StatusAccepted)
	json.NewEncoder(w).Encode(map[string]string{"token": tokenString})

}

func (app *application) signupCode(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Code string `json:"code"`
	}

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		app.clientError(w, http.StatusBadRequest)
		return
	}

	tokenString := r.Header.Get("Authorization")
	if tokenString == "" {
		app.clientError(w, http.StatusUnauthorized)
		return
	}

	email, err := app.getEmailFromSignUpToken(tokenString)
	if err != nil {
		app.serverError(w, err)
		return
	}

	isValid, err := app.users.SignUpConfirmCode(email, req.Code)
	if err != nil {
		app.serverError(w, err)
		return
	}

	if !isValid {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid or expired code"})
		return
	}

	json.NewEncoder(w).Encode(map[string]string{"message": "Verification successful"})
}

func (app *application) signupFinish(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Name     string `json:"name"`
		Password string `json:"password"`
	}

	err := json.NewDecoder(r.Body).Decode(&req)

	if err != nil {
		app.clientError(w, http.StatusBadRequest)
		return
	}

	err = validation.ValidateStruct(&req,
		validation.Field(&req.Name, validation.Required, validation.Length(2, 25), validation.Match(regexp.MustCompile("^[a-zA-Z]+$")).Error("letters only")),
		validation.Field(&req.Password, validation.Required, validation.Length(5, 30)),
	)

	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	tokenString := r.Header.Get("Authorization")
	if tokenString == "" {
		app.clientError(w, http.StatusUnauthorized)
		return
	}

	email, err := app.getEmailFromSignUpToken(tokenString)
	if err != nil {
		app.serverError(w, err)
		return
	}

	err = app.users.SignUpComplete(email, req.Name, req.Password)
	if err != nil {
		app.serverError(w, err)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "Signup successful"})
}

func (app *application) login(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	err := json.NewDecoder(r.Body).Decode(&req)

	if err != nil {
		app.clientError(w, http.StatusBadRequest)
		return
	}
	err = validation.ValidateStruct(&req,
		validation.Field(&req.Email, validation.Required, validation.Length(5, 100), is.Email),
		validation.Field(&req.Password, validation.Required, validation.Length(5, 30)),
	)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	err = app.users.Authenticate(req.Email, req.Password)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"error": "Incorrect email or password"})
		return
	}

	jwt, err := app.generateJWTsignIn(req.Email)
	if err != nil {
		app.serverError(w, err)
		return
	}
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"Token": jwt})
}
