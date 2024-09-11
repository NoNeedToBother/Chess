import React from "react";
import { Link } from "react-router-dom";

interface NavItemProps {
    href: string
    name: string
    active: boolean
}

export function NavItem({ href, name, active }: NavItemProps) {
    return (
        <div className={ `border-x-2 hover:border-blue-600 inline-block rounded-lg px-2 py-1 text-sm font-medium text-gray-900 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900 hover:border-l-2
        ${ active ? "border-blue-600" : "" }` }>
            <Link to={ href }> { name } </Link>
        </div>
    )
}