import { useRef, useEffect, useState, type FC } from 'react'
import { AiTwotoneCloseSquare } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'
import Select from '../../../Components/common/Select'
import Field from '../../../Components/common/Field'
import { voucherSchema, type VoucherValue } from "./type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";

const journalvoucher: FC = () => {
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
        document.title = "Accounting journal voucher - SN ERP";
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
                    navigate("/groups");
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

    const ledgers = [
        "Bank details",
        "op",
    ];


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
                            Acounting voucher creation - journal Voucher
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
                    ref={formRef} className='flex-1 flex flex-col'>

                    {/* Upper side */}
                    <div className='my-2 pb-4 border-b-2 border-gray-500'>
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center'>
                                <h2 className='bg-red-600 px-4 text-white font-semibold'>Journal</h2>
                                <h3>No. <span>1</span></h3>
                            </div>
                            <div>
                                <Field
                                    hidelabel
                                    type="date"
                                    {...register("date")}
                                    label=''
                                />
                            </div>
                        </div>
                    </div>
                    <div className='flex items-center justify-between font-bold pl-12  border-b-2 border-gray-500'>
                        <h1>Particulars</h1>
                        <div className='flex items-center w-[20%] justify-start gap-24'>
                            <h1>Debit</h1>
                            <h1>Credit</h1>
                        </div>
                    </div>
                    <div className='flex-1 flex flex-col justify-between pl-5 mt-4'>
                        <div>
                            <div className='flex items-center justify-between'>
                                <div className='flex items-start gap-3'>
                                    <input
                                        type="text"
                                        className="w-10 bg-gray-300 mr-5 focus:bg-black max-w-52 focus:text-white outline-none transition-colors text-[var(--text)]"
                                        placeholder='By'
                                        {...register("accounts")}
                                    />
                                    <div>
                                        <Select
                                            label="ledgers"
                                            hidelabel={true}
                                            options={ledgers}
                                            {...register("ledgers")}
                                        />
                                    </div>
                                </div>
                                <div className='flex w-[20%] justify-between'>
                                    <Field
                                        hidelabel
                                        type="text"
                                        {...register("amount")}
                                        label=''
                                    />

                                    <Field
                                        hidelabel
                                        type="text"
                                        {...register("amount")}
                                        label=''
                                    />
                                </div>

                            </div>
                            <p className='ml-[7em] text-sm italic'>Cur Bal:</p>
                        </div>

                        <div className='flex flex-col'>
                            <label htmlFor="narration"> Narration :</label>
                            <textarea className='w-[50%] bg-gray-300 mr-5 focus:bg-black focus:text-white outline-none transition-colors text-[var(--text)] w-full' id="narastion" {...register("narrations")}></textarea>
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

export default journalvoucher