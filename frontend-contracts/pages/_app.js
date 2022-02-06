import "../styles/globals.css";
import Link from "next/link";

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <nav className="border-b p-6">
        <p className="text-4xl font-bold">NFsTreamer</p>
        <div className="flex mt-4">
          <Link href="/">
            <a href="url" className="mr-6 text-blue-500">
              Marketplace
            </a>
          </Link>
          <Link href="/create-item">
            <a className="mr-6 text-blue-500">Mint and Sell</a>
          </Link>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
