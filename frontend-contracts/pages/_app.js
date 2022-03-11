import "../styles/globals.css";
import { store } from "../redux/store";
import { Provider } from "react-redux";
import Navbar from "../components/navbar";

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Navbar />
      <div>
        <Component {...pageProps} />
      </div>
    </Provider>
  );
}

export default MyApp;
