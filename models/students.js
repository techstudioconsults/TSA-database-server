const mongoose = require("mongoose");
//pka- popularlyKnownas
const payment = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  receipt: {
    type: String,
    required: true,
  },
  paymentType: {
    type: String,
    enum: ["cash", "bank transfer", "bank deposit"],
  },
  datePaid: {
    type: Date,
    default: Date.now,
  },
  paymentVerification: {
    type: String,
    default: "unverified",
    enum: ["verified", "unverified"],
  },
  comment: {
    type: String,
  },
});

const studentSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    pka: {
      type: String,
      required: true,
    },
    studentId: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    whatsappNumber: {
      type: String,
      required: true,
    },
    courseCohort: {
      type: String,
      required: true,
    },
    classType: {
      type: String,
      enum: ["weekday", "weekend", "online"],
    },
    referralStudentId: {
      type: String,
      // required: true,
    },
    emergencyContactName: {
      type: String,
      required: true,
    },
    emergencyContactNumber: {
      type: String,
      required: true,
    },
    emergencyContactLocation: {
      type: String,
      required: true,
    },
    payment: [payment],
    paymentStatus: {
      type: String,
      enum: ["part", "full"],
      // required: true,
    },
    balance: {
      type: Number,
    },
    courseFee: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

// Pre-save hook to calculate the balance after each payment
studentSchema.pre("save", function (next) {
  const totalAmountPaid = this.payment.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );
  this.balance = this.courseFee - totalAmountPaid;

  // Update paymentStatus to 'full' if the balance is 0
  this.paymentStatus = this.balance === 0 ? "full" : "part";

  next();
});

module.exports = mongoose.model("Student", studentSchema);
