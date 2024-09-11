import { ProfileInfo } from "./ProfileInfo";
import React from "react";
import { User } from "../../../models/User";

export interface InfoSectionProps {
    user: User | null
}

export function InfoSection({ user }: InfoSectionProps) {
    return <div className="w-full my-auto py-6 flex flex-col justify-center gap-2">
        <div className="w-full flex sm:flex-row xs:flex-col gap-2 justify-center">
            <div className="w-full">
                <dl className="text-gray-900 divide-y divide-gray-200 dark:text-white dark:divide-gray-700">
                    { user !== null &&
                        <ProfileInfo label="Name" info={ user.name }/>
                    }
                </dl>
            </div>
            <div className="w-full">
                <dl className="text-gray-900 divide-y divide-gray-200 dark:text-white dark:divide-gray-700">
                    { user !== null &&
                        <ProfileInfo label="Last name" info={ user.lastname }/>
                    }
                </dl>
            </div>
        </div>
    </div>
}