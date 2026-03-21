const mongoose = require('mongoose');

const BriefingSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true
  },
  highlights: [{
    type: String
  }],
  impact: {
    type: String
  },
  timeline: [{
    date: String,
    event: String
  }],
  contrarian: {
    bullish: String,
    bearish: String,
    neutral: String
  },
  winners: [{
    entity: String,
    reason: String
  }],
  losers: [{
    entity: String,
    reason: String
  }],
  sources: [{
    title: String,
    url: String
  }],
  prediction: {
    type: String
  },
  personalRelevance: {
    type: String
  },
  isDaily: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Briefing', BriefingSchema);
