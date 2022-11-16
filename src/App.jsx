import React from "react";
import { db, auth } from "./firebase-config";
import {
  signInWithGoogle,
  signInWithFacebook,
  signInWithGitHub,
  logOut,
} from "./firebase-auth";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  doc,
  where,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
} from "firebase/firestore";
import { useState, useEffect } from "react";

// -------------------------------------------------------------------------------
// VARIABLES GLOBALES
const contactsCollectionRef = collection(db, "contacts");
const initialContact = {
  uid: "",
  name: "",
  lastname: "",
  phone: "",
  email: "",
};

// -------------------------------------------------------------------------------

function App() {
  const [user, setUser] = useState("loading");
  const [contact, setContact] = useState(initialContact);
  const [contactList, setContactList] = useState([]);
  const [currentContact, setCurrentContact] = useState(initialContact);

  // -------------------------------------------------------------------------------
  // LISTAR LOS CONTACTOS AGREGADOS

  useEffect(() => {
    // Función que obtiene los contactos de la colección de contactos:
    const getContacts = async (user) => {
      const data = await getDocs(query(contactsCollectionRef, where("uid", "==", user.uid)));
      const dataList = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      dataList.sort((x, y) => {
        return x.name.localeCompare(y.name);
      });
      setContactList(dataList);
    };

    // Función que maneja el cambio de usuarios:
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        getContacts(user);
      } else {
        setUser(null);
      }
    });
  }, [user])

  // -------------------------------------------------------------------------------
  // CREAR Y AGREGAR UN CONTACTO NUEVO
  
  // Controlador de  cambios en los Inputs del formulario que crea contactos:
  const handleInputChangesNew = (e) => {
    const { name, value } = e.target;
    setContact({ ...contact, [name]: value, uid: user.uid });
  };

  // Función que agrega un nuevo contacto en la colección de contactos:
  const addContact = async () => {
    const contactDoc = contact;

    if ((contactDoc.name !== "") && (contactDoc.phone !== "" || contactDoc.email !== "")) {
      const docRef = await addDoc(contactsCollectionRef, contactDoc);
      setContactList([...contactList, {...contactDoc, id: docRef.id}]);
      setContact(initialContact);
    }
  };

  // -------------------------------------------------------------------------------
  // MODIFICAR UN CONTACTO

  // Controlador de  cambios en los Inputs del formulario que modifica contactos:
  const handleInputChangesCurrent = (e) => {
    const { name, value } = e.target;
    setCurrentContact({ ...currentContact, [name]: value });
  };

  // Función que modifica un contacto en la colección de contactos:
  const updateContact = async (id) => {
    const contactDoc = doc(db, "contacts", id);
    await updateDoc(contactDoc, currentContact);
    setContactList(contactList.map((contact) => contact.id === id ? {...contact, ...currentContact} : contact));
  };

  // -------------------------------------------------------------------------------
  // ELIMINAR UN CONTACTO

  // Función que elimina un contacto en la colección de contactos:
  const deleteContact = async (id) => {
    const contactDoc = doc(db, "contacts", id);
    await deleteDoc(contactDoc);
    setContactList(contactList.filter((contact) => contact.id !== id));
  };

  // -------------------------------------------------------------------------------
  // RENDERIZAR LA PÁGINA

  // Página cargando:
  if (user === "loading") {
    return (
      <div className="container spinner">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  // Contenido que se muestra al iniciar la página:
  return (
    <>
      <header>
        <nav className="navbar bg-dark">
          <div className="container-fluid">
            <div className="header-logo">
              <img
                className="header-icon"
                src="https://cdn.pixabay.com/photo/2016/11/14/17/39/person-1824144__340.png"
              />
              <h1 className="header-title navbar-brand text-bg-dark">
                ContactApp
              </h1>
            </div>
            <button
              className="btn btn-outline-danger btn-logout"
              type="submit"
              style={!user ? { display: 'none'} : { display: 'initial'}}
              onClick={() => {
                logOut();
                setContactList([]);
              }}
            >
              Logout
            </button>
          </div>
        </nav>
      </header>

      {/* Contenido que se muestra SI HAY un USUARIO: */}
      {user ? (
        <>
          <main className="container">
          {/* ------------------------------------------------------------- */}
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
                  required
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

          {/* ------------------------------------------------------------- */}
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
                            <span>Edit</span>
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
                            <span>Delete</span>
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

        {/* ------------------------------------------------------------- */}
        {/* BLOQUE MODAL */}

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
                <h1 className="modal-title fs-5" id="exampleModalLabel">
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
                    Close{" "}
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
                  <button
                    type="button"
                    className="btn btn-primary"
                    data-bs-dismiss="modal"
                    onClick={() => {
                      updateContact(currentContact.id);
                    }}
                  >
                    Save changes{" "}
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
      ) : (
        // Contenido que se muestra si NO HAY un USUARIO:
        <div className="login-container container">
          <h2>Login</h2>
          <hr />
          <div className="login">
            <button type="submit" className="btn-login btn-login-with-google" 
            onClick={() => { signInWithGoogle();}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-google svg-icon" viewBox="0 0 16 16">
                <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"/>
              </svg>
              Sign in with Google
            </button>

            <button type="submit" className="btn-login btn-login-with-facebook" 
            onClick={() => {signInWithFacebook();}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-facebook svg-icon" viewBox="0 0 16 16">
                <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
              </svg> Sign in with Facebook
            </button>
            <button type="submit" className="btn-login btn-login-with-github" 
            onClick={() => {signInWithGitHub();}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-github svg-icon" viewBox="0 0 16 16">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
              </svg>Sign in with GitHub
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
