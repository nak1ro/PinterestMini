// Sample pin data for development
const pins = [
  {
    id: 1,
    title: "Modern Living Room Design",
    description: "Minimalist living room with natural light and plants",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    user: {
      id: 1,
      username: "interiordesigner",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    tags: ["interior", "design", "living room", "minimalist"]
  },
  {
    id: 2,
    title: "Healthy Breakfast Bowl",
    description: "Start your day with this nutritious breakfast bowl filled with fruits and granola",
    image: "https://images.unsplash.com/photo-1494597564530-871f2b93ac55?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    user: {
      id: 2,
      username: "healthyfoodie",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    tags: ["food", "healthy", "breakfast", "recipe"]
  },
  {
    id: 3,
    title: "Mountain Landscape Photography",
    description: "Beautiful mountain range captured during sunrise",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    user: {
      id: 3,
      username: "naturephotographer",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg"
    },
    tags: ["photography", "nature", "mountains", "landscape"]
  },
  {
    id: 4,
    title: "Workspace Setup",
    description: "Productive home office setup with ergonomic design",
    image: "https://images.unsplash.com/photo-1593642532744-d377ab507dc8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    user: {
      id: 4,
      username: "workspaceguru",
      avatar: "https://randomuser.me/api/portraits/men/75.jpg"
    },
    tags: ["workspace", "office", "productivity", "design"]
  },
  {
    id: 5,
    title: "Summer Fashion Trends",
    description: "Latest summer fashion trends for 2025",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    user: {
      id: 5,
      username: "fashionista",
      avatar: "https://randomuser.me/api/portraits/women/90.jpg"
    },
    tags: ["fashion", "summer", "trends", "style"]
  },
  {
    id: 6,
    title: "DIY Plant Holders",
    description: "Create your own beautiful plant holders with simple materials",
    image: "https://images.unsplash.com/photo-1463320726281-696a485928c7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    user: {
      id: 6,
      username: "diycreator",
      avatar: "https://randomuser.me/api/portraits/women/12.jpg"
    },
    tags: ["DIY", "plants", "crafts", "home decor"]
  },
  {
    id: 7,
    title: "Travel Photography: Venice",
    description: "Beautiful canals and architecture of Venice, Italy",
    image: "https://images.unsplash.com/photo-1534113414509-0eec2bfb493f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    user: {
      id: 7,
      username: "travelbug",
      avatar: "https://randomuser.me/api/portraits/men/42.jpg"
    },
    tags: ["travel", "photography", "venice", "italy"]
  },
  {
    id: 8,
    title: "Coding Workspace",
    description: "Perfect setup for programmers and developers",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    user: {
      id: 8,
      username: "techdev",
      avatar: "https://randomuser.me/api/portraits/women/23.jpg"
    },
    tags: ["coding", "technology", "workspace", "development"]
  },
  {
    id: 9,
    title: "Minimalist Tattoo Ideas",
    description: "Simple and elegant tattoo designs for inspiration",
    image: "https://images.unsplash.com/photo-1562962230-16e4623d36e6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    user: {
      id: 9,
      username: "inkartist",
      avatar: "https://randomuser.me/api/portraits/men/55.jpg"
    },
    tags: ["tattoo", "minimalist", "art", "design"]
  },
  {
    id: 10,
    title: "Cozy Reading Nook",
    description: "Create the perfect corner for reading and relaxation",
    image: "https://images.unsplash.com/photo-1591628001212-900e6ab6031d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    user: {
      id: 10,
      username: "bookworm",
      avatar: "https://randomuser.me/api/portraits/women/33.jpg"
    },
    tags: ["reading", "home", "cozy", "interior design"]
  },
  {
    id: 11,
    title: "Urban Street Photography",
    description: "Capturing the essence of city life through street photography",
    image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    user: {
      id: 11,
      username: "urbanphotographer",
      avatar: "https://randomuser.me/api/portraits/men/67.jpg"
    },
    tags: ["photography", "urban", "street", "city"]
  },
  {
    id: 12,
    title: "Homemade Pizza Recipe",
    description: "Make the perfect pizza at home with this simple recipe",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    user: {
      id: 12,
      username: "homechef",
      avatar: "https://randomuser.me/api/portraits/women/58.jpg"
    },
    tags: ["food", "recipe", "pizza", "cooking"]
  },
  {
    id: 13,
    title: "Watercolor Painting Techniques",
    description: "Learn basic watercolor techniques for beginners",
    image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    user: {
      id: 13,
      username: "artisticsouls",
      avatar: "https://randomuser.me/api/portraits/men/29.jpg"
    },
    tags: ["art", "watercolor", "painting", "tutorial"]
  },
  {
    id: 14,
    title: "Scandinavian Interior Design",
    description: "Clean and minimalist Scandinavian-inspired interior design ideas",
    image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    user: {
      id: 14,
      username: "nordicdesign",
      avatar: "https://randomuser.me/api/portraits/women/77.jpg"
    },
    tags: ["interior", "scandinavian", "design", "minimalist"]
  },
  {
    id: 15,
    title: "Fitness Workout Routine",
    description: "30-minute full body workout you can do at home",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    user: {
      id: 15,
      username: "fitnesscoach",
      avatar: "https://randomuser.me/api/portraits/men/94.jpg"
    },
    tags: ["fitness", "workout", "health", "exercise"]
  },
  {
    id: 16,
    title: "Bullet Journal Ideas",
    description: "Creative layouts and trackers for your bullet journal",
    image: "https://images.unsplash.com/photo-1517842645767-c639042777db?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    user: {
      id: 16,
      username: "journalenthusiast",
      avatar: "https://randomuser.me/api/portraits/women/39.jpg"
    },
    tags: ["bullet journal", "planning", "creativity", "organization"]
  },
  {
    id: 17,
    title: "Succulent Garden",
    description: "How to create and maintain a beautiful succulent garden",
    image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    user: {
      id: 17,
      username: "plantlover",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg"
    },
    tags: ["plants", "succulents", "gardening", "home"]
  },
  {
    id: 18,
    title: "Vintage Fashion Inspiration",
    description: "Timeless vintage fashion looks for modern wardrobes",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    user: {
      id: 18,
      username: "vintagestyle",
      avatar: "https://randomuser.me/api/portraits/women/62.jpg"
    },
    tags: ["fashion", "vintage", "style", "clothing"]
  },
  {
    id: 19,
    title: "Architectural Photography",
    description: "Stunning architectural photography from around the world",
    image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    user: {
      id: 19,
      username: "architecturelover",
      avatar: "https://randomuser.me/api/portraits/men/37.jpg"
    },
    tags: ["architecture", "photography", "design", "buildings"]
  },
  {
    id: 20,
    title: "Smoothie Bowl Recipes",
    description: "Colorful and nutritious smoothie bowl ideas for breakfast",
    image: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    user: {
      id: 20,
      username: "healthyeats",
      avatar: "https://randomuser.me/api/portraits/women/19.jpg"
    },
    tags: ["food", "smoothie", "healthy", "breakfast"]
  }
];

export default pins;
