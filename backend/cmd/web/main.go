package main

import (
	"context"
	"flag"
	"github.com/golangcollege/sessions"
	"go.mongodb.org/mongo-driver/mongo/options"
	mongoDB "kazakh-aliexpress/backend/pkg/models/mongodb"
	"log"
	"net/http"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
)

type application struct {
	infoLog  *log.Logger
	errorLog *log.Logger
	users    *mongoDB.UserModel
	session  *sessions.Session
}

func main() {

	addr := flag.String("addr", ":4000", "HTTP networks address")
	mongoURI := flag.String("mongoURI", "mongodb+srv://thedakeen:bYOC9DgDKO1zBIfR@cluster0.jbvthwy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", "MongoDB URI")

	flag.Parse()

	secret := flag.String("secret", "s6Ndh+pPbnzHbS*+9Pk8qGWhTzbpa@ge", "Secret key")
	flag.Parse()

	infoLog := log.New(os.Stdout, "INFO\t", log.Ldate|log.Ltime)
	errorLog := log.New(os.Stdout, "ERROR\t", log.Ldate|log.Ltime|log.Lshortfile)

	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(*mongoURI))
	if err != nil {
		errorLog.Fatal(err)
	}

	defer func() {
		if err = client.Disconnect(context.TODO()); err != nil {
			errorLog.Fatal(err)
		}
	}()

	if err := client.Ping(context.TODO(), nil); err != nil {
		errorLog.Fatal(err)
	}
	//else {
	//	fmt.Println("Connected to mongodb")
	//}

	db := client.Database("Qazaq-Aliexpress")

	session := sessions.New([]byte(*secret))
	session.Lifetime = 12 * time.Hour

	app := &application{
		infoLog:  infoLog,
		errorLog: errorLog,
		session:  session,
		users:    mongoDB.NewUserModel(db.Collection("users")),
	}

	srv := &http.Server{
		Addr:     *addr,
		ErrorLog: errorLog,
		Handler:  app.routes(),

		IdleTimeout:  2 * time.Minute,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
	}

	infoLog.Printf("Starting server on %s", *addr)
	err = srv.ListenAndServe()
	errorLog.Fatal(err)

}
