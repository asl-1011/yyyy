import React from 'react';

interface ProfileCardProps {
  role: string;
  name: string;
  quote: string;
  image: string;
}

export default function ProfileCard({ role, name, quote, image }: ProfileCardProps) {
  return (
    <div className="group relative w-full max-w-sm sm:max-w-[420px] h-[220px] bg-white shadow-xl rounded-2xl overflow-hidden p-6 sm:p-8 transition-transform duration-300 hover:shadow-2xl hover:-translate-y-3 mx-auto">
      
      {/* Cut Corner Image */}
      <div className="absolute top-0 right-0 w-1/2 sm:w-[220px] h-full overflow-hidden">
        <div 
          className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600"
          style={{ clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 0 100%)' }}
        >
          <img
            src={image}
            alt={`${name} profile`}
            className="object-cover w-full h-full opacity-90 group-hover:opacity-100 transition-opacity duration-500"
            style={{ clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 0 100%)' }}
          />
        </div>
      </div>

      {/* Decorative gradient overlay */}
      <div 
        className="absolute top-0 right-0 w-1/2 sm:w-[220px] h-full bg-gradient-to-br from-blue-500 to-purple-600 opacity-20 group-hover:opacity-10 transition-opacity duration-500"
        style={{ clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 0 100%)' }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between h-full">
        <div>
          {/* Role + Name */}
          <p className="text-gray-500 text-xs sm:text-sm font-semibold tracking-wide uppercase">
            {role}
          </p>
          <h2 className="text-xl sm:text-2xl font-extrabold text-green-600 mt-2">
            {name}
          </h2>

          {/* Quote */}
          <p className="text-gray-700 text-sm sm:text-base italic mt-4 sm:mt-6 pr-28 sm:pr-36 leading-relaxed overflow-y-auto max-h-[300px]">
            {quote}
          </p>
        </div>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-green-500 opacity-50 group-hover:opacity-80 transition-opacity duration-500" />
    </div>
  );
}
