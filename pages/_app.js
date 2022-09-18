import "../styles/globals.css";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export const App = initializeApp({
  apiKey: "AIzaSyB3K4nFOAXmjCdY5gQBc1j_zgS70489-3o",
  authDomain: "bnewhistory-ale.firebaseapp.com",
  databaseURL: "https://bnewhistory-ale-default-rtdb.firebaseio.com",
  projectId: "bnewhistory-ale",
  storageBucket: "bnewhistory-ale.appspot.com",
  messagingSenderId: "422901380189",
  appId: "1:422901380189:web:113139fabd5900cae7c9b4",
  measurementId: "G-XPTPWK88WG",
});

export const db = getFirestore();
export const auth = getAuth();

export const theme = extendTheme({
  fonts: {},
  colors: {
    primary: "#ed709D",
    secondary: "#42B392",
    hover_primary: "#f089ae",
    brand: {
      50: "#FCE8F0",
      100: "#F7C0D4",
      200: "#F297B8",
      300: "#ED6E9D",
      400: "#E84581",
      500: "#Ed709d",
      600: "#B51751",
      700: "#88113D",
      800: "#5B0B29",
      900: "#2D0614",
    },
  },

  components: {
    Button: {
      variants: {
        primary: {
          bg: "black",
          color: "white",
          borderRadius: "none",
          gap: "10px",
          _hover: {
            bg: "#222222",
          },
        },
      },
    },
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <>
      <ChakraProvider theme={theme} CSSReset>
        <Component {...pageProps} />
      </ChakraProvider>
    </>
  );
}

export default MyApp;
