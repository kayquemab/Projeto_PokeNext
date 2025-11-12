import React from "react";
import Image from "next/image";
import Link from "next/link";

function Navbar() {
  return (
    <nav>
      <div>
        <Image src="/pokeicon.png" alt="PokeNext Logo" width={50} height={50} />
        <h1>PokeNext</h1>
      </div>
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/about">Sobre</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
