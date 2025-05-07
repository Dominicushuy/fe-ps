// src/components/activity-manager/EmployeeSelect.tsx
import React, { useMemo } from "react";
import Select from "react-select";
import { UserIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEmployees } from "@/hooks/useEmployees";
import { useTranslations } from "next-intl";
import { Employee } from "@/types";

interface EmployeeSelectProps {
    selectedEmployee: Employee | null;
    onEmployeeSelect: (employee: Employee | null) => void;
    disabled?: boolean;
}

// Define type for options
interface EmployeeOption {
    value: string;
    label: string;
    employee: Employee;
}

export default function EmployeeSelect({
    selectedEmployee,
    onEmployeeSelect,
    disabled = false,
}: EmployeeSelectProps) {
    const t = useTranslations();

    // Use the hook to fetch employees
    const { data: employees = [], isLoading } = useEmployees();

    // Convert employees to options for the select
    const options = useMemo(() => {
        return employees.map(employee => ({
            value: employee.employee_id,
            label: `${employee.employee_id}${
                employee.employee_name ? ` - ${employee.employee_name}` : ""
            }`,
            employee,
        }));
    }, [employees]);

    // Convert the selected employee to option format
    const selectedOption = selectedEmployee
        ? {
              value: selectedEmployee.employee_id,
              label: `${selectedEmployee.employee_id}${
                  selectedEmployee.employee_name
                      ? ` - ${selectedEmployee.employee_name}`
                      : ""
              }`,
              employee: selectedEmployee,
          }
        : null;

    return (
        <div className="w-full max-w-md">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 z-10 pointer-events-none">
                    <UserIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                    />
                </div>
                <Select
                    value={selectedOption}
                    onChange={(option: EmployeeOption | null) => {
                        onEmployeeSelect(option ? option.employee : null);
                    }}
                    options={options}
                    isDisabled={disabled}
                    isLoading={isLoading}
                    isClearable
                    placeholder={t("searchEmployee")}
                    loadingMessage={() => t("loading")}
                    noOptionsMessage={() => t("noResultsFound")}
                    // Other options
                    className={`select-component ${
                        selectedEmployee ? "has-value" : ""
                    }`}
                    classNamePrefix="select"
                />
            </div>

            {/* CSS styles for select */}
            <style jsx global>{`
                .select-component .select__control {
                    padding: 0.375rem 0.75rem 0.375rem 2.5rem;
                    border-radius: 0.375rem;
                }
                .select-component.has-value .select__control {
                    border-color: #4f46e5;
                    box-shadow: 0 0 0 1px #4f46e5;
                }
                .select-component .select__control:hover {
                    border-color: ${selectedEmployee ? "#4f46e5" : "#d1d5db"};
                }
                .select-component .select__menu {
                    z-index: 50;
                }
                .select-component .select__indicator-separator {
                    display: none;
                }
                .clear-button {
                    transition: all 0.2s;
                }
                .clear-button:hover {
                    background-color: #e5e7eb;
                }
            `}</style>

            {/* Display selected employee information */}
            {selectedEmployee && (
                <div className="mt-2 p-3 bg-primary-50 rounded-md border border-primary-200 relative">
                    {/* Clear button */}
                    <button
                        className="absolute top-2 right-2 p-1 rounded-full clear-button hover:bg-gray-200 transition-colors"
                        onClick={() => onEmployeeSelect(null)}
                        disabled={disabled}
                        title={t("clearSearch")}
                        aria-label={t("clearSearch")}
                    >
                        <XMarkIcon className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                    </button>

                    <p className="text-sm font-medium text-gray-700">
                        {t("selectedEmployee")}:
                    </p>
                    <div className="mt-1 flex items-center">
                        <UserIcon className="h-5 w-5 text-primary-600 mr-2" />
                        <p className="text-sm text-primary-800">
                            <span className="font-semibold">
                                {selectedEmployee.employee_id}
                            </span>
                            {selectedEmployee.employee_name && (
                                <span> - {selectedEmployee.employee_name}</span>
                            )}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
