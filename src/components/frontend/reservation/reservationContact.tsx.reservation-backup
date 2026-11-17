"use client";

import {
    useMemo,
    useRef,
    useState,
    type FormEvent,
    type ReactNode,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
    AlertCircle,
    ArrowLeft,
    ArrowRight,
    ArrowUpRight,
    Check,
    ChevronLeft,
    ChevronRight,
    Clock3,
    Mail,
    Loader2,
    MapPin,
    Minus,
    Phone,
    Plus,
    Send,
    Users,
} from "lucide-react";
import { AnimatePresence, m, type Variants } from "motion/react";

import LayoutMotion from "@/components/frontend/motion/layoutMotion";
import Reveal from "@/components/frontend/motion/reveal";
import RiseText from "@/components/frontend/motion/riseText";
import { ease } from "@/lib/frontend/motion/tokens";

const contact = {
    // Replace these with verified business information.
    email: "",
    phone: "",
    address: "",
    mapsUrl: "",
    hours: "",
};

const experiences = [
    {
        id: "cafe",
        name: "Café",
        floor: "Ground Floor",
        image: "/assets/hero.png",
    },
    {
        id: "restaurant",
        name: "Restaurant",
        floor: "First Floor",
        image: "/assets/first-floor.png",
    },
    {
        id: "garden-balcony",
        name: "Garden Balcony",
        floor: "First Floor",
        image: "/assets/garden-ambience.png",
    },
    {
        id: "private-dining",
        name: "Private Dining",
        floor: "First Floor",
        image: "/assets/private-celebration.png",
    },
    {
        id: "rooftop",
        name: "Rooftop",
        floor: "Second Floor",
        image: "/assets/rooftop.png",
    },
] as const;

const occasions = [
    "Birthday",
    "Anniversary",
    "Date Night",
    "Business",
    "Family",
    "Other",
] as const;

// Preferred times only. These are not live availability.
// Replace with slots supplied by your reservation backend.
const timePreferences = [
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
];

const steps = [
    "Date",
    "Guests",
    "Experience",
    "Time",
    "Occasion",
    "Details",
];

const fieldClass =
    "w-full min-h-[49px] rounded-[5px] border border-white/[0.15] bg-white/[0.035] px-4 text-[13px] text-ivory outline-none placeholder:text-ivory/30 transition-[border-color,background-color,box-shadow] duration-300 hover:border-white/25 focus:border-blossom/70 focus:bg-white/[0.06] focus:shadow-[0_0_0_4px_rgba(212,135,143,0.12)] aria-[invalid=true]:border-[#eea4ad]/70";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/*
 * Motion
 * - Steps: the outgoing panel leaves and the incoming one enters from the
 *   direction of travel. Fast (≈0.4s total), and mode="wait" so rapid
 *   clicks never stack panels. All booking state lives in this component,
 *   so remounting a step never loses what the visitor entered.
 * - Numbers and months slide by direction; the selected day glides.
 * - Reduced motion: MotionConfig drops the movement, opacity only.
 */
const panelVariants: Variants = {
    enter: (direction: number) => ({ opacity: 0, x: direction * 28 }),
    center: { opacity: 1, x: 0, transition: { duration: 0.32, ease: ease.out } },
    exit: (direction: number) => ({
        opacity: 0,
        x: direction * -20,
        transition: { duration: 0.16, ease: ease.inOut },
    }),
};

const rollVariants: Variants = {
    enter: (direction: number) => ({ opacity: 0, y: direction * 22 }),
    center: { opacity: 1, y: 0, transition: { duration: 0.28, ease: ease.out } },
    exit: (direction: number) => ({
        opacity: 0,
        y: direction * -22,
        transition: { duration: 0.18, ease: ease.inOut },
    }),
};

/**
 * Turn a failed response into an honest, readable message.
 * The endpoint may return HTML (e.g. a 404 page), so JSON is optional.
 */
async function failureMessage(response: Response, fallback: string) {
    try {
        const data: unknown = await response.json();

        if (
            data &&
            typeof data === "object" &&
            "error" in data &&
            typeof data.error === "string" &&
            data.error.trim()
        ) {
            return data.error;
        }
    } catch {
        // Not JSON — fall through to a status-based message.
    }

    if (response.status === 404) {
        return "Online requests aren't available yet, so nothing has been sent. Please try again later.";
    }

    if (response.status >= 500) {
        return "Our server couldn't process this right now, so nothing has been sent. Please try again shortly.";
    }

    return fallback;
}

function networkMessage(error: unknown, fallback: string) {
    // fetch() rejects with a TypeError when the server can't be reached.
    if (error instanceof TypeError) {
        return "We couldn't reach our server. Please check your connection and try again.";
    }

    return error instanceof Error && error.message ? error.message : fallback;
}

const outlineButton =
    "inline-flex min-h-[44px] items-center justify-center gap-3 rounded-full border border-blossom/55 px-6 py-3 text-[12px] text-blossom transition-colors hover:bg-blossom hover:text-midnight";

const dateKey = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const formatDate = (value: string) => {
    if (!value) return "Choose a date";

    return new Intl.DateTimeFormat("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(new Date(`${value}T12:00:00`));
};

const formatTime = (value: string) => {
    if (!value) return "";

    const [hours, minutes] = value.split(":").map(Number);
    return new Intl.DateTimeFormat("en-GB", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: "UTC",
    }).format(new Date(Date.UTC(2026, 0, 1, hours, minutes)));
};

