const mongoose = require('mongoose');
const { Destination } = require('./models');
require('dotenv').config();

const destinations = [
    {
        name: 'Europe',
        image: 'https://images.unsplash.com/photo-1499856871940-a09627c6d7db?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Explore the history and culture of the old continent.',
        details: 'Europe is a continent located entirely in the Northern Hemisphere and mostly in the Eastern Hemisphere. It comprises the westernmost peninsulas of the continental landmass of Eurasia. It shares the continental landmass of Afro-Eurasia with both Africa and Asia.',
        highlights: ['Eiffel Tower', 'Colosseum', 'Santorini', 'Swiss Alps'],
        bestTimeToVisit: 'May to September',
        currency: 'Euro (€)',
        language: 'Various'
    },
    {
        name: 'Asia',
        image: 'https://images.unsplash.com/photo-1535139262971-c51845709a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Discover exotic flavors and ancient traditions.',
        details: 'Asia is Earth\'s largest and most populous continent, located primarily in the Eastern and Northern Hemispheres. It shares the continental landmass of Eurasia with the continent of Europe and the continental landmass of Afro-Eurasia with both Europe and Africa.',
        highlights: ['Great Wall of China', 'Taj Mahal', 'Bali', 'Tokyo'],
        bestTimeToVisit: 'November to April',
        currency: 'Various',
        language: 'Various'
    },
    {
        name: 'Africa',
        image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Experience the wild beauty of nature.',
        details: 'Africa is the world\'s second-largest and second-most populous continent, after Asia. At about 30.3 million km² including adjacent islands, it covers 6% of Earth\'s total surface area and 20% of its land area.',
        highlights: ['Safari in Serengeti', 'Pyramids of Giza', 'Victoria Falls', 'Cape Town'],
        bestTimeToVisit: 'June to October',
        currency: 'Various',
        language: 'Various'
    },
    {
        name: 'North America',
        image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'From bustling cities to stunning national parks.',
        details: 'North America is a continent entirely within the Northern Hemisphere and almost all within the Western Hemisphere. It can also be described as the northern subcontinent of the Americas.',
        highlights: ['Grand Canyon', 'New York City', 'Banff National Park', 'Cancun'],
        bestTimeToVisit: 'Year-round',
        currency: 'USD, CAD, MXN',
        language: 'English, Spanish, French'
    },
    {
        name: 'South America',
        image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Vibrant cultures and breathtaking landscapes.',
        details: 'South America is a continent entirely in the Western Hemisphere and mostly in the Southern Hemisphere, with a relatively small portion in the Northern Hemisphere.',
        highlights: ['Machu Picchu', 'Amazon Rainforest', 'Rio de Janeiro', 'Patagonia'],
        bestTimeToVisit: 'September to November',
        currency: 'Various',
        language: 'Spanish, Portuguese'
    },
    {
        name: 'Oceania',
        image: 'https://images.unsplash.com/photo-1589330273594-fade1ee91647?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Paradise beaches and unique wildlife.',
        details: 'Oceania is a geographic region that includes Australasia, Melanesia, Micronesia and Polynesia. Spanning the Eastern and Western Hemispheres, Oceania has a land area of 8,525,989 square kilometres and a population of over 41 million.',
        highlights: ['Great Barrier Reef', 'Sydney Opera House', 'Bora Bora', 'Fiordland National Park'],
        bestTimeToVisit: 'December to February',
        currency: 'AUD, NZD',
        language: 'English'
    }
];

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        await Destination.deleteMany({});
        await Destination.insertMany(destinations);
        console.log('✅ Seeded destinations');
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
