import "../styles/globals.css";
import { store } from "../redux/store";
import { Provider } from "react-redux";
import Navbar from "../components/navbar";
import { Toaster } from "react-hot-toast";
import { notify } from "../components/toasts";

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Navbar />
      <Toaster />
      <div>
        <Component {...pageProps} />
      </div>
      <button
        onClick={(e) =>
          notify({
            type: "error",
            header: "Madarchod",
            body: "you could imagine you lil ",
          })
        }
      >
        Notify
      </button>
    </Provider>
  );
}

export default MyApp;
