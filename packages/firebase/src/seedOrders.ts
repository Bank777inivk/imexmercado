import { getCollection, setDocument } from "./firestore";

export async function seedOrders() {
  console.log("Starting seeding orders...");
  
  const products = await getCollection("products");
  const users = await getCollection("users");
  
  if (products.length === 0) {
    console.error("No products found. Please seed products first.");
    return;
  }

  const statuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
  const now = new Date();

  for (let i = 0; i < 20; i++) {
    const orderId = `order_${Math.random().toString(36).substr(2, 9)}`;
    
    // Pick a random user or fallback to a name
    const user = users[Math.floor(Math.random() * users.length)];
    const userName = user ? `${user.firstName} ${user.lastName}` : "Client Anonyme";
    const userId = user ? user.id : "anonymous";
    const userEmail = user ? user.email : "client@example.com";

    // Pick 1-3 random products
    const orderItemsCount = Math.floor(Math.random() * 3) + 1;
    const items = [];
    let total = 0;
    
    for (let j = 0; j < orderItemsCount; j++) {
      const product = products[Math.floor(Math.random() * products.length)];
      items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1
      });
      total += product.price;
    }

    // Random date in last 7 days
    const date = new Date();
    date.setDate(now.getDate() - Math.floor(Math.random() * 7));
    date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));

    const order = {
      id: orderId,
      userId,
      userName,
      userEmail,
      items,
      total,
      status: statuses[Math.floor(Math.random() * 3)], // Processing, Shipped, Delivered
      createdAt: date.toISOString()
    };

    await setDocument("orders", orderId, order);
    console.log(`Seeded order: ${orderId} for ${userName} (${total}€)`);
  }

  console.log("Seeding orders complete!");
}
