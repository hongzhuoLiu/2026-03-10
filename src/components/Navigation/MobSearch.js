import CrossBtnLight from '../../images/icons/CrossLight.png';

import React, {useEffect, useRef, useState} from 'react';
import {useNavigate} from "react-router-dom";

import '../../input.css';
import {useFuzzySearchQuery} from "../../app/service/fuzzy-search";
import {toggleUIState} from "../../app/features/ui/UIReducer";
import {useDispatch} from "react-redux";

function MobSearch() {
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const [searchQuery, setSearchQuery] = useState('');
    const [showResults, setShowResults] = useState(false);
    const resultsReference = useRef(null);

    const { data: searchResult, refetch } = useFuzzySearchQuery(searchQuery, { skip: !searchQuery });

    const handleSearch = async () => {
        if (searchQuery.trim()) {
            refetch();
            setShowResults(true);
        }
    };

    const handleClickOutside = (event) => {
        if (resultsReference.current && !resultsReference.current.contains(event.target)) {
            setShowResults(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    
    return (
        <div className="fixed top-0 left-0 m-0 w-screen h-screen flex justify-center items-center z-10 bg-black bg-opacity-50">
            <div className="popUpStyling">
                <div className="mx-auto text-center w-full h-full flex flex-col">

                    <div className="flex justify-end items-center relative w-full h-[8vh] mt-12 sm:mt-0">
                        <img src={CrossBtnLight}
                             className="h-[50px] ml-3 bg-white dark:bg-gray-600 rounded-md shadow-md sm:hover:shadow-xl transition duration-300 cursor-pointer"
                             alt="Cancel button"
                             onClick={() => { dispatch(toggleUIState({ key: 'showMobSearch' })); }}/>
                    </div>

                    <div className="h-[8vh] w-full flex px-2 rounded-md">
                        <input
                            className="editInputStyling"
                            placeholder='Type to start'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSearch();
                            }}
                        />
                    </div>

                    <button className="cursor-pointer inline-block bg-rose-900 hover:bg-rose-950 text-white font-bold py-3 mx-auto rounded transition duration-300 w-[93%] sm:w-[10%]"
                            onClick={handleSearch}>
                        Search
                    </button>

                    {showResults && searchResult && (
                        <div>
                            <div className="fixed top-0 left-0 w-full h-full" onClick={() => setShowResults(false)}></div>
                            <div className="relative z-10 bg-white rounded-md shadow-md overflow-y-auto">
                                <ul>
                                    {searchResult["university-pages"].map((item) => (
                                        <li key={item.id}
                                            onClick={() => { navigate(`/universities/${item.id}`);
                                                setShowResults(false);
                                                dispatch(toggleUIState({ key: 'showMobSearch' })); } }
                                            className="cursor-pointer p-2 hover:bg-gray-200">
                                            {item.universityName}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MobSearch;