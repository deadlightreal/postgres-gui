package routes

import (
	"database/sql"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

type CreateNewColumnRequest struct {
  Database string `json:"database"`
  Data NewTableColumn `json:"data"`
  Table string `json:"table"`
}

func CreateNewColumn(c *gin.Context, connectionString string) {
  var req CreateNewColumnRequest
  c.BindJSON(&req)

  db, dbErr := sql.Open("postgres", connectionString+" dbname="+req.Database)
  if dbErr != nil {
    panic(dbErr.Error())
  }

  Query := fmt.Sprintf("ALTER TABLE %s ADD COLUMN %s %s", req.Table, req.Data.Name, req.Data.ColumnType)

  if req.Data.KeyType != "none" { Query += fmt.Sprintf(" %s KEY", req.Data.KeyType) }
  if req.Data.DefaultValue != "" { Query += fmt.Sprintf(" DEFAULT %s", req.Data.DefaultValue) }

  _, CreatingColumnErr := db.Exec(Query)
  if CreatingColumnErr != nil {
    panic(CreatingColumnErr.Error())
  }

  c.JSON(http.StatusOK, gin.H{})
}
