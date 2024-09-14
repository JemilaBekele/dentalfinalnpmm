import mongoose from 'mongoose';
import userReferenceSchema from "@/app/helpers/userReferenceSchema";

const MedicalFindingSchema = new mongoose.Schema({
    preventive: {
      plaqueTartarBuildup: Boolean,
      toothDecayEarlyStage: Boolean,
      gumIrritation: Boolean,
      enamelSoftSpots: Boolean,
      bruxismWear: Boolean,
      other: String
    },
    restorative: {
      toothDecay: Boolean,
      damagedMissingTeeth: Boolean,
      crackedChippedTeeth: Boolean,
      wornDownTeeth: Boolean,
      looseFailedDentalWork: Boolean,
      other: String
    },
    periodontal: {
      gingivitis: Boolean,
      periodontitis: Boolean,
      recedingGums: Boolean,
      gumInfectionsAbscesses: Boolean,
      boneLoss: Boolean,
      other: String
    },
    endodontic: {
      infectedPulp: Boolean,
      abscessedTooth: Boolean,
      toothSensitivity: Boolean,
      toothache: Boolean,
      pulpNecrosis: Boolean,
      other: String
    },
    prosthodontic: {
      missingTeeth: Boolean,
      illFittingDentures: Boolean,
      difficultyChewing: Boolean,
      collapsedBite: Boolean,
      other: String
    },
    pediatric: {
      earlyToothDecay: Boolean,
      misalignedBabyTeeth: Boolean,
      needForSpaceMaintainers: Boolean,
      eruptionIssues: Boolean,
      behavioralConcerns: Boolean,
      other: String
    },
    sedation: {
      highAnxiety: Boolean,
      complexTreatment: Boolean,
      specialNeeds: Boolean,
      anesthesiaDifficulty: Boolean,
      other: String
    },
    emergency: {
      dentalTrauma: Boolean,
      severeToothache: Boolean,
      acuteInfection: Boolean,
      brokenDentalWork: Boolean,
      other: String
    },
  
  cosmeticFindings: {
    discolorationStains: Boolean,
    misalignedTeeth: Boolean,
    gapsBetweenTeeth: Boolean,
    unevenGumLine: Boolean,
    wornChippedTeeth: Boolean,
    other: String
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
