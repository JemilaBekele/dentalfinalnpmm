import mongoose from 'mongoose';
import userReferenceSchema from "@/app/helpers/userReferenceSchema";

const MedicalFindingSchema = new mongoose.Schema({
  
  ChiefCompliance: {
    type: String,
  },
  Historypresent: {
   
    type: String,
  },
  Vitalsign: {
    Core_Temperature: String,
    Respiratory_Rate: String,
    Blood_Oxygen: String,
    Blood_Pressure: String,
    heart_Rate: String,
  },
  Pastmedicalhistory: {
    
    type: String,
  },
  Pastdentalhistory: {
    type: String,
  },
  IntraoralExamination: {
    type: String,
  },
  ExtraoralExamination: {
    type: String,
  },
  Investigation: {
    type: String,
  },
  Assessment: {
    type: String,
  },
  TreatmentPlan:{
    teethWhitening: Boolean,
    veneers: Boolean,
    bonding: Boolean,
    cosmeticContouring: Boolean,
    gumContouring: Boolean,
    compositeBonding: Boolean,
    smileMakeovers: Boolean,
        other: String,
    },
  patientId: {
    id: {
      type: mongoose.Types.ObjectId,
      ref: 'Patient',
      required: [true, 'Please provide Patient ID'],
    }
    
  },
  createdBy: userReferenceSchema,
}, { timestamps: true });

const MedicalFinding = mongoose.models.MedicalFinding || mongoose.model('MedicalFinding', MedicalFindingSchema);

export default MedicalFinding;
