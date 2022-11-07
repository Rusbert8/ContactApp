import React from "react";
import { db } from "../firebase-config";
import {
  collection,
  getDocs,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { useState, useEffect } from "react";

function App() {
  const contactsCollectionRef = collection(db, "contacts");

  const initialContact = {
    name: "",
    lastname: "",
    phone: "",
    email: "",
  };


  // -------------------------------------------------------------------------------
  // CREAR Y AGREGAR UN CONTACTO NUEVO

  const [contact, setContact] = useState(initialContact);
  
  // Controlador de  cambios en los Inputs del formulario que crea contactos:
  const handleInputChangesNew = (e) => {
    const { name, value } = e.target;
    setContact({ ...contact, [name]: value });
  };

  // Función que agrega un nuevo contacto en la colección de contactos:
  const addContact = async () => {
    const contactDoc = contact;
    await addDoc(contactsCollectionRef, contactDoc);
    setContact(initialContact);
    getContacts();
  };


  // -------------------------------------------------------------------------------
  // MODIFICAR UN CONTACTO
  const [currentContact, setCurrentContact] = useState(initialContact);

  // Controlador de  cambios en los Inputs del formulario que modifica contactos:
  const handleInputChangesCurrent = (e) => {
    const { name, value } = e.target;
    setCurrentContact({ ...currentContact, [name]: value });
  };

  // Función que modifica un contacto en la colección de contactos:
  const updateContact = async (id) => {
    const contactDoc = doc(db, "contacts", id);
    await updateDoc(contactDoc, currentContact);
    getContacts();
  };


  // -------------------------------------------------------------------------------
  // ELIMINAR UN CONTACTO

  // Función que elimina un contacto en la colección de contactos:
  const deleteContact = async (id) => {
    const contactDoc = doc(db, "contacts", id);
    await deleteDoc(contactDoc);
    getContacts();
  };


  // -------------------------------------------------------------------------------
  // LISTAR LOS CONTACTOS AGREGADOS

  const [contactList, setContactList] = useState([]);

  // Función que obtiene los contactos de la colección de contactos:
  const getContacts = async () => {
    const data = await getDocs(contactsCollectionRef);
    const dataList = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    dataList.sort((x, y) => {
      return x.name.localeCompare(y.name);
    })
    setContactList(dataList);
  };

  // Función que obtiene los contactos la primera vez que carga el sitio web:
  useEffect(() => {
    getContacts();
  }, []);

  // -------------------------------------------------------------------------------

  return (
    <>
      <header>
        <nav className="navbar bg-dark">
          <div className="container-fluid">
            <div className="header-logo">
              <img className="header-icon" src="https://cdn.pixabay.com/photo/2016/11/14/17/39/person-1824144__340.png"/>
              <h1 className="header-title navbar-brand text-bg-dark">ContactApp</h1>
            </div>
            <button className="btn btn-outline-danger" type="submit">
              Logout
            </button> 
          </div>
        </nav>
      </header>
      <main className="container">
        {/* FORMULARIO DE NUEVO CONTACTO */}
        <div className="contactForm container">
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <legend>
              <h2>New Contact</h2>
            </legend>

            <div className="new-contact-container row">
              <input
                className="col-md-5 col-lg-2"
                type="text"
                placeholder="Name"
                name="name"
                value={contact.name}
                onChange={handleInputChangesNew}
                autoComplete="off"
              />
              <input
                className="col-md-6 col-lg-3"
                type="text"
                placeholder="Lastname"
                name="lastname"
                value={contact.lastname}
                onChange={handleInputChangesNew}
                autoComplete="off"
              />
              <input
                className="col-md-5 col-lg-2"
                type="tel"
                placeholder="Phone"
                name="phone"
                value={contact.phone}
                onChange={handleInputChangesNew}
                autoComplete="off"
              />
              <input
                className="col-md-6 col-lg-3"
                type="text"
                placeholder="Email"
                name="email"
                value={contact.email}
                onChange={handleInputChangesNew}
                autoComplete="off"
              />

              <button
                className="col-3 col-lg-1 btn btn-success"
                type="submit"
                onClick={addContact}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-plus-circle-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                </svg>{" "}
                Add
              </button>
            </div>
          </form>
        </div>

        <hr />

        {/* TABLA DE CONTACTOS */}
        <div className="contact-list">
          <h2>Contact List</h2>
          <div className="table-responsive-lg">
            <table className="table table-list table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Name</th>
                  <th>Lastname</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {contactList.map((contact) => (
                  <tr key={contact.id}>
                    <td>{contact.name}</td>
                    <td>{contact.lastname}</td>
                    <td>{contact.phone}</td>
                    <td>{contact.email}</td>
                    <td>
                      <div className="buttonGroup">
                      <button
                        className="btn btn-dark"
                        data-bs-toggle="modal"
                        data-bs-target="#updateModal"
                        onClick={() => setCurrentContact(contact)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-pencil-square"
                          viewBox="0 0 16 16"
                        >
                          <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                          <path
                            fillRule="evenodd"
                            d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                          />
                        </svg>{" "}
                        <span>
                        Edit
                        </span>
                      </button>

                      <button
                        className="btn btn-danger"
                        onClick={() => {
                          deleteContact(contact.id);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-trash3-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z" />
                        </svg>{" "}
                        <span>
                        Delete
                        </span>
                      </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
{/* <!-- MODAL --> */}
      <div
        className="modal fade"
        id="updateModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1
                className="modal-title fs-5"
                id="exampleModalLabel"
              >
                Edit Contact
              </h1>
              <button
                type="button"
                className=""
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <form>
                <legend>Make changes and save.</legend>
                <div className="input-container row">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    className="col-lg-12 form-control"
                    type="text"
                    placeholder="Name"
                    name="name"
                    id="name"
                    value={currentContact.name}
                    onChange={handleInputChangesCurrent}
                  />
                  <label htmlFor="lastname" className="form-label">
                    Lastname
                  </label>
                  <input
                    className="col-lg-12 form-control"
                    type="text"
                    placeholder="Lastname"
                    name="lastname"
                    id="lastname"
                    value={currentContact.lastname}
                    onChange={handleInputChangesCurrent}
                  />
                  <label htmlFor="phone" className="form-label ">
                    Phone
                  </label>
                  <input
                    className="col-lg-12 form-control"
                    type="tel"
                    placeholder="Phone"
                    id="phone"
                    name="phone"
                    value={currentContact.phone}
                    onChange={handleInputChangesCurrent}
                  />
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    className="col-lg-12 form-control"
                    type="text"
                    placeholder="Email"
                    id="email"
                    name="email"
                    value={currentContact.email}
                    onChange={handleInputChangesCurrent}
                  />
                </div>
              </form>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close {" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-x-circle-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" />
                  </svg>
                </button>
                <button type="button" className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={()=>{
                  updateContact(currentContact.id)
                  }}>
                  Save changes {" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-check-circle-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
