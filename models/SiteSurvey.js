const mongoose = require('mongoose');

const SiteSurveySchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: true,
  },
  officeAddress: {
    type: String,
    required: true,
  },
  focalPerson: {
    type: String,
    required: true,
  },
  contactDetails: {
    type: String,
    required: true,
  },
  siteName: {
    type: String,
    required: true,
  },
  siteAddress: {
    type: String,
    required: true,
  },
  siteFocalPerson: {
    type: String,
    required: true,
  },
  siteContactDetails: {
    type: String,
    required: true,
  },
  clientRequirements: {
    type: String,
    required: true,
  },
  existingGrids: [
    new mongoose.Schema(
      {
        quantity: { type: Number },
        transformerRating: { type: String },
        netMeterInstalled: { type: Boolean },
      },
      { _id: false } // Disable automatic _id creation for subdocuments
    ),
  ],
  existingGenerators: [
    new mongoose.Schema(
      {
        quantity: { type: Number },
        ratingOfEach: { type: String },
        brand: { type: String },
        model: { type: String },
      },
      { _id: false } // Disable automatic _id creation for subdocuments
    ),
  ],
  existingInverters: [
    new mongoose.Schema(
      {
        quantity: { type: Number },
        ratingOfEach: { type: String },
        brand: { type: String },
        model: { type: String },
      },
      { _id: false } // Disable automatic _id creation for subdocuments
    ),
  ],
  eaInstalled: {
    type: Boolean,
  },
  ctAvailability: {
    type: Boolean,
  },
  busSize: {
    type: String,
  },
  upsSupplyAvailability: {
    type: String,
  },
  distanceGeneratorToPVController: {
    type: String,
  },
  distanceGridToPVController: {
    type: String,
  },
  distanceInvertersToPVController: {
    type: String,
  },
  cableRoutingDetails: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
},{
  timestamps: true
});

// Create the SiteSurvey model
const SiteSurvey = mongoose.model('SiteSurvey', SiteSurveySchema);
module.exports = SiteSurvey;
