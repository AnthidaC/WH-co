export class CouchbaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CouchbaseError";
  }
}

export class CasMismatchError extends CouchbaseError {
  constructor(message = "CAS mismatch: document was modified concurrently by another client") {
    super(message);
    this.name = "CasMismatchError";
  }
}

export class DocumentNotFoundError extends CouchbaseError {
  constructor(key: string) {
    super(`Document with key '${key}' not found in cluster`);
    this.name = "DocumentNotFoundError";
  }
}

export class DocumentExistsError extends CouchbaseError {
  constructor(key: string) {
    super(`Document with key '${key}' already exists`);
    this.name = "DocumentExistsError";
  }
}
