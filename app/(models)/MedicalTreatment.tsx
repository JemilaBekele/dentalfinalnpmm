import mongoose from 'mongoose';
import userReferenceSchema from "@/app/helpers/userReferenceSchema";

const MedicalTreatmentSchema = new mongoose.Schema({
    preventive: {
        dentalCleanings: Boolean,
        fluorideTreatments: Boolean,
        dentalSealants: Boolean,
        oralExaminations: Boolean,
        xRays: Boolean,
        mouthguards: Boolean,
        other: String,
    },
    restorative: {
        fillings: Boolean,
        crowns: Boolean,
        bridges: Boolean,
        inlaysOnlays: Boolean,
        dentalImplants: Boolean,
        dentures: Boolean,
        postAndCore: Boolean,
        other: String,
    },
    periodontal: {
        scalingRootPlaning: Boolean,
        gumGrafts: Boolean,
        periodontalSurgery: Boolean,
        guidedTissueRegeneration: Boolean,
        laserGumSurgery: Boolean,
        periodontalMaintenance: Boolean,
        other: String,
    },
    endodontic: {
        rootCanalTherapy: Boolean,
        endodonticRetreatment: Boolean,
        apicoectomy: Boolean,
        pulpotomy: Boolean,
        pulpCapping: Boolean,
        other: String,
    },
    prosthodontic: {
        completeDentures: Boolean,
        partialDentures: Boolean,
        implantSupportedDentures: Boolean,
        overdentures: Boolean,
        fixedBridges: Boolean,
        fullMouthReconstruction: Boolean,
        other: String,
    },
    pediatric: {
        cleaningsForChildren: Boolean,
        fluorideTreatments: Boolean,
        sealantsForChildren: Boolean,
        pulpotomy: Boolean,
        stainlessSteelCrowns: Boolean,
        spaceMaintainers: Boolean,
        behaviorManagement: Boolean,
        other: String,
    },
    sedation: {
        nitrousOxide: Boolean,
        oralSedation: Boolean,
        ivSedation: Boolean,
        generalAnesthesia: Boolean,
        other: String,
    },
    emergency: {
        emergencyExtractions: Boolean,
        emergencyRootCanal: Boolean,
        temporaryRestorations: Boolean,
        dentalTraumaTreatment: Boolean,
        abscessDrainage: Boolean,
        other: String,
    },
    cosmeticTreatment: {
        teethWhitening: Boolean,
        veneers: Boolean,
        bonding: Boolean,
        cosmeticContouring: Boolean,
        gumContouring: Boolean,
        compositeBonding: Boolean,
        smileMakeovers: Boolean,
        other: String,
    },
    description: {
        type: String,
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

const MedicalTreatment = mongoose.models.MedicalTreatment || mongoose.model('MedicalTreatment', MedicalTreatmentSchema);

export default MedicalTreatment;
