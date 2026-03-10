import React from 'react';

function PageHeading({ pageName, icon, iconClassName = "" }) {
    const defaultSize = "h-[50px] sm:h-[60px]";
    const enlargedSize = "h-[75px] sm:h-[85px]";
    const sizeClass = pageName === "Cookies Policy" ? enlargedSize : defaultSize;

    return (
        <div className="flex justify-center sm:justify-start mt-2">
            <h1 className="titleTextPrimary">{pageName}</h1>
            {icon && (
                <img
                    className={`${sizeClass} ml-3 ${iconClassName}`.trim()}
                    src={icon}
                    alt="Page icon"
                />
            )}
        </div>
    );
}

export default PageHeading;
