package main

import (
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"net/http"
)

// no access for signup/login by authenticated users
func (app *application) requireNoXAuthJWT(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		tokenString := r.Header.Get("X-Auth")
		if tokenString != "" {
			token, err := jwt.ParseWithClaims(tokenString, &AppClaims{}, func(token *jwt.Token) (interface{}, error) {
				return []byte("s7Ndh+pPbnzHbS*+9Pk8qGWhTzbpa@ge"), nil
			})

			if err == nil && token.Valid {
				app.clientError(w, http.StatusForbidden)
				return
			}
		}
		next.ServeHTTP(w, r)
	})
}

// check if user authenticated (e.g. access for cart)
func (app *application) authenticate(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		tokenString := r.Header.Get("X-Auth")
		if tokenString == "" {
			app.clientError(w, http.StatusUnauthorized)
			return
		}

		claims := &AppClaims{}
		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return []byte("s7Ndh+pPbnzHbS*+9Pk8qGWhTzbpa@ge"), nil
		})

		if err != nil || !token.Valid {
			app.clientError(w, http.StatusForbidden)
			return
		}
	})
}

//////////////////////////////////////////////////////////////

func secureHeaders(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("X-XSS-Protection", "1; mode=block")
		w.Header().Set("X-Frame-Options", "deny")
		next.ServeHTTP(w, r)
	})
}

func (app *application) logRequest(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		app.infoLog.Printf("%s - %s %s %s", r.RemoteAddr, r.Proto, r.Method, r.URL.RequestURI())
		next.ServeHTTP(w, r)
	})
}

func (app *application) recoverPanic(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if err := recover(); err != nil {
				w.Header().Set("Connection", "close")
				app.serverError(w, fmt.Errorf("%s", err))
			}
		}()
		next.ServeHTTP(w, r)
	})
}
