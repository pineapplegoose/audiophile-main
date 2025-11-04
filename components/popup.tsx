import { useEffect, useRef } from "react";

export function Popup({
    onClose,
    children,
}: {
    onClose: () => void;
    children: React.ReactNode;
}) {
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                onClose(); // closes popup when clicking outside
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    return (
        <div className="fixed inset-0 bg-black/40 flex items-start justify-end">
            <div
                ref={popupRef}
                className="bg-white p-4 mt-32 mr-10 rounded-lg shadow-lg w-[400px] relative"
            >
                {children}
            </div>
        </div>
    );
}
