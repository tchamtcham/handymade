// seed.js
const mongoose = require('mongoose');
const faker = require('faker');

// Import all your models
const Admin = require('./models/Admin');
const User = require('./models/User');
const Provider = require('./models/Provider');
const Booking = require('./models/Booking');
const Cancellation = require('./models/Cancellation');
const Client = require('./models/Client');
const Dispute = require('./models/Dispute');
const Location = require('./models/Location');
const NotificationSettings = require('./models/NotificationSettings');
const Platform = require('./models/Platform');
const Review = require('./models/Review');
const Role = require('./models/Role');
const Service = require('./models/Service');

// MongoDB connection
const MONGO_URI = 'mongodb+srv://maamaabdelhak:7y6eWcoF4g4qdJb2@cluster1.xhe3yhl.mongodb.net/'; // <- change it to your DB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected!'))
  .catch((err) => console.error(err));

// Helper function to create random IDs
const randomObjectId = () => new mongoose.Types.ObjectId();

const seed = async () => {
  try {
    // First clean all collections
    await Promise.all([
      Admin.deleteMany(),
      User.deleteMany(),
      Provider.deleteMany(),
      Booking.deleteMany(),
      Cancellation.deleteMany(),
      Client.deleteMany(),
      Dispute.deleteMany(),
      Location.deleteMany(),
      NotificationSettings.deleteMany(),
      Platform.deleteMany(),
      Review.deleteMany(),
      Role.deleteMany(),
      Service.deleteMany(),
    ]);
    console.log('All collections cleared.');

    // 1. Seed Admins
    const admins = [];
    for (let i = 0; i < 30; i++) {
      admins.push({
        fullName: faker.name.findName(),
        email: faker.internet.email(),
        phoneNumber: faker.phone.phoneNumber(),
        password: faker.internet.password(),
        role: 'admin',
        isVerified: true,
        status: 'active',
      });
    }
    await Admin.insertMany(admins);

    // 2. Seed Users (Clients + Providers mixed)
    const users = [];
    for (let i = 0; i < 30; i++) {
      users.push({
        fullName: faker.name.findName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: 'client',
        phoneNumber: faker.phone.phoneNumber(),
        isVerified: faker.datatype.boolean(),
      });
    }
    const createdUsers = await User.insertMany(users);

    // 3. Seed Providers
    const providers = [];
    for (let i = 0; i < 30; i++) {
      providers.push({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        phone: faker.phone.phoneNumber(),
        dob: faker.date.past(30, new Date(2000, 0, 1)),
        address: faker.address.streetAddress(),
        city: faker.address.city(),
        zip: faker.address.zipCode(),
        services: [faker.name.jobTitle()],
        otherSkills: faker.hacker.ingverb(),
        experience: `${faker.datatype.number({ min: 1, max: 10 })} years`,
        availability: 'full-time',
        serviceAreas: [faker.address.city()],
        bio: faker.lorem.paragraph(),
        terms: true,
      });
    }
    const createdProviders = await Provider.insertMany(providers);

    // 4. Seed Services
    const services = [];
    for (let i = 0; i < 30; i++) {
      services.push({
        providerId: createdProviders[i % createdProviders.length]._id,
        title: faker.company.bs(),
        description: faker.lorem.paragraph(),
        price: faker.datatype.number({ min: 50, max: 500 }),
        category: faker.commerce.department(),
      });
    }
    const createdServices = await Service.insertMany(services);

    // 5. Seed Bookings
    const bookings = [];
    for (let i = 0; i < 30; i++) {
      bookings.push({
        customerId: createdUsers[i % createdUsers.length]._id,
        providerId: createdProviders[i % createdProviders.length]._id,
        serviceId: createdServices[i % createdServices.length]._id,
        date: faker.date.future(),
        status: 'pending',
      });
    }
    const createdBookings = await Booking.insertMany(bookings);

    // 6. Seed Cancellations
    const cancellations = [];
    for (let i = 0; i < 30; i++) {
      cancellations.push({
        bookingId: createdBookings[i % createdBookings.length]._id,
        customerId: createdUsers[i % createdUsers.length]._id,
        providerId: createdProviders[i % createdProviders.length]._id,
        reason: faker.lorem.sentence(),
        refundRequested: faker.datatype.boolean(),
        refundAmount: faker.datatype.number({ min: 10, max: 100 }),
        status: 'pending',
      });
    }
    await Cancellation.insertMany(cancellations);

    // 7. Seed Disputes
    const disputes = [];
    for (let i = 0; i < 30; i++) {
      disputes.push({
        bookingId: createdBookings[i % createdBookings.length]._id,
        customerId: createdUsers[i % createdUsers.length]._id,
        providerId: createdProviders[i % createdProviders.length]._id,
        issue: faker.lorem.sentence(),
        status: 'pending',
        severity: faker.random.arrayElement(['low', 'medium', 'high']),
      });
    }
    await Dispute.insertMany(disputes);

    // 8. Seed Locations
    const locations = [];
    for (let i = 0; i < 30; i++) {
      locations.push({
        city: faker.address.city(),
        serviceAreas: faker.address.state(),
        status: 'active',
      });
    }
    await Location.insertMany(locations);

    // 9. Seed Notification Settings
    const notificationSettings = [];
    for (let i = 0; i < 30; i++) {
      notificationSettings.push({
        userId: createdUsers[i % createdUsers.length]._id,
        emailEnabled: faker.datatype.boolean(),
        smsEnabled: faker.datatype.boolean(),
        inAppEnabled: faker.datatype.boolean(),
        emergencyEnabled: faker.datatype.boolean(),
      });
    }
    await NotificationSettings.insertMany(notificationSettings);

    // 10. Seed Platforms
    const platforms = [];
    for (let i = 0; i < 30; i++) {
      platforms.push({
        name: faker.company.companyName(),
        contactEmail: faker.internet.email(),
        contactPhone: faker.phone.phoneNumber(),
        logo: faker.image.imageUrl(),
        favicon: faker.image.imageUrl(),
        primaryColor: faker.internet.color(),
        secondaryColor: faker.internet.color(),
        description: faker.lorem.paragraph(),
      });
    }
    await Platform.insertMany(platforms);

    // 11. Seed Reviews
    const reviews = [];
    for (let i = 0; i < 30; i++) {
      reviews.push({
        customerId: createdUsers[i % createdUsers.length]._id,
        providerId: createdProviders[i % createdProviders.length]._id,
        serviceId: createdServices[i % createdServices.length]._id,
        rating: faker.datatype.number({ min: 1, max: 5 }),
        comment: faker.lorem.sentences(2),
      });
    }
    await Review.insertMany(reviews);

    // 12. Seed Roles
    const roles = [];
    for (let i = 0; i < 5; i++) {
      roles.push({
        name: faker.name.jobTitle(),
        permissions: 'read,write,delete',
      });
    }
    await Role.insertMany(roles);

    console.log('Seeding done! ✅');
    mongoose.disconnect();
  } catch (err) {
    console.error(err);
    mongoose.disconnect();
  }
};

seed();
