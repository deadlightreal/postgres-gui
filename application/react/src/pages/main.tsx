import { lazy, memo, useEffect, useState } from "react"
import axios from "axios"
import Database from "../types/database.tsx";
import Table from "../types/table.tsx";
import Config from "../config";
import Column from "../types/column.tsx";
import NewTableData from "../types/new_table_data.tsx";
import NewTableColumn from "../types/new_table_column.tsx";
const NewColumnComponent = lazy(() => import("../components/new_column_component.tsx"));
const NewTableComponent = lazy(() => import("../components/new_table_component.tsx"));
const QueryComponent = lazy(() => import("../components/query_component.tsx"));
const CreateNewDatabaseComponent = lazy(() => import("../components/create_new_database_component.tsx"));
const InvisibleWindowCloser = lazy(() => import("../components/invisible_window_closer.tsx"));
const DropDatabaseConfirmation = lazy(() => import("../components/drop_database_confirmation.tsx"));
const NavigationTree = lazy(() => import("../components/navigation_tree.tsx"));

const Main = () => {
  const [databases, setDatabases] = useState<Array<Database> | null>(null);
  const [selectedDatabase, setSelectedDatabase] = useState<number>(-1);  const [queryResults, setQueryResults] = useState<any | null>(null);
  const [createNewDatabaseWindowEnabled, setCreateNewDatabaseWindowEnabled] = useState<boolean>(false);
  const [areYouSureDropDatabaseWindowEnabled, setAreYouSureDropDatabaseWindowEnabled] = useState<boolean>(false);
  const [dropDatabaseIndex, setDropDatabaseIndex] = useState<number>(-1);
  const [selectedDatabaseColumn, setSelectedDatabaseColumn] = useState<number>(-1);
  const [columns, setColumns] = useState<Array<Column> | null>();
  const [newTableScreenEnabled, setNewTableScreenEnabled] = useState<boolean>(false);
  const [newColumnScreenEnabled, setNewColumnScreenEnabled] = useState<boolean>(false); 

  const loadDatabases = () => {
    axios({
      url: "http://localhost:8940/loadDatabases",
      method: "GET",
    }).then(response => {
      setDatabases(response.data["data"]);
      console.log(response.data["data"]);
    })
  }

  const executeSelect = (query : string) => {
    if(databases == null || selectedDatabase == -1) return;
    axios({
      url: `http://localhost:8940/executeSelect?query=${query}&database=${databases[selectedDatabase]["name"]}`,
      method: "GET",
    }).then(response => {
        setQueryResults(response.data);
    })
  }

  const executeQuery = (query : string) => {
    if(databases == null || selectedDatabase == -1) return;
    axios({
      url: "http://localhost:8940/executeQuery",
      method: "POST",
      headers: {"Content-Type": 'application/json'},
      data: JSON.stringify({"database": databases[selectedDatabase]["name"], "query": query}),
    }).then(response => {
    })
  }

  const createNewTable = (data: NewTableData) => {
    if(databases == null) { return }
    axios({
      url: `${Config.url}/createNewTable`,
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      data: JSON.stringify({"database": databases[selectedDatabase].name, "new_table_data": data}),
    })
  }

  const dropDatabase = (index : number) => {
    if(databases == null) return;
    axios({
      url: `${Config["url"]}/dropDatabase`,
      method: "POST",
      headers: {"Content-Type": 'application/json'},
      data: JSON.stringify({"database": databases[index].name}),
    }).then(response => {
      if(response.status == 200) {
        const clone = [...databases];
        clone.splice(index, 1);
        setDatabases(clone);
        setDropDatabaseIndex(-1);
        setAreYouSureDropDatabaseWindowEnabled(false);
      }
    })
  }

  const loadTableColumns = (index : number) => {
    if (databases == null) return

    const name = databases[selectedDatabase].tables[index].name;

    axios({
      url: `${Config.url}/loadColumns?table=${name}&database=${databases[selectedDatabase].name}`,
      method: "GET",
    }).then(response => {
      if(response.status == 200) {
        setColumns(response.data["data"]);  
      }
    })
  }

  const createNewColumn = (data : NewTableColumn) => {
    if(databases == null) return
    axios({
      url: `${Config.url}/createNewColumn`,
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      data: {"data": data, "database": databases[selectedDatabase].name, "table": databases[selectedDatabase].tables[selectedDatabaseColumn].name},
    }).then(response => {
      if(response.status == 200) {
        setNewColumnScreenEnabled(false);
        if(columns != null) {
          const clone = [...columns];
          const newCol : Column = {Type: data.type, Name: data.name};
          clone.push(newCol);
          setColumns(clone);
        } else {
          const newCol : Column = {Type: data.type, Name: data.name};
          const newColumns = [newCol];
          setColumns(newColumns);
        }
      }
    })
  }

  const createNewDatabase = (name : string) => {
    axios({
      url: "http://localhost:8940/createNewDatabase",
      method: "POST",
      headers: {"Content-Type": 'application/json'},
      data: JSON.stringify({"name": name}),
    }).then(response => {
      if(response.status == 200) {
        setNewColumnScreenEnabled(false);
        let clone : Array<Database> = [];
        if(databases != null) {
          clone = [...databases];
        }
        const newDB : Database = {name: name, tables: []};
        clone.push(newDB);
        setDatabases(clone);
        setCreateNewDatabaseWindowEnabled(false);
      }
    })
  }

  useEffect(() => {
    loadDatabases();
  }, [])

  return (
    <div className="w-full h-full absolute left-0 top-0">
      <NewColumnComponent enabled={newColumnScreenEnabled} onCreateNewColumn={data => createNewColumn(data)} />
      <NewTableComponent enabled={newTableScreenEnabled} onCreateNewTable={data => createNewTable(data)} />        <InvisibleWindowCloser enabled={createNewDatabaseWindowEnabled} closeWindows={() => {setCreateNewDatabaseWindowEnabled(false);}} />
      <CreateNewDatabaseComponent enabled={createNewDatabaseWindowEnabled} createNewDatabase={createNewDatabase} />
      <DropDatabaseConfirmation databaseName={databases != null && dropDatabaseIndex != -1 ? databases[dropDatabaseIndex].name : ""} enabled={areYouSureDropDatabaseWindowEnabled} onNo={() => setAreYouSureDropDatabaseWindowEnabled(false)} onYes={() => dropDatabase(dropDatabaseIndex)} />
      <NavigationTree databases={databases} selectedDatabase={selectedDatabase} selectedDatabaseColumn={selectedDatabaseColumn} setSelectedDatabase={setSelectedDatabase} setDropDatabaseIndex={setDropDatabaseIndex} setAreYouSureDropDatabaseWindowEnabled={setAreYouSureDropDatabaseWindowEnabled} setCreateNewDatabaseWindowEnabled={setCreateNewDatabaseWindowEnabled} setNewTableScreenEnabled={setNewTableScreenEnabled} setSelectedDatabaseColumn={setSelectedDatabaseColumn} loadTableColumns={loadTableColumns} setNewColumnScreenEnabled={setNewColumnScreenEnabled} />
      <QueryComponent queryResults={queryResults} executeQuery={executeQuery} executeSelect={executeSelect} />
    </div>
  )
}

export default memo(Main)
