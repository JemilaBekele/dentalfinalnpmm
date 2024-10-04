import React, { useState, useEffect } from "react";

type TreatmentPlan = {
    teethWhitening?: boolean;
    veneers?: boolean;
    bonding?: boolean;
    cosmeticContouring?: boolean;
    gumContouring?: boolean;
    compositeBonding?: boolean;
    smileMakeovers?: boolean;
    other?: string;
};

type Vitalsign = {
    Core_Temperature?: string;
    Respiratory_Rate?: string;
    Blood_Oxygen?: string;
    Blood_Pressure?: string;
    heart_Rate?: string;
};

type MedicalRecordData = {
    _id: string;
    ChiefCompliance: string;
    Historypresent: string;
    Vitalsign: Vitalsign | null;
    Pastmedicalhistory: string;
    Pastdentalhistory: string;
    IntraoralExamination: string;
    ExtraoralExamination: string;
    Investigation: string;
    Assessment: string;
    TreatmentPlan: TreatmentPlan | null;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: { username: string };
};

interface EditMedicalRecordModalProps {
    isOpen: boolean;
    formData: MedicalRecordData | null;  
    onClose: () => void;
    onUpdate: (data: MedicalRecordData) => void;  
}

const EditMedicalRecordModal: React.FC<EditMedicalRecordModalProps> = ({
    isOpen,
    formData,
    onClose,
    onUpdate,
}) => {
    const [localData, setLocalData] = useState<MedicalRecordData | null>(formData);

    useEffect(() => {
        setLocalData(formData);
    }, [formData]);

    if (!isOpen || !localData) return null;

    const handleChange = (field: keyof MedicalRecordData, value: string) => {
        setLocalData({ ...localData, [field]: value });
    };

    const handleTreatmentChange = (field: keyof TreatmentPlan, value: boolean | string) => {
        setLocalData((prevData) => ({
            ...prevData!,
            TreatmentPlan: {
                ...(prevData?.TreatmentPlan || {}),
                [field]: value,
            },
        }));
    };

    const handleVitalChange = (field: keyof Vitalsign, value: string) => {
        setLocalData((prevData) => ({
            ...prevData!,
            Vitalsign: {
                ...(prevData?.Vitalsign || {}),
                [field]: value,
            },
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (localData) {
            onUpdate(localData); 
        }
    };

    return (
        <div className="fixed inset-0 flex mt-13 items-center mt-14 justify-center bg-gray-200 bg-opacity-50">
            <div className="bg-white p-8 rounded-lg w-full max-w-2xl max-h-screen overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Edit Medical Record</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Chief Complaint */}
                    <div className="mb-4">
                        <label className="block font-bold mb-2" htmlFor="chief-complaint">Chief Complaint</label>
                        <textarea
                            id="chief-complaint"
                            value={localData.ChiefCompliance}
                            onChange={(e) => handleChange("ChiefCompliance", e.target.value)}
                            className="border p-2 rounded-md w-full"
                            placeholder="Enter chief complaint"
                            rows={3}
                        />
                    </div>
                    {/* History of Present Illness */}
                    <div className="mb-4">
                        <label className="block font-bold mb-2" htmlFor="history-present-illness">History of Present Illness</label>
                        <textarea
                            id="history-present-illness"
                            value={localData.Historypresent}
                            onChange={(e) => handleChange("Historypresent", e.target.value)}
                            className="border p-2 rounded-md w-full"
                            placeholder="Enter history of present illness"
                            rows={3}
                        />
                    </div>
                    {/* Vital Signs */}
                    <div className="mb-4">
                        <label className="block font-bold mb-2" htmlFor="vital-sign">Vital Sign</label>
                        <div className="flex flex-col space-y-2">
                        {["Core_Temperature", "Respiratory_Rate", "Blood_Oxygen", "Blood_Pressure", "heart_Rate"].map((vital) => (
    <div key={vital}>
        <label className="block mb-2" htmlFor={vital}>{vital.replace(/_/g, ' ')}</label>
        <input
            id={vital}
            type="text"
            value={localData.Vitalsign?.[vital as keyof Vitalsign] || ""}
            onChange={(e) => handleVitalChange(vital as keyof Vitalsign, e.target.value)}
            className="border p-2 rounded-md w-full"
            placeholder={`Enter ${vital.replace(/_/g, ' ')}`}
        />
    </div>
))}
                        </div>
                    </div>
                    {/* Past Medical History */}
                    <div className="mb-4">
                        <label className="block font-bold mb-2" htmlFor="past-medical-history">Past Medical History</label>
                        <textarea
                            id="past-medical-history"
                            value={localData.Pastmedicalhistory}
                            onChange={(e) => handleChange("Pastmedicalhistory", e.target.value)}
                            className="border p-2 rounded-md w-full"
                            placeholder="Enter past medical history"
                            rows={3}
                        />
                    </div>
                    {/* Past Dental History */}
                    <div className="mb-4">
                        <label className="block font-bold mb-2" htmlFor="past-dental-history">Past Dental History</label>
                        <textarea
                            id="past-dental-history"
                            value={localData.Pastdentalhistory}
                            onChange={(e) => handleChange("Pastdentalhistory", e.target.value)}
                            className="border p-2 rounded-md w-full"
                            placeholder="Enter past dental history"
                            rows={3}
                        />
                    </div>
                    {/* Intra Oral Examination */}
                    <div className="mb-4">
                        <label className="block font-bold mb-2" htmlFor="intraoral-examination">Intra Oral Examination</label>
                        <textarea
                            id="intraoral-examination"
                            value={localData.IntraoralExamination}
                            onChange={(e) => handleChange("IntraoralExamination", e.target.value)}
                            className="border p-2 rounded-md w-full"
                            placeholder="Enter intraoral examination"
                            rows={3}
                        />
                    </div>
                    {/* Extra Oral Examination */}
                    <div className="mb-4">
                        <label className="block font-bold mb-2" htmlFor="extraoral-examination">Extra Oral Examination</label>
                        <textarea
                            id="extraoral-examination"
                            value={localData.ExtraoralExamination}
                            onChange={(e) => handleChange("ExtraoralExamination", e.target.value)}
                            className="border p-2 rounded-md w-full"
                            placeholder="Enter extraoral examination"
                            rows={3}
                        />
                    </div>
                    {/* Investigation */}
                    <div className="mb-4">
                        <label className="block font-bold mb-2" htmlFor="investigation">Investigation</label>
                        <textarea
                            id="investigation"
                            value={localData.Investigation}
                            onChange={(e) => handleChange("Investigation", e.target.value)}
                            className="border p-2 rounded-md w-full"
                            placeholder="Enter investigation"
                            rows={3}
                        />
                    </div>
                    {/* Assessment */}
                    <div className="mb-4">
                        <label className="block font-bold mb-2" htmlFor="assessment">Assessment</label>
                        <textarea
                            id="assessment"
                            value={localData.Assessment}
                            onChange={(e) => handleChange("Assessment", e.target.value)}
                            className="border p-2 rounded-md w-full"
                            placeholder="Enter assessment"
                            rows={3}
                        />
                    </div>
                    
                    {/* Treatment Section */}
                    <div className="mb-4 col-span-2">
    <label className="block font-bold mb-2">Treatment</label>
    <div className="flex flex-col space-y-2">
        {["teethWhitening", "veneers", "bonding", "cosmeticContouring", "gumContouring", "compositeBonding", "smileMakeovers"].map((treatment) => (
            <label key={treatment}>
                <input
                    type="checkbox"
                    checked={!!(localData.TreatmentPlan?.[treatment as keyof TreatmentPlan])}
                    onChange={(e) => handleTreatmentChange(treatment as keyof TreatmentPlan, e.target.checked)}
                />
                {treatment.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
            </label>
        ))}
        <div className="mt-2">
            <label className="block mb-2" htmlFor="treatment-other">Other Treatments</label>
            <input
                id="treatment-other"
                type="text"
                value={localData.TreatmentPlan?.other || ""}
                onChange={(e) => handleTreatmentChange("other", e.target.value)}
                className="border p-2 rounded-md w-full"
                placeholder="Enter other treatments"
            />
        </div>
    </div>
</div>

    
                    <div className="flex justify-end col-span-2">
                        <button type="button" onClick={onClose} className="mr-4 text-red-600">Cancel</button>
                        <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">Update</button>
                    </div>
                </form>
            </div>
        </div>
    );
    
};

export default EditMedicalRecordModal;

