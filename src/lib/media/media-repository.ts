import type { ReaderDocument } from "../content/types";

export type RawMediaUpload = {
  mediaId: string;
  filename: string;
  mimeType: string;
  content: string;
  createdAt: string;
};

export type MediaRepository = {
  saveRawUpload(upload: RawMediaUpload): Promise<void>;
  getRawUpload(mediaId: string): Promise<RawMediaUpload | undefined>;
  deleteRawUpload(mediaId: string): Promise<void>;
  saveDocument(mediaId: string, document: ReaderDocument): Promise<void>;
  getDocument(mediaId: string): Promise<ReaderDocument | undefined>;
  deleteDocument(mediaId: string): Promise<void>;
  listDocuments(): Promise<ReaderDocument[]>;
  clear(): Promise<void>;
};

class InMemoryMediaRepository implements MediaRepository {
  private rawUploads = new Map<string, RawMediaUpload>();
  private documents = new Map<string, ReaderDocument>();

  async saveRawUpload(upload: RawMediaUpload): Promise<void> {
    this.rawUploads.set(upload.mediaId, upload);
  }

  async getRawUpload(mediaId: string): Promise<RawMediaUpload | undefined> {
    return this.rawUploads.get(mediaId);
  }

  async deleteRawUpload(mediaId: string): Promise<void> {
    this.rawUploads.delete(mediaId);
  }

  async saveDocument(mediaId: string, document: ReaderDocument): Promise<void> {
    this.documents.set(mediaId, document);
  }

  async getDocument(mediaId: string): Promise<ReaderDocument | undefined> {
    return this.documents.get(mediaId);
  }

  async deleteDocument(mediaId: string): Promise<void> {
    this.documents.delete(mediaId);
  }

  async listDocuments(): Promise<ReaderDocument[]> {
    return Array.from(this.documents.values());
  }

  async clear(): Promise<void> {
    this.rawUploads.clear();
    this.documents.clear();
  }
}

const DB_NAME = "contexto-media";
const DB_VERSION = 1;
const STORE_RAW = "rawUploads";
const STORE_DOC = "documents";

function openIndexedDB(): Promise<IDBDatabase> {
  const indexedDBFactory = (globalThis as typeof globalThis & {
    indexedDB?: IDBFactory;
  }).indexedDB;

  if (!indexedDBFactory) {
    return Promise.reject(new Error("IndexedDB is not available in this environment"));
  }

  return new Promise((resolve, reject) => {
    const request = indexedDBFactory.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_RAW)) {
        db.createObjectStore(STORE_RAW, { keyPath: "mediaId" });
      }
      if (!db.objectStoreNames.contains(STORE_DOC)) {
        db.createObjectStore(STORE_DOC, { keyPath: "mediaId" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

class IndexedDBMediaRepository implements MediaRepository {
  async saveRawUpload(upload: RawMediaUpload): Promise<void> {
    const db = await openIndexedDB();
    const tx = db.transaction(STORE_RAW, "readwrite");
    tx.objectStore(STORE_RAW).put(upload);
    await transactionComplete(tx);
  }

  async getRawUpload(mediaId: string): Promise<RawMediaUpload | undefined> {
    const db = await openIndexedDB();
    const tx = db.transaction(STORE_RAW, "readonly");
    const request = tx.objectStore(STORE_RAW).get(mediaId);
    return requestToPromise(request);
  }

  async deleteRawUpload(mediaId: string): Promise<void> {
    const db = await openIndexedDB();
    const tx = db.transaction(STORE_RAW, "readwrite");
    tx.objectStore(STORE_RAW).delete(mediaId);
    await transactionComplete(tx);
  }

  async saveDocument(mediaId: string, document: ReaderDocument): Promise<void> {
    const db = await openIndexedDB();
    const tx = db.transaction(STORE_DOC, "readwrite");
    tx.objectStore(STORE_DOC).put(document);
    await transactionComplete(tx);
  }

  async getDocument(mediaId: string): Promise<ReaderDocument | undefined> {
    const db = await openIndexedDB();
    const tx = db.transaction(STORE_DOC, "readonly");
    const request = tx.objectStore(STORE_DOC).get(mediaId);
    return requestToPromise(request);
  }

  async deleteDocument(mediaId: string): Promise<void> {
    const db = await openIndexedDB();
    const tx = db.transaction(STORE_DOC, "readwrite");
    tx.objectStore(STORE_DOC).delete(mediaId);
    await transactionComplete(tx);
  }

  async listDocuments(): Promise<ReaderDocument[]> {
    const db = await openIndexedDB();
    const tx = db.transaction(STORE_DOC, "readonly");
    const request = tx.objectStore(STORE_DOC).getAll();
    return requestToPromise(request);
  }

  async clear(): Promise<void> {
    const db = await openIndexedDB();
    const txRaw = db.transaction(STORE_RAW, "readwrite");
    txRaw.objectStore(STORE_RAW).clear();
    const txDoc = db.transaction(STORE_DOC, "readwrite");
    txDoc.objectStore(STORE_DOC).clear();
    await Promise.all([transactionComplete(txRaw), transactionComplete(txDoc)]);
  }
}

function transactionComplete(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

export function createMemoryMediaRepository(): MediaRepository {
  return new InMemoryMediaRepository();
}

export function createIndexedDBMediaRepository(): MediaRepository {
  return new IndexedDBMediaRepository();
}

export function createMediaRepository(): MediaRepository {
  const factory = (globalThis as typeof globalThis & {
    indexedDB?: IDBFactory;
  }).indexedDB;
  return factory ? new IndexedDBMediaRepository() : new InMemoryMediaRepository();
}
