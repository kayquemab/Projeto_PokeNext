"use client";

export default function ArrowNext({ onClick }) {
    return (
        <div
            onClick={onClick}
            className="
                w-[52px] h-20
                bg-[#1f1f1f]/90
                backdrop-blur-sm
                flex items-center justify-center
                cursor-pointer select-none
                relative
                transition-all duration-200
            "
            style={{
                clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 20%)",
            }}
        >
            <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M20 4 L8 12 L20 20" />
            </svg>
        </div>
    );
}
