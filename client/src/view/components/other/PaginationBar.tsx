import ReactPaginate from 'react-paginate';
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/16/solid";

export interface PaginationBarProps {
    pageAmount: number;
    onPageChanged: (page: number) => void;
}

const PAGE_RANGE = 2;

export function PaginationBar({ pageAmount, onPageChanged }: PaginationBarProps) {
    const pageChangedHandler = (item: { selected: number }) => {
        onPageChanged(item.selected)
    }

    return <ReactPaginate
        className="list-none dark:text-gray-100 flex w-full flex-wrap items-center justify-center mb-2 gap-4 border py-4 shadow-md"
        nextLabel={ <div className="flex-wrap px-2 justify-items-center lg:w-12 w-8">
            <p className="text-sm">Next</p>
            <ArrowRightIcon className="lg:w-12 w-8 hover-slide [--slide-x:4px]"/>
        </div> }
        previousLabel={ <div className="flex-wrap justify-items-center lg:w-12 w-8">
            <p className="text-sm">Previous</p>
            <ArrowLeftIcon className="lg:w-12 w-8 hover-slide [--slide-x:-4px]"/>
        </div> }
        pageRangeDisplayed={ PAGE_RANGE }
        onPageChange={ pageChangedHandler }
        pageCount={ pageAmount }
        breakLabel="..."
        pageClassName="hover:bg-blue-100 dark:hover:bg-blue-800 px-2 py-1 border-2 text-3xl"
        previousClassName="px-2 cursor-pointer font-bold"
        nextClassName="px-2 cursor-pointer font-bold"
        activeClassName="border-blue-500 dark:border-blue-900 font-bold border-4 border-dashed text-blue-300"
        renderOnZeroPageCount={ null }
    />
}