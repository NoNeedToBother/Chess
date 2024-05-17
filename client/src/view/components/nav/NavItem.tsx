import React from "react";
import {Link} from "react-router-dom";

interface NavItemProps {
    href: string;
    name: string;
}

export function NavItem({ href, name}: NavItemProps) {
    return (
        <div className="inline-block rounded-lg px-2 py-1 text-sm font-medium text-gray-900 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900">
            <li>
                <Link to={ href }> { name } </Link>
            </li>
        </div>
    )
}