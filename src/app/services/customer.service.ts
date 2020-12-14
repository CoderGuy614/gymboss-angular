import { Injectable } from '@angular/core';
import { Customer } from '../models/Customer';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  customersCollection: AngularFirestoreCollection<Customer>;
  customerDoc: AngularFirestoreDocument<Customer>;
  customers: Observable<Customer[]>;
  customer: Observable<Customer>;
  constructor(private afs: AngularFirestore) {
    this.customersCollection = this.afs.collection('customers', (ref) =>
      ref.orderBy('lastName', 'asc')
    );
  }

  getCustomers(): Observable<Customer[]> {
    this.customers = this.customersCollection.snapshotChanges().pipe(
      map((actions) =>
        actions.map((a) => {
          const data = a.payload.doc.data() as Customer;
          data.id = a.payload.doc.id;
          return data;
        })
      )
    );
    return this.customers;
  }
}
