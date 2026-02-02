import { useRef, useEffect, useState, type FC } from 'react'
import { AiTwotoneCloseSquare } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'
import Field from '../../../Components/common/Field'
import { voucherSchema, type VoucherValue } from "./type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";

const Salespartydetail: FC = () => {
    const navigate = useNavigate();

    const formRef = useRef<HTMLFormElement | null>(null);
    const yesButtonRef = useRef<HTMLButtonElement | null>(null);
    const previouslyFocused = useRef<HTMLElement | null>(null);
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false);

    const defaultValues: VoucherValue = {
        date: '',
        accounts: '',
        ledgers: "",
        amount: "",
        narrations: "",
        deliveryNotesNo: "",
        despatchDocNo: "",
        despatchThrough: "",
        destination: "",
        orderNo: "",
        modeOfPayment: "",
        otherReference: "",
        termsOfDelivery: "",
        buyerName: "",
        buyerAddress: "",
        salesTaxNo: "",
        Salespartydetail: "No",

    };


    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<VoucherValue>({
        resolver: zodResolver(voucherSchema) as Resolver<VoucherValue>,
        defaultValues,
    });

    // helper: move focus to next/prev focusable element inside the form
    const moveFocus = (delta: number) => {
        const form = formRef.current;
        if (!form) return;
        const focusable = Array.from(
            form.querySelectorAll<HTMLElement>(
                'input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])'
            )
        ).filter(Boolean);
        if (!focusable.length) return;

        const active = document.activeElement as HTMLElement | null;
        const idx = focusable.findIndex((el) => el === active);
        let next = 0;
        if (idx === -1) next = delta > 0 ? 0 : focusable.length - 1;
        else next = (idx + delta + focusable.length) % focusable.length;
        focusable[next].focus();
    };

    // keyboard handlers
    useEffect(() => {
        document.title = "Accounting Sales voucher - SN ERP";
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") {
                navigate(-1);
            }
            if (e.key === "ArrowRight") {
                navigate(+1);
            }

            // If modal is open, handle modal-specific keys
            if (confirmOpen) {
                if (e.key === "Escape") {
                    e.preventDefault();
                    setConfirmOpen(false);
                    previouslyFocused.current?.focus();
                }
                // allow 'y' and 'n' keys
                if (e.key.toLowerCase() === "y") {
                    e.preventDefault();
                    e.stopPropagation();
                    submitFromModal();
                    navigate("/sales-accounting-voucher");
                }
                if (e.key.toLowerCase() === "n") {
                    e.preventDefault();
                    e.stopPropagation();
                    setConfirmOpen(false);
                    previouslyFocused.current?.focus();
                }
            }

            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "m") {
                e.preventDefault();
                navigate("/groups");
                return;
            }

            // if (formRef.current && formRef.current.contains(document.activeElement)) {
            if (e.key === "ArrowDown") {
                e.preventDefault();
                moveFocus(1);
                return;
            }
            if (e.key === "ArrowUp") {
                e.preventDefault();
                moveFocus(-1);
                return;
            }

            // Enter opens confirmation modal instead of submitting directly
            if (e.key === "Enter") {
                const active = document.activeElement as HTMLElement | null;
                const isTextArea = active?.tagName === "TEXTAREA";
                if (!isTextArea) {
                    e.preventDefault();
                    previouslyFocused.current = active ?? null;
                    setConfirmOpen(true);
                }
            }

        };
        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [confirmOpen, navigate]);

    const submitFromModal = () => {
        setConfirmOpen(false);
        previouslyFocused.current?.blur();
        // programmatically run react-hook-form submit
        handleSubmit(onSubmit)()
    };

    const onSubmit = (data: VoucherValue) => {
        console.log("data is submit successfuly", data)
    };

    return (
        <>
            <div className="min-h-screen bg-surface flex flex-col">
                {/*Header */}

                <div className="w-full pt-10 flex items-center justify-between bg-gray-300">
                    <div>
                        <h1 className="capitalize text-black text-md  font-semibold">
                            Party Details
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-muted">Ctrl + M</h1>
                        <button type="button" className=" text-[var(--text)]" aria-label="Close">
                            <AiTwotoneCloseSquare className="w-5 h-5" onClick={() => navigate("/")} />
                        </button>
                    </div>
                </div>

                <form action=""
                    onSubmit={(e) => e.preventDefault()}
                    ref={formRef} className='w-[50%] border-r-2 border-gray-500 '>


                    <div className=' pb-4 border-b-2 border-gray-500'>
                        <div className='w-full border-b-2 border-gray-500 py-2 pl-5'>
                            <h1 className='text-center underline mb-2'>Despatch Details</h1>
                            <div className='flex items-start'>
                                <Field
                                    label="Delivery Notes No"
                                    type="text"
                                    {...register("deliveryNotesNo")}
                                />
                                <div>
                                    <Field
                                        label="Despatch Doc No"
                                        type="text"
                                        {...register("despatchDocNo")}
                                    />
                                    <Field
                                        label="Despatch through"
                                        type="text"
                                        {...register("despatchThrough")}
                                    />
                                    <Field
                                        label="Destination"
                                        type="text"
                                        {...register("destination")}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='w-full border-b-2 border-gray-500 py-2 pl-5'>
                            <h1 className='text-center underline mb-2'>Order Details</h1>
                            <div className='flex items-start'>
                                <Field
                                    label="Order No"
                                    type="text"
                                    {...register("orderNo")}
                                />
                                <div>
                                    <Field
                                        label="Mode/Terms of Payment"
                                        type="text"
                                        {...register("modeOfPayment")}
                                    />
                                    <Field
                                        label="Other Reference"
                                        type="text"
                                        {...register("otherReference")}
                                    />
                                    <Field
                                        label="Terms of Delivery"
                                        type="text"
                                        {...register("termsOfDelivery")}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='p-4'>
                            <h1 className='text-center underline mb-2'>Buyer Details</h1>
                            <Field
                                label="Buyer Name"
                                type="text"
                                {...register("buyerName")}
                            />
                            <Field
                                label="Buyer Address"
                                type="text"
                                {...register("buyerAddress")}
                            />
                            <Field
                                label="Sales Tax No"
                                type="text"
                                {...register("salesTaxNo")}
                            />

                        </div>
                    </div>
                </form>


                {/* Confirmation modal (desktop-styled) */}
                {confirmOpen && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Confirm submit"
                        onClick={() => {
                            setConfirmOpen(false);
                            previouslyFocused.current?.focus();
                        }}
                    >
                        <div
                            className="w-[200px] bg-surface  shadow-xl p-6"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className="text-md font-semibold mb-3">Confirm Submit</h2>
                            {/* <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to submit the form?
              </p> */}

                            <div className="flex justify-between gap-3">
                                <button
                                    type="button"
                                    className="px-4 py-2  bg-gray-200 hover:bg-gray-300"
                                    onClick={() => {
                                        setConfirmOpen(false);
                                        previouslyFocused.current?.focus();
                                    }}
                                >
                                    No
                                </button>
                                <button
                                    ref={yesButtonRef}
                                    type="button"
                                    className="px-4 py-2  bg-blue-600 text-white hover:bg-blue-700"
                                    onClick={submitFromModal}
                                >
                                    Yes
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default Salespartydetail;