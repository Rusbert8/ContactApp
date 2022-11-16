import { auth } from "./firebase-config";
import {
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";

// Iniciar Sesión Google
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();

  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.log(error.message);
  }
};

// Iniciar Sesión Facebook
export const signInWithFacebook = async () => {
  const provider = new FacebookAuthProvider();

  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.log(error.message);
  }
};

// Iniciar Sesión Github
export const signInWithGitHub = async () => {
  const provider = new GithubAuthProvider();

  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.log(error.message);
  }
};

// Cerrar Sesión
export const logOut = async () => {
  await signOut(auth);
};
