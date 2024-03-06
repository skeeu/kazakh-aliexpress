package main

import (
	"github.com/bmizerany/pat"
	"github.com/justinas/alice"
	"github.com/rs/cors"
	"net/http"
)

func (app *application) routes() http.Handler {

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:4000", "http://localhost:3000"},
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

	mux.Get("/api/v1/users/:userId/cart", dynamicMiddleware.Append(app.authenticate).ThenFunc(app.showCart))
	mux.Patch("/api/v1/users/:userId/cart", dynamicMiddleware.Append(app.authenticate).ThenFunc(app.addToCart))
	mux.Del("/api/v1/users/:userId/cart/:itemId", dynamicMiddleware.Append(app.authenticate).ThenFunc(app.deleteFromCart))

	mux.Get("/api/v1/users/:userId/favorites", dynamicMiddleware.Append(app.authenticate).ThenFunc(app.showFavs))
	mux.Post("/api/v1/users/:userId/favorites", dynamicMiddleware.Append(app.authenticate).ThenFunc(app.addToFav))
	mux.Del("/api/v1/users/:userId/favorites/:itemId", dynamicMiddleware.Append(app.authenticate).ThenFunc(app.deleteFromFav))

	mux.Get("/api/v1/items", dynamicMiddleware.ThenFunc(app.showItems))
	mux.Post("/api/v1/items/add", dynamicMiddleware.Append(app.IsSeller).ThenFunc(app.AddItem))

	// registration
	mux.Post("/api/v1/signup/email", dynamicMiddleware.Append(app.requireNoXAuthJWT).ThenFunc(app.signupEmail))
	mux.Post("/api/v1/signup/code", dynamicMiddleware.Append(app.requireNoXAuthJWT).ThenFunc(app.signupCode))
	mux.Post("/api/v1/signup", dynamicMiddleware.Append(app.requireNoXAuthJWT).ThenFunc(app.signupFinish))

	mux.Post("/api/v1/login", dynamicMiddleware.Append(app.requireNoXAuthJWT).ThenFunc(app.login))

	return standardMiddleware.Then(mux)
}
