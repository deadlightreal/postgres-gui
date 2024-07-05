package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"project/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

type ExecuteQueryRequest struct {
  Database string `json:"database"`
  Query string `json:"query"`
}

type ExecuteSelectRequest struct {
  Database string `form:"database"`
  Query string `form:"query"`
}

func main() {
  r := gin.Default()
  r.Use(cors.Default())

  user := "kokot"
  password := "122008Ri__"
  host := "localhost"
  port := "5432"

  connStr := "user="+user+" password="+password+" host="+host+" port="+port+" sslmode=disable"

  generalDB, generalDBErr := sql.Open("postgres", connStr+" dbname=postgres")
  if generalDBErr != nil {
    panic(generalDBErr.Error())
  }

  r.GET("/executeSelect", func(c *gin.Context) {
    var req ExecuteSelectRequest
    c.ShouldBind(&req)

    db, err := sql.Open("postgres", connStr+" dbname="+req.Database)
    if err != nil {
      panic(err.Error())
    }

    rows, err := db.Query(req.Query)
    if err != nil {
      panic(err.Error())
    }

    columns, err := rows.Columns()
	  if err != nil {
		  log.Fatal(err)
	  }

	  // Prepare a slice to hold the data
	  results := make([][]interface{}, 0)

	  // Iterate over the rows
	  for rows.Next() {
		  // Create a slice to hold the values of this row
		  values := make([]interface{}, len(columns))
		  valuePtrs := make([]interface{}, len(columns))

		  for i := range values {
			  valuePtrs[i] = &values[i]
		  }

		  // Scan the row into the slice
		  err := rows.Scan(valuePtrs...)
		  if err != nil {
			  log.Fatal(err)
		  }

		// Append the values to the results slice
		  results = append(results, values)
	  }

	  // Check for errors from iterating over rows
	  if err = rows.Err(); err != nil {
		  log.Fatal(err)
	  }

	  // Print the results
	  for _, row := range results {
		  for i, col := range row {
			  fmt.Printf("%s: %v\n", columns[i], col)
		  }
		  fmt.Println()
	  }

    c.JSON(http.StatusOK, gin.H{"data": results, "names": columns})
  })

  r.POST("/executeQuery", func(c *gin.Context) {
    var req ExecuteQueryRequest
    c.BindJSON(&req)

    db, err := sql.Open("postgres", connStr+" dbname="+req.Database)
    if err != nil {
      panic(err.Error())
    }

    _, execErr := db.Exec(req.Query)
    if execErr != nil {
      panic(execErr.Error())
    }

    c.JSON(http.StatusOK, gin.H{})
  })

  r.GET("/loadDatabases", func(c *gin.Context) {
    db, err := sql.Open("postgres", connStr+" dbname=postgres")
    if err != nil {
        log.Fatal(err)
    }
    defer db.Close()

    var data []map[string]interface{}

    rows, err := db.Query("SELECT datname FROM pg_database WHERE datistemplate = false AND datname != 'postgres';")
    if err != nil {
        log.Fatal(err)
    }
    defer rows.Close()

    for rows.Next() {
        var name string
        if err := rows.Scan(&name); err != nil {
            log.Fatal(err)
        }

        anotherConnStr := fmt.Sprintf("%s dbname=%s", connStr, name)
        another_db, err := sql.Open("postgres", anotherConnStr)
        if err != nil {
            log.Fatal(err)
        }
        defer another_db.Close()

        tableRows, err := another_db.Query("SELECT table_name FROM information_schema.tables WHERE table_type = 'BASE TABLE' AND table_schema NOT IN ('pg_catalog', 'information_schema');")
        if err != nil {
            log.Fatal(err)
        }
        defer tableRows.Close()
        
        var tables []map[string]interface{}

        for tableRows.Next() {
            var table string
            if err := tableRows.Scan(&table); err != nil {
                log.Fatal(err)
            }

            tableMap := map[string]interface{} {
              "name": table,
            }
            
            tables = append(tables, tableMap)
        }

        if err := tableRows.Err(); err != nil {
            log.Fatal(err)
        }

        dbMap := map[string]interface{} {
          "name": name,
          "tables": tables,
        }

        data = append(data, dbMap)
    }

    if err := rows.Err(); err != nil {
        log.Fatal(err)
    }

    c.JSON(http.StatusOK, gin.H{"data": data})
  })

  r.POST("/createNewDatabase", func(c *gin.Context) { routes.CreateNewDatabase(c, generalDB) })
  r.POST("/dropDatabase", func(c *gin.Context) { routes.DropDatabase(c, generalDB) })
  r.POST("/createNewTable", func(c *gin.Context) { routes.CreateNewTable(c, connStr) })
  r.POST("/createNewColumn", func(c *gin.Context) { routes.CreateNewColumn(c, connStr) })

  r.GET("/loadColumns", func(c *gin.Context) { routes.LoadColumns(c, connStr) })

  r.Run("localhost:8940")
}
