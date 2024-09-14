import mongoose from "mongoose";
import Order from "./Order";
import MedicalHistory from "./MedicalFinding"; // Import Order model


import userReferenceSchema from "@/app/helpers/userReferenceSchema"; 
// Define the schemas

const patientSchema = new mongoose.Schema({
    cardno: {
      type: String,
      required: [true, "Please provide a card number"],
      unique: true,
    },
    firstname: {
      type: String,
      required: [true, "Please provide a firstname"],
      minlength: 3,
      maxlength: 50,
    },
    lastname: {
      type: String,
      required: [true, "Please provide a lastname"],
      minlength: 3,
      maxlength: 50,
    },
    age: {
      type: String,
      required: [true, "Please provide an age"],
    },
    sex: {
      type: String,
      enum: ['male', 'female'],
      required: [true, "Please provide a sex"],
    },
    email: {
      type: String,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please provide a valid email',
      ],
      unique: true,
    },
    phoneNumber: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
    },
    createdBy: userReferenceSchema,
    Order: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    MedicalFinding: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MedicalFinding",
      },
    ],
    MedicalTreatment: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MedicalTreatment",
      },
    ],
  }, { 
    timestamps: true,  // Standard options
    strictPopulate: false // Add it as part of the main options object
  });
  
const Patient = mongoose.models.Patient || mongoose.model("Patient", patientSchema);
  
export default Patient;
  


