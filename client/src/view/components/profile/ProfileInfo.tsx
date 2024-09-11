import React from "react";

export interface ProfileInfoProps {
    label: string;
    info: string | null;
}

export function ProfileInfo({ label, info }: ProfileInfoProps) {

    return <div className="flex flex-col pb-3 border-2 p-4">
        <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">{ label }</dt>
        <dd className="text-lg font-semibold">{ info !== null ? info : "Not specified" }</dd>
    </div>
}