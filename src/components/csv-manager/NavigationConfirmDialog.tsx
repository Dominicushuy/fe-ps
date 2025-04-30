import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
    CheckCircleIcon,
    ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import { Client } from "@/types";
import { useTranslations } from "next-intl";

interface NavigationConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    client: Client | null;
}

export default function NavigationConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    client,
}: NavigationConfirmDialogProps) {
    const t = useTranslations();

    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <CheckCircleIcon
                                            className="h-6 w-6 text-green-600"
                                            aria-hidden="true"
                                        />
                                    </div>
                                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-base font-semibold leading-6 text-gray-900"
                                        >
                                            {t("navigateToActivityLog")}
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                {t(
                                                    "uploadSuccessConfirmNavigation",
                                                )}
                                            </p>

                                            {client && (
                                                <div className="mt-4 bg-gray-50 p-3 rounded-md border border-gray-200">
                                                    <div className="flex flex-col gap-2">
                                                        <div>
                                                            <p className="text-xs text-gray-500">
                                                                {t(
                                                                    "selectedClient",
                                                                )}
                                                                :
                                                            </p>
                                                            <p className="text-sm font-medium text-primary-700">
                                                                {`${client.accountId} - ${client.name}`}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="button"
                                        className="inline-flex w-full justify-center items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 sm:ml-3 sm:w-auto"
                                        onClick={onConfirm}
                                    >
                                        <ArrowTopRightOnSquareIcon className="h-4 w-4 mr-1.5" />
                                        {t("goToActivityLog")}
                                    </button>
                                    <button
                                        type="button"
                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                        onClick={onClose}
                                    >
                                        {t("cancel")}
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
