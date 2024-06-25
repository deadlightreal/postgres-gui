package routes

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
)

type DropDatabaseRequest struct {
  Database string `json:"database"`
}

func DropDatabase(c *gin.Context, db * sql.DB) {
  var req DropDatabaseRequest
  c.BindJSON(&req)

  _, droppingDatabaseErr := db.Exec("DROP DATABASE "+req.Database)
  if droppingDatabaseErr != nil {
    panic(droppingDatabaseErr.Error())
  }

  c.JSON(http.StatusOK, gin.H{})
}
