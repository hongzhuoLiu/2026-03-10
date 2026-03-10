import React, { useEffect } from 'react';
import Star from '../../images/icons/StarYellowFill.png';

function PreviewUniReview({ uniBanner, uniName, uniLocation, uniLogo, onClose }) {

    // Prevent background scrolling
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    return (
        <div className="fixed top-0 left-0 w-screen h-screen z-50 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="relative bg-white dark:bg-gray-900 w-full h-[80vh] rounded-lg mx-6">
                {/* Close button */}
                <button 
                    onClick={onClose}
                    className="absolute z-10 text-5xl top-4 right-4 text-gray-700 dark:text-gray-200"
                >
                    ✖
                </button>

                <div className="relative">
                    <UniBanner universityData={uniBanner} />
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '15%' }}>
                        <UniTitleAndImg uniName={uniName} uniLocation={uniLocation} uniLogo={uniLogo}/>
                    </div>
                </div>
                <div className="h-[30%] mt-[-3%] relative">
                    <ProgramAndSubject starIconURL={Star} />
                </div>
            </div>
        </div>
    );
}

function UniTitleAndImg({ uniName, uniLocation, uniLogo }) {
    return (
        <div className="h-full flex justify-between">
            <div className="w-full sm:w-4/5">
                <h1 className="font-bold ml-1 mt-0 text-2xl sm:text-4xl 2xl:text-6xl text-black dark:text-gray-200">{uniName}</h1>
                <p style={{ marginTop: "0%" }} className="ml-1 font-bold text-xl sm:text-2xl 2xl:text-4xl text-gray-500 dark:text-gray-300">{uniLocation}</p>
            </div>

            <img src={uniLogo}
                className="hidden sm:block h-4/5 mr-[2%] self-center" alt={uniLogo} />
        </div>
    );
}

function UniBanner({ universityData }) {
    return (
        <div style={{ height: '60%', position: 'relative' }}>
            <div className="absolute top-0 left-0 w-full h-[90%] sm:h-[70%] bg-gradient-to-b from-white dark:from-gray-800 to-transparent"></div>
            <img src={universityData}
                className="w-screen block object-cover h-[30vh] sm:h-[50vh]" alt="University banner" />
            <div className="bg-gradient-to-t from-white dark:from-gray-900 to-transparent w-full h-[20%] absolute bottom-0 left-0">
            </div>
        </div>
    );
}

function ProgramAndSubject({ starIconURL }) {
    return (
        <div className="h-full w-full mt-10">
            <>
                <h3 className="text-sc-red dark:text-gray-200 ml-6 sm:ml-12 2xl:ml-24 text-3xl font-bold sm:mb-1">Programs</h3>
                <div className="sm:flex sm:justify-between w-11/12 m-auto">
                    {(() => {
                    const programs = [];
                    for (let i = 1; i <= 3; i++) {
                        programs.push(
                        <div style={{ width: "32.5%" }} key={i}>
                            <ShadowBox
                            name={`Program ${i}`}
                            rating={"-"}
                            starIconURL={starIconURL} // Pass the dynamic star icon URL
                            />
                        </div>
                        );
                    }
                    return programs;
                    })()}
                </div>
            </>

            <>
                <h3 className="text-sc-red dark:text-gray-200 ml-6 sm:ml-12 2xl:ml-24 text-3xl font-bold sm:mb-1">Subjects</h3>
                <div className="sm:flex sm:justify-between w-11/12 m-auto">
                    {(() => {
                    const programs = [];
                    for (let i = 1; i <= 3; i++) {
                        programs.push(
                        <div style={{ width: "32.5%" }} key={i}>
                            <ShadowBox
                            name={`Subject ${i}`}
                            rating={"-"}
                            starIconURL={starIconURL} // Pass the dynamic star icon URL
                            />
                        </div>
                        );
                    }
                    return programs;
                    })()}
                </div>
            </>
        </div>
    );
}

function ShadowBox({ name, rating, starIconURL }) {
    return (
        <div className="relative flex justify-center items-center h-16 w-full bg-white dark:bg-gray-600 drop-shadow-md rounded-md m-auto mb-4 sm:mb-0 sm:hover:drop-shadow-xl transition duration-300">
            <p className="text-gray-600 dark:text-gray-200 text-lg sm:text-xl px-10 sm:px-2 text-center font-bold">{name}</p>
            <div className="absolute flex items-center h-1/2 bottom-0 right-0">
                <p className="text-base text-gray-600 dark:text-gray-300 mr-1 font-bold">{rating}</p>
                {starIconURL ? (
                    <img src={starIconURL} className="h-3/5 mr-1" alt="Yellow star icon" />
                ) : (
                    <div className="h-3/5 mr-1" /> // Placeholder or loader if icon URL is not available
                )}
            </div>
        </div>
    );
}

export default PreviewUniReview;