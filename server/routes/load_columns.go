package routes

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
)

type LoadColumnsRequest struct {
  Database string `form:"database"`
  Table string `form:"table"`
}

func LoadColumns(c *gin.Context, connstr string) {
  var req LoadColumnsRequest
  c.ShouldBind(&req)

  var Tables []map[string]interface{}

  db, dbErr := sql.Open("postgres", connstr+" dbname="+req.Database)
  if dbErr != nil {
    panic(dbErr.Error())
  }

  Rows, err := db.Query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = $1", req.Table)
  if err != nil {
    panic(err.Error())
  }

  for Rows.Next() {
    var name string
    var column_type string

    Rows.Scan(&name, &column_type)

    table := map[string]interface{}{
      "Name": name,
      "Type": column_type,
    }

    Tables = append(Tables, table)
  }

  c.JSON(http.StatusOK, gin.H{"data": Tables})
}
