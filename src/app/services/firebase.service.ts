import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private app;
  private db;

  constructor() {
    this.app = initializeApp(environment.firebase);
    this.db = getFirestore(this.app);
  }

  // Get all documents from a collection
  async getCollection(collectionName: string) {
    const collectionRef = collection(this.db, collectionName);
    const snapshot = await getDocs(collectionRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // Add a document to a collection
  async addDocument(collectionName: string, data: any) {
    const collectionRef = collection(this.db, collectionName);
    const docRef = await addDoc(collectionRef, data);
    return docRef.id;
  }

  // Update a document
  async updateDocument(collectionName: string, docId: string, data: any) {
    const docRef = doc(this.db, collectionName, docId);
    await updateDoc(docRef, data);
    return true;
  }

  // Delete a document
  async deleteDocument(collectionName: string, docId: string) {
    const docRef = doc(this.db, collectionName, docId);
    await deleteDoc(docRef);
    return true;
  }
}
