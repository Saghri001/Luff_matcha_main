import React from 'react';

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="w-full bg-[#F4EFE6] text-[#15191E] text-[11px] font-mono font-extrabold uppercase tracking-widest py-2 px-4 text-center flex items-center justify-center gap-2 border-b border-[#EAE3D8] z-50 relative select-none">
      <span className="text-[#E53935] font-black">●</span>
      <span>Free shipping over $40 • 100% Single-Estate Kyoto Tencha</span>
    </div>
  );
};
