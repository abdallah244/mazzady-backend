import * as bcrypt from 'bcrypt';

const auctionData = [
  // electronics (2)
  {
    productName: 'iPhone 15 Pro Max 256GB',
    startingPrice: 25000,
    minBidIncrement: 500,
    category: 'electronics',
    durationDays: 14,
  },
  {
    productName: 'Samsung Galaxy S24 Ultra',
    startingPrice: 20000,
    minBidIncrement: 500,
    category: 'electronics',
    durationDays: 21,
  },
  // fashion (2)
  {
    productName: 'ساعة رولكس أوريجينال كلاسيك',
    startingPrice: 150000,
    minBidIncrement: 5000,
    category: 'fashion',
    durationDays: 30,
  },
  {
    productName: 'شنطة لويس فيتون أصلية',
    startingPrice: 35000,
    minBidIncrement: 1000,
    category: 'fashion',
    durationDays: 10,
  },
  // home (2)
  {
    productName: 'طقم أنتريه مودرن 7 قطع',
    startingPrice: 15000,
    minBidIncrement: 500,
    category: 'home',
    durationDays: 45,
  },
  {
    productName: 'تلفزيون سامسونج 75 بوصة QLED',
    startingPrice: 30000,
    minBidIncrement: 1000,
    category: 'home',
    durationDays: 7,
  },
  // vehicles (2)
  {
    productName: 'BMW X5 موديل 2023',
    startingPrice: 2500000,
    minBidIncrement: 50000,
    category: 'vehicles',
    durationDays: 60,
  },
  {
    productName: 'تويوتا كورولا 2024 زيرو',
    startingPrice: 900000,
    minBidIncrement: 10000,
    category: 'vehicles',
    durationDays: 90,
  },
  // art (1)
  {
    productName: 'لوحة زيتية أصلية - فنان مصري',
    startingPrice: 5000,
    minBidIncrement: 200,
    category: 'art',
    durationDays: 30,
  },
  // jewelry (2)
  {
    productName: 'خاتم ألماس 2 قيراط',
    startingPrice: 80000,
    minBidIncrement: 2000,
    category: 'jewelry',
    durationDays: 21,
  },
  {
    productName: 'عقد ذهب عيار 21 - 50 جرام',
    startingPrice: 120000,
    minBidIncrement: 5000,
    category: 'jewelry',
    durationDays: 14,
  },
  // books (1)
  {
    productName: 'مجموعة كتب نادرة - طبعة أولى',
    startingPrice: 3000,
    minBidIncrement: 100,
    category: 'books',
    durationDays: 45,
  },
  // sports (2)
  {
    productName: 'جهاز جري كهربائي احترافي',
    startingPrice: 8000,
    minBidIncrement: 500,
    category: 'sports',
    durationDays: 10,
  },
  {
    productName: 'دراجة هوائية Trek Madone',
    startingPrice: 45000,
    minBidIncrement: 1000,
    category: 'sports',
    durationDays: 30,
  },
  // other (1)
  {
    productName: 'بيانو ياماها ديجيتال P-125',
    startingPrice: 18000,
    minBidIncrement: 500,
    category: 'other',
    durationDays: 60,
  },
];

const auctionImages: Record<string, string> = {
  'iPhone 15 Pro Max 256GB':
    'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80',
  'Samsung Galaxy S24 Ultra':
    'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80',
  'ساعة رولكس أوريجينال كلاسيك':
    'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800&q=80',
  'شنطة لويس فيتون أصلية':
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80',
  'طقم أنتريه مودرن 7 قطع':
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
  'تلفزيون سامسونج 75 بوصة QLED':
    'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80',
  'BMW X5 موديل 2023':
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
  'تويوتا كورولا 2024 زيرو':
    'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80',
  'لوحة زيتية أصلية - فنان مصري':
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80',
  'خاتم ألماس 2 قيراط':
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80',
  'عقد ذهب عيار 21 - 50 جرام':
    'https://images.unsplash.com/photo-1515562141589-67f0d569b6c9?w=800&q=80',
  'مجموعة كتب نادرة - طبعة أولى':
    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80',
  'جهاز جري كهربائي احترافي':
    'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&q=80',
  'دراجة هوائية Trek Madone':
    'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80',
  'بيانو ياماها ديجيتال P-125':
    'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800&q=80',
};

const PLACEHOLDER_IMAGE = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPj/HwADBwIAMCbHYQAAAABJRU5ErkJggg==',
  'base64',
);

