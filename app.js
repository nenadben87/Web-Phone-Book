
const form = document.getElementById('my-form');
const table = document.getElementById('table');
const searchInput = document.getElementById('search-input');

class Contact {
  constructor(firstName,lastName,phoneNumber,eMail){
     this.firstName = firstName;
     this.lastName = lastName;
     this.phoneNumber = phoneNumber;
     this.eMail = eMail;
  }
}

class UI {

   showAlert(message,className){
     
    const div = document.createElement('div');

    div.className = `alert ${className}`;

    div.appendChild(document.createTextNode(message));

    const container = document.querySelector('.container');

    container.insertBefore(div,form);

    setTimeout(function(){
      div.remove();
    },3000)

   }

   addContactToList(contact){

    const tr = document.createElement('tr');

    const tbody = document.getElementById('t-body');

    tr.innerHTML = `<td>${contact.firstName}</td>
                    <td>${contact.lastName}</td>
                    <td>${contact.phoneNumber}</td>
                    <td>${contact.eMail}</td>
                    <td><a href="#"><i class="fa fa-remove"></i></a></td>
                    `;

    tbody.appendChild(tr);
   }

   clearFields(){

    document.querySelector('#first-name').value = '';
    document.querySelector('#last-name').value = '';
    document.querySelector('#phone-number').value = '';
    document.querySelector('#e-mail').value = '';
   }
}

class Store {

  static getContactsFromLS(){

    let contacts;
    if(localStorage.getItem('contacts') === null){
      contacts = [];
    } else{
      contacts = JSON.parse(localStorage.getItem('contacts'));
    }

    return contacts;
  }

  static addContactsToLS(contact){

    const contacts = Store.getContactsFromLS();

    contacts.push(contact);

    localStorage.setItem('contacts',JSON.stringify(contacts));
    
}

static sortContacts(contact){

  const contacts = Store.getContactsFromLS();

  contacts.sort(contact);
}

static displayContactsFromLS(){

  const contacts = Store.getContactsFromLS();

  contacts.forEach(function(contact){
    const ui = new UI();

    ui.addContactToList(contact);
  })
}

static removeContactFromLS(eMail){

  const contacts = Store.getContactsFromLS();

  contacts.forEach(function(contact,index){
    if(eMail === contact.eMail ){
      contacts.splice(index,1);
    }
  })

  localStorage.setItem('contacts',JSON.stringify(contacts));
}

}

document.addEventListener('DOMContentLoaded',function(){
  Store.displayContactsFromLS();
})

searchInput.addEventListener('keyup',function(e){

  const text = e.target.value.toLowerCase();

  document.querySelectorAll('tr').forEach(function(fName){
    
    const item = fName.firstChild.textContent;

    if(item.toLowerCase().indexOf(text) != -1){
      fName.style.display = 'block';
    } else{
      fName.style.display = 'none';
    }
  })
})

form.addEventListener('submit',function(e){
   
  const firstName = document.getElementById('first-name').value;
  const lastName = document.getElementById('last-name').value;
  const phoneNumber = document.getElementById('phone-number').value;
  const eMail = document.getElementById('e-mail').value;

  const contact = new Contact(firstName,lastName,phoneNumber,eMail);

  const ui = new UI();

  if(firstName === '' || lastName === '' || phoneNumber === '' || eMail === ''){
    
    ui.showAlert('Please fill up all fields!','error')
  } else{
    
    ui.addContactToList(contact);

    ui.clearFields();

    ui.showAlert('Contact added','success');

    Store.addContactsToLS(contact);

    Store.sortContacts();
  }
  
  
  e.preventDefault();
})

table.addEventListener('click',function(e){

    const ui = new UI();

    if(e.target.className === 'fa fa-remove'){
    e.target.parentElement.parentElement.parentElement.remove();

    Store.removeContactFromLS(e.target.parentElement.parentElement.previousElementSibling.textContent);

    ui.showAlert('Contact Removed','success');
  }
})

