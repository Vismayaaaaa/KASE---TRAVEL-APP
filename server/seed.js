const mongoose = require('mongoose');
const { Listing, User, Experience } = require('./models');
require('dotenv').config();

const mockListings = [
    {
        title: "Whitefish Estate",
        location: "Whitefish, Montana",
        price: 10000,
        rating: 5.0,
        image: "https://a0.muscache.com/im/pictures/miso/Hosting-53274539/original/365299e3-f926-47ee-bcbf-606b6a0370b9.jpeg?im_w=720",
        images: [
            "https://a0.muscache.com/im/pictures/miso/Hosting-53274539/original/365299e3-f926-47ee-bcbf-606b6a0370b9.jpeg?im_w=720",
            "https://a0.muscache.com/im/pictures/miso/Hosting-53274539/original/1588d909-6e71-48d4-8550-e03d877b9e71.jpeg?im_w=720",
            "https://a0.muscache.com/im/pictures/miso/Hosting-53274539/original/8f6e16a0-50d6-412d-a123-5e3c732b8d4c.jpeg?im_w=720"
        ],
        host: { name: "Host 1", avatar: "https://randomuser.me/api/portraits/men/1.jpg", isSuperhost: true },
        details: { guests: 16, bedrooms: 5, beds: 8, baths: 6 },
        amenities: ["Wifi", "Pool", "Kitchen", "Free parking", "Gym"],
        description: "Luxury estate with stunning views.",
        guestFavorite: true
    },
    {
        title: "Luxury Stay in Maldives",
        location: "Maldives",
        price: 1200,
        rating: 4.9,
        image: "https://a0.muscache.com/im/pictures/miso/Hosting-826479224565736736/original/b9534d0f-4104-4433-9c16-299e53549c52.jpeg?im_w=720",
        images: ["https://a0.muscache.com/im/pictures/miso/Hosting-826479224565736736/original/b9534d0f-4104-4433-9c16-299e53549c52.jpeg?im_w=720"],
        host: { name: "Host 2", avatar: "https://randomuser.me/api/portraits/women/2.jpg", isSuperhost: true },
        details: { guests: 4, bedrooms: 2, beds: 2, baths: 2 },
        amenities: ["Wifi", "Pool", "Beach access", "Kitchen"],
        description: "Overwater villa with direct ocean access.",
        guestFavorite: true
    },
    {
        title: "Cozy Cabin in Alps",
        location: "Swiss Alps, Switzerland",
        price: 450,
        rating: 4.8,
        image: "https://a0.muscache.com/im/pictures/miso/Hosting-46695796/original/9bd67185-dc83-4473-a191-9486c62aec66.jpeg?im_w=720",
        images: ["https://a0.muscache.com/im/pictures/miso/Hosting-46695796/original/9bd67185-dc83-4473-a191-9486c62aec66.jpeg?im_w=720"],
        host: { name: "Host 3", avatar: "https://randomuser.me/api/portraits/men/3.jpg", isSuperhost: false },
        details: { guests: 6, bedrooms: 3, beds: 4, baths: 2 },
        amenities: ["Wifi", "Kitchen", "Fireplace", "Ski-in/Ski-out"],
        description: "Traditional wooden cabin with modern amenities.",
        guestFavorite: false
    }
];

const mockExperiences = [
    {
        title: "Pasta Making with Nonna",
        location: "Rome, Italy",
        price: 85,
        duration: "3 hours",
        rating: 4.95,
        image: "https://a0.muscache.com/im/pictures/lombard/MtTemplate-1692323-poster/original/5a361286-e070-4960-969c-292415d84347.jpeg?im_w=720",
        images: ["https://a0.muscache.com/im/pictures/lombard/MtTemplate-1692323-poster/original/5a361286-e070-4960-969c-292415d84347.jpeg?im_w=720"],
        host: { name: "Maria", avatar: "https://randomuser.me/api/portraits/women/4.jpg" },
        category: "Food & Drink",
        groupSize: 10,
        description: "Learn to make authentic pasta from scratch.",
        included: ["Food", "Drinks", "Equipment"]
    },
    {
        title: "Sunset Kayaking",
        location: "San Diego, USA",
        price: 60,
        duration: "2 hours",
        rating: 4.8,
        image: "https://a0.muscache.com/im/pictures/lombard/MtTemplate-2496585-poster/original/1ad4121e-1842-4d7a-806c-1e64955767ae.jpeg?im_w=720",
        images: ["https://a0.muscache.com/im/pictures/lombard/MtTemplate-2496585-poster/original/1ad4121e-1842-4d7a-806c-1e64955767ae.jpeg?im_w=720"],
        host: { name: "John", avatar: "https://randomuser.me/api/portraits/men/5.jpg" },
        category: "Sports",
        groupSize: 8,
        description: "Paddle through the bay at sunset.",
        included: ["Kayak", "Life vest", "Guide"]
    },
    {
        title: "Street Art Tour",
        location: "Berlin, Germany",
        price: 30,
        duration: "2.5 hours",
        rating: 4.9,
        image: "https://a0.muscache.com/im/pictures/lombard/MtTemplate-1610894-poster/original/7835e3e1-c89f-4425-838f-2c8096a4b270.jpeg?im_w=720",
        images: ["https://a0.muscache.com/im/pictures/lombard/MtTemplate-1610894-poster/original/7835e3e1-c89f-4425-838f-2c8096a4b270.jpeg?im_w=720"],
        host: { name: "Alex", avatar: "https://randomuser.me/api/portraits/men/6.jpg" },
        category: "Art & Culture",
        groupSize: 15,
        description: "Explore the vibrant street art scene of Berlin.",
        included: ["Guide", "Map"]
    }
];

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');

        // Clear existing
        await Listing.deleteMany({});
        await Experience.deleteMany({});
        console.log('Cleared listings and experiences');

        // Insert new
        await Listing.insertMany(mockListings);
        await Experience.insertMany(mockExperiences);
        console.log('Inserted listings and experiences');

        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
