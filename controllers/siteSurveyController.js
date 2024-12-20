const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const SiteSurvey = require('../models/SiteSurvey');
const User = require('../models/User');

// Get all site surveys for the authenticated user
exports.getAllSurveysForUser = catchAsyncErrors(async (req, res, next) => {
  const surveys = await SiteSurvey.find({ userId: req.user.id }).populate('userId', 'name email');
  res.status(200).json({ success: true, surveys });
});

// Get all site surveys (no user-specific filter)
exports.getAllSurveys = catchAsyncErrors(async (req, res, next) => {
  const surveys = await SiteSurvey.find().populate('userId', 'name email');
  res.status(200).json({ success: true, surveys });
});

// Get a single site survey by ID for the authenticated user
exports.getSurveyByIdForUser = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const survey = await SiteSurvey.findOne({ _id: id, userId: req.user.id }).populate('userId', 'name email');

  if (!survey) {
    return res.status(404).json({ success: false, message: 'Survey not found' });
  }

  res.status(200).json({ success: true, survey });
});

// Create a new site survey for the authenticated user
exports.createSurveyForUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(400).json({ success: false, message: 'User not found' });
  }

  const survey = await SiteSurvey.create({
    ...req.body,
    userId: req.user._id, 
  });

  user.siteSurvey.push(survey._id);
  await user.save({ validateBeforeSave: false });

  res.status(201).json({ success: true, message: 'Survey created successfully', survey });
});

// Update a site survey by ID for the authenticated user
exports.updateSurveyForUser = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ success: false, message: 'Survey ID is required' });
  }

  const updateData = req.body;
  if (!Object.keys(updateData).length) {
    return res.status(400).json({ success: false, message: 'No update data provided' });
  }

  const survey = await SiteSurvey.findOneAndUpdate(
    { _id: id, userId: req.user.id },
    updateData,
    { new: true, runValidators: true }
  );

  if (!survey) {
    return res.status(404).json({ success: false, message: 'Survey not found or you do not have permission to update it' });
  }

  res.status(200).json({ success: true, survey });
});


// Delete a site survey by ID for the authenticated user and remove it from the user model
exports.deleteSurveyForUser = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const survey = await SiteSurvey.findOneAndDelete({ _id: id, userId: req.user.id });

  if (!survey) {
    return res.status(404).json({ success: false, message: 'Survey not found' });
  }

  const user = await User.findById(req.user.id);

  if (user) {
    user.siteSurvey.pull(id); 
    await user.save({ validateBeforeSave: false }); 
  }

  res.status(200).json({ success: true, message: 'Survey deleted successfully' });
});
