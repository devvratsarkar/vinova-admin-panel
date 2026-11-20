'use client'
import React from 'react';
import { MdOutlineInfo } from 'react-icons/md';

export default function TooltipComponent({
  content,
  position = 'top',
}) {
  return (
    <div className="tooltip-wrapper">
      <MdOutlineInfo className="tooltip-icon" />

      <div className={`tooltip-box tooltip-${position}`}>
        <div dangerouslySetInnerHTML={{ __html: content }} />

        {/* Arrow */}
        <div className={`tooltip-arrow tooltip-arrow-${position}`}></div>
      </div>
    </div>
  );
}