async function downloadImage(url: string): Promise<{ buffer: Buffer; contentType: string }> {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0' },
    redirect: 'follow',
  });
  if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.status}`);
  const contentType = response.headers.get('content-type') || 'image/jpeg';
  const arrayBuffer = await response.arrayBuffer();
  return { buffer: Buffer.from(arrayBuffer), contentType };
}

export async function autoSeed(connection: any, logger: any): Promise<void> {
  try {
    const auctionsCol = connection.collection('auctions');
    const count = await auctionsCol.countDocuments();
    if (count > 0) {
      logger.log('Database already has auctions. Skipping automatic seeding.');
      return;
    }

    logger.log('No auctions found in the database. Initiating automatic seeding of users, auctions, and images...');

    const usersCol = connection.collection('users');
    const imageStoreCol = connection.collection('imagestores');

    // 1. Seed Placeholder Image
    let placeholderUrl = '/images/placeholder.png';
    try {
      const imgDoc = await imageStoreCol.insertOne({
        contentType: 'image/png',
        data: PLACEHOLDER_IMAGE,
        originalName: 'placeholder.png',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      placeholderUrl = `/images/${imgDoc.insertedId.toString()}`;
      logger.log(`Placeholder image stored in database: ${placeholderUrl}`);
    } catch (err: any) {
      logger.error(`Failed to store placeholder image: ${err.message}`);
    }

    // 2. Seed Sellers
    const sellers: { id: any; email: string }[] = [];
    const hashedPassword = await bcrypt.hash('Test@12345', 10);

    for (let i = 1; i <= 5; i++) {
      const email = `seller${i}.test@mazzady.works`;
      const existing = await usersCol.findOne({ email });
      if (existing) {
        sellers.push({ id: existing._id, email });
        logger.log(`Seller already exists: ${email}`);
        continue;
      }

      const result = await usersCol.insertOne({
        email,
        password: hashedPassword,
        firstName: `Seller`,
        middleName: '',
        lastName: `Test${i}`,
        nickname: `seller_test_${i}`,
        authProvider: 'local',
        isProfileComplete: true,
        walletBalance: 5000,
        isOnline: false,
        visitsThisMonth: 0,
        lastActivity: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      sellers.push({
        id: result.insertedId,
        email,
      });
      logger.log(`Created test seller: ${email}`);
    }

    // 3. Seed Auctions
    const now = new Date();
    const createdAuctions: { _id: any; productName: string }[] = [];

    for (let i = 0; i < auctionData.length; i++) {
      const a = auctionData[i];
      const seller = sellers[i % sellers.length];
      const durationInSeconds = a.durationDays * 24 * 60 * 60;
      const startDate = now;
      const endDate = new Date(now.getTime() + durationInSeconds * 1000);

      const exists = await auctionsCol.findOne({ productName: a.productName });
      if (exists) {
        logger.log(`Auction already exists: ${a.productName}`);
        createdAuctions.push({ _id: exists._id, productName: a.productName });
        continue;
      }

      const result = await auctionsCol.insertOne({
        productName: a.productName,
        sellerId: seller.id,
        startingPrice: a.startingPrice,
        minBidIncrement: a.minBidIncrement,
        mainImageUrl: placeholderUrl,
        mainImageFilename: 'placeholder.png',
        additionalImagesUrl: [],
        additionalImagesFilename: [],
        status: 'active',
        startDate,
        endDate,
        durationInSeconds,
        highestBid: null,
        highestBidderId: null,
        isFeatured: i < 4, // First 4 are featured
        category: a.category,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      createdAuctions.push({
        _id: result.insertedId,
        productName: a.productName,
      });
      logger.log(`Created auction: ${a.productName}`);
    }

    // 4. Download and Seed Real Images
    logger.log('Downloading real product images from Unsplash to update auctions...');
    const auctionNames = Object.keys(auctionImages);

    for (const name of auctionNames) {
      const auction = createdAuctions.find((ca) => ca.productName === name);
      if (!auction) continue;

      const url = auctionImages[name];
      logger.log(`Downloading image for: ${name}...`);

      try {
        const { buffer, contentType } = await downloadImage(url);
        logger.log(`  Downloaded ${(buffer.length / 1024).toFixed(0)}KB`);

        const imgDoc = await imageStoreCol.insertOne({
          contentType,
          data: buffer,
          originalName: `${name.replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '_')}.jpg`,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        const imageUrl = `/images/${imgDoc.insertedId.toString()}`;

        await auctionsCol.updateOne(
          { _id: auction._id },
          { $set: { mainImageUrl: imageUrl, mainImageFilename: `${name}.jpg` } },
        );

        logger.log(`  ✓ Stored & updated: ${imageUrl}`);
      } catch (err: any) {
        logger.error(`  ✗ Failed to download image for ${name}: ${err.message}. Keeping placeholder.`);
      }
    }

    logger.log('Automatic database seeding completed successfully!');
  } catch (globalErr: any) {
    logger.error(`Global error during database seeding: ${globalErr.message}`);
  }
}
