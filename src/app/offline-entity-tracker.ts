import { Savable } from "./savable";

class OfflineEntityTrackerOperation<T> {
    operation: "add" | "update" | "delete" | undefined;
    entity: T | undefined; 

    constructor(operation: "add" | "update" | "delete", entity: T) {
        this.operation = operation;
        this.entity = entity;
    }
}

export class OfflineEntityTracker<T, K> {

    /* Saving between pages */
    private sessionStorageSaveName: string = "";
    withSessionStorageSaveName(sessionStorageSaveName: string): OfflineEntityTracker<T, K> {
        this.sessionStorageSaveName = sessionStorageSaveName;
        return this;
    }

    // https://stackoverflow.com/questions/29085197/how-do-you-json-stringify-an-es6-map
    private mapReplacer(key: any, value: any) {
        if(value instanceof Map) {
          return {
            dataType: 'Map',
            value: Array.from(value.entries()), // or with spread: value: [...value]
          };
        } else {
          return value;
        }
    }

    private mapReviver(key: any, value: any) {
        if(typeof value === 'object' && value !== null) {
          if (value.dataType === 'Map') {
            return new Map(value.value);
          }
        }
        return value;
    }

    private loaded: boolean = false;
    private saveData(): void {
        sessionStorage.setItem(this.sessionStorageSaveName + "__operations", 
                                JSON.stringify(this.entityTracker));
        sessionStorage.setItem(this.sessionStorageSaveName + "__cache", 
                                JSON.stringify(this.offlineCache, this.mapReplacer));
        sessionStorage.setItem(this.sessionStorageSaveName + "__cacheOfflineId", 
                                JSON.stringify(this.lastOfflineId));
    }
    private loadData(): void {
        this.loaded = true;

        let opState: string | null = sessionStorage
                                            .getItem(this.sessionStorageSaveName + "__operations");
        if (opState != null) {
            let result: OfflineEntityTrackerOperation<T>[] = JSON.parse(opState);
            this.entityTracker = result;
        }

        let cacheState: string | null = sessionStorage
                                            .getItem(this.sessionStorageSaveName + "__cache");
        if (cacheState != null) {
            let result: Map<K, T> = JSON.parse(cacheState, this.mapReviver);
            this.offlineCache = result;
        }

        let lastIdState: string | null = sessionStorage
                                            .getItem(this.sessionStorageSaveName + "__cacheOfflineId");
        if (lastIdState != null) {
            let result: K = JSON.parse(lastIdState);
            this.lastOfflineId = result;
        }
    }

    /* Internet Checker */
    private static hasInternet = navigator.onLine;
    private checkInternet() {
        OfflineEntityTracker.hasInternet = navigator.onLine;
        if (OfflineEntityTracker.hasInternet) {
            if (this.entityTracker.length > 0) {
                for (let op of this.entityTracker) {
                    if (op == undefined || op.entity == undefined) continue;
                    if (op.operation == "add")
                        this.add(op.entity);
                    else if (op.operation == "update")
                        this.update(op.entity);
                    else if (op.operation == "delete")
                        this.delete(op.entity);
                }
                this.entityTracker.splice(0, this.entityTracker.length);
                this.saveData();
            }
        } else {
            this.saveData();
        }
    }

    internetAvailable(): boolean {
        return OfflineEntityTracker.hasInternet;
    }

    static internetAvailable(): boolean {
        return OfflineEntityTracker.hasInternet;
    }

    /* Initialize Internet Check */
    constructor() {
        setTimeout(() => this.checkInternet(), 1000);
        setInterval(() => this.checkInternet(), 5000);
    }

    /* How to get/set the ID */
    private entityGetIdCallback: (entity: T) => K | null = () => { return null; };
    withEntityGetId(entityIdCallback: (entity: T) => K | null): OfflineEntityTracker<T, K> {
        this.entityGetIdCallback = entityIdCallback;
        return this;
    }

    private entitySetIdCallback: (entity: T, id: K) => T | null = () => { return null; };
    withEntitySetId(entityIdCallback: (entity: T, id: K) => T): OfflineEntityTracker<T, K> {
        this.entitySetIdCallback = entityIdCallback;
        return this;
    }

