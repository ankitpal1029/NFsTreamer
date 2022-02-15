import Link from "next/link";

const Navbar = () => {
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
    </div>
  );
};

export default Navbar;
