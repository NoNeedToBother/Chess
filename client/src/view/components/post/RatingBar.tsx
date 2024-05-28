import {Fill, RatingStar} from "./RatingStar";
import {useState} from "react";

export interface RatingBarProps {
    rating: number,
    onRatingChosen: (rating: number) => void
}

export function RatingBar({ rating, onRatingChosen }: RatingBarProps) {
    const [hoverValue, setHoverValue] = useState(-1)

    const ratings = [1, 2, 3, 4, 5]

    const getFill = (value: number, rating: number): Fill => {
        if (value <= rating) return Fill.FULL
        if (value >= rating + 1) return Fill.EMPTY
        let floor = Math.floor(rating)
        let delta = rating - floor
        if (delta <= 0.25) return Fill.EMPTY
        else if (delta <= 0.75) return Fill.HALF_FULL
        else return Fill.FULL
    }

    const onStarHover = (value: number) => {
        setHoverValue(value)
    }
    const onStarHoverEnd = () => {
        setHoverValue(-1)
    }

    return <div className="flex justify-center gap-4">
        <div className="flex">
            { hoverValue === -1 && ratings.map((value: number, index: number) =>
                <RatingStar value={ value } fill={ getFill(value, rating) } onChosen={ onRatingChosen }
                            key={ index } onHover={ onStarHover } onHoverEnd={ onStarHoverEnd }/>
            )}
            { hoverValue !== -1 && ratings.map((value: number, index: number) =>
                <RatingStar value={ value } fill={ getFill(value, hoverValue) } onChosen={ onRatingChosen }
                            key={ index } onHover={ onStarHover } onHoverEnd={ onStarHoverEnd }/>

            )}
        </div>
        <span className="text-slate-400 font-medium">{ rating + " out of 5"}</span>
    </div>
}