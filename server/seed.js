const mongoose = require('mongoose');
const { Listing, User, Experience } = require('./models');
require('dotenv').config();

const mockListings = [
    {
        title: "Whitefish Estate",
        location: "Whitefish, Montana",
        latitude: 48.4111,
        longitude: -114.3376,
        price: 45,
        rating: 5.0,
        image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1587595431973-160d0d94add1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1600596542815-27bfef403789?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ],
        host: { name: "Host 1", avatar: "https://randomuser.me/api/portraits/men/1.jpg", isSuperhost: true },
        details: { guests: 16, bedrooms: 5, beds: 8, baths: 6 },
        amenities: ["Wifi", "Pool", "Kitchen", "Free parking", "Gym"],
        description: "Luxury estate with stunning views.",
        guestFavorite: true,
        category: "Countryside"
    },
    {
        title: "Luxury Stay in Maldives",
        location: "Maldives",
        latitude: 3.2028,
        longitude: 73.2207,
        price: 35,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
        host: { name: "Host 2", avatar: "https://randomuser.me/api/portraits/women/2.jpg", isSuperhost: true },
        details: { guests: 4, bedrooms: 2, beds: 2, baths: 2 },
        amenities: ["Wifi", "Pool", "Beach access", "Kitchen"],
        description: "Overwater villa with direct ocean access.",
        guestFavorite: true,
        category: "Beach"
    },
    {
        title: "Cozy Cabin in Alps",
        location: "Swiss Alps, Switzerland",
        latitude: 46.8182,
        longitude: 8.2275,
        price: 28,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1517362302400-873b4e30f5c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1517362302400-873b4e30f5c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
        host: { name: "Host 3", avatar: "https://randomuser.me/api/portraits/men/3.jpg", isSuperhost: false },
        details: { guests: 6, bedrooms: 3, beds: 4, baths: 2 },
        amenities: ["Wifi", "Kitchen", "Fireplace", "Ski-in/Ski-out"],
        description: "Traditional wooden cabin with modern amenities.",
        guestFavorite: false,
        category: "Skiing"
    },
    {
        title: "Tropical Paradise Villa",
        location: "Bali, Indonesia",
        latitude: -8.4095,
        longitude: 115.1889,
        price: 18,
        rating: 4.92,
        image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
        host: { name: "Wayan", avatar: "https://randomuser.me/api/portraits/men/7.jpg", isSuperhost: true },
        details: { guests: 4, bedrooms: 2, beds: 2, baths: 2 },
        amenities: ["Wifi", "Pool", "AC", "Breakfast"],
        description: "Beautiful villa surrounded by rice fields.",
        guestFavorite: true,
        category: "Beach"
    },
    {
        title: "Seaside Cottage",
        location: "Cornwall, UK",
        latitude: 50.2660,
        longitude: -5.0527,
        price: 15,
        rating: 4.75,
        image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
        host: { name: "Sarah", avatar: "https://randomuser.me/api/portraits/women/8.jpg", isSuperhost: false },
        details: { guests: 4, bedrooms: 2, beds: 3, baths: 1 },
        amenities: ["Wifi", "Kitchen", "Heating", "Garden"],
        description: "Charming cottage steps from the beach.",
        guestFavorite: false,
        category: "Beach"
    },
    {
        title: "Modern Beachfront Condo",
        location: "Miami, FL",
        latitude: 25.7617,
        longitude: -80.1918,
        price: 42,
        rating: 4.88,
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
        host: { name: "Mike", avatar: "https://randomuser.me/api/portraits/men/9.jpg", isSuperhost: true },
        details: { guests: 6, bedrooms: 3, beds: 4, baths: 3 },
        amenities: ["Wifi", "Pool", "Gym", "Ocean View"],
        description: "Stunning views of the Atlantic Ocean.",
        guestFavorite: true,
        category: "Beach"
    },
    {
        title: "Santorini Cave House",
        location: "Santorini, Greece",
        latitude: 36.3932,
        longitude: 25.4615,
        price: 48,
        rating: 4.99,
        image: "https://images.unsplash.com/photo-1601918774757-6e5f99d82327?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1601918774757-6e5f99d82327?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
        host: { name: "Eleni", avatar: "https://randomuser.me/api/portraits/women/10.jpg", isSuperhost: true },
        details: { guests: 2, bedrooms: 1, beds: 1, baths: 1 },
        amenities: ["Wifi", "Jacuzzi", "Breakfast", "View"],
        description: "Traditional cave house with caldera view.",
        guestFavorite: true,
        category: "Islands"
    },
    {
        title: "Tuscan Villa",
        location: "Tuscany, Italy",
        latitude: 43.7711,
        longitude: 11.2486,
        price: 30,
        rating: 4.95,
        image: "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
        host: { name: "Giovanni", avatar: "https://randomuser.me/api/portraits/men/11.jpg", isSuperhost: true },
        details: { guests: 10, bedrooms: 6, beds: 8, baths: 5 },
        amenities: ["Wifi", "Pool", "Vineyard", "Chef"],
        description: "Authentic Tuscan experience in a renovated farmhouse.",
        guestFavorite: true,
        category: "Countryside"
    }
];

const mockExperiences = [
    {
        title: "Pasta Making with Nonna",
        location: "Rome, Italy",
        price: 85,
        duration: "3 hours",
        rating: 4.95,
        image: "https://images.unsplash.com/photo-1556910103-1c02745a30bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1556910103-1c02745a30bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
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
        image: "https://images.unsplash.com/photo-1566371486490-560ded23b5e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1566371486490-560ded23b5e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
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
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
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
