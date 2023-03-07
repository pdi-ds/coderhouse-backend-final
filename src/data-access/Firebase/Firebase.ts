import initFirebase from "../../config/firebase";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
  increment,
  Firestore,
  limit,
} from "firebase/firestore";
import { ConnectionConfig } from "../../config/ConnectionConfig";

const app = initFirebase();
class Firebase {
  readonly collectionName: string;
  private readonly db: Firestore;
  constructor(config: ConnectionConfig, collectionName: string) {
    this.collectionName = collectionName;
    this.db = getFirestore();
  }
  async insert(data: Object): Promise<any | boolean> {
    const result = await addDoc(collection(this.db, this.collectionName), data)
      .then(({ id }) => id)
      .catch((err) => {
        return false;
      });
    return result;
  }
  async update(id: any, data: object): Promise<boolean> {
    return await updateDoc(
      doc(collection(this.db, this.collectionName), id),
      data
    )
      .then(() => true)
      .catch((err) => {
        return false;
      });
  }
  async delete(id: any): Promise<boolean> {
    return await deleteDoc(doc(collection(this.db, this.collectionName), id))
      .then(() => true)
      .catch((err) => {
        return false;
      });
  }
  async get(id: any): Promise<object | null> {
    const result = await getDoc(
      doc(collection(this.db, this.collectionName), id)
    )
      .then((doc) => ({ id: doc.id, ...doc.data() }))
      .catch((err) => {
        return null;
      });
    return result !== null ? result : null;
  }
  async getBy(field: string, value: any): Promise<object | null> {
    const result = await getDocs(
      query(
        collection(this.db, this.collectionName),
        where(field as string, "==", value),
        limit(1)
      )
    )
      .then((snapshot) => ({
        id: snapshot.docs[0].id,
        ...snapshot.docs[0].data(),
      }))
      .catch((err) => {
        return null;
      });
    return result !== null ? result : null;
  }
  async getAllBy(field: string, value: any): Promise<object | null> {
    const result = await getDocs(
      query(
        collection(this.db, this.collectionName),
        where(field as string, "==", value)
      )
    )
      .then((snapshot) =>
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      )
      .catch((err) => {
        return null;
      });
    return result !== null ? result : null;
  }
  async getAll(): Promise<Array<object>> {
    const result = await getDocs(
      query(collection(this.db, this.collectionName))
    ).then((docs) => {
      const array: Array<any> = [];
      docs.forEach((doc) => array.push({ id: doc.id, ...doc.data() }));
      return array;
    });
    return result;
  }
}

export default Firebase;
