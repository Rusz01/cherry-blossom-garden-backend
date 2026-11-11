
import type { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/components/frontend/navbar";
import ReservationContact from "@/components/frontend/reservation/reservationContact";

export const metadata: Metadata = {
    title: "Reservation & Contact | Cherry Blossom Garden",
    description:
        "Plan your visit to Cherry Blossom Garden. Request a table in our café, restaurant, garden balcony, private dining or rooftop, and get in touch with our team.",
};

export default function ReservationPage() {
    return (
        <div className="min-h-screen bg-midnight font-inter text-ivory">
            <Navbar />

            <main>
                <Suspense fallback={<div className="min-h-[650px]" />}>
                    <ReservationContact />
                </Suspense>
            </main>
        </div>
    );
}
