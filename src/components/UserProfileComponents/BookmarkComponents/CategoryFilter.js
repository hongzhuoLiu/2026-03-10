// CategoryFilter.jsx
import React from 'react';


function ActionButton({ text, isSelected, onClick }) {
  const textCol = isSelected
    ? 'text-white'
    : 'text-rose-900 dark:text-white';
  const bgCol = isSelected
    ? 'bg-sc-red'
    : 'bg-white dark:bg-gray-700';

    return (
      <div
        className={`
          inline-flex           
          items-center 
          justify-center
          h-10                  
          px-4                  
          ${bgCol} ${textCol}
          rounded-full          
          drop-shadow-md
          transition duration-300
          hover:drop-shadow-xl
          cursor-pointer
        `}
        onClick={onClick}
      >
        <span className="font-semibold text-sm sm:text-base">{text}</span>
      </div>
    );
  }


const categories = [
  { id: 'universities',   text: 'Universities'   },
  { id: 'programs',       text: 'Programs'       },
  { id: 'subjects',       text: 'Subjects'       },
  { id: 'accommodation', text: 'Accommodation' },
  { id: 'destinations',   text: 'Destinations'   },
  { id: 'health',         text: 'Health'         },
  { id: 'fitness',        text: 'Fitness'        },
  { id: 'eateries',       text: 'Eateries'       },
  { id: 'clubs',          text: 'Clubs & Societies' },
  { id: 'culture',        text: 'Culture & Religion' },
  { id: 'links',          text: 'Helpful Links'  },
];

export default function CategoryFilter({ activeCategory, onChange }) {
  return (
    <div
      className={`
        mt-6
        mb-6
        w-[95%] mx-auto
        grid 
        grid-cols-2        
        sm:grid-cols-6     
        gap-3              
      `}
    >
      {categories.map(cat => (
        <ActionButton
          key={cat.id}
          text={cat.text}
          isSelected={activeCategory === cat.id}
          onClick={() => onChange(cat.id)}
        />
      ))}
    </div>
  );
}
