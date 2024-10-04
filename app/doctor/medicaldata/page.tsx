"use client";
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

interface CreatedBy {
  id: string;
  username: string;
}



// Define the form data type
type MedicalFindingFormData = {
  _id: string;
  ChiefCompliance: string;
  Historypresent: string;
  createdAt: string; // Added for timestamp
  updatedAt: string;
  createdBy: CreatedBy;
  Vitalsign?: string;
  Pastmedicalhistory?: string;
  Pastdentalhistory?: string;
  IntraoralExamination?: string;
  ExtraoralExamination?: string;
  Investigation?: string;
  Assessment?: string;
  TreatmentPlan?: {
    teethWhitening?: boolean;
    veneers?: boolean;
    bonding?: boolean;
    cosmeticContouring?: boolean;
    gumContouring?: boolean;
    compositeBonding?: boolean;
    smileMakeovers?: boolean;
    other?: string;
  };
  
  // Added for timestamp
  // ... other fields
};

type MedicalFindingFormProps = {
  params: {
    id: string;
  };
};

export default function MedicalFindingForm({ params }: MedicalFindingFormProps) {
  const patientId = params.id;

  
  const { register, handleSubmit, formState: { errors } } = useForm<MedicalFindingFormData>();
  const router = useRouter();
  
  const [existingMedicalFindings, setExistingMedicalFindings] = useState<MedicalFindingFormData[]>([]);

  // Fetch existing medical findings
  useEffect(() => {
    async function fetchMedicalFindings() {
      try {
        const response = await fetch(`/api/patient/MedicalHistory/${patientId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const result = await response.json();
          console.log('Fetched data:', result);

          if (result.data && Array.isArray(result.data)) {
            setExistingMedicalFindings(result.data);
          } else {
            setExistingMedicalFindings([]);
          }
        } else {
          console.error('Failed to fetch medical findings');
        }
      } catch (error) {
        console.error('Error fetching medical findings:', error);
      }
    }

    fetchMedicalFindings();
  }, [patientId]);

  // Function to handle form submission
  const onSubmit = async (data: MedicalFindingFormData) => {
    console.log(data);
    alert('Form Submitted!');
    try {
      const response = await fetch(`/api/patient/MedicalHistory/${patientId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert('Medical finding created successfully');
        router.push('/doctor');
      } else {
        const result = await response.json();
        alert(result.error || 'Failed to create medical finding');
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert('Something went wrong');
    }
  };

  // Combine values for Chief Compliance and History Present
  const combinedFindings = existingMedicalFindings.reduce((acc, finding) => {
    if (finding.ChiefCompliance) {
        acc.ChiefCompliance += `
          <div class="bg-gray-100 p-4 mb-2 rounded shadow-md flex justify-between">
            <div class="flex-1">
              <p>${finding.ChiefCompliance}</p>
            </div>
            <div class="ml-4 text-right">
              <p class="text-gray-600 text-sm mb-1"><strong>Date:</strong> ${new Date(finding.createdAt).toLocaleString()}</p>
              <p class="text-gray-600 text-sm"><strong>Dr</strong> ${finding.createdBy.username}</p>
            </div>
          </div>`;
    }
    
    if (finding.Historypresent) {
        acc.Historypresent += `
          <div class="bg-gray-100 p-4 mb-2 rounded shadow-md flex justify-between">
            <div class="flex-1">
              <p>${finding.Historypresent}</p>
            </div>
            <div class="ml-4 text-right">
              <p class="text-gray-600 text-sm mb-1"><strong>Date:</strong> ${new Date(finding.createdAt).toLocaleString()}</p>
              <p class="text-gray-600 text-sm"><strong>Dr</strong> ${finding.createdBy.username}</p>
            </div>
          </div>`;
    }
    
    if (finding.Vitalsign) {
        acc.Vitalsign += `
          <div class="bg-gray-100 p-4 mb-2 rounded shadow-md flex justify-between">
            <div class="flex-1">
              <p>${finding.Vitalsign}</p>
            </div>
            <div class="ml-4 text-right">
              <p class="text-gray-600 text-sm mb-1"><strong>Date:</strong> ${new Date(finding.createdAt).toLocaleString()}</p>
              <p class="text-gray-600 text-sm"><strong>Dr</strong> ${finding.createdBy.username}</p>
            </div>
          </div>`;
    }

    if (finding.Pastmedicalhistory) {
        acc.Pastmedicalhistory += `
          <div class="bg-gray-100 p-4 mb-2 rounded shadow-md flex justify-between">
            <div class="flex-1">
              <p>${finding.Pastmedicalhistory}</p>
            </div>
            <div class="ml-4 text-right">
              <p class="text-gray-600 text-sm mb-1"><strong>Date:</strong> ${new Date(finding.createdAt).toLocaleString()}</p>
              <p class="text-gray-600 text-sm"><strong>Dr</strong> ${finding.createdBy.username}</p>
            </div>
          </div>`;
    }

    if (finding.Pastdentalhistory) {
        acc.Pastdentalhistory += `
          <div class="bg-gray-100 p-4 mb-2 rounded shadow-md flex justify-between">
            <div class="flex-1">
              <p>${finding.Pastdentalhistory}</p>
            </div>
            <div class="ml-4 text-right">
              <p class="text-gray-600 text-sm mb-1"><strong>Date:</strong> ${new Date(finding.createdAt).toLocaleString()}</p>
              <p class="text-gray-600 text-sm"><strong>Dr</strong> ${finding.createdBy.username}</p>
            </div>
          </div>`;
    }

    if (finding.IntraoralExamination) {
        acc.IntraoralExamination += `
          <div class="bg-gray-100 p-4 mb-2 rounded shadow-md flex justify-between">
            <div class="flex-1">
              <p>${finding.IntraoralExamination}</p>
            </div>
            <div class="ml-4 text-right">
              <p class="text-gray-600 text-sm mb-1"><strong>Date:</strong> ${new Date(finding.createdAt).toLocaleString()}</p>
              <p class="text-gray-600 text-sm"><strong>Dr</strong> ${finding.createdBy.username}</p>
            </div>
          </div>`;
    }

    if (finding.ExtraoralExamination) {
        acc.ExtraoralExamination += `
          <div class="bg-gray-100 p-4 mb-2 rounded shadow-md flex justify-between">
            <div class="flex-1">
              <p>${finding.ExtraoralExamination}</p>
            </div>
            <div class="ml-4 text-right">
              <p class="text-gray-600 text-sm mb-1"><strong>Date:</strong> ${new Date(finding.createdAt).toLocaleString()}</p>
              <p class="text-gray-600 text-sm"><strong>Dr</strong> ${finding.createdBy.username}</p>
            </div>
          </div>`;
    }

    if (finding.Investigation) {
        acc.Investigation += `
          <div class="bg-gray-100 p-4 mb-2 rounded shadow-md flex justify-between">
            <div class="flex-1">
              <p>${finding.Investigation}</p>
            </div>
            <div class="ml-4 text-right">
              <p class="text-gray-600 text-sm mb-1"><strong>Date:</strong> ${new Date(finding.createdAt).toLocaleString()}</p>
              <p class="text-gray-600 text-sm"><strong>Dr</strong> ${finding.createdBy.username}</p>
            </div>
          </div>`;
    }

    if (finding.Assessment) {
        acc.Assessment += `
          <div class="bg-gray-100 p-4 mb-2 rounded shadow-md flex justify-between">
            <div class="flex-1">
              <p>${finding.Assessment}</p>
            </div>
            <div class="ml-4 text-right">
              <p class="text-gray-600 text-sm mb-1"><strong>Date:</strong> ${new Date(finding.createdAt).toLocaleString()}</p>
              <p class="text-gray-600 text-sm"><strong>Dr</strong> ${finding.createdBy.username}</p>
            </div>
          </div>`;
    }

    if (finding.TreatmentPlan) {
      const treatmentPlanEntries = Object.entries(finding.TreatmentPlan)
        .filter(([key, value]) => key === 'other' || value === true) // Keep entries with value true or the 'other' field
        .map(([key, value]) => {
          if (key === 'other' && value) {
            return `<p><strong>Other:</strong> ${value}</p>`; // Display the value for 'other'
          } else if (value === true) {
            return `<p><strong class="capitalize">${key}:</strong> Yes</p>`; // Display "Yes" for true boolean values
          }
          return ''; // No need to return anything if condition doesn't match
        })
        .join('');
    
      if (treatmentPlanEntries) { // Ensure only sections with treatments are displayed
        acc.TreatmentPlan += `
          <div class="bg-gray-100 p-4 mb-2 rounded shadow-md flex justify-between">
            <div class="flex-1 capitalize">
              ${treatmentPlanEntries}
            </div>
            <div class="ml-4 text-right">
              <p class="text-gray-600 text-sm mb-1"><strong>Date:</strong> ${new Date(finding.createdAt).toLocaleString()}</p>
              <p class="text-gray-600 text-sm"><strong>Dr</strong> ${finding.createdBy.username}</p>
            </div>
          </div>`;
      }
    }
    
    

    return acc;
}, {
    ChiefCompliance: '', 
    Historypresent: '', 
    Vitalsign: '', 
    Pastmedicalhistory: '', 
    Pastdentalhistory: '', 
    IntraoralExamination: '', 
    ExtraoralExamination: '', 
    Investigation: '', 
    Assessment: '', 
    TreatmentPlan: ''
});

  
  
  return (
    <div className="flex flex-col items-center">
      <div className="max-w-4xl w-full p-8 bg-white rounded-lg shadow-lg mt-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {existingMedicalFindings.length > 0 ? (
            <div className="flex flex-col border border-gray-200 p-4 rounded-lg shadow-sm mt-6">
              {/* Chief Compliance */}
              <div className="flex items-center justify-between">
                <label htmlFor="ChiefCompliance" className="text-lg font-semibold text-gray-700">
                  Chief Compliance
                </label>
                
              </div>

            
                <div className="bg-gray-100 p-2 rounded text-gray-800 mt-2">
                
                <strong>Previous Data </strong>
                <div dangerouslySetInnerHTML={{ __html: combinedFindings.ChiefCompliance }} />
          
                 
                </div>
             

              <textarea
                id="ChiefCompliance"
                {...register('ChiefCompliance', {
                  required: 'Chief Compliance is required',
                })}
                className="w-full mt-2 p-2 border border-gray-300 rounded"
                placeholder="Enter Chief Compliance details here"
                rows={6} 
              />

              {errors.ChiefCompliance && <p className="text-red-500 mt-2">{errors.ChiefCompliance?.message}</p>}

              {/* History Present */}
              <div className="flex items-center justify-between mt-6">
                <label htmlFor="Historypresent" className="text-lg font-semibold text-gray-700">
                  History Present
                </label>
                
              </div>

              
                <div className="bg-gray-100 p-2 rounded text-gray-800 mt-2">
                <strong>Previous Data :</strong>
                <div dangerouslySetInnerHTML={{ __html: combinedFindings.Historypresent }} />
            
                </div>
            

              <textarea
                id="Historypresent"
                {...register('Historypresent')}
                className="w-full mt-2 p-2 border border-gray-300 rounded"
                placeholder="Enter History Present details here"
                rows={6} 
              />

              {errors.Historypresent && <p className="text-red-500 mt-2">{errors.Historypresent?.message}</p>}



                  {/* Vitalsign */}
                  <div className="flex items-center justify-between">
                <label htmlFor="Vitalsign" className="text-lg font-semibold text-gray-700">
                Vital sign
                </label>
                
              </div>

            
                <div className="bg-gray-100 p-2 rounded text-gray-800 mt-2">
                
                <strong>Previous Data </strong>
                <div dangerouslySetInnerHTML={{ __html: combinedFindings.Vitalsign }} />
          
                 
                </div>
             

              <textarea
                id="Vitalsign"
                {...register('Vitalsign', {
                  required: 'Vital signis required',
                })}
                className="w-full mt-2 p-2 border border-gray-300 rounded"
                placeholder="Enter Vital sign details here"
                rows={6} 
              />

              {errors.Vitalsign && <p className="text-red-500 mt-2">{errors.Vitalsign?.message}</p>}

               {/*Past medical history*/}
               <div className="flex items-center justify-between mt-6">
                <label htmlFor="Pastmedicalhistory" className="text-lg font-semibold text-gray-700">
                Past Medical History
                </label>
                
              </div>

              
                <div className="bg-gray-100 p-2 rounded text-gray-800 mt-2">
                <strong>Previous Data :</strong>
                <div dangerouslySetInnerHTML={{ __html: combinedFindings.Pastmedicalhistory }} />
            
                </div>
            

              <textarea
                id="Pastmedicalhistory"
                {...register('Pastmedicalhistory')}
                className="w-full mt-2 p-2 border border-gray-300 rounded"
                placeholder="Enter Past medical history details here"
                rows={6} 
              />

              {errors.Pastmedicalhistory && <p className="text-red-500 mt-2">{errors.Pastmedicalhistory?.message}</p>}


 {/* Pastdentalhistory */}
 <div className="flex items-center justify-between mt-6">
                <label htmlFor="Pastdentalhistory" className="text-lg font-semibold text-gray-700">
                Past Dental History
                </label>
                
              </div>

              
                <div className="bg-gray-100 p-2 rounded text-gray-800 mt-2">
                <strong>Previous Data :</strong>
                <div dangerouslySetInnerHTML={{ __html: combinedFindings.Pastdentalhistory }} />
            
                </div>
            

              <textarea
                id="Pastdentalhistory"
                {...register('Pastdentalhistory')}
                className="w-full mt-2 p-2 border border-gray-300 rounded"
                placeholder="Enter Past dental history details here"
                rows={6} 
              />

              {errors.Pastdentalhistory && <p className="text-red-500 mt-2">{errors.Pastdentalhistory?.message}</p>}



 {/* IntraoralExamination */}
 <div className="flex items-center justify-between mt-6">
                <label htmlFor="IntraoralExamination" className="text-lg font-semibold text-gray-700">
                Intraoral Examination
                </label>
                
              </div>

              
                <div className="bg-gray-100 p-2 rounded text-gray-800 mt-2">
                <strong>Previous Data :</strong>
                <div dangerouslySetInnerHTML={{ __html: combinedFindings.IntraoralExamination }} />
            
                </div>
            

              <textarea
                id="IntraoralExamination"
                {...register('IntraoralExamination')}
                className="w-full mt-2 p-2 border border-gray-300 rounded"
                placeholder="Enter IntraoralExamination details here"
                rows={6} 
              />

              {errors.IntraoralExamination && <p className="text-red-500 mt-2">{errors.IntraoralExamination?.message}</p>}


 {/* ExtraoralExamination */}
 <div className="flex items-center justify-between mt-6">
                <label htmlFor="ExtraoralExamination" className="text-lg font-semibold text-gray-700">
                Extraoral Examination
                </label>
                
              </div>

              
                <div className="bg-gray-100 p-2 rounded text-gray-800 mt-2">
                <strong>Previous Data :</strong>
                <div dangerouslySetInnerHTML={{ __html: combinedFindings.ExtraoralExamination }} />
            
                </div>
            

              <textarea
                id="ExtraoralExamination"
                {...register('ExtraoralExamination')}
                className="w-full mt-2 p-2 border border-gray-300 rounded"
                placeholder="Enter Extraoral Examination details here"
                rows={5} 
              />

              {errors.ExtraoralExamination && <p className="text-red-500 mt-2">{errors.ExtraoralExamination?.message}</p>}


 {/* Investigation*/}
 <div className="flex items-center justify-between mt-6">
                <label htmlFor="Investigation" className="text-lg font-semibold text-gray-700">
                Investigation
                </label>
                
              </div>

              
                <div className="bg-gray-100 p-2 rounded text-gray-800 mt-2">
                <strong>Previous Data :</strong>
                <div dangerouslySetInnerHTML={{ __html: combinedFindings.Investigation }} />
            
                </div>
            

              <textarea
                id="Investigation"
                {...register('Investigation')}
                className="w-full mt-2 p-2 border border-gray-300 rounded"
                placeholder="Enter Investigation details here"
                rows={6} 
              />

              {errors.Investigation && <p className="text-red-500 mt-2">{errors.Investigation?.message}</p>}


 {/* Assessment */}
 <div className="flex items-center justify-between mt-6">
                <label htmlFor="Assessment" className="text-lg font-semibold text-gray-700">
                Assessment
                </label>
                
              </div>

              
                <div className="bg-gray-100 p-2 rounded text-gray-800 mt-2">
                <strong>Previous Data :</strong>
                <div dangerouslySetInnerHTML={{ __html: combinedFindings.Assessment }} />
            
                </div>
            

              <textarea
                id="Assessment"
                {...register('Assessment')}
                className="w-full mt-2 p-2 border border-gray-300 rounded"
                placeholder="Enter Assessment details here"
                rows={6} 
              />

              {errors.Assessment && <p className="text-red-500 mt-2">{errors.Assessment?.message}</p>}

{/* TreatmentPlan */}
<div className="flex items-center justify-between mt-6">
                <label htmlFor="TreatmentPlan" className="text-lg font-semibold text-gray-700">
                TreatmentPlan
                </label>
                
              </div>

              
                <div className="bg-gray-100 p-2 rounded text-gray-800 mt-2">
                <strong>Previous Data :</strong>
                <div dangerouslySetInnerHTML={{ __html: combinedFindings.TreatmentPlan }} />
            
                </div>
            

                <div className="mt-2 space-y-2">
    <label className="flex items-center">
      <input
        type="checkbox"
        {...register('TreatmentPlan.teethWhitening')}
        className="form-checkbox"
      />
      <span className="ml-2">Teeth Whitening</span>
    </label>

    <label className="flex items-center">
      <input
        type="checkbox"
        {...register('TreatmentPlan.veneers')}
        className="form-checkbox"
      />
      <span className="ml-2">Veneers</span>
    </label>

   

    <label className="flex items-center">
      <input
        type="checkbox"
        {...register('TreatmentPlan.bonding')}
        className="form-checkbox"
      />
      <span className="ml-2">bonding</span>
    </label>


    <label className="flex items-center">
      <input
        type="checkbox"
        {...register('TreatmentPlan.cosmeticContouring')}
        className="form-checkbox"
      />
      <span className="ml-2">cosmeticContouring</span>
    </label>

    <label className="flex items-center">
      <input
        type="checkbox"
        {...register('TreatmentPlan.gumContouring')}
        className="form-checkbox"
      />
      <span className="ml-2">gumContouring</span>
    </label>
    
    <label className="flex items-center">
      <input
        type="checkbox"
        {...register('TreatmentPlan.compositeBonding')}
        className="form-checkbox"
      />
      <span className="ml-2">compositeBonding</span>
    </label>
    
    <label className="flex items-center">
      <input
        type="checkbox"
        {...register('TreatmentPlan.smileMakeovers')}
        className="form-checkbox"
      />
      <span className="ml-2">smileMakeovers</span>
    </label>
    <label className="flex items-center">
    <span className="mr-2">other</span>
      <input
        type="text"
        {...register('TreatmentPlan.other')}
        className="from-primary-foreground border border-gray-300 rounded"
      />
      
    </label>

    {/* Add more treatment options in a similar manner */}
  </div>

              {errors.TreatmentPlan && <p className="text-red-500 mt-2">{errors.TreatmentPlan?.message}</p>}
 


            </div>
          ) : (
            <div className="flex flex-col border border-gray-200 p-4 rounded-lg shadow-sm mt-6">
              {/* Chief Compliance */}
              <div className="flex items-center justify-between">
                <label htmlFor="ChiefCompliance" className="text-lg font-semibold text-gray-700">
                  Chief Compliance
                </label>
                
              </div>
              <textarea
                id="ChiefCompliance"
                {...register('ChiefCompliance', {
                  required: 'Chief Compliance is required',
                })}
                className="w-full mt-2 p-2 border border-gray-300 rounded"
                placeholder="Enter Chief Compliance details here"
                rows={6} 
              />

              {errors.ChiefCompliance && <p className="text-red-500 mt-2">{errors.ChiefCompliance?.message}</p>}

              {/* History Present */}
              <div className="flex items-center justify-between mt-6">
                <label htmlFor="Historypresent" className="text-lg font-semibold text-gray-700">
                  History Present
                </label>
                
              </div>  
               <textarea
                id="Historypresent"
                {...register('Historypresent')}
                className="w-full mt-2 p-2 border border-gray-300 rounded"
                placeholder="Enter History Present details here"
                rows={6} 
              />

              {errors.Historypresent && <p className="text-red-500 mt-2">{errors.Historypresent?.message}</p>}



                  {/* Vitalsign */}
                  <div className="flex items-center justify-between">
                <label htmlFor="Vitalsign" className="text-lg font-semibold text-gray-700">
                Vital sign
                </label>
                
              </div>

            
                

              <textarea
                id="Vitalsign"
                {...register('Vitalsign', {
                  required: 'Vital signis required',
                })}
                className="w-full mt-2 p-2 border border-gray-300 rounded"
                placeholder="Enter Vital sign details here"
                rows={6} 
              />

              {errors.Vitalsign && <p className="text-red-500 mt-2">{errors.Vitalsign?.message}</p>}

               {/*Past medical history*/}
               <div className="flex items-center justify-between mt-6">
                <label htmlFor="Pastmedicalhistory" className="text-lg font-semibold text-gray-700">
                Past Medical History
                </label>
                
              </div>
              <textarea
                id="Pastmedicalhistory"
                {...register('Pastmedicalhistory')}
                className="w-full mt-2 p-2 border border-gray-300 rounded"
                placeholder="Enter Past medical history details here"
                rows={6} 
              />

              {errors.Pastmedicalhistory && <p className="text-red-500 mt-2">{errors.Pastmedicalhistory?.message}</p>}


 {/* Pastdentalhistory */}
 <div className="flex items-center justify-between mt-6">
                <label htmlFor="Pastdentalhistory" className="text-lg font-semibold text-gray-700">
                Past Dental History
                </label>
                
              </div>
              <textarea
                id="Pastdentalhistory"
                {...register('Pastdentalhistory')}
                className="w-full mt-2 p-2 border border-gray-300 rounded"
                placeholder="Enter Past dental history details here"
                rows={6} 
              />

              {errors.Pastdentalhistory && <p className="text-red-500 mt-2">{errors.Pastdentalhistory?.message}</p>}



 {/* IntraoralExamination */}
 <div className="flex items-center justify-between mt-6">
                <label htmlFor="IntraoralExamination" className="text-lg font-semibold text-gray-700">
                Intraoral Examination
                </label>
                
              </div>
              <textarea
                id="IntraoralExamination"
                {...register('IntraoralExamination')}
                className="w-full mt-2 p-2 border border-gray-300 rounded"
                placeholder="Enter IntraoralExamination details here"
                rows={6} 
              />

              {errors.IntraoralExamination && <p className="text-red-500 mt-2">{errors.IntraoralExamination?.message}</p>}


 {/* ExtraoralExamination */}
 <div className="flex items-center justify-between mt-6">
                <label htmlFor="ExtraoralExamination" className="text-lg font-semibold text-gray-700">
                Extraoral Examination
                </label>
                
              </div>
              <textarea
                id="ExtraoralExamination"
                {...register('ExtraoralExamination')}
                className="w-full mt-2 p-2 border border-gray-300 rounded"
                placeholder="Enter Extraoral Examination details here"
                rows={5} 
              />

              {errors.ExtraoralExamination && <p className="text-red-500 mt-2">{errors.ExtraoralExamination?.message}</p>}


 {/* Investigation*/}
 <div className="flex items-center justify-between mt-6">
                <label htmlFor="Investigation" className="text-lg font-semibold text-gray-700">
                Investigation
                </label>
                
              </div>
              <textarea
                id="Investigation"
                {...register('Investigation')}
                className="w-full mt-2 p-2 border border-gray-300 rounded"
                placeholder="Enter Investigation details here"
                rows={6} 
              />

              {errors.Investigation && <p className="text-red-500 mt-2">{errors.Investigation?.message}</p>}


 {/* Assessment */}
 <div className="flex items-center justify-between mt-6">
                <label htmlFor="Assessment" className="text-lg font-semibold text-gray-700">
                Assessment
                </label>
                
              </div>
            <textarea
                id="Assessment"
                {...register('Assessment')}
                className="w-full mt-2 p-2 border border-gray-300 rounded"
                placeholder="Enter Assessment details here"
                rows={6} 
              />

              {errors.Assessment && <p className="text-red-500 mt-2">{errors.Assessment?.message}</p>}

{/* TreatmentPlan */}
<div className="flex items-center justify-between mt-6">
                <label htmlFor="TreatmentPlan" className="text-lg font-semibold text-gray-700">
                TreatmentPlan
                </label>
                
              </div>

                <div className="mt-2 space-y-2">
    <label className="flex items-center">
      <input
        type="checkbox"
        {...register('TreatmentPlan.teethWhitening')}
        className="form-checkbox"
      />
      <span className="ml-2">Teeth Whitening</span>
    </label>

    <label className="flex items-center">
      <input
        type="checkbox"
        {...register('TreatmentPlan.veneers')}
        className="form-checkbox"
      />
      <span className="ml-2">Veneers</span>
    </label>

   

    <label className="flex items-center">
      <input
        type="checkbox"
        {...register('TreatmentPlan.bonding')}
        className="form-checkbox"
      />
      <span className="ml-2">bonding</span>
    </label>


    <label className="flex items-center">
      <input
        type="checkbox"
        {...register('TreatmentPlan.cosmeticContouring')}
        className="form-checkbox"
      />
      <span className="ml-2">cosmeticContouring</span>
    </label>

    <label className="flex items-center">
      <input
        type="checkbox"
        {...register('TreatmentPlan.gumContouring')}
        className="form-checkbox"
      />
      <span className="ml-2">gumContouring</span>
    </label>
    
    <label className="flex items-center">
      <input
        type="checkbox"
        {...register('TreatmentPlan.compositeBonding')}
        className="form-checkbox"
      />
      <span className="ml-2">compositeBonding</span>
    </label>
    
    <label className="flex items-center">
      <input
        type="checkbox"
        {...register('TreatmentPlan.smileMakeovers')}
        className="form-checkbox"
      />
      <span className="ml-2">smileMakeovers</span>
    </label>
    <label className="flex items-center">
    <span className="mr-2">other</span>
      <input
        type="text"
        {...register('TreatmentPlan.other')}
        className="from-primary-foreground border border-gray-300 rounded"
      />
      
    </label>
    {/* Add more treatment options in a similar manner */}
  </div>

              {errors.TreatmentPlan && <p className="text-red-500 mt-2">{errors.TreatmentPlan?.message}</p>}
 


            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700 transition-colors"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
