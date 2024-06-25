package routes

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
)

type request struct {
  Name string `json:"name"`
}

func CreateNewDatabase(c *gin.Context, db *sql.DB) {
  var req request
  c.BindJSON(&req)

  _, creatingNewDatabaseErr := db.Exec("CREATE DATABASE "+req.Name)
  if creatingNewDatabaseErr != nil {
    panic(creatingNewDatabaseErr.Error())
  }

  c.JSON(http.StatusOK, gin.H{})
}
