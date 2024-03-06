package main

import (
	"encoding/json"
	"errors"
	"github.com/go-ozzo/ozzo-validation/v4"
	"github.com/go-ozzo/ozzo-validation/v4/is"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"kazakh-aliexpress/backend/pkg/models"
	"log"
	"net/http"
	"regexp"
	"strconv"
)

func (app *application) home(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Home page"))
}

// /////////////////////// CART LOGIC /////////////////////////////
func (app *application) addToCart(w http.ResponseWriter, r *http.Request) {
	userId, ok := r.Context().Value("userID").(string)

	if !ok {
		app.clientError(w, http.StatusUnauthorized)
		return
	}

	userId = r.URL.Query().Get(":userId")

	var req struct {
		ItemId string `json:"itemId"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		app.clientError(w, http.StatusBadRequest)
		return
	}

	userOBJId, err := primitive.ObjectIDFromHex(userId)
	if err != nil {
		app.serverError(w, err)
		return
	}

	itemOBJId, err := primitive.ObjectIDFromHex(req.ItemId)
	if err != nil {
		app.serverError(w, err)
		return
	}

	exists, err := app.items.ItemExists(itemOBJId)
	if err != nil {
		app.serverError(w, err)
		return
	}

	if !exists {
		app.notFound(w)
		return
	}

	if err = app.users.AddItemToCart(userOBJId, itemOBJId); err != nil {
		app.serverError(w, err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusAccepted)
	json.NewEncoder(w).Encode(map[string]string{"message": "Item added to cart"})
}

func (app *application) deleteFromCart(w http.ResponseWriter, r *http.Request) {
	userId, ok := r.Context().Value("userID").(string)

	if !ok {
		app.clientError(w, http.StatusUnauthorized)
		return
	}

	userId = r.URL.Query().Get(":userId")

	var req struct {
		ItemId string `json:"itemId"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		app.clientError(w, http.StatusBadRequest)
		return
	}

	userOBJId, err := primitive.ObjectIDFromHex(userId)
	if err != nil {
		app.serverError(w, err)
		return
	}

	itemOBJId, err := primitive.ObjectIDFromHex(req.ItemId)
	if err != nil {
		app.serverError(w, err)
		return
	}

	// Удаление товара из корзины
	if err = app.users.DeleteItemFromCart(userOBJId, itemOBJId); err != nil {
		app.serverError(w, err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusAccepted)
	json.NewEncoder(w).Encode(map[string]string{"message": "Item removed from cart"})

}

///////////////////////// END OF CART LOGIC /////////////////////////////

///////////////////////// CATEGORIES LOGIC /////////////////////////////

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

func (app *application) showCategory(w http.ResponseWriter, r *http.Request) {
	categoryName := r.URL.Query().Get(":name")
	if categoryName == "" {
		app.notFound(w)
		return
	}
	log.Printf("Requested category: %s", categoryName)

	pageStr := r.URL.Query().Get("page")
	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		page = 1
	}

	pageSize := 10

	exists, err := app.categories.CategoryExists(categoryName)
	if err != nil {
		app.serverError(w, err)
		return
	}
	if !exists {
		app.notFound(w)
		return
	}

	i, err := app.items.GetItemsByCategoryName(categoryName, page, pageSize)
	if err != nil {
		app.serverError(w, err)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	err = json.NewEncoder(w).Encode(i)
	if err != nil {
		app.serverError(w, err)
		return
	}
}

////////////////////////// END OF CATEGORIES LOGIC /////////////////////////////////

func (app *application) showItem(w http.ResponseWriter, r *http.Request) {
	itemId := r.URL.Query().Get(":itemId")

	i, err := app.items.GetItem(itemId)

	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			app.notFound(w)
		} else {
			app.serverError(w, err)
			return
		}
		return
	}

	w.Header().Set("Content-Type", "application/json")

	err = json.NewEncoder(w).Encode(i)
	if err != nil {
		app.serverError(w, err)
		return
	}
}

func (app *application) showItems(w http.ResponseWriter, r *http.Request) {
	pageStr := r.URL.Query().Get("page")
	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		page = 1
	}
	pageSize := 10

	var i []*models.Item
	category_id := r.URL.Query().Get("category_id")

	exists, err := app.categories.CategoryExistsById(category_id)
	if err != nil {
		app.serverError(w, err)
		return
	}
	if exists {
		i, err = app.items.GetItemsByCategoryId(category_id, page, pageSize)
		if err != nil {
			app.serverError(w, err)
			return
		}
	} else {
		i, err = app.items.GetItems(page, pageSize)
		if err != nil {
			app.serverError(w, err)
			return
		}
	}

	w.Header().Set("Content-Type", "application/json")

	err = json.NewEncoder(w).Encode(i)
	if err != nil {
		app.serverError(w, err)
		return
	}
}

func (app *application) AddItem(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Categories []string `json:"categories,omitempty"`
		Price      float64  `json:"price"`
		ItemName   string   `json:"item_name"`
		Photos     []string `json:"item_photos"`
	}
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		app.clientError(w, http.StatusBadRequest)
		return
	}
	err = validation.ValidateStruct(&req,
		validation.Field(&req.Categories, validation.Required),
		validation.Field(&req.Price, validation.Required),
		validation.Field(&req.ItemName, validation.Required),
		validation.Field(&req.Photos),
	)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}
	var categories []*models.Category
	for _, category_id := range req.Categories {
		c, err := app.categories.GetById(category_id)
		if err != nil {
			app.serverError(w, err)
		}
		categories = append(categories, c)
	}
	err = app.items.SetItem(categories, req.Price, req.ItemName, req.Photos)
	if err != nil {
		app.serverError(w, err)
	}
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": `successfully added`})
}

////////////////////////// AUTH LOGIC /////////////////////////////////

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
	err = app.users.CheckEmail(req.Email)
	if err != nil {
		if errors.Is(err, models.ErrDuplicateEmail) {
			w.WriteHeader(http.StatusConflict)
			json.NewEncoder(w).Encode(map[string]string{"error": "Email already in use"})
		} else {
			app.serverError(w, err)
		}
		return
	}
	err = app.otps.SignUpEmail(req.Email)
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

	isValid, err := app.otps.SignUpConfirmCode(email, req.Code)
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

	userId, userRole, err := app.users.Authenticate(req.Email, req.Password)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"error": "Incorrect email or password"})
		return
	}

	jwt, err := app.generateJWTsignIn(userId, req.Email, userRole)
	if err != nil {
		app.serverError(w, err)
		return
	}
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"Token": jwt})
}