    /* Explicate how to add, update, delete when internet returns */
    private add: (entity: T) => any = () => {};
    withAddOperation(addCallback: (entity: T) => any): OfflineEntityTracker<T, K> {
        this.add = addCallback;
        return this;
    }

    private update: (entity: T) => any = () => {};
    withUpdateOperation(updateCallback: (entity: T) => any): OfflineEntityTracker<T, K> {
        this.update = updateCallback;
        return this;
    }

    private delete: (entity: T) => any = () => {};
    withDeleteOperation(deleteCallback: (entity: T) => any): OfflineEntityTracker<T, K> {
        this.delete = deleteCallback;
        return this;
    }

    /* Entity track operations */
    private entityTracker: OfflineEntityTrackerOperation<T>[] = [];
    addEntity(entity: T) : OfflineEntityTracker<T, K> {
        if (!this.loaded) this.loadData();

        let id: K | null = this.entityGetIdCallback(entity);
        if (id == null) return this;
        this.entityTracker.push(new OfflineEntityTrackerOperation<T>("add", entity));
        this.saveData();
        return this;
    }
    updateEntity(entity: T) : OfflineEntityTracker<T, K> {
        if (!this.loaded) this.loadData();

        let id: K | null = this.entityGetIdCallback(entity);
        if (id == null) return this;
        this.entityTracker.push(new OfflineEntityTrackerOperation<T>("update", entity));
        this.saveData();
        return this;
    }
    deleteEntity(entity: T) : OfflineEntityTracker<T, K> {
        if (!this.loaded) this.loadData();

        let id: K | null = this.entityGetIdCallback(entity);
        if (id == null) return this;
        this.entityTracker.push(new OfflineEntityTrackerOperation<T>("delete", entity));
        this.saveData();
        return this;
    }

    /* Offline Cache */
    private lastOfflineId: K | null = null;
    withInitialOfflineId(initialOfflineId: K | null): OfflineEntityTracker<T, K> {
        this.lastOfflineId = initialOfflineId;
        return this;
    }
    private offlineIdUpdateCall: (id: K | null) => K | null = (id) => { return id; };
    withOfflineIdUpdateCall(offlineIdUpdateCall: (id: K | null) => K | null): OfflineEntityTracker<T, K> {
        this.lastOfflineId = offlineIdUpdateCall(this.lastOfflineId);
        return this;
    }

    private offlineCache = new Map<K, T>();
    cache(entity: T): K | null {
        if (!this.loaded) this.loadData();

        let id: K | null = this.entityGetIdCallback(entity);
        if (id == null) return null;
        if (this.offlineCache.has(id)) return null;
        if (OfflineEntityTracker.hasInternet) {
            this.offlineCache.set(id, entity);
            this.saveData();
            return id;
        } else {
            if (this.lastOfflineId == null) return null;
            let offlineIdEntity: T | null = this.entitySetIdCallback(entity, this.lastOfflineId);
            if (offlineIdEntity == null) return null;
            this.offlineCache.set(this.lastOfflineId, offlineIdEntity);
            let currentId: K = this.lastOfflineId;
            this.offlineIdUpdateCall(this.lastOfflineId);
            this.saveData();
            return currentId;
        }
    }

    isCached(entity: T): boolean {
        if (!this.loaded) this.loadData();

        let id: K | null = this.entityGetIdCallback(entity);
        if (id == null) return false;
        return this.offlineCache.has(id);
    }

    isCachedId(id: K): boolean {
        if (!this.loaded) this.loadData();
        return this.offlineCache.has(id);
    }

    serveCachedAll(): IterableIterator<T> {
        if (!this.loaded) { this.loadData(); }
        return this.offlineCache.values();
    }

    serveCached(id: K): T | undefined {
        if (!this.loaded) this.loadData();
        return this.offlineCache.get(id);
    }
    
    destroy(id: K): boolean {
        if (!this.loaded) this.loadData();

        let result: boolean = this.offlineCache.delete(id);
        this.saveData();
        return result;
    }

}
