package main

import (
	"github.com/bmizerany/pat"
	"github.com/justinas/alice"
	"net/http"
)

func (app *application) routes() http.Handler {
	standardMiddleware := alice.New(app.recoverPanic, app.logRequest, secureHeaders)
	dynamicMiddleware := alice.New(app.session.Enable)

	mux := pat.New()

	mux.Get("/", dynamicMiddleware.ThenFunc(app.home))

	// registration
	mux.Get("/api/v1/signup/email", dynamicMiddleware.ThenFunc(app.signupEmail))
	mux.Post("/api/v1/signup/email", dynamicMiddleware.ThenFunc(app.signupEmail))

	return standardMiddleware.Then(mux)
}
