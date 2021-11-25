import "../styles/globals.css";
import Link from "next/link";

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <nav className="border-b p-6">
        <p className="text-4xl font-bold">Testing</p>
        <div className="flex mt-4"> 
          <Link href="/">
            <a className="mr-6 text-blue-500">Home</a>
          </Link>
          <Link href="/create-item">
            <a className="mr-6 text-blue-500">Mint and Sell</a>
          </Link>
          <Link href="/my-assets">
            <a className="mr-6 text-blue-500">My assets</a>
          </Link>
          <Link href="/creator-dashboard">
            <a className="mr-6 text-blue-500">Creator Dashboard</a>
          </Link>
          <Link href="/listVouchers">
            <a href="url" className="mr-6 text-blue-500">Vouchers</a>
          </Link>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
