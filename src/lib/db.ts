import {TabContent} from "../types/tabcontent";

const tabTableName = "tabs";
const executionTableName = "executions";
const version = 1;

class DatabaseService {
    private database: IDBDatabase | undefined;

    initDb(): Promise<boolean> {
      return new Promise(resolve => {
        const request = indexedDB.open(tabTableName, version);

        request.addEventListener("upgradeneeded", (e) => {
        // @ts-ignore
          const db: IDBDatabase = e.target.result;
          db.createObjectStore(tabTableName, {keyPath: "id"});
          db.createObjectStore(executionTableName, {keyPath: "id"});
        });

        request.addEventListener("success", event => {
          // @ts-ignore
          this.database = event.target.result;
          resolve(true);
        });

        request.addEventListener("error", () => {
          const error = request.error?.message;
          console.log(`Init database error => ${error}`);
          resolve(false);  
        });
      });
    }

    saveTab(tab: TabContent) {
      this.checkDatabaseInitialized();

      const objectStore = this.database!!.transaction(tabTableName, "readwrite")
        .objectStore(tabTableName);

      const previousTab = objectStore.getKey(tab.id);
      if(previousTab !== undefined) {
        objectStore.delete(tab.id);
      }

      objectStore.add(tab);
    }

    getAllTabs(
      onSuccess: (tabs: TabContent[]) => void,
      onError?: (error: string) => void,
    ) {
      if(!this.database) {
        if(onError) {
          onError("Database has not been initalized");
        }
        return;
      }

      const objectStore = this.database.transaction(tabTableName, "readonly")
        .objectStore(tabTableName);

      const request: IDBRequest<TabContent[]> = objectStore.getAll();
      request.addEventListener("success", event => {
        // @ts-ignore
        onSuccess(event.target.result);
      });

      request.addEventListener("error", e => {
        if(onError) {
          //@ts-ignore
          onError(e.error.message);
        }
      });
    }

    deleteTabById(id: string) {
      this.checkDatabaseInitialized();

      const objectStore = this.database!!.transaction(tabTableName, "readwrite")
        .objectStore(tabTableName);

      objectStore.delete(id);
    }

    private checkDatabaseInitialized() {
      if(!this.database) {
        throw new Error("Database has not been initialized");
      }
    }
}

const databaseService = new DatabaseService();
export default databaseService;
