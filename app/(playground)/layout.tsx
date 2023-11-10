import Link from "next/link";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <HomeButton />
    </>
  );
}

function HomeButton() {
  return (
    <div className="fixed right-2 top-2">
      <button className="btn btn-circle">
        <Link href="/">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </Link>
      </button>
    </div>
  );
}
