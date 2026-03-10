import { useRef, useEffect, useState } from "react";

function SelectButtonGroup({ options, selectedOption, onOptionChange, buttonWidth = 150 }) {
    const buttonContainerRef = useRef(null);
    const [sliderStyle, setSliderStyle] = useState({ left: 0, width: 0 });

    useEffect(() => {
        const updateSliderPosition = () => {
            if (buttonContainerRef.current) {
                const containerRect = buttonContainerRef.current.getBoundingClientRect();
                const selectedButton = document.querySelector(`[data-type="${selectedOption}"]`);
                if (selectedButton) {
                    const buttonRect = selectedButton.getBoundingClientRect();
                    setSliderStyle({
                        width: `${buttonRect.width}px`,
                        left: `${buttonRect.left - containerRect.left}px`,
                    });
                }
            }
        };

        updateSliderPosition();
    }, [selectedOption]);

    return (
        <div ref={buttonContainerRef} className={`relative shadow-inner h-12 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center px-1 sm:ml-4 w-full sm:w-auto`}>
            <div className="absolute left-0 h-[85%] top-[7.5%] bg-white dark:bg-gray-800 transition-all duration-300 rounded-md shadow-md" style={sliderStyle}></div>
            {options.map((option) => (
                <SelectButton
                    key={option.type}
                    text={option.text}
                    image={option.image}
                    type={option.type}
                    selectedType={selectedOption}
                    onClick={() => onOptionChange(option.type)}
                />
            ))}
        </div>
    );
}


function SelectButton({ text, image, type, selectedType, onClick }) {
    const isSelected = type === selectedType;
    const buttonStyle = isSelected ? "text-sc-red dark:text-gray-200" : "text-gray-800 dark:text-white";

    return (
        <button
            data-type={type}
            className={`relative ${buttonStyle} flex-1 min-w-[120px] sm:min-w-[180px] md:min-w-[150px] h-4/5 text-sm font-semibold flex justify-center items-center`}
            onClick={onClick}
        >
            {image ? (
                <img src={image} alt={text || type} className="w-full h-[70%] object-contain" />
            ) : (
                <p className="whitespace-nowrap">{text}</p>
            )}
        </button>
        
    );
}

export default SelectButtonGroup;