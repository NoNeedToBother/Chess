import { ClockIcon } from "@heroicons/react/24/outline";

export interface TimerProps {
    time: number
    opponentTime: number
}

export function Timer({ time, opponentTime }: TimerProps) {
    const formatTime = (time: number) => {
        if (time < 0) {
            throw new Error('Time cannot be negative')
        }
        const min = parseInt(String(time / 60))
        const sec = parseInt(String(time % 60))
        if (min === 0) return sec.toString().padStart(2, '0') + "s"
        else return min.toString().padStart(2, '0') + "m " + sec.toString().padStart(2, '0') + "s"
    }

    return <div className="border-2 border-gray-400 bg-gray-200 w-full h-full flex flex-row">
        <ClockIcon className="w-1/2"/>
        <div className="mx-auto text-xl flex flex-col justify-between">
            <div>
                Opponent:
                <div>{ formatTime(opponentTime) }</div>
            </div>
            <div>
                You:
                <div>{ formatTime(time) }</div>
            </div>
        </div>
    </div>
}