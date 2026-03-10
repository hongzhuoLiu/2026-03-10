// src/components/common/LogoTile.jsx
import React from "react";

export default function LogoTile({
  src,
  alt = "logo",
  size = 56,          
  imgMaxW = "80%",    
  imgMaxH = "80%",
  rounded = "rounded-xl",
  className = "",
}) {
  return (
    <div
      className={`flex items-center justify-center ${rounded} 
                  bg-neutral-200 dark:bg-neutral-700 
                  ring-1 ring-neutral-300 dark:ring-neutral-600 
                  shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          maxWidth: imgMaxW,
          maxHeight: imgMaxH,
          objectFit: "contain",
          display: "block",
        }}
        loading="lazy"
      />
    </div>
  );
}