import { CircleImage } from "../base/CircleImage";
import { Link } from "react-router-dom";
import React from "react";
import { useUserContext } from "../../../context/UserContext";

export function ChessOpponentInfo() {
    const { opponent } = useUserContext()

    return <>
        { opponent !== null &&
            <span className="flex justify-center border-4 border-gray-400 shadow-md rounded-r">
                <CircleImage src={ opponent.profilePicture } className="h-20"/>
                <Link to={ `/profile/${ opponent.id }` }>
                    <div className="w-full h-full">
                        <h2 className="ml-2 h-1/2 my-6">
                            { opponent.username }
                        </h2>
                    </div>
                </Link>
            </span>
        }
    </>
}