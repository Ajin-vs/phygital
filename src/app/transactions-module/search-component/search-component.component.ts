import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TransactionServiceService } from '../transaction-service.service';
import { Contacts } from '@capacitor-community/contacts';
import { Toast } from '@capacitor/toast';
@Component({
  selector: 'app-search-component',
  templateUrl: './search-component.component.html',
  styleUrls: ['./search-component.component.css']
})
export class SearchComponentComponent {
  mobileNumber: any;
  userDeatils: any = null;
  // contacts: any[] = [{ "contactId": "908", "name": { "display": "Anna Rose CTS", "given": "Anna", "middle": "Rose", "family": "CTS" }, "phones": [{ "type": "mobile", "isPrimary": false, "number": "9830910458" }, { "type": "mobile", "isPrimary": false, "number": "+917902432280" }, { "type": "mobile", "isPrimary": false, "number": "+917902432280" }, { "type": "mobile", "isPrimary": false, "number": "+917902432280" }] }, { "contactId": "908", "name": { "display": "Anna Rose CTS", "given": "Anna", "middle": "Rose", "family": "CTS" }, "phones": [{ "type": "mobile", "isPrimary": false, "number": "9830918458" }, { "type": "mobile", "isPrimary": false, "number": "+917902432280" }, { "type": "mobile", "isPrimary": false, "number": "+917902432280" }, { "type": "mobile", "isPrimary": false, "number": "+917902432280" }] }, { "contactId": "909", "name": { "display": "Rini", "given": "Rini" }, "phones": [{ "type": "mobile", "isPrimary": false, "number": "+919495229497" }, { "type": "mobile", "isPrimary": false, "number": "+919495229497" }, { "type": "mobile", "isPrimary": false, "number": "+919495229497" }, { "type": "mobile", "isPrimary": false, "number": "+919495229497" }] }]
  contacts: any[] = []
  allUsers: any[] = []
  allContacts: any[] = []
  filteredContacts: any[] = []
  avl: any[] = []
  constructor(private transactionService: TransactionServiceService, private router: Router) { }

  ngOnInit() {

    this.transactionService.getAllUsers().subscribe(allUser => {
      this.allUsers = allUser
      const projection = {
        // Specify which fields should be retrieved.
        name: true,
        phones: true,
      };

      Contacts.getContacts({
        projection,
      }).then(contacts => {
        // this.allContacts = contacts.contacts;
        this.contacts = contacts.contacts;


        Promise.all(this.allUsers.map((user, ind) => {
          this.contacts.map((contact, index) => {
            let data = {
              firstName: contact?.name?.display,
              lastName: contact?.name?.given,
              mobileNumber: contact.phones?.[0]?.number,
              account: false,
              publicKey: ''
            }
            if (contact.phones?.[0]?.number.includes(user.mobileNumber)) {
              this.avl.push(ind);
              data.account = true;
              if (ind == 0) {
                data.publicKey = user.publicKey
                this.filteredContacts.push(data);
              }
              else {
                data.publicKey = user.publicKey
                this.filteredContacts[index] = data;
              }
            } else {
              if (ind == 0) {

                this.filteredContacts.push(data);
              }
            }
          })
        })).then(() => {
          // need to check this
          console.log(JSON.stringify(this.avl), "avl");

          Promise.all(
            // array1.filter(function(obj) { return array2.indexOf(obj) == -1; });
            //   this.allUsers.map((data, index) => {
            //   this.avl.map((al) => {
            //     if (al !== index) {
            //       let d = {
            //         firstName: data?.firstName +' '+ data?.lastName,
            //         lastName: data?.lastName,
            //         mobileNumber: data.mobileNumber,
            //         account: true,
            //         publicKey:data.publicKey
            //       }
            //       this.filteredContacts.push(d);
            //     }
            //   })
            // })
            this.avl.map(ind => {
              this.allUsers.splice(ind, 1)
            })


          ).then(() => {
           Promise.all(this.allUsers.map(al => {
              let d = {
                        firstName: al?.firstName +' '+ al?.lastName,
                        lastName: al?.lastName,
                        mobileNumber: al.mobileNumber,
                        account: true,
                        publicKey:al.publicKey
                      }
                      this.filteredContacts.push(d);
            })).then(()=>{
              this.allContacts = [...this.filteredContacts]
            })
            // this.filteredContacts = [this.filteredContacts, ...this.allUsers]
          })

        })


      });
    })


  }


  getShortName(fullName: string) {
    return fullName.split(' ').map(n => n[0]).join('');
  }

  onPhoneNumber() {
    // console.log(this.allContacts.length, "length");
    let rep: any[] = []
    if (this.mobileNumber == '' || this.mobileNumber == undefined || this.mobileNumber == null || this.mobileNumber.length == 0) {
      this.filteredContacts = [...this.allContacts];
    }
    Promise.all(
      this.allContacts.map(contacte => {

        if (contacte.mobileNumber?.startsWith(this.mobileNumber)) {
          rep.push(contacte)
          // this.filteredContacts = []
          // this.filteredContacts.push(contacte)
        }
        if (this.mobileNumber == '' || this.mobileNumber == undefined || this.mobileNumber == null || this.mobileNumber.length == 0) {
          this.filteredContacts = [...this.allContacts];
        }



      })).then(() => {
        this.filteredContacts = [...rep]
        if (this.mobileNumber == '' || this.mobileNumber == undefined || this.mobileNumber == null || this.mobileNumber.length == 0) {
          this.filteredContacts = [...this.allContacts];
        }
      })

    // if (this.mobileNumber.toString().length > 6) {
    //   this.transactionService.getUser(this.mobileNumber).subscribe(data => {
    //     this.userDeatils = data;
    //     // this.userDeatils = data.user
    //     // this.userDeatils.map((res:any)=>{
    //     //   this.getShortName(res.name)
    //     // })

    //   })
    // }
    // else {
    //   this.userDeatils = null;
    // }

  }

  onPayment(user: any) {
    console.log(user);
    if (user.publicKey) {
      localStorage.setItem("reciever", JSON.stringify(user))
      this.router.navigateByUrl('/transaction/payment')
    } else {
      Toast.show({
        text: 'Number is not registered with Phygital wallet.',
      });
    }

  }
}
