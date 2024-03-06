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
	mux.Get("/api/v1/categories", dynamicMiddleware.ThenFunc(app.showAllCategories))
	mux.Get("/api/v1/categories/:name", dynamicMiddleware.ThenFunc(app.showCategory))
	mux.Get("/api/v1/item/:itemId", dynamicMiddleware.ThenFunc(app.showItem))
	mux.Post("/api/v1/cart/add/:userId", dynamicMiddleware.Append(app.authenticate).ThenFunc(app.addToCart))
	mux.Post("/api/v1/cart/remove/:userId", dynamicMiddleware.Append(app.authenticate).ThenFunc(app.deleteFromCart))

	mux.Get("/api/v1/items", dynamicMiddleware.ThenFunc(app.showItems))

	// registration
	mux.Post("/api/v1/signup/email", dynamicMiddleware.Append(app.requireNoXAuthJWT).ThenFunc(app.signupEmail))
	mux.Post("/api/v1/signup/code", dynamicMiddleware.Append(app.requireNoXAuthJWT).ThenFunc(app.signupCode))
	mux.Post("/api/v1/signup", dynamicMiddleware.Append(app.requireNoXAuthJWT).ThenFunc(app.signupFinish))

	mux.Post("/api/v1/login", dynamicMiddleware.Append(app.requireNoXAuthJWT).ThenFunc(app.login))

	return standardMiddleware.Then(mux)
}
