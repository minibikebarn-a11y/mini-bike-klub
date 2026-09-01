/* MINI BIKE KLUB — products.js
   Single source of truth for all product data. Referenced by shop.js,
   product detail pages, cart.js, and (later) the SSR / serverless layer. */

const MBK_PRODUCTS = [

  /* ---------------- Mini Drift Trikes ---------------- */
  {
    id: "mbk-stealth",
    name: "MBK Stealth",
    category: "mini-drift-trikes",
    categoryLabel: "Mini Drift Trike",
    price: 1500,
    color: "Black / Gray",
    style: "Street / Custom",
    description: "A sleek black custom mini trike built for riders who want an aggressive, clean look. Featuring a bold frame, oversized front wheel, wide rear tires, and a distinctive front plate, the Stealth delivers serious custom-bike style.",
    image: "images/drift-trikes/mbk-stealth.jpg"
  },
  {
    id: "mbk-emerald",
    name: "MBK Emerald",
    category: "mini-drift-trikes",
    categoryLabel: "Mini Drift Trike",
    price: 1500,
    color: "Metallic Green",
    style: "Custom / Street",
    description: "Turn heads with the Emerald — a vibrant green custom mini trike featuring a matching frame, engine components and custom wheels. Its wide rear stance and oversized front wheel give it an unmistakable presence.",
    image: "images/drift-trikes/mbk-emerald.jpg"
  },
  {
    id: "mbk-neon",
    name: "MBK Neon",
    category: "mini-drift-trikes",
    categoryLabel: "Mini Drift Trike",
    price: 1500,
    color: "Black / Neon Green",
    style: "Custom / Performance",
    description: "Built to stand out. The Neon combines a black frame with striking lime-green wheels and handlebars for a bold West Coast-inspired appearance.",
    image: "images/drift-trikes/mbk-neon.jpg"
  },
  {
    id: "mbk-blue-flame",
    name: "MBK Blue Flame",
    category: "mini-drift-trikes",
    categoryLabel: "Mini Drift Trike",
    price: 1500,
    color: "Blue / Black",
    style: "Custom / Cruiser",
    description: "A classic custom look with a deep blue finish, oversized front wheel, wide rear tires and a low-profile frame. The Blue Flame blends old-school mini-bike attitude with a modern custom build.",
    image: "images/drift-trikes/mbk-blue-flame.jpg"
  },
  {
    id: "mbk-redline-trike",
    name: "MBK Redline Trike",
    category: "mini-drift-trikes",
    categoryLabel: "Mini Drift Trike",
    price: 1500,
    color: "Red / Black",
    style: "Aggressive / Custom",
    description: "The Redline brings an aggressive all-red finish with a stretched custom frame and wide rear setup. Designed for riders who want their mini trike to make a statement.",
    image: "images/drift-trikes/mbk-redline-trike.jpg"
  },
  {
    id: "mbk-king",
    name: "MBK King",
    category: "mini-drift-trikes",
    categoryLabel: "Mini Drift Trike",
    price: 1500,
    color: "Yellow / Red",
    style: "Custom / Show",
    description: "A bold yellow custom trike with red accents, sculpted bodywork and a wide rear stance. The King is designed around a distinctive custom silhouette.",
    image: "images/drift-trikes/mbk-king.jpg"
  },
  {
    id: "mbk-blue-king",
    name: "MBK Blue King",
    category: "mini-drift-trikes",
    categoryLabel: "Mini Drift Trike",
    price: 1500,
    color: "Blue / White / Black",
    style: "Street / Custom",
    description: "A bold blue custom mini trike built for riders who want a standout street presence. Featuring a matching blue frame, oversized front wheel, wide rear tires, custom fenders, and a low-profile seat, the Blue King brings a clean custom finish with serious attitude.",
    image: "images/drift-trikes/mbk-blue-king.jpg"
  },
  {
    id: "mbk-orange-fury",
    name: "MBK Orange Fury",
    category: "mini-drift-trikes",
    categoryLabel: "Mini Drift Trike",
    price: 1500,
    color: "Orange / Purple / Black",
    style: "Street / Custom",
    description: "A vibrant custom mini trike finished in striking orange with deep purple accents. The Orange Fury features an oversized front wheel, wide rear drift tires, extended rear frame, custom engine cover, and a low-profile seat. The contrasting purple wheels and rear frame details give it a bold, show-ready custom look.",
    image: "images/drift-trikes/mbk-orange-fury.jpg"
  },
  {
    id: "mbk-red-rocket",
    name: "MBK Red Rocket",
    category: "mini-drift-trikes",
    categoryLabel: "Mini Drift Trike",
    price: 1500,
    color: "Red / Black / Chrome",
    style: "Street / Custom / Drift",
    description: "A bold red custom mini trike with an aggressive stretched frame and oversized front wheel. The Red Rocket combines a vibrant red finish with black components, a low-profile saddle, wide rear tires, exposed performance engine, and a custom extended rear drift frame for a distinctive street-built appearance.",
    image: "images/drift-trikes/mbk-red-rocket.jpg"
  },
  {
    id: "mbk-white-king",
    name: "MBK White King",
    category: "mini-drift-trikes",
    categoryLabel: "Mini Drift Trike",
    price: 1500,
    color: "White / Black",
    style: "Street / Custom",
    description: "A clean and striking custom mini trike finished in crisp white with contrasting black components. The White King features an oversized front wheel, wide rear tire, matching white fenders, a custom front plate, and a low-profile black seat. Its minimalist two-tone finish gives it a sleek, premium custom look with plenty of street presence.",
    image: "images/drift-trikes/mbk-white-king.jpg"
  },

  /* ---------------- Mini Bikes ---------------- */
  {
    id: "mbk-redline-bike",
    name: "MBK Redline",
    category: "mini-bikes",
    categoryLabel: "Mini Bike",
    price: 1000,
    color: "Gloss Red / Black",
    style: "Custom / Performance",
    description: "A powerful-looking red custom mini bike featuring a reinforced tubular frame, oversized front suspension, wide tires and a matching red engine.",
    image: "images/bikes/mbk-redline-bike.jpg"
  },
  {
    id: "mbk-magenta",
    name: "MBK Magenta",
    category: "mini-bikes",
    categoryLabel: "Mini Bike",
    price: 1000,
    color: "Metallic Magenta / Black",
    style: "Custom / Street",
    description: "A vibrant metallic-magenta mini bike built around a stretched custom frame and wide-tire setup. Its bold color and minimalist design give it a clean West Coast custom-bike appearance.",
    image: "images/bikes/mbk-magenta.jpg"
  },
  {
    id: "mbk-royal",
    name: "MBK Royal",
    category: "mini-bikes",
    categoryLabel: "Mini Bike",
    price: 1000,
    color: "Royal Blue / Black",
    style: "Custom / Cruiser",
    description: "A deep royal-blue custom mini bike with a sleek matching frame, wide tires, custom side panel, and classic high-rise handlebars.",
    image: "images/bikes/mbk-royal.jpg"
  },
  {
    id: "mbk-pink",
    name: "MBK Pink",
    category: "mini-bikes",
    categoryLabel: "Mini Bike",
    price: 1000,
    color: "Pink / Black",
    style: "Custom / Street",
    description: "A bold custom mini bike finished in vibrant pink, featuring a low-profile frame, fat tires, high-rise handlebars and matching custom components.",
    image: "images/bikes/mbk-pink.jpg"
  },
  {
    id: "mbk-black-chrome",
    name: "MBK Black Chrome",
    category: "mini-bikes",
    categoryLabel: "Mini Bike",
    price: 1500,
    color: "Black / Chrome",
    style: "Cruiser / Custom",
    description: "A sleek custom mini bike with a deep black finish and polished chrome accents. The Black Chrome features a compact low-profile frame, fat front and rear tires, chrome-finished wheels, a custom center tank, and a clean black saddle. Its combination of dark styling and bright metal details gives it a classic custom-cruiser appearance.",
    image: "images/bikes/mbk-black-chrome.jpg"
  },

  /* ---------------- Parts & Accessories ---------------- */
  {
    id: "mbk-blue-body-kit",
    name: "MBK Blue Body Kit",
    subtitle: "Custom Mini Bike Body Panel Set",
    category: "parts",
    categoryLabel: "Parts & Accessories",
    partType: "Body Panel Kit",
    price: 200,
    color: "Gloss Blue",
    style: "Body Panel Kit",
    description: "Multiple custom body panels with smooth molded construction and a gloss painted finish, designed to coordinate with custom MBK builds.",
    features: [
      "Multiple custom body panels",
      "Smooth molded construction",
      "Gloss painted finish",
      "Designed to coordinate with custom MBK builds"
    ],
    image: "images/parts/mbk-blue-body-kit.jpg"
  },
  {
    id: "mbk-gas-engine",
    name: "MBK Gas Engine",
    subtitle: "4-Stroke Performance Gas Engine",
    category: "parts",
    categoryLabel: "Parts & Accessories",
    partType: "4-Stroke Gas Engine",
    price: 350,
    color: "Black / Blue",
    style: "4-Stroke Gas Engine",
    description: "A horizontal-shaft, compact performance-oriented 4-stroke gas engine with visible electric-start components, suitable for custom mini bike applications.",
    features: [
      "Horizontal-shaft configuration",
      "Electric-start components visible",
      "Suitable for custom mini bike applications",
      "Compact performance-oriented design"
    ],
    image: "images/parts/mbk-gas-engine.jpg"
  },
  {
    id: "mbk-performance-chassis",
    name: "MBK Performance Rolling Chassis",
    subtitle: "Custom Mini Bike Rolling Chassis",
    category: "parts",
    categoryLabel: "Parts & Accessories",
    partType: "Rolling Chassis",
    price: 850,
    color: "Raw Steel / Blue",
    style: "Rolling Chassis",
    description: "A complete foundation for a custom build: custom tubular frame, gas engine, rear axle assembly, drivetrain components, custom exhaust and engine mounting system.",
    features: [
      "Custom tubular frame",
      "Gas engine",
      "Rear axle assembly",
      "Drivetrain components",
      "Custom exhaust",
      "Engine mounting system",
      "Foundation for a complete custom build"
    ],
    image: "images/parts/mbk-performance-chassis.jpg"
  },
  {
    id: "mbk-raw-frame",
    name: "MBK Raw Custom Frame",
    subtitle: "Custom Mini Bike Frame",
    category: "parts",
    categoryLabel: "Parts & Accessories",
    partType: "Custom Mini Bike Frame",
    price: 350,
    color: "Raw Steel",
    style: "Custom Mini Bike Frame",
    description: "A tubular steel custom mini bike frame with an engine mounting area and seat mounting points, ready for paint or powder coating.",
    features: [
      "Tubular steel construction",
      "Engine mounting area",
      "Seat mounting points",
      "Designed for custom builds",
      "Ready for paint or powder coating"
    ],
    image: "images/parts/mbk-raw-frame.jpg"
  },
  {
    id: "mbk-blue-wheel-set",
    name: "MBK Blue Wheel Set",
    subtitle: "Custom 6-Spoke Wheel & Tire Set",
    category: "parts",
    categoryLabel: "Parts & Accessories",
    partType: "Wheel & Tire Set",
    price: 300,
    color: "Blue / White / Black",
    style: "Wheel & Tire Set",
    description: "A custom 6-spoke wheel and tire set finished in gloss blue with matching tires, designed for custom mini bike builds.",
    features: [
      "Custom 6-spoke design",
      "Gloss blue finish",
      "Matching tires",
      "Designed for custom mini bike builds"
    ],
    image: "images/parts/mbk-blue-wheel-set.jpg"
  },
  {
    id: "mbk-black-fender-set",
    name: "MBK Black Fender Set",
    subtitle: "Custom Mini Bike Fender Kit",
    category: "parts",
    categoryLabel: "Parts & Accessories",
    partType: "Fender Kit / Body Accessories",
    price: 150,
    color: "Gloss Black",
    style: "Fender Kit / Body Accessories",
    description: "Multiple custom-shaped fenders with a gloss painted finish, designed for custom mini bike builds.",
    features: [
      "Multiple custom-shaped fenders",
      "Gloss painted finish",
      "Designed for custom mini bike builds"
    ],
    image: "images/parts/mbk-black-fender-set.jpg"
  }
];

/* Helper accessors used across pages */
const MBK = {
  all(){ return MBK_PRODUCTS; },
  byId(id){ return MBK_PRODUCTS.find(function(p){ return p.id === id; }); },
  byCategory(cat){
    if (!cat || cat === "all") return MBK_PRODUCTS;
    return MBK_PRODUCTS.filter(function(p){ return p.category === cat; });
  },
  related(product, limit){
    limit = limit || 3;
    return MBK_PRODUCTS.filter(function(p){
      return p.category === product.category && p.id !== product.id;
    }).slice(0, limit);
  },
  formatPrice(n){
    return "$" + n.toLocaleString("en-US");
  }
};
