package main

import (
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"net/http"
	"runtime/debug"
	"time"
)

func (app *application) serverError(w http.ResponseWriter, err error) {
	trace := fmt.Sprintf("%s\n%s", err.Error(), debug.Stack())
	app.errorLog.Output(2, trace)

	http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
}

func (app *application) clientError(w http.ResponseWriter, status int) {
	http.Error(w, http.StatusText(status), status)
}

func (app *application) notFound(w http.ResponseWriter) {
	app.clientError(w, http.StatusNotFound)
}

func (app *application) generateJWTsignUp(email string) (string, error) {
	expirationTime := time.Now().Add(12 * time.Minute)

	claims := &jwt.StandardClaims{
		Subject:   email,
		ExpiresAt: expirationTime.Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte("s6Ndh+pPbnzHbS*+9Pk8qGWhTzbpa@ge"))

	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func (app *application) getEmailFromSignUpToken(tokenString string) (string, error) {
	claims := &jwt.StandardClaims{}

	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte("s6Ndh+pPbnzHbS*+9Pk8qGWhTzbpa@ge"), nil
	})

	if err != nil || !token.Valid {
		return "", err
	}

	return claims.Subject, nil
}

// ///////////////////////////////////////////////
type AppClaims struct {
	jwt.StandardClaims
	UserID string `json:"userId"`
	Email  string `json:"email"`
	Role   string `json:"role"`
}

func (app *application) generateJWTsignIn(userId, email, role string) (string, error) {
	expirationTime := time.Now().Add(12 * time.Hour)

	claims := &AppClaims{
		UserID: userId,
		Email:  email,
		Role:   role,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte("s7Ndh+pPznbHbS*+9Pk8qGWhTzbpa@tw"))

	if err != nil {
		return "", err
	}

	return tokenString, nil
}
