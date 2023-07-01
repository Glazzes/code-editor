import { TabContent } from "../types/tabcontent";

const storeName = "tabs";
const version = 1;

export function setUpDB(): Promise<boolean> {
    return new Promise(resolve => {
      const request = indexedDB.open(storeName, version);

      request.addEventListener("upgradeneeded", e => {
        // @ts-ignore
        const db: IDBDatabase = e.target.result;
        db.createObjectStore(storeName, {keyPath: "id"});
      });

      request.addEventListener("success", () => {
        console.log(`request.success => version ${version}`);
        resolve(true);
      });

      request.addEventListener("error", () => {
        console.log(`request.error => version ${version}`);
        resolve(false);
      });

    });
}

export function saveTab(tab: TabContent): Promise<boolean | string> {
  return new Promise(resolve => {
    const request = indexedDB.open(storeName, version);

    request.addEventListener("success", (e) => {
      // @ts-ignore
      const db: IDBDatabase = e.target.result;
      const objectStore = db.transaction(storeName, "readwrite")
        .objectStore(storeName);
      
      const value = objectStore.get(tab.id);
      if(value) {
        objectStore.delete(tab.id);
      }

      objectStore.add(tab);
      resolve(true);
    });

    request.addEventListener("error", () => {
        const error = request.error?.message;
        if(error) {
          resolve(error);
        }else{
          resolve("Unkown error");
        }
    });

  })
}

export function getAllTabs(
    onSuccess: (tabs: TabContent[]) => void,
    onError?: (error: string) => void
): Promise<TabContent[] | string> {
  return new Promise(resolve => {
    const request = indexedDB.open(storeName, version);

    request.addEventListener("success", e => {
        // @ts-ignore
        const database: IDBDatabase = e.target.result;
        const objectStore = database.transaction(storeName, "readonly")
          .objectStore(storeName);

        const tabRequest: IDBRequest<TabContent[]> = objectStore.getAll();
        tabRequest.addEventListener("success", e => {
            // @ts-ignore
            onSuccess(e.target.result);
        });

        tabRequest.addEventListener("error", e => {
            //@ts-ignore
            onError(e.error.message);
        });
    });
  });
}

class TabService {
    private database: IDBDatabase | undefined;

    initDb(): Promise<boolean> {
      return new Promise(resolve => {
        const request = indexedDB.open(storeName, version);

        request.addEventListener("upgradeneeded", (e) => {
        // @ts-ignore
          const db: IDBDatabase = e.target.result;
          db.createObjectStore(storeName, {keyPath: "id"});

          this.database = db;
          resolve(true);
        });

        request.addEventListener("error", () => {
          const error = request.error?.message;
          console.log(`Init database error => ${error}`);
          resolve(false);  
        });

      });


    }
}
