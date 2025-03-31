import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Client } from "@/types";

interface ConfirmClientChangeDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    currentClient: Client | null;
    newClient: Client | null;
}

export default function ConfirmClientChangeDialog({
    isOpen,
    onClose,
    onConfirm,
    currentClient,
    newClient,
}: ConfirmClientChangeDialogProps) {
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
                                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <ExclamationTriangleIcon
                                            className="h-6 w-6 text-amber-600"
                                            aria-hidden="true"
                                        />
                                    </div>
                                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-base font-semibold leading-6 text-gray-900"
                                        >
                                            クライアント変更の確認 (Client
                                            Change Confirmation)
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                現在のCSVデータはアップロードされたファイルから生成されています。クライアントを変更すると、現在のファイルとデータプレビューがクリアされます。
                                            </p>
                                            <p className="text-sm text-gray-500 mt-2">
                                                (Current CSV data is generated
                                                from the uploaded file. Changing
                                                the client will clear the
                                                current file and data preview.)
                                            </p>

                                            <div className="mt-4 bg-gray-50 p-3 rounded-md border border-gray-200">
                                                <div className="flex flex-col gap-2">
                                                    <div>
                                                        <p className="text-xs text-gray-500">
                                                            現在のクライアント
                                                            (Current Client):
                                                        </p>
                                                        <p className="text-sm font-medium text-gray-700">
                                                            {currentClient
                                                                ? `${currentClient.accountId} - ${currentClient.name}`
                                                                : "なし (None)"}
                                                        </p>
                                                    </div>
                                                    <div className="border-t border-gray-200 pt-2">
                                                        <p className="text-xs text-gray-500">
                                                            新しいクライアント
                                                            (New Client):
                                                        </p>
                                                        <p className="text-sm font-medium text-primary-700">
                                                            {newClient
                                                                ? `${newClient.accountId} - ${newClient.name}`
                                                                : "なし (None)"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="button"
                                        className="inline-flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 sm:ml-3 sm:w-auto"
                                        onClick={onConfirm}
                                    >
                                        変更する (Change)
                                    </button>
                                    <button
                                        type="button"
                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                        onClick={onClose}
                                    >
                                        キャンセル (Cancel)
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
