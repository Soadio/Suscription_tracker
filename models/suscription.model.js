import mongoose from 'mongoose';


const subscriptionSchema = new mongoose.Schema({
    name: {
    type: String,
    required: [true, 'Subscription name is required'],
    min: [0, 'Price must be greater than 0']
},
price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be greater than 0']
    },
currency: {
    type: String,
    enum: ['NGN', 'EUR', 'GBP'],
    default: 'NGN'
 },

 category: {
    type: String,
    enum: ['sport', 'news', 'entertainment', 'lifestyle', 'technology', 'finance', 'politics', 'other' ],
    required: true,
 },

 paymentMethod:{
    type: String,
   required: true,
   trim: true,
 },

 status: {
    type: String,
    enum: ['active', 'cancelled', 'expired'],
    default: 'active',
 },

 startDate: {
    type: Date,
    required: true,
    validate: {
        validator: (value) => value <= new Date(),
        message: 'start date must be in the past', 
    }
 },

 renewalDate: {
    type: Date,
    required: true,
    validate: {
        validator: function (value) { 
        return value > this.startDate()
    },

    message: 'renewal must be after the start date',
 }
},

user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
}

},  { timestamps: true });

//auto-calculate renewal date if missing.

subscriptionSchema.pre('save', function(next){
    if(!this.renewalDate){
        const renewalPeriods = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365,
        }};

    this.renewalDate = new Date(this.startDate);
    this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);

    //Auto-update the status if renewal date has passed

    if (this.renewalDate < new Date()){
        this.status = 'expired';
    }

    next();

});

const Subscription = mongoose.model( 'Subscription', subscriptionSchema);

export default Subscription;

