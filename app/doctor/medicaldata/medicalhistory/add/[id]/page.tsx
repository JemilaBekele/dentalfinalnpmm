"use client";

import React, { useState } from "react";
import PatientComponent from "@/app/components/patient/PatientComponent";
import { useRouter } from 'next/navigation';

type MedicalFindingFormProps = {
  params: {
    id: string;
  };
};

export default function MedicalFindingForm({ params }: MedicalFindingFormProps) {
  const patientId = params.id;
  const router = useRouter();

  const [formData, setFormData] = useState({
    ChiefCompliance: "",
    Historypresent: "",
    Vitalsign: {
      Core_Temperature: "",
      Respiratory_Rate: "",
      Blood_Oxygen: "",
      Blood_Pressure: "",
      heart_Rate: "",
    },
    Pastmedicalhistory: "",
    Pastdentalhistory: "",
    IntraoralExamination: "",
    ExtraoralExamination: "",
    Investigation: "",
    Assessment: "",
    TreatmentPlan: {
      teethWhitening: false,
      veneers: false,
      bonding: false,
      cosmeticContouring: false,
      gumContouring: false,
      compositeBonding: false,
      smileMakeovers: false,
      other: "",
    },
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Function to validate form data
  const validateForm = () => {
    const formErrors: { [key: string]: string } = {};

    if (!formData.ChiefCompliance.trim()) {
      formErrors.ChiefCompliance = "Chief complaint is required.";
    }
    if (!formData.Historypresent.trim()) {
      formErrors.Historypresent = "History of present illness is required.";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data
    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch(`/api/patient/MedicalHistory/${patientId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("Form submitted successfully");
        setFormSubmitted(true);
        router.push(`/doctor/medicaldata/medicalhistory/all/${patientId}`);
      } else {
        console.error("Failed to submit form");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  // Handle input change
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name in formData.Vitalsign) {
        setFormData((prevData) => ({
            ...prevData,
            Vitalsign: {
                ...prevData.Vitalsign,
                [name]: value,
            },
        }));
    } else if (name === "other") {
        setFormData((prevData) => ({
            ...prevData,
            TreatmentPlan: {
                ...prevData.TreatmentPlan,
                other: value,
            },
        }));
    } else {
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }
};



  // Handle checkbox change for Treatment Plan
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      TreatmentPlan: {
        ...prevData.TreatmentPlan,
        [name]: checked,
      },
    }));
  };

  return (
    <div className="flex m-7">
      <div className="flex-grow md:ml-60 container mx-auto p-4">
        <div className="flex space-x-8">
          {/* Patient Details */}
          <div className="w-1/3 p-4">
            <PatientComponent params={params} />
          </div>

          {/* Medical Findings Form */}
          <div className="w-2/3 bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">Medical Record</h1>
            </div>

            {/* Form Submission */}
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="ChiefCompliance" className="block font-bold mb-2">
                  Chief Complaint
                </label>
                <textarea
                  id="ChiefCompliance"
                  name="ChiefCompliance"
                  value={formData.ChiefCompliance}
                  onChange={handleInputChange}
                  className={`border p-2 rounded-md w-full ${errors.ChiefCompliance ? "border-red-500" : ""}`}
                  rows={3}
                />
                {errors.ChiefCompliance && <p className="text-red-500">{errors.ChiefCompliance}</p>}
              </div>

              <div className="mt-4">
                <label htmlFor="Historypresent" className="block font-bold mb-2">
                  History of Present Illness
                </label>
                <textarea
                  id="Historypresent"
                  name="Historypresent"
                  value={formData.Historypresent}
                  onChange={handleInputChange}
                  className={`border p-2 rounded-md w-full ${errors.Historypresent ? "border-red-500" : ""}`}
                  rows={3}
                />
                {errors.Historypresent && <p className="text-red-500">{errors.Historypresent}</p>}
              </div>

              {/* Additional fields */}
              <div className="mt-4">
                <h2 className="font-bold mb-2">Vital Sign</h2>
                <div className="mt-4">
                <label htmlFor="Core_Temperature" className="block font-bold mb-2">
                Core Temperature
                </label>
                <input
                  id="Core_Temperature"
                  name="Core_Temperature"
                  value={formData.Vitalsign.Core_Temperature}
                  onChange={handleInputChange}
                  className="border p-2 rounded-md w-full"
                />
              </div>
              <div className="mt-4">
                <label htmlFor="Respiratory_Rate" className="block font-bold mb-2">
                Respiratory Rate
                </label>
                <input
                  id="Respiratory_Rate"
                  name="Respiratory_Rate"
                  value={formData.Vitalsign.Respiratory_Rate}
                  onChange={handleInputChange}
                  className="border p-2 rounded-md w-full"
                />
              </div>
              <div className="mt-4">
                <label htmlFor="Blood_Oxygen" className="block font-bold mb-2">
                Blood Oxygen
                </label>
                <input
                  id="Blood_Oxygen"
                  name="Blood_Oxygen"
                  value={formData.Vitalsign.Blood_Oxygen}
                  onChange={handleInputChange}
                  className="border p-2 rounded-md w-full"
                />
              </div>
              <div className="mt-4">
                <label htmlFor="Blood_Pressure" className="block font-bold mb-2">
                Blood Pressure
                </label>
                <input
                  id="Blood_Pressure"
                  name="Blood_Pressure"
                  value={formData.Vitalsign.Blood_Pressure}
                  onChange={handleInputChange}
                  className="border p-2 rounded-md w-full"
                />
              </div>

              <div className="mt-4">
                <label htmlFor="heart_Rate" className="block font-bold mb-2">
                Heart Rate
                </label>
                <input
                  id="heart_Rate"
                  name="heart_Rate"
                  value={formData.Vitalsign.heart_Rate}
                  onChange={handleInputChange}
                  className="border p-2 rounded-md w-full"
                />
              </div>
              </div>

              <div className="mt-4">
                <label htmlFor="Pastmedicalhistory" className="block font-bold mb-2">
                  Past Medical History
                </label>
                <textarea
                  id="Pastmedicalhistory"
                  name="Pastmedicalhistory"
                  value={formData.Pastmedicalhistory}
                  onChange={handleInputChange}
                  className="border p-2 rounded-md w-full"
                  rows={3}
                />
              </div>

              <div className="mt-4">
                <label htmlFor="Pastdentalhistory" className="block font-bold mb-2">
                  Past Dental History
                </label>
                <textarea
                  id="Pastdentalhistory"
                  name="Pastdentalhistory"
                  value={formData.Pastdentalhistory}
                  onChange={handleInputChange}
                  className="border p-2 rounded-md w-full"
                  rows={3}
                />
              </div>

              <div className="mt-4">
                <label htmlFor="IntraoralExamination" className="block font-bold mb-2">
                  Intra Oral Examination
                </label>
                <textarea
                  id="IntraoralExamination"
                  name="IntraoralExamination"
                  value={formData.IntraoralExamination}
                  onChange={handleInputChange}
                  className="border p-2 rounded-md w-full"
                  rows={3}
                />
              </div>

              <div className="mt-4">
                <label htmlFor="ExtraoralExamination" className="block font-bold mb-2">
                  Extra Oral Examination
                </label>
                <textarea
                  id="ExtraoralExamination"
                  name="ExtraoralExamination"
                  value={formData.ExtraoralExamination}
                  onChange={handleInputChange}
                  className="border p-2 rounded-md w-full"
                  rows={3}
                />
              </div>

              <div className="mt-4">
                <label htmlFor="Investigation" className="block font-bold mb-2">
                  Investigation
                </label>
                <textarea
                  id="Investigation"
                  name="Investigation"
                  value={formData.Investigation}
                  onChange={handleInputChange}
                  className="border p-2 rounded-md w-full"
                  rows={3}
                />
              </div>

              <div className="mt-4">
                <label htmlFor="Assessment" className="block font-bold mb-2">
                  Assessment
                </label>
                <textarea
                  id="Assessment"
                  name="Assessment"
                  value={formData.Assessment}
                  onChange={handleInputChange}
                  className="border p-2 rounded-md w-full"
                  rows={3}
                />
              </div>

              {/* Treatment Plan Checkboxes */}
              <div className="mt-4">
                <h2 className="font-bold mb-2">Treatment Plan</h2>
                <div className="flex flex-wrap">
                  <label className="mr-4">
                    <input
                      type="checkbox"
                      name="teethWhitening"
                      checked={formData.TreatmentPlan.teethWhitening}
                      onChange={handleCheckboxChange}
                      className="mr-2"
                    />
                    Teeth Whitening
                  </label>
                  <label className="mr-4">
                    <input
                      type="checkbox"
                      name="veneers"
                      checked={formData.TreatmentPlan.veneers}
                      onChange={handleCheckboxChange}
                      className="mr-2"
                    />
                    Veneers
                  </label>
                  <label className="mr-4">
                    <input
                      type="checkbox"
                      name="bonding"
                      checked={formData.TreatmentPlan.bonding}
                      onChange={handleCheckboxChange}
                      className="mr-2"
                    />
                    Bonding
                  </label>
                  <label className="mr-4">
                    <input
                      type="checkbox"
                      name="cosmeticContouring"
                      checked={formData.TreatmentPlan.cosmeticContouring}
                      onChange={handleCheckboxChange}
                      className="mr-2"
                    />
                    Cosmetic Contouring
                  </label>
                  <label className="mr-4">
                    <input
                      type="checkbox"
                      name="gumContouring"
                      checked={formData.TreatmentPlan.gumContouring}
                      onChange={handleCheckboxChange}
                      className="mr-2"
                    />
                    Gum Contouring
                  </label>
                  <label className="mr-4">
                    <input
                      type="checkbox"
                      name="compositeBonding"
                      checked={formData.TreatmentPlan.compositeBonding}
                      onChange={handleCheckboxChange}
                      className="mr-2"
                    />
                    Composite Bonding
                  </label>
                  <label className="mr-4">
                    <input
                      type="checkbox"
                      name="smileMakeovers"
                      checked={formData.TreatmentPlan.smileMakeovers}
                      onChange={handleCheckboxChange}
                      className="mr-2"
                    />
                    Smile Makeovers
                  </label>
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="other" className="block font-bold mb-2">
                  Other Treatment
                </label>
                <input
                  id="other"
                  name="other"
                  value={formData.TreatmentPlan.other}
                  onChange={handleInputChange}
                  className="border p-2 rounded-md w-full"
                />
              </div>

              <button type="submit" className="bg-green-500 hover:bg-green-300 text-white px-4 py-2 rounded-md mt-4">
                Submit
              </button>
            </form>

            {formSubmitted && <p className="bg-green-300 text-green-600 mt-4">Form submitted successfully!</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
