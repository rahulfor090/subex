import React, { useEffect, useRef, useState } from "react";
import { cn } from "../../lib/utils";

export const BackgroundBeams = ({ className }) => {
    const beamsRef = useRef(null);

    useEffect(() => {
        // Simple subtle pulse effect or movement could be done here if needed
        // But CSS animation is often smoother for this specific look
    }, []);

    return (
        <div
            className={cn(
                "absolute inset-0 w-full h-full pointer-events-none overflow-hidden",
                className
            )}
        >
            <div className="absolute left-0 top-0 w-full h-full bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent blur-3xl opacity-20 transform -skew-y-12 animate-pulse" />
            <div
                className="absolute -left-[10%] -top-[10%] w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent blur-3xl opacity-30 animate-blob"
                style={{ animationDelay: "0s" }}
            />
            <div
                className="absolute -right-[10%] -bottom-[10%] w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent blur-3xl opacity-30 animate-blob"
                style={{ animationDelay: "2s" }}
            />
            <div
                className="absolute left-[20%] top-[20%] w-[60%] h-[60%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent blur-3xl opacity-20 animate-blob"
                style={{ animationDelay: "4s" }}
            />

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-grid-white/[0.02] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        </div>
    );
};
