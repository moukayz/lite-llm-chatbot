"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Header = () => {
  const pathname = usePathname();
  const getLinkClassName = (path: string) => {
    return pathname === path ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700';
  }

  const links = [
    { href: "/", label: "Chat" },
    { href: "/about", label: "About" },
  ];

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 w-full">
          <div className="flex w-full">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-blue-500">ChatBot</h1>
            </div>
            <div className="ml-6 flex items-center justify-center space-x-8 w-full">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${getLinkClassName(link.href)}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header; 