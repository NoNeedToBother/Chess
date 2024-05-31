export interface ProfileInfoProps {
    label: string;
    info: string | null;
}

export function ProfileInfo({ label, info }: ProfileInfoProps) {
    const getInfo = () => {
        if (info !== null) return info
        else return "Not specified"
    }
    return <div className="flex flex-col pb-3">
        <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">{ label }</dt>
        <dd className="text-lg font-semibold">{ getInfo() }</dd>
    </div>
}