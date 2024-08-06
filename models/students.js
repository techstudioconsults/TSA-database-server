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
      trim: true,
    },
    pka: {
      type: String,
      required: true,
      trim: true,
    },
    studentId: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    whatsappNumber: {
      type: String,
      required: true,
      trim: true,
    },
    courseCohort: {
      type: String,
      required: true,
      trim: true,
    },
    classType: {
      type: String,
      enum: ["weekday", "weekend", "online"],
    },
    courseDuration: {
      type: Number,
    },
    referralStudentId: {
      type: String,
    },
    referralStudentName: {
      type: String,
    },
    emergencyContactName: {
      type: String,
      required: true,
      trim: true,
    },
    emergencyContactNumber: {
      type: String,
      required: true,
      trim: true,
    },
    emergencyContactLocation: {
      type: String,
      required: true,
      trim: true,
    },
    payments: [payment],
    paymentStatus: {
      type: String,
      enum: ["part", "full"],
      // required: true,
    },
    modifiedBy: {
      type: mongoose.Types.ObjectId,
      ref: "admin",
    },
    balance: {
      type: Number,
      min: 0,
    },
    courseFee: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  { timestamps: true }
);

// Pre-save hook to calculate the balance after each payment
studentSchema.pre("save", function (next) {
  // Calculate the total amount paid
  const totalAmountPaid = this.payments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );

  // Calculate the discount  of the total amount paid
  const discountAmount = (this.discount / 100) * this.courseFee;

  // Calculate the balance after subtracting the discounted amount
  this.balance = this.courseFee - (discountAmount + totalAmountPaid);

  // Update paymentStatus to 'full' if the balance is 0
  this.paymentStatus = this.balance === 0 ? "full" : "part";
  if (this.balance < 0) {
    this.balance = 0;
  }

  next();
});

module.exports = mongoose.model("Student", studentSchema);
