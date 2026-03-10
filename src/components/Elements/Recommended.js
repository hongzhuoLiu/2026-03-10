import { useNavigate } from "react-router-dom";
import GradCap from '../../images/icons/graduationCol.png';
import Atom from '../../images/icons/atomicCol.png';
import Book from '../../images/icons/writeCol.png';

function Recommended({ type, text, click, advertisement, bgCol }) {

    const navigate = useNavigate();

    const handleClick = () => {
        navigate(click);
    };

    // Determine the image to use based on the type argument
    let imageSrc;
    if (type === 1) {
        imageSrc = GradCap;
    } else if (type === 2) {
        imageSrc = Atom;
    } else if (type === 3) {
        imageSrc = Book;
    } else {
        imageSrc= null;
    }

    return (
        <div className="relative min-w-[40vw] sm:min-w-[200px] min-h-36 sm:w-[40vw] sm:h-[15vh] lg:h-[18vh] ml-1 sm:ml-0 bg-white dark:bg-gray-600 rounded-md shadow-md p-2 flex flex-col justify-end
            sm:hover:transform sm:hover:scale-105 sm:hover:-rotate-3 transition duration-300 cursor-pointer" 
            onClick={handleClick}>
            {imageSrc && (
                <img
                    src={imageSrc}
                    alt="Icon"
                    className="absolute top-2 right-2 h-10"
                />
            )}
            
            {!advertisement && (
                <div className="text-left font-bold text-sm sm:text-base leading-snug text-gray-700 dark:text-gray-200">
                    {text}
                </div>
            )}

            {advertisement && (
                <div className={`flex justify-center items-center h-full font-bold text-sm sm:text-2xl text-center text-gray-700 dark:text-gray-200`}>
                    {text}
                </div>
            )}

            {/* {advertisement && (
                <div className="absolute bottom-0 right-0 h-6 w-24 bg-white rounded-br-md rounded-tl-md">
                    <p>Sponsored</p>
                </div>
            )} */}
            
        </div>
    );
}

export default Recommended;