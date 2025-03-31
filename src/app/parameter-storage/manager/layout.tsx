import React from "react";

export const metadata = {
    title: "Parame Storage Manager",
    description: "Upload and Download Master Upload data",
};

export default function ParameLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <div>{children}</div>;
}
