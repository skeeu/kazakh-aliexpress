package main

import (
	"github.com/bmizerany/pat"
	"github.com/justinas/alice"
	"github.com/rs/cors"
	"net/http"
)

func (app *application) routes() http.Handler {

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:4000"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Authorization", "Content-Type", "X-Auth"},
		AllowCredentials: true,
		Debug:            true,
	})

	standardMiddleware := alice.New(app.recoverPanic, app.logRequest, secureHeaders, c.Handler)
	dynamicMiddleware := alice.New()

	mux := pat.New()

	mux.Get("/", dynamicMiddleware.ThenFunc(app.home))

	// registration
	mux.Post("/api/v1/signup/email", dynamicMiddleware.Append(app.requireNoXAuthJWT).ThenFunc(app.signupEmail))
	mux.Post("/api/v1/signup/code", dynamicMiddleware.Append(app.requireNoXAuthJWT).ThenFunc(app.signupCode))
	mux.Post("/api/v1/signup", dynamicMiddleware.Append(app.requireNoXAuthJWT).ThenFunc(app.signupFinish))

	mux.Post("/api/v1/login", dynamicMiddleware.Append(app.requireNoXAuthJWT).ThenFunc(app.login))

	return standardMiddleware.Then(mux)
}
