package routes

import (
	"database/sql"
	"fmt"
  "net/http"

	"github.com/gin-gonic/gin"
)

type NewTableData struct {
  Name string `json:"name"`
  Columns []NewTableColumn `json:"columns"`
}

type NewTableColumn struct {
    Name         string `json:"name"`
    ColumnType   string `json:"type"`
    KeyType      string `json:"key_type"`
    DefaultValue string `json:"default_value"`
}

type CreateNewTableRequest struct {
  Database string `json:"database"`
  NewTableData NewTableData `json:"new_table_data"`
}

func CreateNewTable(c *gin.Context, connStr string) {
  var req CreateNewTableRequest
  c.BindJSON(&req)

  db, dbErr := sql.Open("postgres", connStr+" dbname="+req.Database)
  if dbErr != nil {
    panic(dbErr.Error())
  }

  db.Ping()

  Query := fmt.Sprintf("create table %s (", req.NewTableData.Name)
  
  var index int

  for index < len(req.NewTableData.Columns) {
    column := req.NewTableData.Columns[index]
    col := fmt.Sprintf(" %s %s", column.Name, column.ColumnType)
    if column.KeyType != "none" {
      col += fmt.Sprintf(" %s key", column.KeyType)
    }
    if column.DefaultValue != "" {
      col += fmt.Sprintf(" default value %s", column.DefaultValue)
    }
    Query += col
    if (index+1 < len(req.NewTableData.Columns)) {
      Query += ","
    }
    index++
  }

  Query += ");";

  _, ErrorCreatingTable := db.Exec(Query)
  if ErrorCreatingTable != nil {
    panic(ErrorCreatingTable.Error())
  }

  c.JSON(http.StatusOK, gin.H{})
}