type Booking = {
    date: string;
    guests: number;
    experience: string;
    time: string;
    occasion: string;
    name: string;
    email: string;
    phone: string;
    message: string;
};

type FormStatus =
    | { type: "idle"; message: "" }
    | { type: "success" | "error"; message: string };

function SmallLabel({ children }: { children: ReactNode }) {
    return (
        <span className="text-[10px] font-semibold uppercase tracking-[0.27em] text-blossom">
      {children}
    </span>
    );
}

function Calendar({
                      value,
                      onChange,
                  }: {
    value: string;
    onChange: (value: string) => void;
}) {
    const today = useMemo(() => new Date(), []);
    const [month, setMonth] = useState(() => {
        const d = value ? new Date(`${value}T12:00:00`) : new Date();
        return new Date(d.getFullYear(), d.getMonth(), 1);
    });
    const [monthDirection, setMonthDirection] = useState(1);

    const firstWeekday =
        new Date(month.getFullYear(), month.getMonth(), 1).getDay();

    const daysInMonth = new Date(
        month.getFullYear(),
        month.getMonth() + 1,
        0
    ).getDate();

    // Always six rows, so the panel never changes height between months.
    const cells = [
        ...Array.from({ length: firstWeekday }, () => 0),
        ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];
    while (cells.length < 42) cells.push(0);

    const monthTitle = new Intl.DateTimeFormat("en-GB", {
        month: "long",
        year: "numeric",
    }).format(month);

    const changeMonth = (amount: number) => {
        setMonthDirection(amount > 0 ? 1 : -1);
        setMonth(
            (current) =>
                new Date(
                    current.getFullYear(),
                    current.getMonth() + amount,
                    1
                )
        );
    };

    const currentMonth =
        month.getFullYear() === today.getFullYear() &&
        month.getMonth() === today.getMonth();

    return (
        <div className="w-full max-w-[440px]">
            <div className="mb-5 flex items-center justify-between">
                <button
                    type="button"
                    disabled={currentMonth}
                    onClick={() => changeMonth(-1)}
                    aria-label="Previous month"
                    className="flex h-11 w-11 items-center justify-center rounded-full text-ivory/70 transition-colors duration-300 hover:bg-white/[0.06] hover:text-blossom disabled:opacity-20 disabled:hover:bg-transparent"
                >
                    <ChevronLeft size={19} />
                </button>

                <span className="relative h-[32px] min-w-[170px] overflow-hidden text-center" aria-live="polite">
                    <AnimatePresence initial={false} custom={monthDirection}>
                        <m.span
                            key={monthTitle}
                            custom={monthDirection}
                            variants={panelVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            className="absolute inset-0 font-cormorant text-[25px] leading-[32px] text-ivory"
                        >
                            {monthTitle}
                        </m.span>
                    </AnimatePresence>
                </span>

                <button
                    type="button"
                    onClick={() => changeMonth(1)}
                    aria-label="Next month"
                    className="flex h-11 w-11 items-center justify-center rounded-full text-ivory/70 transition-colors duration-300 hover:bg-white/[0.06] hover:text-blossom"
                >
                    <ChevronRight size={19} />
                </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
                {["S", "M", "T", "W", "T", "F", "S"].map(
                    (day, i) => (
                        <span
                            key={i}
                            className="py-2 text-[11px] text-ivory/40"
                        >
              {day}
            </span>
                    )
                )}
            </div>

            {/* Days slide with the month; the selection pill glides between days. */}
            <div className="relative overflow-hidden">
            <AnimatePresence mode="wait" initial={false} custom={monthDirection}>
            <m.div
                key={monthTitle}
                custom={monthDirection}
                variants={panelVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="grid grid-cols-7 gap-1 text-center"
            >
                {cells.map((day, index) => {
                    if (!day) {
                        return <span key={`empty-${index}`} className="aspect-square w-full max-w-[43px]" />;
                    }

                    const d = new Date(
                        month.getFullYear(),
                        month.getMonth(),
                        day
                    );

                    const key = dateKey(d);
                    const disabled = key < dateKey(today);
                    const selected = value === key;

                    return (
                        <button
                            key={key}
                            type="button"
                            disabled={disabled}
                            onClick={() => onChange(key)}
                            aria-label={formatDate(key)}
                            aria-pressed={selected}
                            className={`
                focus-ring
                relative mx-auto flex aspect-square w-full max-w-[43px]
                items-center justify-center rounded-full
                text-[12px] transition-colors duration-300
                active:scale-95
                ${
                                selected
                                    ? "font-semibold text-midnight"
                                    : "text-ivory/75 hover:bg-white/10"
                            }
                disabled:cursor-not-allowed
                disabled:opacity-20
              `}
                        >
                            {selected ? (
                                <m.span
                                    layoutId="calendar-selection"
                                    aria-hidden="true"
                                    className="absolute inset-0 rounded-full bg-blossom shadow-[0_6px_20px_-6px_rgba(212,135,143,0.7)]"
                                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                                />
                            ) : null}
                            <span className="relative">{day}</span>
                        </button>
                    );
                })}
            </m.div>
            </AnimatePresence>
            </div>
        </div>
    );
}

export default function ReservationContact() {
    const searchParams = useSearchParams();
    const initialOccasion =
        searchParams.get("occasion") === "kids-party"
            ? "Birthday"
            : "";

    const initialMessage =
        searchParams.get("occasion") === "kids-party"
            ? "I would like to enquire about a kids party."
            : "";

    const [step, setStep] = useState(0);
    // 1 = forward, -1 = back: which side the next panel enters from.
    const [direction, setDirection] = useState(1);
    const [guestDirection, setGuestDirection] = useState(1);
    // Fields the visitor has left, so messages appear after, not during, typing.
    const [touched, setTouched] = useState<Partial<Record<"name" | "email" | "phone", boolean>>>({});
    // Move focus to the new step's heading after keyboard/mouse navigation.
    const focusHeading = useRef(false);
    const [booking, setBooking] = useState<Booking>({
        date: "",
        guests: 2,
        experience: "",
        time: "",
        occasion: initialOccasion,
        name: "",
        email: "",
        phone: "",
        message: initialMessage,
    });

    const [reservationStatus, setReservationStatus] =
        useState<FormStatus>({ type: "idle", message: "" });

    const [sending, setSending] = useState(false);
    const [enquirySending, setEnquirySending] = useState(false);

    const [enquiry, setEnquiry] = useState({
        name: "",
        email: "",
        message: "",
    });

    const [enquiryStatus, setEnquiryStatus] =
        useState<FormStatus>({ type: "idle", message: "" });

    const updateBooking = <K extends keyof Booking>(
        key: K,
        value: Booking[K]
    ) => {
        setBooking((previous) => ({ ...previous, [key]: value }));
        setReservationStatus({ type: "idle", message: "" });
    };

    const goToStep = (target: number) => {
        if (target === step) return;
        setDirection(target > step ? 1 : -1);
        focusHeading.current = true;
        setStep(target);
    };

    const changeGuests = (delta: number) => {
        setGuestDirection(delta > 0 ? 1 : -1);
        updateBooking("guests", booking.guests + delta);
    };

    // Same rules as validStep(), surfaced as messages once a field is left.
    const detailErrors = {
        name: booking.name.trim() ? "" : "Please enter your name.",
        phone: booking.phone.trim() ? "" : "Please enter a contact number.",
        email: EMAIL_PATTERN.test(booking.email) ? "" : "Please enter a valid email address.",
    };

    const validStep = () => {
        switch (step) {
            case 0:
                return Boolean(booking.date) &&
                    booking.date >= dateKey(new Date());
            case 1:
                return booking.guests >= 1 && booking.guests <= 20;
            case 2:
                return Boolean(booking.experience);
            case 3:
                return Boolean(booking.time);
            case 4:
                return true;
            case 5:
                return Boolean(
                    booking.name.trim() &&
                    booking.phone.trim() &&
                    EMAIL_PATTERN.test(booking.email)
                );
            default:
                return false;
        }
    };

    async function submitReservation() {
        if (!validStep() || sending) return;

        setSending(true);
        setReservationStatus({ type: "idle", message: "" });

        try {
            const response = await fetch("/api/reservation-contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "reservation",
                    ...booking,
                }),
            });

            // Success is shown only for a real 2xx response from the server.
            if (!response.ok) {
                throw new Error(
                    await failureMessage(response, "Unable to send request.")
                );
            }

            setReservationStatus({
                type: "success",
                message:
                    "Your reservation request has been received. Our team will contact you to confirm availability.",
            });
        } catch (error) {
            setReservationStatus({
                type: "error",
                message: networkMessage(
                    error,
                    "Something went wrong. Please try again."
                ),
            });
        } finally {
            setSending(false);
        }
    }

    async function submitEnquiry(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (enquirySending) return;

        setEnquirySending(true);
        setEnquiryStatus({ type: "idle", message: "" });

        try {
            const response = await fetch("/api/reservation-contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "contact",
                    ...enquiry,
                }),
            });

            if (!response.ok) {
                throw new Error(
                    await failureMessage(response, "Unable to send message.")
                );
            }

            setEnquiryStatus({
                type: "success",
                message: "Thank you. Your message has been received.",
            });
            setEnquiry({ name: "", email: "", message: "" });
        } catch (error) {
            setEnquiryStatus({
                type: "error",
                message: networkMessage(error, "Unable to send your message."),
            });
        } finally {
            setEnquirySending(false);
        }
    }

    const selectedExperience = experiences.find(
        (item) => item.id === booking.experience
    );

    return (
        <div className="relative overflow-hidden bg-midnight">
            {/* SPLIT PAGE */}
            <div className="mx-auto grid max-w-[1900px] lg:grid-cols-[57%_43%]">

                {/* =======================================
            LEFT: RESERVATIONS
            ======================================= */}
                <section
                    id="reservation"
                    className="relative min-w-0 border-r border-champagne/10"
                >
                    <div
                        className="pointer-events-none absolute inset-x-0 top-0 h-[500px] opacity-15"
                        style={{
                            background:
                                "radial-gradient(ellipse at 65% 0%, #a66f73 0%, transparent 65%)",
                        }}
                    />

                    <div className="relative px-5 pb-20 pt-16 sm:px-10 lg:px-12 lg:pt-20 xl:px-20">
                        <div className="cbg-enter cbg-delay-1">
                            <SmallLabel>Make a Reservation</SmallLabel>
                        </div>

                        <h1 className="mt-7 max-w-[800px] font-cormorant text-[clamp(54px,5.8vw,96px)] font-normal leading-[0.89] tracking-[-0.04em]">
                            <RiseText text="A Beautiful" delay={0.2} />
                            <br />
                            <RiseText text="Experience" delay={0.34} />{" "}
                            <span className="                    mt-2
                    font-allura font-normal
                    leading-[1.1]
                    tracking-normal text-blossom"><RiseText text="Awaits." delay={0.44} /></span>
                        </h1>

                        <p className="cbg-enter mt-7 max-w-[450px] text-[13px] leading-7 text-ivory/55 sm:text-[14px]" style={{ animationDelay: "0.6s" }}>
                            Good food, beautiful spaces and memorable moments.
                            We look forward to welcoming you.
                        </p>

                        {/* STEPPER */}
                        <div
                            aria-label="Reservation progress"
                            className="cbg-enter mt-12 grid grid-cols-6 gap-1 sm:mt-16 sm:gap-3"
                            style={{ animationDelay: "0.75s" }}
                        >
                            {steps.map((label, index) => {
                                const completed = index < step;
                                const active = index === step;

                                return (
                                    <button
                                        type="button"
                                        key={label}
                                        onClick={() => {
                                            // Permit visiting earlier steps only.
                                            if (index <= step) goToStep(index);
                                        }}
                                        disabled={index > step}
                                        aria-current={active ? "step" : undefined}
                                        aria-label={`Step ${index + 1}: ${label}${completed ? " (completed)" : active ? " (current)" : ""}`}
                                        className="focus-ring group min-w-0 rounded-md text-left disabled:cursor-default"
                                    >
                    <span className="flex items-center gap-2">
                      <span
                          className={`
                          flex h-9 w-9 shrink-0 items-center justify-center rounded-full border
                          text-[12px] transition-[background-color,border-color,color,box-shadow] duration-500 sm:h-10 sm:w-10
                          ${
                              active
                                  ? "border-blossom bg-blossom text-midnight shadow-[0_0_0_5px_rgba(212,135,143,0.14)]"
                                  : completed
                                      ? "border-blossom text-blossom group-hover:bg-blossom/10"
                                      : "border-white/25 text-ivory/50"
                          }
                        `}
                      >
                        {completed ? (
                            <Check size={15} className="cbg-enter-fade" style={{ animationDuration: "400ms" }} />
                        ) : (
                            index + 1
                        )}
                      </span>
                        {index < steps.length - 1 && (
                            // The connector fills as each step is completed.
                            <span className="relative h-px min-w-0 flex-1 overflow-hidden bg-white/20">
                                <span
                                    className={`absolute inset-0 origin-left bg-blossom transition-transform duration-700 ease-brand ${
                                        completed ? "scale-x-100" : "scale-x-0"
                                    }`}
                                />
                            </span>
                        )}
                    </span>
                                        <span
                                            className={`mt-3 block text-[9px] transition-colors duration-500 sm:text-[11px] ${
                                                active ? "text-ivory" : completed ? "text-ivory/65" : "text-ivory/45"
                                            }`}
                                        >
                      {label}
                    </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* STEP CONTENT */}
                        <div className="mt-12 min-h-[325px] overflow-x-clip sm:mt-14">
                          <AnimatePresence mode="wait" initial={false} custom={direction}>
                          <m.div
                              key={step}
                              custom={direction}
                              variants={panelVariants}
                              initial="enter"
                              animate="center"
                              exit="exit"
                          >
                            <div className="mb-7 flex items-center justify-between gap-3">
                                <div>
                                    <SmallLabel>
                                        Step {String(step + 1).padStart(2, "0")}
                                    </SmallLabel>
                                    <h2
                                        tabIndex={-1}
                                        ref={(element) => {
                                            if (element && focusHeading.current) {
                                                focusHeading.current = false;
                                                element.focus({ preventScroll: true });
                                            }
                                        }}
                                        className="mt-3 font-cormorant text-[37px] font-normal outline-none sm:text-[45px]"
                                    >
                                        {[
                                            "Choose a Date",
                                            "How Many Guests?",
                                            "Choose Your Experience",
                                            "Select a Time",
                                            "What's the Occasion?",
                                            "Your Details & Message",
                                        ][step]}
                                    </h2>
                                </div>
                                <span className="text-[11px] text-ivory/60">
                  {step + 1} / 6
                </span>
                            </div>

                            {/* DATE */}
                            {step === 0 && (
                                <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
                                    <div className="rounded-lg border border-white/10 bg-white/[0.025] p-4 sm:p-6">
                                        <LayoutMotion>
                                            <Calendar
                                                value={booking.date}
                                                onChange={(value) => updateBooking("date", value)}
                                            />
                                        </LayoutMotion>
                                    </div>
                                    <div className="relative hidden min-h-[305px] overflow-hidden rounded-lg md:block">
                                        <Image
                                            src="/assets/elevated-dining.png"
                                            alt="Elegant Cherry Blossom Garden dining"
                                            fill
                                            sizes="30vw"
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                        <span className="absolute bottom-6 left-6 font-cormorant text-[29px] italic">
                      Moments worth sharing.
                    </span>
                                    </div>
                                    {booking.date && (
                                        <p key={booking.date} className="cbg-enter-fade text-[12px] text-blossom md:col-span-2" style={{ animationDuration: "400ms" }}>
                                            Selected: {formatDate(booking.date)}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* GUESTS */}
                            {step === 1 && (
                                <div className="max-w-[470px] rounded-lg border border-white/10 bg-white/[0.03] p-8 sm:p-10">
                                    <Users size={29} strokeWidth={1.2} className="text-blossom" />
                                    <p className="mt-5 text-[13px] text-ivory/55">
                                        How many people will be joining us?
                                    </p>
                                    <div className="mt-8 flex items-center justify-between border border-white/15 px-5 py-4">
                                        <button
                                            type="button"
                                            aria-label="Remove guest"
                                            disabled={booking.guests <= 1}
                                            onClick={() => changeGuests(-1)}
                                            className={guestButton}
                                        >
                                            <Minus size={20} />
                                        </button>
                                        <div className="text-center">
                                            {/* The number rolls up when adding, down when removing. */}
                                            <span className="relative block h-[55px] w-24 overflow-hidden" aria-hidden="true">
                                                <AnimatePresence initial={false} custom={guestDirection}>
                                                    <m.span
                                                        key={booking.guests}
                                                        custom={guestDirection}
                                                        variants={rollVariants}
                                                        initial="enter"
                                                        animate="center"
                                                        exit="exit"
                                                        className="absolute inset-0 font-cormorant text-[55px] leading-none"
                                                    >
                                                        {booking.guests}
                                                    </m.span>
                                                </AnimatePresence>
                                            </span>
                                            <p className="mt-1 text-[10px] text-ivory/60">
                                                {booking.guests === 1 ? "Guest" : "Guests"}
                                            </p>
                                            <span className="sr-only" aria-live="polite">
                                                {booking.guests} {booking.guests === 1 ? "guest" : "guests"}
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            aria-label="Add guest"
                                            disabled={booking.guests >= 20}
                                            onClick={() => changeGuests(1)}
                                            className={guestButton}
                                        >
                                            <Plus size={20} />
                                        </button>
                                    </div>
                                    {/* Turns to an accent note once the online limit is reached. */}
                                    <p
                                        role={booking.guests >= 20 ? "status" : undefined}
                                        className={`mt-5 text-[11px] leading-6 transition-colors duration-500 ${
                                            booking.guests >= 20 ? "text-blossom" : "text-ivory/40"
                                        }`}
                                    >
                                        {booking.guests >= 20
                                            ? "20 guests is the most we can take online. "
                                            : null}
                                        For larger gatherings, please contact our team
                                        directly.
                                    </p>
                                </div>
                            )}

                            {/* EXPERIENCES */}
                            {step === 2 && (
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
                                    {experiences.map((item) => {
                                        const selected =
                                            booking.experience === item.id;

                                        return (
                                            <button
                                                key={item.id}
                                                type="button"
                                                aria-pressed={selected}
                                                onClick={() =>
                                                    updateBooking("experience", item.id)
                                                }
                                                className={`focus-ring group relative aspect-[4/5] overflow-hidden rounded-md border text-left transition-[border-color,box-shadow,scale] duration-500 active:scale-[0.98] ${
                                                    selected
                                                        ? "border-blossom shadow-[0_0_0_1px_var(--blossom),0_18px_40px_-18px_rgba(212,135,143,0.55)]"
                                                        : "border-white/15 hover:border-blossom/50"
                                                }`}
                                            >
                                                <Image
                                                    src={item.image}
                                                    alt=""
                                                    fill
                                                    sizes="(max-width: 640px) 50vw, 20vw"
                                                    className={`object-cover transition-[scale,filter] duration-700 ${
                                                        selected
                                                            ? "scale-105 saturate-100"
                                                            : booking.experience
                                                                ? "saturate-[0.7] group-hover:scale-105 group-hover:saturate-100"
                                                                : "group-hover:scale-105"
                                                    }`}
                                                />
                                                <div className={`absolute inset-0 bg-gradient-to-t from-black/95 via-black/15 to-black/5 transition-opacity duration-500 ${selected ? "opacity-85" : ""}`} />
                                                <AnimatePresence>
                                                    {selected && (
                                                        <m.span
                                                            initial={{ opacity: 0, scale: 0.5 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            exit={{ opacity: 0, scale: 0.5 }}
                                                            transition={{ type: "spring", stiffness: 500, damping: 28 }}
                                                            className="absolute right-3 top-3 rounded-full bg-blossom p-1 text-midnight"
                                                        >
                                                            <Check size={15} />
                                                        </m.span>
                                                    )}
                                                </AnimatePresence>
                                                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                                                    <p className="font-cormorant text-[24px] leading-none sm:text-[27px]">
                                                        {item.name}
                                                    </p>
                                                    <p className="mt-2 text-[10px] text-ivory/65">
                                                        {item.floor}
                                                    </p>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {/* PREFERRED TIME */}
                            {step === 3 && (
                                <div>
                                    <p className="mb-6 text-[12px] leading-6 text-ivory/60">
                                        Choose your preferred arrival time. Our team will
                                        confirm the actual availability.
                                    </p>
                                    <div className="grid max-w-[660px] grid-cols-3 gap-3 sm:grid-cols-4">
                                        {timePreferences.map((time) => (
                                            <button
                                                key={time}
                                                type="button"
                                                aria-pressed={booking.time === time}
                                                onClick={() => updateBooking("time", time)}
                                                className={`focus-ring min-h-[51px] rounded-md border text-[12px] transition-[background-color,border-color,color,scale] duration-300 active:scale-[0.97] ${
                                                    booking.time === time
                                                        ? "border-blossom bg-blossom/15 text-blossom"
                                                        : "border-white/15 text-ivory/70 hover:border-blossom/50"
                                                }`}
                                            >
                                                {formatTime(time)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* OCCASION */}
                            {step === 4 && (
                                <div>
                                    <p className="mb-7 text-[12px] text-ivory/60">
                                        Optional — help us make your visit extra special.
                                    </p>
                                    <div className="grid max-w-[650px] grid-cols-2 gap-3 sm:grid-cols-3">
                                        {occasions.map((occasion) => (
                                            <button
                                                key={occasion}
                                                type="button"
                                                aria-pressed={booking.occasion === occasion}
                                                onClick={() =>
                                                    updateBooking(
                                                        "occasion",
                                                        booking.occasion === occasion
                                                            ? ""
                                                            : occasion
                                                    )
                                                }
                                                className={`focus-ring min-h-[65px] rounded-md border px-3 text-[12px] transition-[background-color,border-color,color,scale] duration-300 active:scale-[0.97] ${
                                                    booking.occasion === occasion
                                                        ? "border-blossom bg-blossom/15 text-blossom"
                                                        : "border-white/15 text-ivory/65 hover:border-blossom/50"
                                                }`}
                                            >
                                                {occasion}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* DETAILS */}
                            {step === 5 && (
                                <div className="max-w-[690px] space-y-4">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <Field label="Full Name" error={touched.name ? detailErrors.name : ""} errorId="booking-name-error">
                                            <input
                                                className={fieldClass}
                                                autoComplete="name"
                                                placeholder="Your full name"
                                                value={booking.name}
                                                maxLength={120}
                                                aria-invalid={Boolean(touched.name && detailErrors.name)}
                                                aria-describedby="booking-name-error"
                                                onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                                                onChange={(e) =>
                                                    updateBooking("name", e.target.value)
                                                }
                                            />
                                        </Field>
                                        <Field label="Phone Number" error={touched.phone ? detailErrors.phone : ""} errorId="booking-phone-error">
                                            <input
                                                type="tel"
                                                className={fieldClass}
                                                autoComplete="tel"
                                                placeholder="Contact number"
                                                value={booking.phone}
                                                maxLength={35}
                                                aria-invalid={Boolean(touched.phone && detailErrors.phone)}
                                                aria-describedby="booking-phone-error"
                                                onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
                                                onChange={(e) =>
                                                    updateBooking("phone", e.target.value)
                                                }
                                            />
                                        </Field>
                                    </div>
                                    <Field label="Email Address" error={touched.email ? detailErrors.email : ""} errorId="booking-email-error">
                                        <input
                                            type="email"
                                            className={fieldClass}
                                            autoComplete="email"
                                            placeholder="name@example.com"
                                            value={booking.email}
                                            maxLength={254}
                                            aria-invalid={Boolean(touched.email && detailErrors.email)}
                                            aria-describedby="booking-email-error"
                                            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                                            onChange={(e) =>
                                                updateBooking("email", e.target.value)
                                            }
                                        />
                                    </Field>
                                    <Field label="Message / Special Requests (Optional)">
                    <textarea
                        className={`${fieldClass} min-h-[115px] resize-y py-4`}
                        placeholder="Dietary preferences, accessibility, decorations or anything else we should know..."
                        value={booking.message}
                        maxLength={1000}
                        onChange={(e) =>
                            updateBooking("message", e.target.value)
                        }
                    />
                                    </Field>
                                    <p className="text-[11px] leading-6 text-ivory/60">
                                        By submitting, you agree to be contacted about your
                                        reservation request. This is not a confirmed booking.
                                    </p>
                                </div>
                            )}
                          </m.div>
                          </AnimatePresence>
                        </div>

                        {/* BUTTONS */}
                        <div className="mt-10 flex max-w-[690px] flex-col-reverse gap-3 sm:flex-row">
                            {step > 0 && (
                                <button
                                    type="button"
                                    onClick={() => goToStep(step - 1)}
                                    className="group inline-flex min-h-[55px] items-center justify-center gap-3 rounded-full border border-white/20 px-7 text-[12px] text-ivory/70 transition-colors duration-300 hover:border-blossom hover:text-blossom active:scale-[0.98]"
                                >
                                    <ArrowLeft size={16} className="transition-transform duration-300 group-hover:-translate-x-1" /> Back
                                </button>
                            )}
                            <button
                                type="button"
                                disabled={!validStep() || sending ||
                                    reservationStatus.type === "success"}
                                aria-busy={sending}
                                onClick={() =>
                                    step === 5
                                        ? void submitReservation()
                                        : goToStep(Math.min(5, step + 1))
                                }
                                className="group inline-flex min-h-[55px] flex-1 items-center justify-center gap-4 rounded-full bg-blossom px-8 text-[12px] font-semibold text-midnight transition-[background-color,opacity,scale] duration-300 hover:bg-[#e4a1a9] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                {sending
                                    ? "Sending Request..."
                                    : step === 5
                                        ? "Request Reservation"
                                        : `Continue to ${steps[step + 1]}`}
                                {sending ? (
                                    <Loader2 size={17} className="animate-spin" aria-hidden="true" />
                                ) : (
                                    <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1 group-disabled:translate-x-0" />
                                )}
                            </button>
                        </div>

                        <StatusMessage status={reservationStatus} className="mt-5 max-w-[690px]" />

                        {/* MINI BOOKING SUMMARY */}
                        <div className="mt-12 max-w-[690px] border-t border-white/10 pt-7">
                            <SmallLabel>Your Visit</SmallLabel>
                            <p className="mt-3 text-[12px] leading-7 text-ivory/55">
                                {booking.date
                                    ? formatDate(booking.date)
                                    : "Date not selected"}{" "}
                                · {booking.guests}{" "}
                                {booking.guests === 1 ? "guest" : "guests"}
                                {selectedExperience && ` · ${selectedExperience.name}`}
                                {booking.time && ` · ${formatTime(booking.time)}`}
                            </p>
                        </div>
                    </div>
                </section>

                {/* =======================================
            RIGHT: CONTACT & ENQUIRIES
            ======================================= */}
                <aside
                    id="contact"
                    className="relative min-w-0 bg-[#111113]"
                >
                    {/* EDITORIAL PHOTO */}
                    <div className="relative h-[280px] overflow-hidden sm:h-[350px] lg:h-[330px]">
                        <Image
                            src="/assets/garden-ambience.png"
                            alt="The atmosphere of Cherry Blossom Garden"
                            fill
                            sizes="(max-width: 1023px) 100vw, 43vw"
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#111113] via-black/10 to-black/10" />
                        <div className="absolute bottom-8 left-8 sm:left-12">
                            <p className="text-[10px] uppercase tracking-[0.3em] text-[#f1ced0]">
                                Cherry Blossom Garden
                            </p>
                        </div>
                    </div>

                    <div className="px-6 pb-20 pt-9 sm:px-12 lg:px-10 xl:px-16">
                        <Reveal intensity="subtle">
                        <SmallLabel>Contact Us</SmallLabel>

                        <h2 className="mt-5 font-cormorant text-[clamp(55px,5.2vw,82px)] leading-[0.85] tracking-[-0.04em]">
                            We&apos;re Here
                            <br />
                            <span className="italic text-blossom">for You.</span>
                        </h2>

                        <p className="mt-7 max-w-[420px] text-[13px] leading-7 text-ivory/55">
                            Planning a celebration, have a question or looking for
                            something special? Our team would love to hear from you.
                        </p>
                        </Reveal>

                        {/* CONTACT METHODS */}
                        <div className="mt-10 grid gap-7 border-y border-white/10 py-9 sm:grid-cols-2">
                            <ContactDetail
                                icon={<Phone size={19} strokeWidth={1.4} />}
                                title="Call Us"
                            >
                                {contact.phone ? (
                                    <a
                                        href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`}
                                        className="hover:text-blossom"
                                    >
                                        {contact.phone}
                                    </a>
                                ) : (
                                    <span>Phone details coming soon</span>
                                )}
                            </ContactDetail>

                            <ContactDetail
                                icon={<Mail size={19} strokeWidth={1.4} />}
                                title="Email Us"
                            >
                                {contact.email ? (
                                    <a
                                        href={`mailto:${contact.email}`}
                                        className="break-all hover:text-blossom"
                                    >
                                        {contact.email}
                                    </a>
                                ) : (
                                    <span>Use the enquiry form below</span>
                                )}
                            </ContactDetail>

                            <ContactDetail
                                icon={<MapPin size={19} strokeWidth={1.4} />}
                                title="Visit Us"
                            >
                                {contact.address || "Venue address coming soon"}
                            </ContactDetail>

                            <ContactDetail
                                icon={<Clock3 size={19} strokeWidth={1.4} />}
                                title="Opening Hours"
                            >
                                {contact.hours || "Opening hours to be announced"}
                            </ContactDetail>
                        </div>

                        {/* DIRECTIONS — only displayed when configured */}
                        {contact.mapsUrl && (
                            <a
                                href={contact.mapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${outlineButton} mt-8`}
                            >
                                Get Directions <ArrowUpRight size={16} />
                            </a>
                        )}

                        {/* GENERAL CONTACT FORM */}
                        <div className="mt-14">
                            <SmallLabel>General Enquiries</SmallLabel>
                            <h3 className="mt-4 font-cormorant text-[38px] leading-none">
                                Send Us a Message.
                            </h3>
                            <p className="mt-4 text-[12px] leading-6 text-ivory/60">
                                Not making a reservation? Send us your enquiry here.
                            </p>

                            <form
                                onSubmit={submitEnquiry}
                                className="mt-7 space-y-4"
                            >
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Field label="Your Name">
                                        <input
                                            required
                                            maxLength={120}
                                            autoComplete="name"
                                            className={fieldClass}
                                            placeholder="Full name"
                                            value={enquiry.name}
                                            onChange={(e) =>
                                                setEnquiry({
                                                    ...enquiry,
                                                    name: e.target.value,
                                                })
                                            }
                                        />
                                    </Field>
                                    <Field label="Email">
                                        <input
                                            required
                                            type="email"
                                            maxLength={254}
                                            autoComplete="email"
                                            className={fieldClass}
                                            placeholder="Your email"
                                            value={enquiry.email}
                                            onChange={(e) =>
                                                setEnquiry({
                                                    ...enquiry,
                                                    email: e.target.value,
                                                })
                                            }
                                        />
                                    </Field>
                                </div>

                                <Field label="Your Message">
                  <textarea
                      required
                      maxLength={3000}
                      className={`${fieldClass} min-h-[125px] resize-y py-3`}
                      placeholder="How can we help?"
                      value={enquiry.message}
                      onChange={(e) =>
                          setEnquiry({
                              ...enquiry,
                              message: e.target.value,
                          })
                      }
                  />
                                </Field>

                                <button
                                    disabled={enquirySending}
                                    aria-busy={enquirySending}
                                    type="submit"
                                    className="group mt-2 inline-flex min-h-[49px] items-center justify-center gap-4 rounded-full border border-blossom px-8 text-[12px] font-medium text-blossom transition-colors duration-300 hover:bg-blossom hover:text-midnight active:scale-[0.98] disabled:opacity-50"
                                >
                                    {enquirySending ? "Sending..." : "Send Enquiry"}
                                    {enquirySending ? (
                                        <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                                    ) : (
                                        <Send
                                            size={16}
                                            strokeWidth={1.5}
                                            className="transition-transform duration-300 group-hover:translate-x-1"
                                        />
                                    )}
                                </button>

                                <StatusMessage status={enquiryStatus} />
                            </form>
                        </div>

                        {/* SIGNATURE */}
                        <div className="mt-16 border-t border-champagne/15 pt-8">
                            <p className="font-allura text-[35px] text-blossom">
                                Where every moment blooms.
                            </p>
                            <Link
                                href="/"
                                className="mt-3 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-ivory/60 transition-colors hover:text-blossom"
                            >
                                Explore Cherry Blossom Garden
                                <ArrowUpRight size={14} />
                            </Link>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}

const guestButton =
    "flex h-11 w-11 items-center justify-center rounded-full text-ivory transition-[background-color,color,scale,opacity] duration-300 hover:bg-white/[0.07] hover:text-blossom active:scale-90 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ivory";

function Field({
                   label,
                   children,
                   error = "",
                   errorId,
               }: {
    label: string;
    children: ReactNode;
    /** Shown under the field; empty hides it. */
    error?: string;
    /** Matches the input's aria-describedby. */
    errorId?: string;
}) {
    return (
        <label className="block">
      <span className="mb-2 block text-[11px] text-ivory/70">
        {label}
      </span>
            {children}
            {errorId ? (
                <span id={errorId} className="block min-h-[20px]">
                    <AnimatePresence initial={false}>
                        {error ? (
                            <m.span
                                key={error}
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.25, ease: ease.out }}
                                className="mt-1.5 block text-[11px] text-[#eea4ad]"
                            >
                                {error}
                            </m.span>
                        ) : null}
                    </AnimatePresence>
                </span>
            ) : null}
        </label>
    );
}

/**
 * Result of a real request. Success is only ever set after a 2xx response,
 * so this never shows an unverified confirmation.
 */
function StatusMessage({
                           status,
                           className = "",
                       }: {
    status: FormStatus;
    className?: string;
}) {
    const success = status.type === "success";

    return (
        <div aria-live="polite" className={className}>
            <AnimatePresence initial={false} mode="wait">
                {status.message ? (
                    <m.p
                        key={`${status.type}-${status.message}`}
                        role={success ? "status" : "alert"}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: ease.out }}
                        className={`flex items-start gap-3 rounded-md border px-4 py-3 text-[12px] leading-6 ${
                            success
                                ? "border-[#b9d0ad]/30 bg-[#b9d0ad]/[0.06] text-[#b9d0ad]"
                                : "border-[#eea4ad]/30 bg-[#eea4ad]/[0.06] text-[#eea4ad]"
                        }`}
                    >
                        {success ? (
                            <Check size={16} className="mt-1 shrink-0" aria-hidden="true" />
                        ) : (
                            <AlertCircle size={16} className="mt-1 shrink-0" aria-hidden="true" />
                        )}
                        <span>{status.message}</span>
                    </m.p>
                ) : null}
            </AnimatePresence>
        </div>
    );
}

function ContactDetail({
                           icon,
                           title,
                           children,
                       }: {
    icon: ReactNode;
    title: string;
    children: ReactNode;
}) {
    return (
        <div className="min-w-0">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-blossom/40 text-blossom">
                {icon}
            </div>
            <p className="text-[13px] font-medium text-ivory">
                {title}
            </p>
            <div className="mt-2 text-[12px] leading-6 text-ivory/60">
                {children}
            </div>
        </div>
    );
}
