const mongoose = require('mongoose');
const { Schema } = mongoose;

const codeSnippetSchema = new Schema({
  userId: { type: String, required: true },
  roomId: { type: String, required: true },
  code: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const CodeSnippet = mongoose.model('CodeSnippet', codeSnippetSchema);
module.exports = CodeSnippet;
